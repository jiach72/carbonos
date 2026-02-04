# CarbonOS™ SaaS 多租户架构设计方案

## 1. 核心目标
将 CarbonOS 从单体应用改造为支持多客户（租户）同时使用的 SaaS 平台，确保：
- **数据隔离**：租户 A 绝不可见租户 B 的数据。
- **按量计费**：支持不同租户订阅不同套餐（基础版/专业版）。
- **统一运维**：一套代码、一个数据库服务于所有客户，降低运维成本。

## 2. 架构模式选型
采用 **共享数据库，共享 Schema (Shared Database, Shared Schema)** 模式。
这是 B2B SaaS 最主流、成本最低的模式。

### 对比
- **独立数据库模式**：每个客户一个数据库。成本极高，适合银行级大客户。
- **共享模式（推荐）**：所有客户数据在同一张表中，通过 `tenant_id` 区分。成本最低，扩展性强。

## 3. 数据库模型改造

### 3.1 新增 Tenant（租户）表
这是 SaaS 的顶层单位，代表"购买服务的客户"。

```python
class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(UUID, primary_key=True)
    name = Column(String)          # 租户名称（如：苏州工业园运营公司）
    domain = Column(String)        # 专属域名（如：suzhou.carbonos.cloud）
    plan = Column(String)          # 套餐（basic, pro, enterprise）
    status = Column(String)        # active, suspended
    created_at = Column(DateTime)
```

### 3.2 现有表改造
所有业务表必须添加 `tenant_id` 外键，实现行级隔离。

| 表名 | 改造动作 | 说明 |
|------|----------|------|
| `users` | 新增 `tenant_id` | 用户归属于特定租户 |
| `organizations` | 新增 `tenant_id` | 组织树归属于特定租户 |
| `devices` | 新增 `tenant_id` | 设备归属 |
| `carbon_emissions` | 新增 `tenant_id` | 数据归属 |

## 4. 应用层隔离实现 (Middleware)

为了防止开发者忘记写 `Where tenant_id = ?`，将在框架层强制隔离。

### 4.1 请求上下文 (Context)
每个请求进来时，中间件解析 Token 中的 `tenant_id`，存入全局上下文（如 `contextvar`）。

```python
# 伪代码：中间件逻辑
async def tenant_middleware(request, call_next):
    token = request.headers.get("Authorization")
    user = decode_token(token)
    ctx.tenant_id.set(user.tenant_id) # 设置上下文
    response = await call_next(request)
    return response
```

### 4.2 ORM 自动过滤
在 SQLAlchemy 查询中注入默认过滤条件。

```python
# 伪代码：查询拦截
session.query(User).filter_by(tenant_id=ctx.tenant_id.get()).all()
```

## 5. 改造路线图

1.  **Phase 1: 模型层 (Model)** - 创建 Tenant 表，全量表添加字段。
2.  **Phase 2: 认证层 (Auth)** - 登录接口返回 Token 包含 `tenant_id`。
3.  **Phase 3: 业务层 (Service)** - 所有 CRUD 操作增加租户校验。
4.  **Phase 4: 运营后台 (Admin)** - 开发超级管理员后台，用于开通/禁用租户。

## 6. 带来的商业价值
- **快速开通**：新客户注册仅需 1 秒（插入一条 Tenant 记录）。
- **灵活定价**：可根据 Tenant 表的 `plan` 字段控制功能权限（Feature Flag）。
