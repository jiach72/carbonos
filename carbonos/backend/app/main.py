"""
CarbonOS™ API 入口
零碳园区智能运营平台
"""

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
# from app.api.report import router as report_router
from app.core.database import engine, Base
# 引入模型以确保建表
from app.models.tenant import Tenant
from app.models.user import User
from app.models.organization import Organization
from app.models.carbon import CarbonEmission, CarbonInventory

app = FastAPI(
    title="CarbonOS™ API",
    description="零碳园区智能运营平台",
    version="0.1.0",
)

# 启动时自动建表（MVP）
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    """根路径重定向到文档"""
    return RedirectResponse(url="/docs")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Favicon 占位符"""
    return RedirectResponse(url="/docs")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://scdc.cloud", "https://www.scdc.cloud"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 多租户中间件 (必须在 CORS 之后)
from app.core.middleware.tenant import TenantMiddleware
app.add_middleware(TenantMiddleware)

# 注册路由
app.include_router(ai_diagnostic_router, prefix="/api/v1") # Registered FIRST
app.include_router(auth_router, prefix="/api/v1")
app.include_router(organization_router, prefix="/api/v1")
app.include_router(data_router, prefix="/api/v1")
app.include_router(carbon_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(simulation_router, prefix="/api/v1")
app.include_router(pcf_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
# app.include_router(report_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok", "service": "carbonos-api"}


@app.get("/api/v1/info")
async def api_info():
    """API 信息"""
    return {
        "name": "CarbonOS™ API",
        "version": "0.1.0",
        "description": "零碳园区智能运营平台",
    }

