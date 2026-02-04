# CarbonOS 自动化部署指南

本文档详细介绍了如何使用 GitHub Actions 将 CarbonOS 部署到生产服务器 (`159.75.67.162`)。

## 1. 服务器环境准备

本文档基于 **Ubuntu 20.04/22.04 LTS** 编写。在目标服务器上，需要安装 Docker 和 Docker Config。

```bash
# SSH 登录服务器
ssh root@159.75.67.162

# 1. 更新系统并安装基础工具
apt-get update && apt-get upgrade -y
apt-get install -y curl git

# 2. 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. 启动 Docker 并设置开机自启
systemctl start docker
systemctl enable docker

# 4. 验证安装
docker --version
docker compose version
```

## 2. GitHub Secrets 配置

在 GitHub 仓库页面，进入 **Settings** -> **Secrets and variables** -> **Actions**，添加以下 Repository Secrets：

| Secret Name | Description | Value Example |
|-------------|-------------|---------------|
| `SERVER_HOST` | 服务器 IP 地址 | `159.75.67.162` |
| `SERVER_USER` | SSH 登录用户名 | `root` (或您配置的 sudo 用户) |
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_PORT` | SSH 端口 (可选) | `22` (默认) |

> **如何获取 SSH 私钥？**
> 在您的本地机器或专门生成的机器上，查看私钥文件 (通常是 `~/.ssh/id_rsa`)。确保对应的公钥 (`id_rsa.pub`) 已经添加到服务器的 `~/.ssh/authorized_keys` 文件中。

## 3. 添加生产环境 Docker Compose 配置文件

在项目根目录创建一个名为 `docker-compose.prod.yml` 的文件，用于定义生产环境的服务。此文件将使用从 GitHub Container Registry (GHCR) 拉取的镜像，而不是本地构建。

**文件路径**: `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  frontend:
    image: ghcr.io/${GITHUB_REPOSITORY_OWNER}/carbonos-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.scdc.cloud
    restart: always
    networks:
      - carbonos-network

  backend:
    image: ghcr.io/${GITHUB_REPOSITORY_OWNER}/carbonos-backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://carbonos:carbonos@postgres:5432/carbonos
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - /lhcos-data:/app/uploads
    restart: always
    networks:
      - carbonos-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: carbonos
      POSTGRES_PASSWORD: carbonos
      POSTGRES_DB: carbonos
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - carbonos-network
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U carbonos" ]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - carbonos-network
    restart: always

networks:
  carbonos-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

*注意：请根据实际情况调整 `GITHUB_REPOSITORY_OWNER` 和环境变量。在实际部署脚本中，我们会自动替换这些变量。*

### 对象存储配置说明
如果您配置了云厂商的对象存储（COS/OSS）挂载到服务器，可以通过 `volumes` 将其映射到容器内部。
- **主机路径**: `/lhcos-data` (示例中使用的挂载点)
- **容器路径**: `/app/uploads` (后端应用配置的文件存储路径)

确保服务器上 `/lhcos-data` 目录已正确挂载且有读写权限。

## 4. 创建 GitHub Actions Workflow

在项目根目录创建 `.github/workflows/deploy.yml` 文件。

**文件路径**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Copy docker-compose.prod.yml to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          source: "docker-compose.prod.yml"
          target: "/app/carbonos/"

      - name: Execute deployment commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd /app/carbonos
            
            # 登录 GHCR 以拉取私有/公开镜像
            echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            
            # 替换 docker-compose.prod.yml 中的变量 (如果需要动态替换)
            # 这里简单起见，假设 docker-compose.prod.yml 里的 GITHUB_REPOSITORY_OWNER 已经写好或者是用 sed 替换
            # 下面是一个 sed 示例，将占位符替换为实际仓库所有者
            sed -i 's/${GITHUB_REPOSITORY_OWNER}/${{ github.repository_owner }}/g' docker-compose.prod.yml
            
            # 拉取最新镜像
            docker compose -f docker-compose.prod.yml pull
            
            # 重启服务
            docker compose -f docker-compose.prod.yml up -d --remove-orphans
            
            # 清理无用镜像
            docker image prune -f
```

## 5. 验证部署

1. 提交代码到 `main` 分支。
2. 在 GitHub 的 **Actions** 标签页查看 Workflow 运行状态。
3. 部署成功后，访问 `http://159.75.67.162:3000` (前端) 和 `http://159.75.67.162:8000/docs` (后端文档)。

## 常见问题排查

- **Permission denied (publickey)**: 检查 Secret 中的 `SSH_PRIVATE_KEY` 是否正确，且公钥已添加到服务器。
- **Login failed**: 确保 Workflow 有 `packages: write` 权限。
- **Container name conflict**: 部署脚本中使用了 `--remove-orphans` 清理旧容器。

## 6. 域名解析 (Cloudflare)

您需要在 Cloudflare 控制台添加以下 DNS 记录，将域名指向通过 GitHub Actions 部署的服务器 IP。

| 类型 (Type) | 名称 (Name) | 内容 (Content) | 代理状态 (Proxy Status) | 说明 |
|---|---|---|---|---|
| `A` | `@` | `159.75.67.162` | Proxied (橙色云朵) | 主域名 `scdc.cloud` |
| `A` | `www` | `159.75.67.162` | Proxied (橙色云朵) | `www.scdc.cloud` |
| `A` | `api` | `159.75.67.162` | Proxied (橙色云朵) | `api.scdc.cloud` |

## 7. 反向代理配置 (Nginx)

本项目使用 Docker 容器化部署 Nginx，因此**无需配置服务器宿主机 Nginx**。

`nginx/nginx.conf` 配置文件已包含在代码库中，并会在部署时自动复制到服务器。

### 7.1 DNS 配置（必要）

请确保 Cloudflare 的 SSL/TLS 模式设置为 **Flexible**（灵活性）。
这是因为 Nginx 容器配置监听的是 80 端口，Cloudflare 负责处理 HTTPS 并回源到 HTTP 端口。

如果 Cloudflare 设置为 Full/Strict，会导致重定向循环或 522 错误。

> **推荐设置**: 在 Cloudflare "Edge Certificates" 页面，开启 **Always Use HTTPS** 以强制所有流量通过 HTTPS 访问。

### 7.2 端口说明

- **80**: Nginx 监听端口（映射到宿主机 80）
- **3000**: 前端容器内部端口（不暴露到宿主机）
- **8000**: 后端容器内部端口（不暴露到宿主机）

无需在服务器上手动运行 `apt-get install nginx`。

### 7.3 配置 HTTPS (Cloudflare 模式)

如果您在 Cloudflare 开启了 **Proxied (橙色云朵)** 模式，且 SSL/TLS 设置为 **Flexible**，则上述 Nginx 配置 (监听 80 端口) 即可直接工作。

如果设置为 **Full** 或 **Full (Strict)**，建议使用 Certbot 生成自签名或有效证书，或使用 Cloudflare Origin CA 证书。

> **推荐最简方案**: Cloudflare SSL 设置为 **Flexible**，Nginx 仅监听 80 端口。Cloudflare 负责处理 HTTPS 到 HTTP 的回源。
