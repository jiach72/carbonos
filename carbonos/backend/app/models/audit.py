"""
审计日志持久化模块
P2: 将审计日志存储到数据库
"""

import uuid
from datetime import datetime
from typing import Optional, Any
from enum import Enum

from sqlalchemy import String, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import Base


class AuditAction(str, Enum):
    """审计动作类型"""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"
    IMPORT = "import"
    ADMIN_ACTION = "admin_action"


class AuditLog(Base):
    """审计日志表"""
    __tablename__ = "audit_logs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    # 时间戳
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )
    
    # 动作信息
    action: Mapped[AuditAction] = mapped_column(
        SQLEnum(AuditAction),
        nullable=False,
        index=True
    )
    
    # 资源信息
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_id: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # 用户信息
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    user_email: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # 租户信息
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
        index=True
    )
    
    # 请求信息
    ip_address: Mapped[str | None] = mapped_column(String(50))
    user_agent: Mapped[str | None] = mapped_column(String(500))
    
    # 详情
    details: Mapped[dict | None] = mapped_column(JSONB)
    
    # 结果
    success: Mapped[bool] = mapped_column(default=True)
    error_message: Mapped[str | None] = mapped_column(Text)


class AuditLogRepository:
    """审计日志仓库"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(
        self,
        action: AuditAction,
        resource_type: str,
        user_id: uuid.UUID,
        resource_id: Optional[str] = None,
        user_email: Optional[str] = None,
        tenant_id: Optional[uuid.UUID] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[dict] = None,
        success: bool = True,
        error_message: Optional[str] = None,
    ) -> AuditLog:
        """创建审计日志"""
        log = AuditLog(
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            user_id=user_id,
            user_email=user_email,
            tenant_id=tenant_id,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
            success=success,
            error_message=error_message,
        )
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log
    
    async def list_by_user(
        self,
        user_id: uuid.UUID,
        limit: int = 100,
        offset: int = 0
    ) -> list[AuditLog]:
        """查询用户审计日志"""
        result = await self.db.execute(
            select(AuditLog)
            .where(AuditLog.user_id == user_id)
            .order_by(AuditLog.timestamp.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
    
    async def list_by_tenant(
        self,
        tenant_id: uuid.UUID,
        limit: int = 100,
        offset: int = 0
    ) -> list[AuditLog]:
        """查询租户审计日志"""
        result = await self.db.execute(
            select(AuditLog)
            .where(AuditLog.tenant_id == tenant_id)
            .order_by(AuditLog.timestamp.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
    
    async def list_by_resource(
        self,
        resource_type: str,
        resource_id: Optional[str] = None,
        limit: int = 100
    ) -> list[AuditLog]:
        """查询资源审计日志"""
        query = select(AuditLog).where(AuditLog.resource_type == resource_type)
        if resource_id:
            query = query.where(AuditLog.resource_id == resource_id)
        result = await self.db.execute(
            query.order_by(AuditLog.timestamp.desc()).limit(limit)
        )
        return list(result.scalars().all())


async def log_audit_event(
    db: AsyncSession,
    action: AuditAction,
    resource_type: str,
    user_id: uuid.UUID,
    **kwargs: Any
) -> AuditLog:
    """
    快捷函数：记录审计事件
    
    使用示例:
    await log_audit_event(
        db,
        AuditAction.UPDATE,
        "tenant",
        user.id,
        resource_id=str(tenant.id),
        details={"plan": "premium"}
    )
    """
    repo = AuditLogRepository(db)
    return await repo.create(
        action=action,
        resource_type=resource_type,
        user_id=user_id,
        **kwargs
    )
