"""
碳核算 API 路由
P0-002: 添加多租户数据隔离
"""

import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.permissions import get_tenant_user, tenant_filter, get_tenant_id  # P0-002: 租户隔离
from app.models.carbon import EmissionFactor, CarbonEmission, CarbonInventory, EmissionScope
from app.models.user import User
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

from app.core.permissions import get_superuser

@router.post("/factors", response_model=EmissionFactorResponse, status_code=status.HTTP_201_CREATED)
async def create_emission_factor(
    factor_data: EmissionFactorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-002: 仅超管可创建排放因子
):
    """创建排放因子 (仅限超级管理员)"""
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
    """获取排放因子列表 (Public - 排放因子是公共资源)"""
    query = select(EmissionFactor)
    if category:
        query = query.where(EmissionFactor.category == category)
    if energy_type:
        query = query.where(EmissionFactor.energy_type == energy_type)
    
    result = await db.execute(query.order_by(EmissionFactor.category))
    return result.scalars().all()


# ============ 碳核算计算 ============

@router.post("/calculate", response_model=CarbonEmissionResponse)
async def calculate_emission(
    request: CarbonCalculateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """计算碳排放"""
    # P0-002: 验证用户有权访问该组织的数据
    tenant_id = get_tenant_id(current_user)
    
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
            tenant_id=tenant_id,  # P0-002: 传递租户 ID
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """获取碳排放记录"""
    # P0-002: 添加租户隔离过滤
    query = select(CarbonEmission).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == current_user.tenant_id  # 关键：租户隔离
    )
    
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
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
    
    # P0-002: 添加租户隔离过滤
    query = select(
        CarbonEmission.scope,
        func.sum(CarbonEmission.emission_amount).label("total")
    ).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == current_user.tenant_id,  # 关键：租户隔离
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """获取碳盘查记录"""
    # P0-002: 添加租户隔离过滤
    query = select(CarbonInventory).where(
        CarbonInventory.organization_id == organization_id,
        CarbonInventory.tenant_id == current_user.tenant_id  # 关键：租户隔离
    )
    
    if year:
        query = query.where(CarbonInventory.year == year)
    
    query = query.order_by(CarbonInventory.year.desc(), CarbonInventory.month.desc())
    result = await db.execute(query)
    return result.scalars().all()
