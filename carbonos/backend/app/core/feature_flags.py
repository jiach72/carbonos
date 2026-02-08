"""
Feature Flag 系统 - SaaS 多租户功能分层控制
基于 PRD v1.3 订阅版本实现功能门控
"""

from enum import Enum
from functools import wraps
from typing import Callable, Any
from fastapi import HTTPException, status


class Feature(str, Enum):
    """可用功能枚举 (对应 PRD v1.3 功能优先级矩阵)"""
    # 基础功能 (Essential+)
    CARBON_ACCOUNTING = "carbon_accounting"       # 组织碳核算
    REPORT_GENERATION = "report_generation"       # 报告生成
    SURVEY_WIZARD = "survey_wizard"               # 数字化调研向导
    
    # 专业版功能 (Pro+)
    AI_DIAGNOSIS = "ai_diagnosis"                 # AI 智能诊断 (Aican)
    IOT_INTEGRATION = "iot_integration"           # IoT 数据接入
    PCF_ASSISTANT = "pcf_assistant"               # 产品碳足迹助手
    QUOTA_MANAGEMENT = "quota_management"         # 配额管理与预警
    
    # 旗舰版功能 (Enterprise+)
    CARBON_ENERGY_SYNERGY = "carbon_energy_synergy"  # 碳-能协同控制
    GREEN_FINANCE_PACK = "green_finance_pack"        # 绿色金融就绪包
    MULTI_TENANT_MGMT = "multi_tenant_mgmt"          # 多租户层级管理
    SUPPLY_CHAIN = "supply_chain"                    # 供应链管理
    
    # 定制版功能 (Custom)
    GOV_TECH = "gov_tech"                            # 零碳城镇 (Gov Tech)
    CARBON_TRADING = "carbon_trading"                # 碳资产交易辅助


# 功能与订阅版本的映射关系
# key: 功能名称, value: 允许使用该功能的订阅版本列表
FEATURE_MAP: dict[str, list[str]] = {
    # Essential+ (启航版及以上)
    Feature.CARBON_ACCOUNTING.value: ["essential", "pro", "enterprise", "custom"],
    Feature.REPORT_GENERATION.value: ["essential", "pro", "enterprise", "custom"],
    Feature.SURVEY_WIZARD.value: ["essential", "pro", "enterprise", "custom"],
    
    # Pro+ (专业版及以上)
    Feature.AI_DIAGNOSIS.value: ["pro", "enterprise", "custom"],
    Feature.IOT_INTEGRATION.value: ["pro", "enterprise", "custom"],
    Feature.PCF_ASSISTANT.value: ["pro", "enterprise", "custom"],
    Feature.QUOTA_MANAGEMENT.value: ["pro", "enterprise", "custom"],
    
    # Enterprise+ (旗舰版及以上)
    Feature.CARBON_ENERGY_SYNERGY.value: ["enterprise", "custom"],
    Feature.GREEN_FINANCE_PACK.value: ["enterprise", "custom"],
    Feature.MULTI_TENANT_MGMT.value: ["enterprise", "custom"],
    Feature.SUPPLY_CHAIN.value: ["enterprise", "custom"],
    
    # Custom only (仅定制版)
    Feature.GOV_TECH.value: ["custom"],
    Feature.CARBON_TRADING.value: ["enterprise", "custom"],
}


def has_feature(tenant_plan: str, feature: str) -> bool:
    """
    检查租户订阅版本是否有权限使用某功能
    
    Args:
        tenant_plan: 租户订阅版本 (essential/pro/enterprise/custom)
        feature: 功能名称
        
    Returns:
        bool: 是否有权限
    """
    allowed_plans = FEATURE_MAP.get(feature, [])
    return tenant_plan.lower() in allowed_plans


