
import contextvars
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import uuid

# 全局租户上下文
tenant_context: contextvars.ContextVar[str | None] = contextvars.ContextVar("tenant_context", default=None)

class TenantMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # 暂时简单实现：从 Header 获取 X-Tenant-ID
        # 生产环境应从 JWT Token 解析
        tenant_id = request.headers.get("X-Tenant-ID")
        
        # 如果是公开接口 (如 /docs, /auth)，允许无 tenant_id
        if request.url.path.startswith("/api/v1/auth") or request.url.path.startswith("/docs") or request.url.path.startswith("/openapi.json"):
             response = await call_next(request)
             return response

        if tenant_id:
            try:
                # 验证 UUID 格式
                uuid.UUID(tenant_id)
                token = tenant_context.set(tenant_id)
            except ValueError:
                # 如果格式不对，暂时忽略或报错，这里选择忽略
                pass
        
        try:
            response = await call_next(request)
        finally:
            if tenant_id:
                # 显式重置 context，防止污染 (ContextVar 是线程安全的，但在 async 中要小心)
                # 其实 Python 3.7+ ContextVar 原生支持 async/await 自动管理，这里是防险
                if 'token' in locals():
                    tenant_context.reset(token)
                    
        return response
