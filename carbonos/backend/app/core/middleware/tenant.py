"""
多租户中间件
P0-004: 从 JWT Token 解析 tenant_id，而非信任客户端 Header
"""

import contextvars
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from jose import jwt, JWTError
import uuid

from app.core.config import get_settings

# 全局租户上下文 (用于在请求生命周期内共享租户信息)
tenant_context: contextvars.ContextVar[str | None] = contextvars.ContextVar("tenant_context", default=None)

# 公开接口路径前缀列表
PUBLIC_PATHS = [
    "/api/v1/auth",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/health",
    "/favicon.ico",
    "/",
]


class TenantMiddleware(BaseHTTPMiddleware):
    """
    多租户中间件
    
    功能：
    1. 从 JWT Token 中解析 tenant_id（安全）
    2. 设置租户上下文供后续请求使用
    3. 自动跳过公开接口
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.settings = get_settings()
    
    def _is_public_path(self, path: str) -> bool:
        """检查是否为公开接口"""
        return any(path.startswith(prefix) for prefix in PUBLIC_PATHS)
    
    def _extract_tenant_from_jwt(self, auth_header: str) -> str | None:
        """
        从 Authorization Header 中提取 tenant_id
        P0-004: 关键安全改进 - 不再信任客户端 Header
        """
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header[7:]  # 移除 "Bearer " 前缀
        
        try:
            payload = jwt.decode(
                token, 
                self.settings.secret_key, 
                algorithms=[self.settings.algorithm]
            )
            tenant_id = payload.get("tenant_id")
            
            # 验证 tenant_id 格式
            if tenant_id:
                uuid.UUID(tenant_id)  # 验证是有效的 UUID
                return tenant_id
                
        except (JWTError, ValueError):
            # JWT 解析失败或 tenant_id 格式无效
            # 让后续的认证依赖项处理具体错误
            pass
        
        return None
    
    async def dispatch(self, request: Request, call_next):
        # 公开接口直接放行
        if self._is_public_path(request.url.path):
            return await call_next(request)
        
        # 从 JWT 提取 tenant_id（安全方式）
        auth_header = request.headers.get("Authorization", "")
        tenant_id = self._extract_tenant_from_jwt(auth_header)
        
        token_var = None
        if tenant_id:
            token_var = tenant_context.set(tenant_id)
        
        try:
            response = await call_next(request)
        finally:
            # 清理上下文，防止污染其他请求
            if token_var is not None:
                tenant_context.reset(token_var)
        
        return response


def get_current_tenant_id() -> str | None:
    """
    获取当前请求的租户 ID
    可在任何地方调用以获取当前租户上下文
    """
    return tenant_context.get()
