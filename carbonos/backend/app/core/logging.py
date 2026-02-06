"""
结构化日志模块
P1-004: 使用 structlog 实现结构化日志记录
"""

import sys
import logging
from typing import Any, Optional

import structlog

from app.core.config import get_settings


def setup_logging() -> None:
    """
    配置结构化日志
    在应用启动时调用
    """
    settings = get_settings()
    
    # 配置时间戳格式
    timestamper = structlog.processors.TimeStamper(fmt="iso")
    
    # 共享处理器（简化版本，兼容 PrintLogger）
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        timestamper,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.UnicodeDecoder(),
    ]
    
    if settings.debug:
        # 开发环境：彩色控制台输出
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer(colors=True)
        ]
    else:
        # 生产环境：JSON 格式
        processors = shared_processors + [
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer()
        ]
    
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )
    
    # 配置标准库 logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=logging.DEBUG if settings.debug else logging.INFO,
    )


def get_logger(name: str = __name__) -> structlog.BoundLogger:
    """获取日志记录器"""
    return structlog.get_logger(name)


class RequestLogger:
    """
    请求日志记录器
    用于记录 API 请求和响应
    """
    
    def __init__(self):
        self.logger = get_logger("api.request")
    
    def log_request(
        self,
        method: str,
        path: str,
        tenant_id: Optional[str] = None,
        user_id: Optional[str] = None,
        **extra: Any
    ) -> None:
        """记录请求"""
        self.logger.info(
            "api_request",
            method=method,
            path=path,
            tenant_id=tenant_id,
            user_id=user_id,
            **extra
        )
    
    def log_response(
        self,
        method: str,
        path: str,
        status_code: int,
        duration_ms: float,
        tenant_id: Optional[str] = None,
        **extra: Any
    ) -> None:
        """记录响应"""
        log_method = self.logger.info if status_code < 400 else self.logger.warning
        log_method(
            "api_response",
            method=method,
            path=path,
            status_code=status_code,
            duration_ms=round(duration_ms, 2),
            tenant_id=tenant_id,
            **extra
        )
    
    def log_error(
        self,
        method: str,
        path: str,
        error: str,
        tenant_id: Optional[str] = None,
        **extra: Any
    ) -> None:
        """记录错误"""
        self.logger.error(
            "api_error",
            method=method,
            path=path,
            error=error,
            tenant_id=tenant_id,
            **extra
        )


class AuditLogger:
    """
    审计日志记录器
    P2: 记录敏感操作
    """
    
    def __init__(self):
        self.logger = get_logger("audit")
    
    def log_action(
        self,
        action: str,
        resource_type: str,
        resource_id: str,
        user_id: str,
        tenant_id: Optional[str] = None,
        details: Optional[dict] = None,
        **extra: Any
    ) -> None:
        """记录审计事件"""
        self.logger.info(
            "audit_event",
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            user_id=user_id,
            tenant_id=tenant_id,
            details=details or {},
            **extra
        )
    
    def log_login(
        self,
        user_id: str,
        email: str,
        success: bool,
        ip_address: Optional[str] = None,
        **extra: Any
    ) -> None:
        """记录登录事件"""
        log_method = self.logger.info if success else self.logger.warning
        log_method(
            "login_attempt",
            user_id=user_id,
            email=email,
            success=success,
            ip_address=ip_address,
            **extra
        )


# 延迟初始化全局日志实例
_request_logger = None
_audit_logger = None


def get_request_logger() -> RequestLogger:
    """获取请求日志记录器（延迟初始化）"""
    global _request_logger
    if _request_logger is None:
        _request_logger = RequestLogger()
    return _request_logger


def get_audit_logger() -> AuditLogger:
    """获取审计日志记录器（延迟初始化）"""
    global _audit_logger
    if _audit_logger is None:
        _audit_logger = AuditLogger()
    return _audit_logger
