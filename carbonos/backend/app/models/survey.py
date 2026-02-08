"""
调研数据模型
用于在线自我诊断问卷 (Self-Diagnosis Survey)
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import enum

from app.core.database import Base


class SurveyScenario(str, enum.Enum):
    """业务场景"""
    FACTORY = "factory"       # 出口工厂
    BUILDING = "building"     # 商业建筑
    PARK = "park"             # 工业园区
    GOVERNMENT = "government" # 政府机构
    OTHER = "other"           # 其他


class SurveyIndustry(str, enum.Enum):
    """行业类型"""
    MANUFACTURING = "manufacturing"   # 制造业
    CHEMICAL = "chemical"             # 化工
    BUILDING_MATERIALS = "building_materials"  # 建材
    ELECTRONICS = "electronics"       # 电子
    TEXTILE = "textile"               # 纺织
    FOOD = "food"                     # 食品加工
    OTHER = "other"                   # 其他


class ElectricityRange(str, enum.Enum):
    """年用电量范围"""
    BELOW_100 = "below_100"           # <100万kWh
    RANGE_100_500 = "100_500"         # 100-500万kWh
    RANGE_500_1000 = "500_1000"       # 500-1000万kWh
    ABOVE_1000 = "above_1000"         # >1000万kWh


class Survey(Base):
    """
    调研问卷表 - 用于在线自我诊断
    路由: POST /api/surveys
    """
    __tablename__ = "surveys"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    
    # 可选关联租户 (匿名用户提交时为 None)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("tenants.id"),
        nullable=True
    )
    
    # === 问卷字段 ===
    scenario: Mapped[str] = mapped_column(String(50))       # 业务场景
    industry: Mapped[str] = mapped_column(String(50))       # 行业类型
    electricity_range: Mapped[str] = mapped_column(String(50))  # 年用电量范围
    exports_to_eu: Mapped[bool] = mapped_column(Boolean, default=False)  # 是否出口欧盟
    has_carbon_audit: Mapped[bool | None] = mapped_column(Boolean, nullable=True)  # 是否进行过碳盘查
    
    # === 联系信息 ===
    contact_info: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # 结构: { "name": str, "company": str, "phone": str, "email": str }
    
    # === 诊断结果 ===
    diagnosis_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 零碳就绪指数 0-100
    diagnosis_summary: Mapped[str | None] = mapped_column(Text, nullable=True)   # AI 生成的诊断摘要
    recommended_plan: Mapped[str | None] = mapped_column(String(50), nullable=True)  # 推荐版本
    report_url: Mapped[str | None] = mapped_column(String(500), nullable=True)   # PDF 报告 OSS 地址
    
    # === 元数据 ===
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)  # AI 处理时间
    
    # === 关联 ===
    # tenant: Mapped["Tenant"] = relationship(back_populates="surveys")


# 诊断评分规则 (用于计算零碳就绪指数)
def calculate_diagnosis_score(survey: Survey) -> int:
    """
    根据问卷答案计算零碳就绪指数 (0-100)
    
    评分标准:
    - 业务场景权重: 园区/政府 > 工厂 > 建筑
    - 是否出口欧盟: 是 +20 分 (CBAM 合规需求)
    - 是否已有碳盘查: 是 +30 分
    - 用电量规模: 规模越大基础分越高
    """
    score = 30  # 基础分
    
    # 业务场景加分
    scenario_scores = {
        "park": 15,
        "government": 15,
        "factory": 10,
        "building": 5,
        "other": 0,
    }
    score += scenario_scores.get(survey.scenario, 0)
    
    # 用电量规模加分
    electricity_scores = {
        "above_1000": 20,
        "500_1000": 15,
        "100_500": 10,
        "below_100": 5,
    }
    score += electricity_scores.get(survey.electricity_range, 0)
    
    # 出口欧盟加分 (CBAM 合规需求高)
    if survey.exports_to_eu:
        score += 15
    
    # 已有碳盘查经验加分
    if survey.has_carbon_audit:
        score += 20
    
    return min(score, 100)


def get_recommended_plan(survey: Survey) -> str:
    """
    根据问卷答案推荐订阅版本
    """
    # 政府客户 -> 定制版
    if survey.scenario == "government":
        return "custom"
    
    # 园区 / 大规模用电 -> 旗舰版
    if survey.scenario == "park" or survey.electricity_range == "above_1000":
        return "enterprise"
    
    # 出口欧盟 / 中等规模 -> 专业版
    if survey.exports_to_eu or survey.electricity_range in ["500_1000", "100_500"]:
        return "pro"
    
    # 其他 -> 启航版
    return "essential"
