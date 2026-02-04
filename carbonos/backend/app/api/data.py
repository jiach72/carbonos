"""
数据接入 API 路由
"""

import uuid
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.energy import EnergyData, EnergyType, DataSource, ImportRecord
from app.schemas.energy import (
    EnergyDataCreate, 
    EnergyDataResponse, 
    EnergyDataBatch,
    ImportRecordResponse,
    EnergyStats
)

router = APIRouter(prefix="/data", tags=["数据接入"])


from app.api.deps import get_current_active_user
from app.models.user import User

@router.post("/energy", response_model=EnergyDataResponse, status_code=status.HTTP_201_CREATED)
async def create_energy_data(
    data: EnergyDataCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """录入能源数据（手动）"""
    if not current_user.tenant_id:
        raise HTTPException(status_code=400, detail="非租户用户无法提交数据")

    energy = EnergyData(
        organization_id=data.organization_id,
        energy_type=EnergyType(data.energy_type),
        data_date=data.data_date,
        consumption=data.consumption,
        unit=data.unit,
        cost=data.cost,
        remarks=data.remarks,
        source=DataSource.MANUAL,
        tenant_id=current_user.tenant_id,  # 强制注入
        created_by=current_user.id
    )
    db.add(energy)
    await db.commit()
    await db.refresh(energy)
    
    return energy


@router.post("/energy/batch", response_model=dict)
async def batch_create_energy_data(
    batch: EnergyDataBatch, 
    db: AsyncSession = Depends(get_db)
):
    """批量录入能源数据"""
    success_count = 0
    failed_count = 0
    
    for item in batch.data:
        try:
            energy = EnergyData(
                organization_id=item.organization_id,
                energy_type=EnergyType(item.energy_type),
                data_date=item.data_date,
                consumption=item.consumption,
                unit=item.unit,
                cost=item.cost,
                remarks=item.remarks,
                source=DataSource.MANUAL,
            )
            db.add(energy)
            success_count += 1
        except Exception:
            failed_count += 1
    
    await db.commit()
    
    return {
        "success_count": success_count,
        "failed_count": failed_count,
        "total": len(batch.data)
    }


@router.get("/energy", response_model=list[EnergyDataResponse])
async def list_energy_data(
    organization_id: Optional[uuid.UUID] = Query(None),
    energy_type: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    limit: int = Query(100, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取能源数据列表 (租户隔离)"""
    query = select(EnergyData).where(EnergyData.tenant_id == current_user.tenant_id) # 隔离
    
    if organization_id:
        query = query.where(EnergyData.organization_id == organization_id)
    if energy_type:
        query = query.where(EnergyData.energy_type == EnergyType(energy_type))
    if start_date:
        query = query.where(EnergyData.data_date >= start_date)
    if end_date:
        query = query.where(EnergyData.data_date <= end_date)
    
    query = query.order_by(EnergyData.data_date.desc()).limit(limit)
    result = await db.execute(query)
    
    return result.scalars().all()


@router.get("/energy/stats", response_model=list[EnergyStats])
async def get_energy_stats(
    organization_id: uuid.UUID,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """获取能源统计"""
    query = select(
        EnergyData.energy_type,
        func.sum(EnergyData.consumption).label("total_consumption"),
        EnergyData.unit,
        func.sum(EnergyData.cost).label("total_cost"),
        func.count(EnergyData.id).label("record_count")
    ).where(EnergyData.organization_id == organization_id)
    
    if start_date:
        query = query.where(EnergyData.data_date >= start_date)
    if end_date:
        query = query.where(EnergyData.data_date <= end_date)
    
    query = query.group_by(EnergyData.energy_type, EnergyData.unit)
    result = await db.execute(query)
    
    stats = []
    for row in result.all():
        stats.append(EnergyStats(
            energy_type=row.energy_type.value,
            total_consumption=row.total_consumption or 0,
            unit=row.unit,
            total_cost=row.total_cost or 0,
            record_count=row.record_count
        ))
    
    return stats


@router.post("/import/excel", response_model=ImportRecordResponse)
async def import_excel(
    organization_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Excel 数据导入"""
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="仅支持 Excel (.xlsx, .xls) 或 CSV 文件"
        )
    
    # 创建导入记录
    import_record = ImportRecord(
        filename=file.filename,
        organization_id=organization_id,
        status="processing"
    )
    db.add(import_record)
    await db.commit()
    await db.refresh(import_record)
    
    # TODO: 实际解析 Excel 文件并导入数据
    # 这里仅返回导入记录，实际实现需要:
    # 1. 读取 Excel 文件
    # 2. 解析数据行
    # 3. 验证数据格式
    # 4. 批量插入数据库
    # 5. 更新导入记录状态
    
    import_record.status = "completed"
    import_record.total_rows = 0
    import_record.success_rows = 0
    await db.commit()
    await db.refresh(import_record)
    
    return import_record


@router.get("/import/records", response_model=list[ImportRecordResponse])
async def list_import_records(
    organization_id: Optional[uuid.UUID] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """获取导入记录列表"""
    query = select(ImportRecord)
    
    if organization_id:
        query = query.where(ImportRecord.organization_id == organization_id)
    
    query = query.order_by(ImportRecord.created_at.desc()).limit(limit)
    result = await db.execute(query)
    
    return result.scalars().all()
