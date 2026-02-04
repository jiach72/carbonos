"""
碳核算数据模型
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, ForeignKey, Enum as SQLEnum, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class EmissionScope(str, enum.Enum):
    """排放范围"""
    SCOPE_1 = "scope_1"  # 直接排放
    SCOPE_2 = "scope_2"  # 间接排放（电力/热力）
    SCOPE_3 = "scope_3"  # 其他间接排放


class EmissionFactor(Base):
    """排放因子库"""
    __tablename__ = "emission_factors"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # 电力、天然气、煤炭等
    energy_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    scope: Mapped[EmissionScope] = mapped_column(SQLEnum(EmissionScope), nullable=False)
    factor_value: Mapped[float] = mapped_column(Float, nullable=False)  # 排放因子值
    unit: Mapped[str] = mapped_column(String(50), nullable=False)  # 如 kgCO2e/kWh
    source: Mapped[str | None] = mapped_column(String(500))  # 数据来源
    region: Mapped[str | None] = mapped_column(String(100))  # 地区
    year: Mapped[int | None] = mapped_column()  # 有效年份
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CarbonEmission(Base):
    """碳排放记录"""
    __tablename__ = "carbon_emissions"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"),
        nullable=False,
        index=True
    )
    # SaaS 租户隔离
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )
    energy_data_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("energy_data.id")
    )
    emission_factor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("emission_factors.id"),
        nullable=False
    )
    scope: Mapped[EmissionScope] = mapped_column(SQLEnum(EmissionScope), nullable=False, index=True)
    activity_data: Mapped[float] = mapped_column(Float, nullable=False)  # 活动数据
    activity_unit: Mapped[str] = mapped_column(String(50), nullable=False)
    emission_amount: Mapped[float] = mapped_column(Float, nullable=False)  # 排放量 (tCO2e)
    calculation_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    period_start: Mapped[datetime | None] = mapped_column(DateTime)
    period_end: Mapped[datetime | None] = mapped_column(DateTime)
    remarks: Mapped[str | None] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CarbonInventory(Base):
    """碳盘查汇总"""
    __tablename__ = "carbon_inventories"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"),
        nullable=False,
        index=True
    )
    # SaaS 租户隔离
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )
    year: Mapped[int] = mapped_column(nullable=False, index=True)
    month: Mapped[int | None] = mapped_column()  # 如果为空则为年度汇总
    
    scope_1_total: Mapped[float] = mapped_column(Float, default=0)  # tCO2e
    scope_2_total: Mapped[float] = mapped_column(Float, default=0)
    scope_3_total: Mapped[float] = mapped_column(Float, default=0)
    total_emission: Mapped[float] = mapped_column(Float, default=0)
    
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft, confirmed, submitted
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
