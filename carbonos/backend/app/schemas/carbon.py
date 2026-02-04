"""
碳核算 Schema
"""

import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class EmissionFactorBase(BaseModel):
    """排放因子基础"""
    name: str
    category: str
    energy_type: str
    scope: str
    factor_value: float
    unit: str
    source: Optional[str] = None
    region: Optional[str] = None
    year: Optional[int] = None


class EmissionFactorCreate(EmissionFactorBase):
    """创建排放因子"""
    is_default: bool = False


class EmissionFactorResponse(EmissionFactorBase):
    """排放因子响应"""
    id: uuid.UUID
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CarbonCalculateRequest(BaseModel):
    """碳核算计算请求"""
    organization_id: uuid.UUID
    energy_type: str
    activity_data: float  # 活动数据（能源消耗量）
    activity_unit: str
    emission_factor_id: Optional[uuid.UUID] = None  # 可选，未指定则使用默认因子
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class CarbonEmissionResponse(BaseModel):
    """碳排放记录响应"""
    id: uuid.UUID
    organization_id: uuid.UUID
    scope: str
    activity_data: float
    activity_unit: str
    emission_amount: float  # tCO2e
    calculation_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class CarbonInventoryResponse(BaseModel):
    """碳盘查汇总响应"""
    id: uuid.UUID
    organization_id: uuid.UUID
    year: int
    month: Optional[int] = None
    scope_1_total: float
    scope_2_total: float
    scope_3_total: float
    total_emission: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class CarbonSummary(BaseModel):
    """碳排放汇总"""
    organization_id: uuid.UUID
    period: str
    scope_1: float
    scope_2: float
    scope_3: float
    total: float
    breakdown: dict[str, float]  # 按能源类型分类
