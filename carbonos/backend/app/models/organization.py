"""
组织数据模型
园区 -> 企业 -> 车间 三级结构
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class OrganizationType(str, enum.Enum):
    """组织类型"""
    PARK = "park"           # 园区
    ENTERPRISE = "enterprise"  # 企业
    WORKSHOP = "workshop"      # 车间


class Organization(Base):
    """组织表（通用：园区/企业/车间）"""
    __tablename__ = "organizations"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    type: Mapped[OrganizationType] = mapped_column(
        SQLEnum(OrganizationType), 
        nullable=False,
        index=True
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"),
        nullable=True,
        index=True
    )
    # SaaS 租户隔离
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )
    address: Mapped[str | None] = mapped_column(String(500))
    contact_name: Mapped[str | None] = mapped_column(String(100))
    contact_phone: Mapped[str | None] = mapped_column(String(20))
    description: Mapped[str | None] = mapped_column(Text)
    
    # 排放相关
    industry_code: Mapped[str | None] = mapped_column(String(20))  # 行业代码
    area_sqm: Mapped[float | None] = mapped_column()  # 面积（平方米）
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    parent: Mapped["Organization | None"] = relationship(
        "Organization", 
        remote_side=[id],
        back_populates="children"
    )
    children: Mapped[list["Organization"]] = relationship(
        "Organization", 
        back_populates="parent"
    )


class UserOrganization(Base):
    """用户-组织关联表（多对多）"""
    __tablename__ = "user_organizations"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"),
        nullable=False,
        index=True
    )
    role: Mapped[str] = mapped_column(String(50), default="member")  # admin, manager, member
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
