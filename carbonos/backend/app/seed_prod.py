import asyncio
import logging
import sys
import uuid
import random
from datetime import datetime, timedelta

# 添加模块搜索路径
sys.path.append(".")

from sqlalchemy import select
from app.core.database import async_session_maker
from app.core.security import get_password_hash
from app.models.user import User, UserRole, UserStatus
from app.models.tenant import Tenant, TenantPlan
from app.models.organization import Organization, OrganizationType
from app.models.carbon import CarbonEmission, EmissionScope, EmissionFactor
from app.models.energy import EnergyData

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    async with async_session_maker() as db:
        try:
            # 1. 创建超级管理员 (无需 Tenant)
            logger.info("Checking Super Admin...")
            result = await db.execute(select(User).where(User.email == "admin@scdc.cloud"))
            admin = result.scalar_one_or_none()
            
            if not admin:
                admin = User(
                    email="admin@scdc.cloud",
                    password_hash=get_password_hash("123456"),
                    full_name="Super Admin",
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                    is_superuser=True  # P0-003: 明确标识超级管理员
                )
                db.add(admin)
                logger.info("Created Super Admin: admin@scdc.cloud (is_superuser=True)")
            else:
                # P0-003: 确保现有超管有正确的标识
                if not admin.is_superuser:
                    admin.is_superuser = True
                    logger.info("Updated Super Admin: set is_superuser=True")
                logger.info("Super Admin already exists.")

            # 2. 创建测试租户 (ABC Tech)
            logger.info("Checking Test Tenant...")
            result = await db.execute(select(User).where(User.email == "user@abc.com"))
            test_user = result.scalar_one_or_none()
            
            if not test_user:
                # A. 创建租户
                tenant = Tenant(
                    name="ABC Tech",
                    code="abctech",
                    plan=TenantPlan.ENTERPRISE
                )
                db.add(tenant)
                await db.flush()
                
                # B. 创建组织架构 (总部 & 工厂)
                org_hq = Organization(
                    name="ABC Tech 总部",
                    code="abc_hq",
                    type=OrganizationType.PARK,  # 园区类型
                    tenant_id=tenant.id
                )
                db.add(org_hq)
                
                org_factory = Organization(
                    name="苏州制造工厂",
                    code="abc_sz_factory",
                    type=OrganizationType.ENTERPRISE,  # 企业类型
                    tenant_id=tenant.id,
                    parent_id=org_hq.id
                )
                db.add(org_factory)
                await db.flush()
                
                # C. 创建租户管理员
                test_user = User(
                    email="user@abc.com",
                    password_hash=get_password_hash("123456"),
                    full_name="Test Manager",
                    role=UserRole.ADMIN,
                    tenant_id=tenant.id,
                    status=UserStatus.ACTIVE
                )
                db.add(test_user)
                logger.info("Created Test Tenant User: user@abc.com")
                
                # D. 创建排放因子 (必须先有因子才能创建排放记录)
                logger.info("Creating Emission Factors...")
                factors = [
                    {
                        "name": "华东区域电网平均排放因子",
                        "category": "电力",
                        "energy_type": "electricity",
                        "scope": EmissionScope.SCOPE_2,
                        "factor_value": 0.5810,
                        "unit": "kgCO2e/kWh"
                    },
                    {
                        "name": "工业天然气",
                        "category": "天然气",
                        "energy_type": "natural_gas",
                        "scope": EmissionScope.SCOPE_1,
                        "factor_value": 2.16,
                        "unit": "kgCO2e/m3"
                    },
                    {
                        "name": "0号柴油",
                        "category": "燃油",
                        "energy_type": "diesel",
                        "scope": EmissionScope.SCOPE_1,
                        "factor_value": 2.6,
                        "unit": "kgCO2e/L"
                    }
                ]
                
                created_factors = {}
                for f in factors:
                    ef = EmissionFactor(
                        name=f["name"],
                        category=f["category"],
                        energy_type=f["energy_type"],
                        scope=f["scope"],
                        factor_value=f["factor_value"],
                        unit=f["unit"],
                        source="CN-Grid-2022",
                        year=2023,
                        is_default=True
                    )
                    db.add(ef)
                    await db.flush() # get id
                    created_factors[f["energy_type"]] = ef

                # E. 模拟排放数据 (过去30天)
                logger.info("Generating mock emission data...")
                
                # energy_type, name mapping
                sources = [
                    ("electricity", "市电购入"),
                    ("natural_gas", "锅炉燃气"),
                    ("diesel", "备用发电机"),
                ]
                
                for i in range(30):
                    date = datetime.utcnow() - timedelta(days=i)
                    
                    for energy_type, name in sources:
                        amount = random.uniform(100, 1000)
                        factor_obj = created_factors[energy_type]
                        
                        emission = CarbonEmission(
                            organization_id=org_factory.id,
                            tenant_id=tenant.id,
                            emission_factor_id=factor_obj.id, # 关联到因子ID
                            scope=factor_obj.scope,
                            activity_data=amount,
                            activity_unit=factor_obj.unit.split("/")[1], # e.g. kWh
                            emission_amount=(amount * factor_obj.factor_value) / 1000.0, # tCO2e
                            calculation_date=date,
                            remarks=f"{name} - {date.strftime('%Y-%m-%d')}"
                        )
                        db.add(emission)
                
                logger.info("Mock data generated.")
                
            else:
                logger.info("Test Tenant User already exists.")

            await db.commit()
            logger.info("Seed completed successfully.")
            
        except Exception as e:
            logger.error(f"Seed failed: {e}")
            await db.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(seed_data())
