"""
仪表盘 API 路由
P0-002: 添加多租户数据隔离
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.permissions import get_tenant_user  # P0-002: 租户隔离
from app.models.carbon import CarbonEmission, EmissionScope
from app.models.energy import EnergyData, EnergyType
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["仪表盘"])


@router.get("/summary")
async def get_dashboard_summary(
    organization_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """获取仪表盘核心指标"""
    now = datetime.utcnow()
    this_month_start = datetime(now.year, now.month, 1)
    last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
    
    # P0-002: 所有查询都添加租户过滤
    tenant_id = current_user.tenant_id
    
    # 1. 本月总排放
    query_emission = select(func.sum(CarbonEmission.emission_amount)).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
        CarbonEmission.calculation_date >= this_month_start
    )
    total_emission = (await db.execute(query_emission)).scalar() or 0
    
    # 2. 上月排放（用于环比）
    query_last_emission = select(func.sum(CarbonEmission.emission_amount)).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
        CarbonEmission.calculation_date >= last_month_start,
        CarbonEmission.calculation_date < this_month_start
    )
    last_emission = (await db.execute(query_last_emission)).scalar() or 0
    emission_trend = ((total_emission - last_emission) / last_emission * 100) if last_emission > 0 else 0
    
    # 3. 本月能耗费用
    query_cost = select(func.sum(EnergyData.cost)).where(
        EnergyData.organization_id == organization_id,
        EnergyData.tenant_id == tenant_id,  # P0-002: 租户隔离
        EnergyData.data_date >= this_month_start.date()
    )
    total_cost = (await db.execute(query_cost)).scalar() or 0
    
    # 4. 年度目标完成度 (模拟目标: 5000t)
    yearly_target = 5000
    query_year_emission = select(func.sum(CarbonEmission.emission_amount)).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
        CarbonEmission.calculation_date >= datetime(now.year, 1, 1)
    )
    current_year_emission = (await db.execute(query_year_emission)).scalar() or 0
    progress = min(round((current_year_emission / yearly_target) * 100, 1), 100)
    
    return {
        "total_emission": round(total_emission, 2),
        "emission_trend": round(emission_trend, 1),
        "total_cost": round(total_cost, 2),
        "year_progress": progress,
        "year_target": yearly_target,
        "current_year_emission": round(current_year_emission, 2)
    }


@router.get("/trends")
async def get_dashboard_trends(
    organization_id: uuid.UUID,
    period: str = Query("month", description="周期: month/year"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """获取排放趋势图表数据"""
    now = datetime.utcnow()
    data = []
    tenant_id = current_user.tenant_id  # P0-002: 获取租户 ID
    
    if period == "year":
        # 最近12个月
        for i in range(11, -1, -1):
            date_point = now - timedelta(days=i*30)  # 简化计算
            start = datetime(date_point.year, date_point.month, 1)
            if start.month == 12:
                end = datetime(start.year + 1, 1, 1)
            else:
                end = datetime(start.year, start.month + 1, 1)
            
            query = select(func.sum(CarbonEmission.emission_amount)).where(
                CarbonEmission.organization_id == organization_id,
                CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
                CarbonEmission.calculation_date >= start,
                CarbonEmission.calculation_date < end
            )
            val = (await db.execute(query)).scalar() or 0
            data.append({
                "name": f"{start.month}月",
                "value": round(val, 2)
            })
    else:
        # 最近30天
        for i in range(29, -1, -1):
            date_point = now - timedelta(days=i)
            start = datetime(date_point.year, date_point.month, date_point.day)
            end = start + timedelta(days=1)
            
            query = select(func.sum(CarbonEmission.emission_amount)).where(
                CarbonEmission.organization_id == organization_id,
                CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
                CarbonEmission.calculation_date >= start,
                CarbonEmission.calculation_date < end
            )
            val = (await db.execute(query)).scalar() or 0
            data.append({
                "name": f"{date_point.day}日",
                "value": round(val, 2)
            })
        
    return data


@router.get("/distribution")
async def get_emission_distribution(
    organization_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_tenant_user)  # P0-002: 需要租户用户
):
    """获取排放构成（按范围）"""
    now = datetime.utcnow()
    start_year = datetime(now.year, 1, 1)
    tenant_id = current_user.tenant_id  # P0-002: 获取租户 ID
    
    query = select(
        CarbonEmission.scope,
        func.sum(CarbonEmission.emission_amount)
    ).where(
        CarbonEmission.organization_id == organization_id,
        CarbonEmission.tenant_id == tenant_id,  # P0-002: 租户隔离
        CarbonEmission.calculation_date >= start_year
    ).group_by(CarbonEmission.scope)
    
    result = await db.execute(query)
    
    data = []
    scope_map = {
        EmissionScope.SCOPE_1: "范围一",
        EmissionScope.SCOPE_2: "范围二",
        EmissionScope.SCOPE_3: "范围三"
    }
    
    for row in result.all():
        data.append({
            "name": scope_map.get(row[0], row[0]),
            "value": round(row[1], 2)
        })
        
    return data
