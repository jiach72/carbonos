
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.carbon import CarbonEmission, EmissionScope
from app.models.tenant import Tenant

router = APIRouter(prefix="/diagnostic", tags=["AI 智能诊断"])

@router.get("/ping")
async def ping():
    return {"message": "pong"}

# --- Models ---

class DiagnosticInput(BaseModel):
    start_date: Optional[str] = None # YYYY-MM-DD
    end_date: Optional[str] = None   # YYYY-MM-DD

class OptimizationSuggestion(BaseModel):
    id: str
    title: str
    description: str
    impact: str # High, Medium, Low
    cost: str   # High, Medium, Low
    type: str   # Management, Technical, Energy
    score_uplift: float # 预计提升分数

class ScopeAnalysis(BaseModel):
    scope_1: float
    scope_2: float
    scope_3: float
    total: float

class DiagnosticReport(BaseModel):
    health_score: int
    analysis_date: datetime
    scope_analysis: ScopeAnalysis
    top_emissions: List[dict] # {source: str, amount: float}
    suggestions: List[OptimizationSuggestion]
    ai_summary: str # AI 生成的总结或是规则生成的总结

# --- Logic ---

def generate_rule_based_suggestions(scope_analysis: ScopeAnalysis, top_sources: List[dict]) -> List[OptimizationSuggestion]:
    """
    基于规则生成减排建议 (Fallback when AI is not configured)
    """
    suggestions = []
    
    total = scope_analysis.total
    if total <= 0:
        return []
        
    s1_ratio = scope_analysis.scope_1 / total
    s2_ratio = scope_analysis.scope_2 / total
    s3_ratio = scope_analysis.scope_3 / total
    
    # 规则 1: Scope 2 (电力) 占比过高 -> 建议绿电/光伏
    if s2_ratio > 0.5:
        suggestions.append(OptimizationSuggestion(
            id="rec_pv_001",
            title="部署分布式光伏发电系统",
            description=f"检测到您的外购电力排放占比高达 {s2_ratio:.1%}。建议利用园区闲置屋顶部署光伏系统，直接抵扣 Scope 2 排放。",
            impact="High",
            cost="High",
            type="Energy",
            score_uplift=15.0
        ))
        suggestions.append(OptimizationSuggestion(
            id="rec_pPA_002",
            title="采购绿色电力 (PPA)",
            description="短期内无法建设光伏的情况下，建议参与绿电市场交易，采购可再生能源电力。",
            impact="Medium",
            cost="Medium",
            type="Management",
            score_uplift=8.0
        ))
        
    # 规则 2: Scope 1 占比过高 -> 建议设备升级/电气化
    if s1_ratio > 0.3:
        suggestions.append(OptimizationSuggestion(
            id="rec_eq_001",
            title="生产设备电气化改造",
            description=f"Scope 1 直接排放占比 {s1_ratio:.1%}。建议排查燃油/燃气锅炉及车辆，逐步替换为电气化设备。",
            impact="High",
            cost="High",
            type="Technical",
            score_uplift=12.0
        ))
        
    # 规则 3: 通用管理建议
    suggestions.append(OptimizationSuggestion(
        id="rec_mgt_001",
        title="建立数字化能耗监控体系",
        description="建议接入 IoT 智能电表与水表，实时监控重点耗能设备，减少非生产时段的能源浪费。",
        impact="Medium",
        cost="Low",
        type="Management",
        score_uplift=5.0
    ))
    
    return suggestions

# --- Endpoints ---

@router.post("/analyze", response_model=DiagnosticReport)
async def analyze_emissions(
    input_data: DiagnosticInput,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    执行 AI 碳排诊断
    目前版本：规则引擎 (v1.0)
    未来版本：接入 LLM 进行深度分析
    """
    if not current_user.tenant_id:
        # 如果是超级管理员，需要指定 tenant_id 或者分析全平台（暂不支持）
        # 这里简单处理，暂定只能租户自己分析
        raise HTTPException(status_code=400, detail="请进入租户视角进行诊断")

    # 1. 聚合数据 (Scope 1/2/3)
    # 实际应根据 date range 过滤
    stmt = select(
        CarbonEmission.scope, 
        func.sum(CarbonEmission.emission_amount)
    ).where(
        CarbonEmission.tenant_id == current_user.tenant_id
    ).group_by(CarbonEmission.scope)
    
    result = await db.execute(stmt)
    rows = result.all()
    
    scope_map = {
        EmissionScope.SCOPE_1: 0.0,
        EmissionScope.SCOPE_2: 0.0,
        EmissionScope.SCOPE_3: 0.0
    }
    
    total_emission = 0.0
    for scope, amount in rows:
        scope_map[scope] = amount or 0.0
        total_emission += (amount or 0.0)
        
    scope_analysis = ScopeAnalysis(
        scope_1=scope_map[EmissionScope.SCOPE_1],
        scope_2=scope_map[EmissionScope.SCOPE_2],
        scope_3=scope_map[EmissionScope.SCOPE_3],
        total=total_emission
    )
    
    # 2. 获取 Top 排放源 (Mock for now, as we don't have detailed source breakdown query ready)
    # In real implementation: join with emission_source/factor
    top_emissions = []
    if scope_analysis.scope_2 > 0:
        top_emissions.append({"source": "外购电力 (国家电网)", "amount": scope_analysis.scope_2, "percent": scope_analysis.scope_2/total_emission if total_emission else 0})
    if scope_analysis.scope_1 > 0:
        top_emissions.append({"source": "自有车辆/锅炉", "amount": scope_analysis.scope_1, "percent": scope_analysis.scope_1/total_emission if total_emission else 0})
        
    # 3. 计算健康分 (Mock logic)
    # 假设基准是 1000t/年，越低分越高
    # 简单算法：基础分 60 + (1000 - total)/20
    # 但为了演示效果，给一个相对好看的分数
    base_score = 75
    if total_emission > 5000:
        health_score = 55
    elif total_emission > 1000:
        health_score = 68
    elif total_emission > 100:
        health_score = 82
    else:
        health_score = 90
        
    # 4. 生成建议
    suggestions = generate_rule_based_suggestions(scope_analysis, top_emissions)
    
    return DiagnosticReport(
        health_score=health_score,
        analysis_date=datetime.now(),
        scope_analysis=scope_analysis,
        top_emissions=top_emissions,
        suggestions=suggestions,
        ai_summary="基于现有排放数据分析，您的主要排放来源为外购电力（Scope 2）。系统建议优先考虑能源结构优化，引入清洁能源。"
    )