def get_available_features(tenant_plan: str) -> list[str]:
    """
    获取租户订阅版本可用的所有功能列表
    
    Args:
        tenant_plan: 租户订阅版本
        
    Returns:
        list[str]: 可用功能列表
    """
    plan_lower = tenant_plan.lower()
    return [
        feature for feature, plans in FEATURE_MAP.items()
        if plan_lower in plans
    ]


def get_upgrade_hint(current_plan: str, feature: str) -> str | None:
    """
    获取升级提示信息 (用于前端展示)
    
    Args:
        current_plan: 当前订阅版本
        feature: 需要的功能
        
    Returns:
        str | None: 升级提示信息，如果已有权限返回 None
    """
    if has_feature(current_plan, feature):
        return None
    
    allowed_plans = FEATURE_MAP.get(feature, [])
    if not allowed_plans:
        return None
    
    # 版本优先级映射
    plan_priority = {"essential": 1, "pro": 2, "enterprise": 3, "custom": 4}
    plan_names = {"essential": "启航版", "pro": "专业版", "enterprise": "旗舰版", "custom": "定制版"}
    
    # 找到最低可用版本
    min_plan = min(allowed_plans, key=lambda p: plan_priority.get(p, 99))
    
    return f"此功能需要升级到 {plan_names.get(min_plan, min_plan)}，请联系销售。"


def require_feature(feature: str):
    """
    路由装饰器 - 检查租户是否有权限访问某功能
    
    用于保护 API 路由，确保只有具有相应订阅版本的租户才能访问
    
    Usage:
        @router.get("/ai-analysis")
        @require_feature(Feature.AI_DIAGNOSIS.value)
        async def get_ai_analysis(tenant: Tenant = Depends(get_current_tenant)):
            ...
    
    Args:
        feature: 需要检查的功能名称
        
    Raises:
        HTTPException 403: 租户订阅版本不支持该功能
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # 从 kwargs 中获取 tenant 对象 (通过 Depends 注入)
            tenant = kwargs.get("tenant") or kwargs.get("current_tenant")
            
            if tenant is None:
                # 尝试从 args 中查找 (不推荐)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="无法获取租户信息，请确保使用 Depends 注入 tenant 参数"
                )
            
            tenant_plan = getattr(tenant, "plan", None)
            if tenant_plan is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="租户信息不完整"
                )
            
            # 获取 plan 的 value (如果是 Enum 类型)
            plan_value = tenant_plan.value if hasattr(tenant_plan, "value") else str(tenant_plan)
            
            if not has_feature(plan_value, feature):
                upgrade_hint = get_upgrade_hint(plan_value, feature)
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "code": "FEATURE_NOT_AVAILABLE",
                        "message": f"当前订阅版本不支持此功能",
                        "feature": feature,
                        "current_plan": plan_value,
                        "upgrade_hint": upgrade_hint
                    }
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# 功能描述 (用于 API 响应和前端展示)
FEATURE_DESCRIPTIONS: dict[str, dict[str, str]] = {
    Feature.CARBON_ACCOUNTING.value: {
        "name": "组织碳核算",
        "description": "支持 Scope 1/2/3 碳排放核算，Excel/CSV 数据导入"
    },
    Feature.AI_DIAGNOSIS.value: {
        "name": "AI 智能诊断",
        "description": "基于 Aican 大模型的减排机会识别与优化建议"
    },
    Feature.PCF_ASSISTANT.value: {
        "name": "产品碳足迹助手",
        "description": "单件产品碳排放计算，CBAM 通报数据生成"
    },
    Feature.CARBON_ENERGY_SYNERGY.value: {
        "name": "碳-能协同控制",
        "description": "碳预算触发能源调度，与 EMS 系统联动"
    },
    Feature.GREEN_FINANCE_PACK.value: {
        "name": "绿色金融就绪包",
        "description": "一键生成银行认可的碳信排查报告"
    },
    Feature.GOV_TECH.value: {
        "name": "零碳城镇",
        "description": "区域碳账户、双控驾驶舱、政策模拟器"
    },
}
