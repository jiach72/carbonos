"""
Prometheus 监控模块
P2: 应用指标收集和暴露
"""

import time
from typing import Callable
from functools import wraps

from fastapi import Response
from starlette.types import ASGIApp, Scope, Receive, Send, Message

try:
    from prometheus_client import (
        Counter, Histogram, Gauge, Info,
        generate_latest, CONTENT_TYPE_LATEST,
        CollectorRegistry, multiprocess, REGISTRY
    )
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False


# ============ 指标定义 ============

if PROMETHEUS_AVAILABLE:
    # 请求计数器
    REQUEST_COUNT = Counter(
        "carbonos_http_requests_total",
        "HTTP 请求总数",
        ["method", "endpoint", "status_code", "tenant_id"]
    )
    
    # 请求延迟直方图
    REQUEST_LATENCY = Histogram(
        "carbonos_http_request_duration_seconds",
        "HTTP 请求延迟（秒）",
        ["method", "endpoint"],
        buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
    )
    
    # 活跃请求数
    REQUESTS_IN_PROGRESS = Gauge(
        "carbonos_http_requests_in_progress",
        "正在处理的 HTTP 请求数",
        ["method", "endpoint"]
    )
    
    # 数据库查询计数
    DB_QUERY_COUNT = Counter(
        "carbonos_db_queries_total",
        "数据库查询总数",
        ["operation", "table"]
    )
    
    # 数据库查询延迟
    DB_QUERY_LATENCY = Histogram(
        "carbonos_db_query_duration_seconds",
        "数据库查询延迟（秒）",
        ["operation", "table"],
        buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0]
    )
    
    # 缓存命中率
    CACHE_HITS = Counter(
        "carbonos_cache_hits_total",
        "缓存命中次数",
        ["cache_type"]
    )
    
    CACHE_MISSES = Counter(
        "carbonos_cache_misses_total",
        "缓存未命中次数",
        ["cache_type"]
    )
    
    # 租户统计
    TENANT_REQUESTS = Counter(
        "carbonos_tenant_requests_total",
        "租户请求总数",
        ["tenant_id"]
    )
    
    # 应用信息
    APP_INFO = Info(
        "carbonos_app",
        "CarbonOS 应用信息"
    )


def init_metrics():
    """初始化指标（应用启动时调用）"""
    if not PROMETHEUS_AVAILABLE:
        return
    
    APP_INFO.info({
        "version": "0.1.0",
        "name": "CarbonOS API",
    })


class PrometheusMiddleware:
    """
    Prometheus 指标收集中间件（纯 ASGI）
    自动记录请求计数、延迟和活跃连接数
    """

    # 跳过指标收集的路径
    SKIP_PATHS = [
        "/metrics",
        "/health",
        "/docs",
        "/openapi.json",
        "/redoc",
    ]

    def __init__(self, app: ASGIApp, enabled: bool = True):
        self.app = app
        self.enabled = enabled and PROMETHEUS_AVAILABLE

    def _should_skip(self, path: str) -> bool:
        return any(path.startswith(skip) for skip in self.SKIP_PATHS)

    def _normalize_path(self, path: str) -> str:
        """
        归一化路径，避免基数爆炸
        /api/v1/users/123 -> /api/v1/users/{id}
        """
        import re
        # UUID 替换
        path = re.sub(
            r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
            '{id}',
            path,
            flags=re.IGNORECASE
        )
        # 数字 ID 替换
        path = re.sub(r'/\d+', '/{id}', path)
        return path

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.enabled:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if self._should_skip(path):
            await self.app(scope, receive, send)
            return

        method = scope.get("method", "UNKNOWN")
        normalized_path = self._normalize_path(path)
        tenant_id = "unknown" # In raw ASGI, tenant_id would need to be extracted from headers or query params if available
        status_code = 500

        # 增加活跃请求计数
        REQUESTS_IN_PROGRESS.labels(method=method, endpoint=normalized_path).inc()
        start_time = time.perf_counter()

        async def send_wrapper(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message.get("status", 500)
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        except Exception:
            status_code = 500
            raise
        finally:
            duration = time.perf_counter() - start_time
            REQUEST_LATENCY.labels(method=method, endpoint=normalized_path).observe(duration)

            REQUEST_COUNT.labels(
                method=method,
                endpoint=normalized_path,
                status_code=str(status_code),
                tenant_id=str(tenant_id)
            ).inc()

            if tenant_id != "unknown":
                TENANT_REQUESTS.labels(tenant_id=str(tenant_id)).inc()

            REQUESTS_IN_PROGRESS.labels(method=method, endpoint=normalized_path).dec()


async def metrics_endpoint() -> Response:
    """
    Prometheus 指标端点
    GET /metrics
    """
    if not PROMETHEUS_AVAILABLE:
        return Response(
            content="Prometheus client not available",
            status_code=503
        )
    
    return Response(
        content=generate_latest(REGISTRY),
        media_type=CONTENT_TYPE_LATEST
    )


# ============ 装饰器：用于手动记录指标 ============

def track_db_query(operation: str, table: str):
    """
    装饰器：记录数据库查询指标
    
    使用示例:
    @track_db_query("select", "users")
    async def get_user(user_id: str):
        ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not PROMETHEUS_AVAILABLE:
                return await func(*args, **kwargs)
            
            start_time = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.perf_counter() - start_time
                DB_QUERY_COUNT.labels(operation=operation, table=table).inc()
                DB_QUERY_LATENCY.labels(operation=operation, table=table).observe(duration)
        
        return wrapper
    return decorator


def record_cache_hit(cache_type: str = "default"):
    """记录缓存命中"""
    if PROMETHEUS_AVAILABLE:
        CACHE_HITS.labels(cache_type=cache_type).inc()


def record_cache_miss(cache_type: str = "default"):
    """记录缓存未命中"""
    if PROMETHEUS_AVAILABLE:
        CACHE_MISSES.labels(cache_type=cache_type).inc()
