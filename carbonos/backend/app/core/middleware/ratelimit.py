"""
API 限流中间件
P2: 防止 API 滥用和 DDoS 攻击
"""

import time
from typing import Optional, Callable
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.core.cache import get_redis
from app.core.logging import get_logger

logger = get_logger("middleware.ratelimit")


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    基于 Redis 的 API 限流中间件
    
    策略：
    - 未认证用户：100 请求/分钟 (按 IP)
    - 认证用户：1000 请求/分钟 (按用户 ID)
    - 超管用户：无限制
    """
    
    # 限流配置
    ANONYMOUS_LIMIT = 100  # 未认证用户每分钟请求数
    AUTHENTICATED_LIMIT = 1000  # 认证用户每分钟请求数
    WINDOW_SIZE = 60  # 时间窗口（秒）
    
    # 跳过限流的路径
    SKIP_PATHS = [
        "/docs",
        "/openapi.json",
        "/redoc",
        "/health",
        "/favicon.ico",
    ]
    
    def __init__(self, app: ASGIApp, enabled: bool = True):
        super().__init__(app)
        self.enabled = enabled
    
    def _should_skip(self, path: str) -> bool:
        """检查是否跳过限流"""
        return any(path.startswith(skip) for skip in self.SKIP_PATHS)
    
    def _get_client_ip(self, request: Request) -> str:
        """获取客户端 IP"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"
    
    async def _check_rate_limit(
        self, 
        key: str, 
        limit: int, 
        window: int
    ) -> tuple[bool, int, int]:
        """
        检查限流
        返回: (是否允许, 剩余次数, 重置时间)
        """
        try:
            redis = await get_redis()
            
            # 获取当前计数
            current = await redis.get(key)
            
            if current is None:
                # 首次请求，设置计数器
                await redis.setex(key, window, 1)
                return True, limit - 1, window
            
            count = int(current)
            
            if count >= limit:
                # 获取剩余过期时间
                ttl = await redis.ttl(key)
                return False, 0, ttl
            
            # 增加计数
            await redis.incr(key)
            return True, limit - count - 1, await redis.ttl(key)
            
        except Exception as e:
            # Redis 故障时允许请求通过
            logger.warning("rate_limit_error", error=str(e))
            return True, limit, window
    
    async def dispatch(self, request: Request, call_next):
        # 禁用或跳过路径
        if not self.enabled or self._should_skip(request.url.path):
            return await call_next(request)
        
        # 确定限流键和限制值
        auth_header = request.headers.get("Authorization", "")
        client_ip = self._get_client_ip(request)
        
        if auth_header.startswith("Bearer "):
            # 认证用户：按用户限流
            # 从 JWT 提取用户 ID（简化处理）
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
                
                # 检查是否超管（不限流）
                tenant_id = payload.get("tenant_id")
                if tenant_id is None:
                    return await call_next(request)
                
                key = f"ratelimit:user:{user_id}"
                limit = self.AUTHENTICATED_LIMIT
            except JWTError:
                key = f"ratelimit:ip:{client_ip}"
                limit = self.ANONYMOUS_LIMIT
        else:
            # 未认证用户：按 IP 限流
            key = f"ratelimit:ip:{client_ip}"
            limit = self.ANONYMOUS_LIMIT
        
        # 检查限流
        allowed, remaining, reset = await self._check_rate_limit(
            key, limit, self.WINDOW_SIZE
        )
        
        if not allowed:
            logger.warning(
                "rate_limit_exceeded",
                key=key,
                limit=limit,
                client_ip=client_ip
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="请求过于频繁，请稍后再试",
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset),
                    "Retry-After": str(reset),
                }
            )
        
        # 添加限流响应头
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(reset)
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    请求日志中间件
    P1-004: 记录所有 API 请求和响应
    """
    
    # 跳过日志的路径
    SKIP_PATHS = [
        "/docs",
        "/openapi.json",
        "/redoc",
        "/health",
    ]
    
    def __init__(self, app: ASGIApp, enabled: bool = True):
        super().__init__(app)
        self.enabled = enabled
        self.logger = get_logger("middleware.request")
    
    def _should_skip(self, path: str) -> bool:
        """检查是否跳过日志"""
        return any(path.startswith(skip) for skip in self.SKIP_PATHS)
    
    async def dispatch(self, request: Request, call_next):
        if not self.enabled or self._should_skip(request.url.path):
            return await call_next(request)
        
        start_time = time.perf_counter()
        
        # 记录请求
        self.logger.info(
            "request_start",
            method=request.method,
            path=request.url.path,
            query=str(request.query_params),
        )
        
        try:
            response = await call_next(request)
            
            # 计算耗时
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            # 记录响应
            self.logger.info(
                "request_end",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2),
            )
            
            return response
            
        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000
            self.logger.error(
                "request_error",
                method=request.method,
                path=request.url.path,
                error=str(e),
                duration_ms=round(duration_ms, 2),
            )
            raise
