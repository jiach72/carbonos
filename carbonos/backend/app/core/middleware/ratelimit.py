"""
API 限流与安全中间件
P2: 防止 API 滥用和 DDoS 攻击

重要：所有中间件已迁移为纯 ASGI 实现，
解决 BaseHTTPMiddleware 多层叠加导致 POST 请求体被消费的问题。
参考: https://github.com/encode/starlette/issues/1012
"""

import time
import json
from starlette.types import ASGIApp, Scope, Receive, Send, Message
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.cache import get_redis
from app.core.logging import get_logger

logger = get_logger("middleware.ratelimit")


# ============ 工具函数 ============

def _get_client_ip(scope: Scope) -> str:
    """从 ASGI scope 获取客户端 IP"""
    headers = dict((k.decode(), v.decode()) for k, v in scope.get("headers", []))
    forwarded = headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    client = scope.get("client")
    return client[0] if client else "unknown"


def _get_header(scope: Scope, name: str) -> str:
    """从 ASGI scope 获取请求头 (header name 小写)"""
    for key, value in scope.get("headers", []):
        if key.decode().lower() == name.lower():
            return value.decode()
    return ""


# ============ 纯 ASGI 中间件 ============

class RateLimitMiddleware:
    """
    基于 Redis 的 API 限流中间件（纯 ASGI）

    策略：
    - 未认证用户：100 请求/分钟 (按 IP)
    - 认证用户：1000 请求/分钟 (按用户 ID)
    - 超管用户：无限制
    """

    ANONYMOUS_LIMIT = 100
    AUTHENTICATED_LIMIT = 1000
    WINDOW_SIZE = 60

    SKIP_PATHS = ["/docs", "/openapi.json", "/redoc", "/health", "/favicon.ico"]

    def __init__(self, app: ASGIApp, enabled: bool = True):
        self.app = app
        self.enabled = enabled

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.enabled:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if any(path.startswith(skip) for skip in self.SKIP_PATHS):
            await self.app(scope, receive, send)
            return

        # 确定限流键和限制值
        auth_header = _get_header(scope, "authorization")
        client_ip = _get_client_ip(scope)

        key = f"ratelimit:ip:{client_ip}"
        limit = self.ANONYMOUS_LIMIT

        if auth_header.startswith("Bearer "):
            from jose import jwt, JWTError
            from app.core.config import get_settings

            settings = get_settings()
            try:
                token = auth_header[7:]
                payload = jwt.decode(
                    token,
                    settings.secret_key,
                    algorithms=[settings.algorithm]
                )
                user_id = payload.get("sub", "unknown")
                tenant_id = payload.get("tenant_id")

                # 超管不限流
                if tenant_id is None:
                    await self.app(scope, receive, send)
                    return

                key = f"ratelimit:user:{user_id}"
                limit = self.AUTHENTICATED_LIMIT
            except JWTError:
                pass

        # 检查限流
        allowed, remaining, reset = await self._check_rate_limit(key, limit, self.WINDOW_SIZE)

        if not allowed:
            logger.warning("rate_limit_exceeded", key=key, limit=limit, client_ip=client_ip)
            response = JSONResponse(
                status_code=429,
                content={"detail": "请求过于频繁，请稍后再试"},
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset),
                    "Retry-After": str(reset),
                },
            )
            await response(scope, receive, send)
            return

        # 注入限流响应头
        async def send_with_headers(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers.append((b"x-ratelimit-limit", str(limit).encode()))
                headers.append((b"x-ratelimit-remaining", str(remaining).encode()))
                headers.append((b"x-ratelimit-reset", str(reset).encode()))
                message["headers"] = headers
            await send(message)

        await self.app(scope, receive, send_with_headers)

    async def _check_rate_limit(
        self, key: str, limit: int, window: int
    ) -> tuple[bool, int, int]:
        """检查限流。返回: (是否允许, 剩余次数, 重置时间)"""
        try:
            redis = await get_redis()
            current = await redis.get(key)

            if current is None:
                await redis.setex(key, window, 1)
                return True, limit - 1, window

            count = int(current)
            if count >= limit:
                ttl = await redis.ttl(key)
                return False, 0, ttl

            await redis.incr(key)
            return True, limit - count - 1, await redis.ttl(key)
        except Exception as e:
            logger.warning("rate_limit_error", error=str(e))
            return True, limit, window


class RequestLoggingMiddleware:
    """
    请求日志中间件（纯 ASGI）
    P1-004: 记录所有 API 请求和响应
    """

    SKIP_PATHS = ["/docs", "/openapi.json", "/redoc", "/health"]

    def __init__(self, app: ASGIApp, enabled: bool = True):
        self.app = app
        self.enabled = enabled
        self.logger = get_logger("middleware.request")

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.enabled:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if any(path.startswith(skip) for skip in self.SKIP_PATHS):
            await self.app(scope, receive, send)
            return

        method = scope.get("method", "UNKNOWN")
        query = scope.get("query_string", b"").decode()
        start_time = time.perf_counter()
        status_code = 500  # 默认异常状态

        self.logger.info("request_start", method=method, path=path, query=query)

        async def send_wrapper(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message.get("status", 500)
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000
            self.logger.error(
                "request_error",
                method=method, path=path,
                error=str(e), duration_ms=round(duration_ms, 2),
            )
            raise
        else:
            duration_ms = (time.perf_counter() - start_time) * 1000
            self.logger.info(
                "request_end",
                method=method, path=path,
                status_code=status_code,
                duration_ms=round(duration_ms, 2),
            )


class AuthRateLimitMiddleware:
    """
    认证端点专用限流中间件（纯 ASGI）
    安全增强：防止暴力破解攻击

    策略：
    - 登录/注册端点：5 请求/15分钟 (按 IP)
    """

    AUTH_LIMIT = 5
    AUTH_WINDOW = 15 * 60

    AUTH_PATHS = ["/api/v1/auth/login", "/api/v1/auth/register"]

    def __init__(self, app: ASGIApp, enabled: bool = True):
        self.app = app
        self.enabled = enabled

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.enabled:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if not any(path.startswith(p) for p in self.AUTH_PATHS):
            await self.app(scope, receive, send)
            return

        client_ip = _get_client_ip(scope)
        key = f"ratelimit:auth:{client_ip}"

        try:
            redis = await get_redis()
            current = await redis.get(key)

            if current is None:
                await redis.setex(key, self.AUTH_WINDOW, 1)
            else:
                count = int(current)
                if count >= self.AUTH_LIMIT:
                    ttl = await redis.ttl(key)
                    logger.warning(
                        "auth_rate_limit_exceeded",
                        client_ip=client_ip, path=path
                    )
                    response = JSONResponse(
                        status_code=429,
                        content={"detail": f"登录尝试次数过多，请 {int(ttl / 60) + 1} 分钟后再试"},
                        headers={"Retry-After": str(ttl)},
                    )
                    await response(scope, receive, send)
                    return
                await redis.incr(key)
        except Exception as e:
            logger.warning("auth_rate_limit_error", error=str(e))

        await self.app(scope, receive, send)


class SecurityHeadersMiddleware:
    """
    安全响应头中间件（纯 ASGI）
    添加标准安全头以防止常见攻击
    """

    SECURITY_HEADERS = [
        (b"x-content-type-options", b"nosniff"),
        (b"x-frame-options", b"DENY"),
        (b"x-xss-protection", b"1; mode=block"),
        (b"strict-transport-security", b"max-age=31536000; includeSubDomains"),
        (b"x-ua-compatible", b"IE=edge"),
    ]

    def __init__(self, app: ASGIApp, enabled: bool = True):
        self.app = app
        self.enabled = enabled

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.enabled:
            await self.app(scope, receive, send)
            return

        async def send_with_security_headers(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers.extend(self.SECURITY_HEADERS)
                message["headers"] = headers
            await send(message)

        await self.app(scope, receive, send_with_security_headers)
