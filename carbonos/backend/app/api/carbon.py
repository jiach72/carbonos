"""
碳核算 API 路由
"""

import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.carbon import EmissionFactor, CarbonEmission, CarbonInventory, EmissionScope
from app.schemas.carbon import (
    EmissionFactorCreate,
    EmissionFactorResponse,
    CarbonCalculateRequest,
    CarbonEmissionResponse,
    CarbonInventoryResponse,
    CarbonSummary
)
from app.services.carbon_engine import CarbonCalculationEngine

router = APIRouter(prefix="/carbon", tags=["碳核算"])


# ============ 排放因子管理 ============

from app.api.deps import get_current_active_user
from app.models.user import User

# ============ 排放因子管理 ============

@router.post("/factors", response_model=EmissionFactorResponse, status_code=status.HTTP_201_CREATED)
async def create_emission_factor(
    factor_data: EmissionFactorCreate,
    db: AsyncSession = Depends(get_db),
    # 暂时不需要 User，因为排放因子库通常是公共的，或者是系统管理员维护
    # V2.0 逻辑：如果是租户创建的，则标记 source=tenant，否则是 public
    # 这里先简单处理，允许 Admin 创建
):
    """创建排放因子 (Admin)"""
    factor = EmissionFactor(
        name=factor_data.name,
        category=factor_data.category,
        energy_type=factor_data.energy_type,
        scope=EmissionScope(factor_data.scope),
        factor_value=factor_data.factor_value,
        unit=factor_data.unit,
        source=factor_data.source,
        region=factor_data.region,
        year=factor_data.year,
        is_default=factor_data.is_default,
    )
    db.add(factor)
    await db.commit()
    await db.refresh(factor)
    return factor


@router.get("/factors", response_model=list[EmissionFactorResponse])
async def list_emission_factors(
    category: Optional[str] = Query(None),
    energy_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """获取排放因子列表 (Public)"""
    query = select(EmissionFactor)
    if category:
        query = query.where(EmissionFactor.category == category)
    if energy_type:
        query = query.where(EmissionFactor.energy_type == energy_type)
    
    # TODO: 未来可以增加过滤 tenant_id IS NULL OR tenant_id = current_user.tenant_id
    
    result = await db.execute(query.order_by(EmissionFactor.category))
    return result.scalars().all()


# ============ 碳核算计算 ============

@router.post("/calculate", response_model=CarbonEmissionResponse)
async def calculate_emission(
    request: CarbonCalculateRequest,
    db: AsyncSession = Depends(get_db)
):
    """计算碳排放"""
    engine = CarbonCalculationEngine(db)
    
    try:
        emission = await engine.calculate_emission(
            organization_id=request.organization_id,
            energy_type=request.energy_type,
            activity_data=request.activity_data,
            activity_unit=request.activity_unit,
            factor_id=request.emission_factor_id,
            period_start=request.period_start,
            period_end=request.period_end,
        )
        return emission
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/emissions", response_model=list[CarbonEmissionResponse])
async def list_emissions(
    organization_id: uuid.UUID,
    scope: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """获取碳排放记录"""
    query = select(CarbonEmission).where(CarbonEmission.organization_id == organization_id)
    
    if scope:
        query = query.where(CarbonEmission.scope == EmissionScope(scope))
    
    query = query.order_by(CarbonEmission.calculation_date.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/summary", response_model=CarbonSummary)
async def get_carbon_summary(
    organization_id: uuid.UUID,
    year: int = Query(...),
    month: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """获取碳排放汇总"""
    # 构建日期范围
    if month:
        start = datetime(year, month, 1)
        if month == 12:
            end = datetime(year + 1, 1, 1)
        else:
            end = datetime(year, month + 1, 1)
        period = f"{year}年{month}月"
    else:
        start = datetime(year, 1, 1)
        end = datetime(year + 1, 1, 1)
        period = f"{year}年"
    
    # 按范围统计
    query = select(
        CarbonEmission.scope,
        func.sum(CarbonEmission.emission_amount).label("total")
    ).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.calculation_date >= start,
        CarbonEmission.calculation_date < end
    ).group_by(CarbonEmission.scope)
    
    result = await db.execute(query)
    scope_totals = {row.scope.value: row.total or 0 for row in result.all()}
    
    scope_1 = scope_totals.get("scope_1", 0)
    scope_2 = scope_totals.get("scope_2", 0)
    scope_3 = scope_totals.get("scope_3", 0)
    
    return CarbonSummary(
        organization_id=organization_id,
        period=period,
        scope_1=scope_1,
        scope_2=scope_2,
        scope_3=scope_3,
        total=scope_1 + scope_2 + scope_3,
        breakdown=scope_totals
    )


# ============ 碳盘查 ============

@router.get("/inventory", response_model=list[CarbonInventoryResponse])
async def list_inventories(
    organization_id: uuid.UUID,
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """获取碳盘查记录"""
    query = select(CarbonInventory).where(CarbonInventory.organization_id == organization_id)
    
    if year:
        query = query.where(CarbonInventory.year == year)
    
    query = query.order_by(CarbonInventory.year.desc(), CarbonInventory.month.desc())
    result = await db.execute(query)
    return result.scalars().all()
