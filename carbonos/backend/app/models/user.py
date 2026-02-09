"""
用户数据模型
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Enum as SQLEnum, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    """用户角色"""
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    USER = "USER"
    VIEWER = "VIEWER"


class UserStatus(str, enum.Enum):
    """用户状态"""
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"


class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    # SaaS 租户隔离
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id"),
        nullable=True, # 允许为空可能是系统管理员，但一般业务用户必填。先设为 True 方便迁移，后期 Phase 2.2 变更为 False
        index=True
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole), 
        default=UserRole.USER
    )
    status: Mapped[UserStatus] = mapped_column(
        SQLEnum(UserStatus), 
        default=UserStatus.ACTIVE,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime)
    
    # 超级管理员标识（P0-003: 替代脆弱的 tenant_id==null 判断）
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    
    # 安全增强：账户锁定机制 - 暂时禁用直到数据库迁移完成
    # TODO: 数据库迁移完成后取消注释
    # failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    # locked_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationship
    tenant: Mapped["Tenant"] = relationship(back_populates="users", foreign_keys=[tenant_id])
