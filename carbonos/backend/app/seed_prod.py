import asyncio
import logging
import sys
from datetime import datetime, timedelta

# 添加模块搜索路径
sys.path.append(".")

from sqlalchemy import select
from app.core.database import async_session_maker
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.tenant import Tenant, TenantPlan
from app.models.organization import Organization, OrganizationType
from app.models.carbon import CarbonEmission, EmissionSourceType, EmissionScope

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
                    role=UserRole.OD_ADMIN, # 平台超管
                    is_active=True
                )
                db.add(admin)
                logger.info("Created Super Admin: admin@scdc.cloud")
            else:
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
                    type=OrganizationType.HEADQUARTER,
                    tenant_id=tenant.id
                )
                db.add(org_hq)
                
                org_factory = Organization(
                    name="苏州制造工厂",
                    code="abc_sz_factory",
                    type=OrganizationType.FACTORY,
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
                    is_active=True
                )
                db.add(test_user)
                logger.info("Created Test Tenant User: user@abc.com")
                
                # D. 模拟排放数据 (过去30天)
                import random
                logger.info("Generating mock emission data...")
                
                sources = [
                    (EmissionSourceType.ELECTRICITY, EmissionScope.SCOPE_2, "市电购入"),
                    (EmissionSourceType.NATURAL_GAS, EmissionScope.SCOPE_1, "锅炉燃气"),
                    (EmissionSourceType.DIESEL, EmissionScope.SCOPE_1, "备用发电机"),
                    (EmissionSourceType.GASOLINE, EmissionScope.SCOPE_1, "自有车辆"),
                ]
                
                for i in range(30):
                    date = datetime.utcnow() - timedelta(days=i)
                    # 为工厂生成数据
                    for source_type, scope, name in sources:
                        amount = random.uniform(100, 1000)
                        factor = random.uniform(0.5, 2.0)
                        
                        emission = CarbonEmission(
                            organization_id=org_factory.id,
                            tenant_id=tenant.id,
                            source_type=source_type,
                            scope=scope,
                            name=f"{name} - {date.strftime('%Y-%m-%d')}",
                            amount=amount,
                            unit="kWh" if source_type == EmissionSourceType.ELECTRICITY else "L/m3",
                            emission_factor=factor,
                            total_co2e=amount * factor,
                            occurrence_date=date,
                            recorder_id=test_user.id
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
