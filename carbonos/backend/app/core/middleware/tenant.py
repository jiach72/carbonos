"""
多租户中间件（纯 ASGI）
P0-004: 从 JWT Token 解析 tenant_id，而非信任客户端 Header
"""

import contextvars
from starlette.types import ASGIApp, Scope, Receive, Send
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


class TenantMiddleware:
    """
    多租户中间件（纯 ASGI）

    功能：
    1. 从 JWT Token 中解析 tenant_id（安全）
    2. 设置租户上下文供后续请求使用
    3. 自动跳过公开接口
    """

    def __init__(self, app: ASGIApp):
        self.app = app
        self.settings = get_settings()

    def _is_public_path(self, path: str) -> bool:
        """检查是否为公开接口"""
        return any(path.startswith(prefix) for prefix in PUBLIC_PATHS)

    def _extract_tenant_from_jwt(self, scope: Scope) -> str | None:
        """从 ASGI scope 的 Authorization Header 中提取 tenant_id"""
        auth_header = ""
        for key, value in scope.get("headers", []):
            if key.decode().lower() == "authorization":
                auth_header = value.decode()
                break

        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header[7:]

        try:
            payload = jwt.decode(
                token,
                self.settings.secret_key,
                algorithms=[self.settings.algorithm]
            )
            tenant_id = payload.get("tenant_id")

            if tenant_id:
                uuid.UUID(tenant_id)  # 验证是有效的 UUID
                return tenant_id

        except (JWTError, ValueError):
            pass

        return None

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if self._is_public_path(path):
            await self.app(scope, receive, send)
            return

        # 从 JWT 提取 tenant_id（安全方式）
        tenant_id = self._extract_tenant_from_jwt(scope)

        token_var = None
        if tenant_id:
            token_var = tenant_context.set(tenant_id)

        try:
            await self.app(scope, receive, send)
        finally:
            # 清理上下文，防止污染其他请求
            if token_var is not None:
                tenant_context.reset(token_var)


def get_current_tenant_id() -> str | None:
    """
    获取当前请求的租户 ID
    可在任何地方调用以获取当前租户上下文
    """
    return tenant_context.get()
