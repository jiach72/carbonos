"""
报告 API 路由
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.carbon import CarbonEmission, Organization
from app.services.report_generator import ReportGenerator

router = APIRouter(prefix="/reports", tags=["报告"])


@router.get("/inventory/download")
async def download_inventory_report(
    organization_id: uuid.UUID,
    year: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """下载碳盘查报告 (PDF)"""
    # 获取组织信息
    org_result = await db.execute(select(Organization).where(Organization.id == organization_id))
    org = org_result.scalar_one_or_none()
    org_name = org.name if org else "Unknown Organization"
    
    # 获取数据汇总
    start = datetime(year, 1, 1)
    end = datetime(year + 1, 1, 1)
    
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
    
    summary = {
        "scope_1": scope_totals.get("scope_1", 0),
        "scope_2": scope_totals.get("scope_2", 0),
        "scope_3": scope_totals.get("scope_3", 0),
        "total": sum(scope_totals.values())
    }
    
    # 生成 PDF
    pdf_content = ReportGenerator.generate_carbon_inventory_report(org_name, year, summary)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Carbon_Inventory_{year}.pdf"
        }
    )
