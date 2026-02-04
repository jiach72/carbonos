# CarbonOS™ 零碳园区智能运营平台

零碳园区智能运营平台，帮助企业实现碳排放精准核算、智能诊断和优化决策。

## 技术栈

- **前端**: Next.js 14 + shadcn/ui + TailwindCSS
- **后端**: FastAPI + SQLAlchemy 2.0
- **数据库**: PostgreSQL + InfluxDB + Redis
- **部署**: Docker Compose

## 快速开始

### 开发环境

```bash
# 1. 安装前端依赖
npm install

# 2. 启动开发服务器
npm run dev
```

### Docker 部署

```bash
# 1. 复制环境变量
cp .env.example .env

# 2. 启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

## 访问地址

- 前端: http://localhost:3001
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs
- InfluxDB: http://localhost:8086

## 目录结构

```
carbonos/
├── src/                 # Next.js 前端源码
├── backend/             # FastAPI 后端源码
│   ├── app/
│   │   └── main.py      # API 入口
│   └── Dockerfile
├── docker-compose.yml   # Docker 编排
└── Dockerfile           # 前端 Docker
```

## 许可证

© 2026 苏州创电云科技有限公司
