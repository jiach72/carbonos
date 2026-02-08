"""
调研问卷 API 路由
提供在线自我诊断功能
"""

from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.models.survey import (
    Survey, 
    calculate_diagnosis_score, 
    get_recommended_plan
)


router = APIRouter(prefix="/surveys", tags=["调研问卷"])


# ============ Pydantic Schemas ============

class ContactInfo(BaseModel):
    """联系信息"""
    name: str
    company: str
    phone: str
    email: EmailStr


class SurveyCreate(BaseModel):
    """创建调研问卷请求"""
    scenario: str           # factory / building / park / government / other
    industry: str           # manufacturing / chemical / electronics / textile / food / building_materials / other
    electricity_range: str  # below_100 / 100_500 / 500_1000 / above_1000
    exports_to_eu: bool = False
    has_carbon_audit: bool | None = None
    contact_info: ContactInfo


class SurveyResponse(BaseModel):
    """调研问卷响应"""
    id: UUID
    scenario: str
    industry: str
    electricity_range: str
    exports_to_eu: bool
    has_carbon_audit: bool | None
    diagnosis_score: int | None
    diagnosis_summary: str | None
    recommended_plan: str | None
    report_url: str | None
    created_at: datetime
    
    class Config:
        from_attributes = True


class DiagnosisResult(BaseModel):
    """诊断结果"""
    score: int
    level: str                 # 评级: 领先 / 良好 / 起步 / 较弱
    recommended_plan: str      # 推荐版本
    plan_name: str             # 版本中文名
    summary: str               # 诊断摘要
    key_insights: list[str]    # 关键洞察


# ============ API Endpoints ============

@router.post("", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def create_survey(
    data: SurveyCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    创建调研问卷 (无需认证)
    
    用于官网在线自我诊断功能
    """
    # 创建问卷记录
    survey = Survey(
        scenario=data.scenario,
        industry=data.industry,
        electricity_range=data.electricity_range,
        exports_to_eu=data.exports_to_eu,
        has_carbon_audit=data.has_carbon_audit,
        contact_info=data.contact_info.model_dump() if data.contact_info else None
    )
    
    # 计算诊断评分
    survey.diagnosis_score = calculate_diagnosis_score(survey)
    survey.recommended_plan = get_recommended_plan(survey)
    survey.processed_at = datetime.utcnow()
    
    # 生成诊断摘要 (简化版，不调用 AI)
    survey.diagnosis_summary = _generate_summary(survey)
    
    db.add(survey)
    await db.commit()
    await db.refresh(survey)
    
    return survey


@router.get("/{survey_id}", response_model=SurveyResponse)
async def get_survey(
    survey_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """获取调研问卷详情"""
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="问卷不存在"
        )
    
    return survey


@router.get("/{survey_id}/diagnosis", response_model=DiagnosisResult)
async def get_diagnosis(
    survey_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    获取诊断结果详情
    
    可用于展示更丰富的诊断信息
    """
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="问卷不存在"
        )
    
    # 评分等级
    score = survey.diagnosis_score or 0
    if score >= 80:
        level = "领先"
    elif score >= 60:
        level = "良好"
    elif score >= 40:
        level = "起步"
    else:
        level = "较弱"
    
    # 版本名称映射
    plan_names = {
        "essential": "启航版",
        "pro": "专业版",
        "enterprise": "旗舰版",
        "custom": "定制版"
    }
    
    # 关键洞察
    insights = _generate_insights(survey)
    
    return DiagnosisResult(
        score=score,
        level=level,
        recommended_plan=survey.recommended_plan or "essential",
        plan_name=plan_names.get(survey.recommended_plan or "essential", "启航版"),
        summary=survey.diagnosis_summary or "",
        key_insights=insights
    )


# ============ Helper Functions ============

def _generate_summary(survey: Survey) -> str:
    """生成诊断摘要 (规则模板版)"""
    score = survey.diagnosis_score or 0
    
    if score >= 80:
        prefix = "您的企业在零碳转型方面处于领先地位！"
    elif score >= 60:
        prefix = "您的企业已具备良好的零碳基础。"
    elif score >= 40:
        prefix = "您的企业正在起步阶段，有较大提升空间。"
    else:
        prefix = "建议您尽快启动零碳转型计划。"
    
    recommendations = []
    
    if survey.exports_to_eu and not survey.has_carbon_audit:
        recommendations.append("建议优先完成碳盘查，以应对 CBAM 合规要求")
    
    if survey.electricity_range in ["above_1000", "500_1000"]:
        recommendations.append("用电规模较大，建议部署智能能源管理系统")
    
    if survey.scenario == "park":
        recommendations.append("园区场景适合源网荷储一体化建设")
    
    if recommendations:
        return f"{prefix} " + "；".join(recommendations) + "。"
    
    return prefix


def _generate_insights(survey: Survey) -> list[str]:
    """生成关键洞察列表"""
    insights = []
    
    # 场景洞察
    scenario_insights = {
        "factory": "作为出口工厂，CBAM 碳关税合规是紧迫需求",
        "park": "园区运营可充分利用碳-能协同优势",
        "building": "商业建筑可通过 LEED/WELL 认证提升资产价值",
        "government": "零碳城镇建设是区域双碳目标的关键抓手"
    }
    if survey.scenario in scenario_insights:
        insights.append(scenario_insights[survey.scenario])
    
    # 出口洞察
    if survey.exports_to_eu:
        insights.append("欧盟 CBAM 已于 2026 年全面生效，需准备产品碳足迹数据")
    
    # 碳盘查洞察
    if survey.has_carbon_audit:
        insights.append("已有碳盘查基础，可快速启动碳管理数字化")
    else:
        insights.append("建议先完成组织碳核算，建立排放基线")
    
    # 用电量洞察
    if survey.electricity_range == "above_1000":
        insights.append("大规模用电企业建议考虑绿电采购和储能投资")
    
    return insights
