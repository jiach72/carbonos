# CarbonOS 运维手册

## 部署架构

```
[Nginx/Caddy] → [Next.js (Frontend)] → [FastAPI (Backend)] → [PostgreSQL + Redis]
```

## 环境变量

### 后端 (`backend/.env`)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql+asyncpg://user:pass@host:5432/carbonos` |
| `REDIS_URL` | Redis 连接地址 | `redis://localhost:6379/0` |
| `JWT_SECRET_KEY` | JWT 签名密钥 (**必须修改**) | `your-secret-key-min-32-chars` |
| `JWT_ALGORITHM` | JWT 算法 | `HS256` |
| `DEBUG` | 调试模式 | `false` (生产环境必须关闭) |

### 前端 (`carbonos/.env.local`)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_API_URL` | API 代理基础 URL | (通常通过 next.config.js rewrites) |

## 常用命令

### 后端

```bash
# 启动开发服务器
cd backend && uvicorn app.main:app --reload --port 8000

# 数据库迁移
alembic upgrade head        # 应用所有迁移
alembic revision --autogenerate -m "描述"  # 生成新迁移

# 运行测试
pytest tests/ -v

# 初始化生产数据
python scripts/seed_prod.py
```

### 前端

```bash
# 开发
cd carbonos && npm run dev

# 测试
npm run test              # Jest 单元测试
npm run test:e2e          # Playwright E2E
npm run test:e2e:ui       # Playwright UI 模式
npm run test:coverage     # 覆盖率报告

# 构建
npm run build
npm run analyze           # Bundle 分析
```

## 安全中间件配置

### 限流规则 (`app/core/security/rate_limit.py`)

| 中间件 | 路径 | 限制 |
|--------|------|------|
| `RateLimitMiddleware` | 全局 | 100 次/分钟/IP |
| `AuthRateLimitMiddleware` | `/api/v1/auth/login` | 5 次/分钟/IP |

### 安全 Headers (`SecurityHeadersMiddleware`)

自动添加：`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`

## 监控

### Prometheus 指标 (`/metrics`)

| 指标 | 说明 |
|------|------|
| `http_requests_total` | HTTP 请求总数 (按方法/路径/状态码) |
| `http_request_duration_seconds` | 请求耗时分布 |
| `app_info` | 应用元信息 |

## 故障排查

### 常见问题

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| 登录 500 | 数据库未迁移 | 执行 `alembic upgrade head` |
| 前端 401 循环 | Token 过期 | 清除浏览器 localStorage |
| 429 频繁限流 | IP 触发限流 | 检查是否有爬虫/恶意请求 |
| E2E 测试失败 | Dev server 未启动 | Playwright 会自动启动，确保端口 3000 空闲 |
