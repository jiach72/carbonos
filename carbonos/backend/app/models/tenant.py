"""
租户数据模型
v2.0 SaaS 核心表
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base

class TenantStatus(str, enum.Enum):
    ACTIVE = "active"       # 正常
    SUSPENDED = "suspended" # 欠费/冻结
    PENDING = "pending"     # 待审核

class TenantPlan(str, enum.Enum):
    FREE = "free"           # 免费版
    PRO = "pro"             # 专业版
    ENTERPRISE = "enterprise" # 旗舰版

class Tenant(Base):
    """租户表 (SaaS 顶层单位)"""
    __tablename__ = "tenants"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False) # 租户名称 (e.g. 苏州工业园)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True) # 租户代码 (e.g. suzhou_park)
    
    domain: Mapped[str | None] = mapped_column(String(255)) # 专属域名
    plan: Mapped[TenantPlan] = mapped_column(SQLEnum(TenantPlan), default=TenantPlan.FREE)
    status: Mapped[TenantStatus] = mapped_column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    
    contact_email: Mapped[str | None] = mapped_column(String(255))
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    users: Mapped[list["User"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
