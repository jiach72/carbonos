"""
能源数据模型
"""

import uuid
from datetime import datetime, date
from sqlalchemy import String, DateTime, Date, Float, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class EnergyType(str, enum.Enum):
    """能源类型"""
    ELECTRICITY = "electricity"  # 电力
    NATURAL_GAS = "natural_gas"  # 天然气
    COAL = "coal"  # 煤炭
    DIESEL = "diesel"  # 柴油
    GASOLINE = "gasoline"  # 汽油
    STEAM = "steam"  # 蒸汽
    HEAT = "heat"  # 热力
    WATER = "water"  # 水


class DataSource(str, enum.Enum):
    """数据来源"""
    MANUAL = "manual"  # 手动录入
    EXCEL = "excel"  # Excel 导入
    API = "api"  # API 接口
    IOT = "iot"  # IoT 设备


class EnergyData(Base):
    """能源数据表"""
    __tablename__ = "energy_data"
    
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
    energy_type: Mapped[EnergyType] = mapped_column(
        SQLEnum(EnergyType), 
        nullable=False,
        index=True
    )
    data_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    consumption: Mapped[float] = mapped_column(Float, nullable=False)  # 消耗量
    unit: Mapped[str] = mapped_column(String(20), nullable=False)  # 单位
    cost: Mapped[float | None] = mapped_column(Float)  # 费用（元）
    source: Mapped[DataSource] = mapped_column(
        SQLEnum(DataSource), 
        default=DataSource.MANUAL
    )
    remarks: Mapped[str | None] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))


class ImportRecord(Base):
    """导入记录表"""
    __tablename__ = "import_records"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"),
        nullable=False
    )
    total_rows: Mapped[int] = mapped_column(default=0)
    success_rows: Mapped[int] = mapped_column(default=0)
    failed_rows: Mapped[int] = mapped_column(default=0)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, processing, completed, failed
    error_message: Mapped[str | None] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
