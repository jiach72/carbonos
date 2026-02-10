"""
CarbonOS™ API 入口
零碳园区智能运营平台

P1-P2 升级:
- P1-004: 结构化日志
- P2: API 限流中间件
- P2: Prometheus 监控
- P2: 审计日志持久化
- P2: 租户级别配置
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.organization import router as organization_router
from app.api.data import router as data_router
from app.api.carbon import router as carbon_router
from app.api.dashboard import router as dashboard_router
from app.api.simulation import router as simulation_router
from app.api.pcf import router as pcf_router
from app.api.admin import router as admin_router
from app.api.ai import router as ai_diagnostic_router
from app.api.survey import router as survey_router
from app.core.database import engine, Base
from app.core.config import get_settings

# 引入模型以确保建表
from app.models.tenant import Tenant
from app.models.user import User
from app.models.organization import Organization
from app.models.carbon import CarbonEmission, CarbonInventory
from app.models.audit import AuditLog  # P2: 审计日志
from app.models.tenant_config import TenantConfig  # P2: 租户配置
from app.models.survey import Survey  # 调研问卷


# 应用生命周期管理
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    启动时: 初始化日志、数据库、Redis
    关闭时: 清理连接
    """
    # 启动时
    from app.core.logging import setup_logging, get_logger
    from app.core.cache import get_redis, close_redis
    
    # 初始化日志
    setup_logging()
    logger = get_logger("app.main")
    logger.info("application_starting", version="0.1.0")
    
    # 初始化数据库表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("database_initialized")
    
    # 初始化超级管理员（系统自带固定账户）
    from app.core.init_superuser import init_superuser
    from app.core.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        try:
            superuser = await init_superuser(db)
            logger.info("superuser_initialized", email=superuser.email)
        except Exception as e:
            logger.error("superuser_init_failed", error=str(e))
    
    # 预热 Redis 连接
    try:
        redis = await get_redis()
        await redis.ping()
        logger.info("redis_connected")
    except Exception as e:
        logger.warning("redis_connection_failed", error=str(e))
    
    yield
    
    # 关闭时
    await close_redis()
    logger.info("application_shutdown")


app = FastAPI(
    title="CarbonOS™ API",
    description="零碳园区智能运营平台",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    """根路径重定向到文档"""
    return RedirectResponse(url="/docs")


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Favicon 占位符"""
    return RedirectResponse(url="/docs")


# ============ 中间件配置 ============
# 注意：中间件按添加顺序的逆序执行

# 1. CORS 配置（最后执行，最先添加）
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://scdc.cloud", 
        "https://www.scdc.cloud",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 多租户中间件（P0-004: 从 JWT 解析 tenant_id）
from app.core.middleware.tenant import TenantMiddleware
app.add_middleware(TenantMiddleware)

# 3. 安全响应头中间件（仅修改 response headers，不影响 request body）
from app.core.middleware.ratelimit import SecurityHeadersMiddleware
app.add_middleware(SecurityHeadersMiddleware, enabled=True)

# ⚠️ 以下中间件暂时禁用
# 原因：多层 BaseHTTPMiddleware 叠加导致 POST 请求体被消费，引发 500 错误
# 参考：https://github.com/encode/starlette/issues/1012
# TODO: 迁移到纯 ASGI 中间件后重新启用

# from app.core.middleware.ratelimit import AuthRateLimitMiddleware, RateLimitMiddleware, RequestLoggingMiddleware
# app.add_middleware(AuthRateLimitMiddleware, enabled=True)
# app.add_middleware(RateLimitMiddleware, enabled=not settings.debug)
# app.add_middleware(RequestLoggingMiddleware, enabled=True)

# from app.core.metrics import PrometheusMiddleware, metrics_endpoint, init_metrics
# app.add_middleware(PrometheusMiddleware, enabled=not settings.debug)

from app.core.metrics import metrics_endpoint, init_metrics
init_metrics()


# ============ 注册路由 ============
app.include_router(ai_diagnostic_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(organization_router, prefix="/api/v1")
app.include_router(data_router, prefix="/api/v1")
app.include_router(carbon_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(simulation_router, prefix="/api/v1")
app.include_router(pcf_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(survey_router, prefix="/api/v1")


# ============ 健康检查 ============
@app.get("/health")
async def health_check():
    """健康检查接口"""
    from app.core.cache import get_redis
    
    status = {
        "status": "ok",
        "service": "carbonos-api",
        "version": "0.1.0",
    }
    
    # 检查 Redis 连接
    try:
        redis = await get_redis()
        await redis.ping()
        status["redis"] = "connected"
    except Exception:
        status["redis"] = "disconnected"
    
    return status


@app.get("/api/v1/info")
async def api_info():
    """API 信息"""
    return {
        "name": "CarbonOS™ API",
        "version": "0.1.0",
        "description": "零碳园区智能运营平台",
        "features": [
            "multi-tenancy",
            "rate-limiting",
            "structured-logging",
            "redis-caching",
            "prometheus-metrics",
            "audit-logging",
            "tenant-config",
        ]
    }


# ============ Prometheus 指标端点 ============
@app.get("/metrics", include_in_schema=False)
async def prometheus_metrics():
    """Prometheus 指标端点"""
    return await metrics_endpoint()
