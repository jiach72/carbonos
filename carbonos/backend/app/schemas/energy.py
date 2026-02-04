"""
能源数据 Schema
"""

import uuid
from datetime import datetime, date
from pydantic import BaseModel
from typing import Optional


class EnergyDataBase(BaseModel):
    """能源数据基础"""
    organization_id: uuid.UUID
    energy_type: str
    data_date: date
    consumption: float
    unit: str
    cost: Optional[float] = None
    remarks: Optional[str] = None


class EnergyDataCreate(EnergyDataBase):
    """创建能源数据"""
    pass


class EnergyDataResponse(EnergyDataBase):
    """能源数据响应"""
    id: uuid.UUID
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


class EnergyDataBatch(BaseModel):
    """批量能源数据"""
    data: list[EnergyDataCreate]


class ImportRecordResponse(BaseModel):
    """导入记录响应"""
    id: uuid.UUID
    filename: str
    organization_id: uuid.UUID
    total_rows: int
    success_rows: int
    failed_rows: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EnergyStats(BaseModel):
    """能源统计"""
    energy_type: str
    total_consumption: float
    unit: str
    total_cost: float
    record_count: int
