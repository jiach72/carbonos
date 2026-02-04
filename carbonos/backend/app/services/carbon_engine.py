"""
碳核算引擎服务
"""

from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.carbon import EmissionFactor, CarbonEmission, EmissionScope
from app.models.energy import EnergyType


class CarbonCalculationEngine:
    """碳核算计算引擎"""
    
    # 默认排放因子（备用）
    DEFAULT_FACTORS = {
        "electricity": {"factor": 0.5810, "unit": "kgCO2e/kWh", "scope": "scope_2"},  # 中国电网因子
        "natural_gas": {"factor": 2.162, "unit": "kgCO2e/m³", "scope": "scope_1"},
        "coal": {"factor": 2.493, "unit": "kgCO2e/kg", "scope": "scope_1"},
        "diesel": {"factor": 2.73, "unit": "kgCO2e/L", "scope": "scope_1"},
        "gasoline": {"factor": 2.30, "unit": "kgCO2e/L", "scope": "scope_1"},
        "steam": {"factor": 0.11, "unit": "kgCO2e/kg", "scope": "scope_2"},
        "heat": {"factor": 0.11, "unit": "kgCO2e/MJ", "scope": "scope_2"},
    }
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_emission_factor(
        self, 
        energy_type: str, 
        factor_id: Optional[uuid.UUID] = None
    ) -> tuple[float, str, EmissionScope]:
        """获取排放因子"""
        if factor_id:
            result = await self.db.execute(
                select(EmissionFactor).where(EmissionFactor.id == factor_id)
            )
            factor = result.scalar_one_or_none()
            if factor:
                return factor.factor_value, factor.unit, factor.scope
        
        # 查找默认因子
        result = await self.db.execute(
            select(EmissionFactor)
            .where(EmissionFactor.energy_type == energy_type)
            .where(EmissionFactor.is_default == True)
        )
        factor = result.scalar_one_or_none()
        
        if factor:
            return factor.factor_value, factor.unit, factor.scope
        
        # 使用内置默认值
        default = self.DEFAULT_FACTORS.get(energy_type)
        if default:
            return default["factor"], default["unit"], EmissionScope(default["scope"])
        
        raise ValueError(f"未找到能源类型 {energy_type} 的排放因子")
    
    async def calculate_emission(
        self,
        organization_id: uuid.UUID,
        energy_type: str,
        activity_data: float,
        activity_unit: str,
        factor_id: Optional[uuid.UUID] = None,
        period_start: Optional[datetime] = None,
        period_end: Optional[datetime] = None,
    ) -> CarbonEmission:
        """计算碳排放"""
        factor_value, factor_unit, scope = await self.get_emission_factor(energy_type, factor_id)
        
        # 计算排放量 (kg -> t)
        emission_kg = activity_data * factor_value
        emission_ton = emission_kg / 1000
        
        # 创建排放记录
        emission = CarbonEmission(
            organization_id=organization_id,
            scope=scope,
            activity_data=activity_data,
            activity_unit=activity_unit,
            emission_amount=emission_ton,
            calculation_date=datetime.utcnow(),
            period_start=period_start,
            period_end=period_end,
        )
        
        self.db.add(emission)
        await self.db.commit()
        await self.db.refresh(emission)
        
        return emission
    
    @staticmethod
    def get_scope_description(scope: EmissionScope) -> str:
        """获取范围描述"""
        descriptions = {
            EmissionScope.SCOPE_1: "范围一（直接排放）：来自企业拥有或控制的排放源",
            EmissionScope.SCOPE_2: "范围二（间接排放）：来自外购电力、热力等",
            EmissionScope.SCOPE_3: "范围三（其他间接排放）：价值链上下游排放",
        }
        return descriptions.get(scope, "")
