# CarbonOS™ SaaS 平台实施计划

> 基于 PRD v1.2 及技能审阅更新

## 部署架构

| 项目 | 域名 | 技术栈 |
|------|------|--------|
| 官网 | `scdc.cloud` | Vite + React（现有） |
| CarbonOS 平台 | `scdc.cloud` | Next.js + shadcn/ui |

**部署方式**：Docker Compose 统一部署，Nginx 反向代理分发

| 层级 | 技术 | 审阅依据 |
|------|------|----------|
| **前端** | Next.js 14 + shadcn/ui | `nextjs-app-router-patterns` ✅ |
| **后端** | FastAPI (Python 3.11+) | `fastapi-pro` ✅ |
| **数据库** | PostgreSQL 15 + InfluxDB + Redis | `postgres-best-practices` ✅ |
| **AI** | 国产模型（混元/通义/DeepSeek） | `rag-implementation` ✅ |
| **存储** | MinIO | `docker-expert` ✅ |
| **部署** | Docker + Compose | `docker-expert` ✅ |

---

## 技能审阅建议

### 1. 后端 FastAPI（来自 `fastapi-pro`）
- ✅ 使用 async/await 模式
- ✅ Pydantic V2 数据验证
- ✅ SQLAlchemy 2.0 async 支持
- ✅ JWT + OAuth2 认证

### 2. Docker 部署（来自 `docker-expert`）
- ✅ 多阶段构建
- ✅ 非 root 用户运行
- ✅ 健康检查配置
- ✅ Docker Compose 服务编排

### 3. 微服务架构（来自 `microservices-patterns`）
- ⚠️ **建议**：MVP 阶段采用**模块化单体**，避免过早拆分
- v1.0 阶段再考虑微服务拆分

### 4. AI 诊断（来自 `rag-implementation`）
- ✅ LangChain + 向量数据库（Chroma）
- ✅ Hybrid Search（语义+关键词）
- ✅ 文档分块策略

---

## 微服务架构（简化版）

| 服务 | 端口 | 职责 |
|------|------|------|
| user-service | 8001 | 认证、组织 |
| carbon-service | 8002 | 碳核算 |
| ai-service | 8005 | AI 诊断 |
| report-service | 8004 | 报告生成 |

---

## MVP 路线图（12周）

| 周 | 任务 |
|---|------|
| 1-2 | 基础设施 + Docker |
| 3-4 | 用户系统 |
| 5-6 | 数据接入 |
| 7-8 | 碳核算引擎 |
| 9-10 | 仪表盘 |
| 11 | 报告生成 |
| 12 | 测试部署 |

---

## 使用的技能

- `react-patterns` / `nextjs-app-router-patterns`
- `tailwind-patterns`
- `fastapi-pro`
- `docker-expert`
- `postgres-best-practices`
- `rag-implementation`
