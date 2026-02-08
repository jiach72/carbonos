"""
演示数据种子脚本
创建租户、租户管理员和示例数据

运行方式:
cd carbonos/backend
python -m scripts.seed_demo
"""

import asyncio
import uuid
from datetime import datetime, timedelta
import random

from app.core.database import AsyncSessionLocal, engine, Base
from app.models.tenant import Tenant, TenantPlan, TenantStatus
from app.models.user import User, UserRole, UserStatus
from app.models.organization import Organization, OrganizationType
from app.models.carbon import CarbonEmission, EmissionFactor, EmissionScope
from app.models.energy import EnergyData, EnergyType, DataSource

import bcrypt


def hash_password(password: str) -> str:
    """哈希密码"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# ============ 演示租户配置 ============
DEMO_TENANTS = [
    {
        "name": "苏州工业园 A 区",
        "code": "sip_a",
        "plan": TenantPlan.ENTERPRISE,
        "admin_email": "admin@sip-a.com",
        "contact_email": "contact@sip-a.com",
    },
    {
        "name": "高新区科创园",
        "code": "snd_tech",
        "plan": TenantPlan.PRO,
        "admin_email": "manager@snd-tech.com",
        "contact_email": "info@snd-tech.com",
    },
    {
        "name": "昆山智能制造基地",
        "code": "kunshan_mfg",
        "plan": TenantPlan.PRO,
        "admin_email": "ops@kunshan-mfg.com",
        "contact_email": "ops@kunshan-mfg.com",
    },
    {
        "name": "吴中生物医药港",
        "code": "bio_port",
        "plan": TenantPlan.ESSENTIAL,
        "admin_email": "contact@bio-port.com",
        "contact_email": "contact@bio-port.com",
    },
    {
        "name": "相城数字经济产业园",
        "code": "xc_digital",
        "plan": TenantPlan.ESSENTIAL,
        "admin_email": "info@xc-digital.com",
        "contact_email": "info@xc-digital.com",
    },
]

# 默认密码
DEFAULT_PASSWORD = "123456"


async def create_emission_factors(db):
    """创建排放因子库"""
    from sqlalchemy import select
    
    # 检查是否已存在默认排放因子
    result = await db.execute(select(EmissionFactor).where(EmissionFactor.is_default == True))
    existing = result.scalars().first()
    if existing:
        print("  ⏭️  排放因子已存在，跳过")
        return []
    
    factors = [
        EmissionFactor(
            name="华东电网电力排放因子",
            category="电力",
            energy_type="electricity",
            scope=EmissionScope.SCOPE_2,
            factor_value=0.7035,
            unit="kgCO2e/kWh",
            source="生态环境部 2023",
            region="华东",
            year=2023,
            is_default=True,
        ),
        EmissionFactor(
            name="天然气燃烧排放因子",
            category="天然气",
            energy_type="natural_gas",
            scope=EmissionScope.SCOPE_1,
            factor_value=2.162,
            unit="kgCO2e/m³",
            source="IPCC 2006",
            region="全球",
            year=2023,
            is_default=True,
        ),
        EmissionFactor(
            name="柴油燃烧排放因子",
            category="柴油",
            energy_type="diesel",
            scope=EmissionScope.SCOPE_1,
            factor_value=2.7266,
            unit="kgCO2e/L",
            source="IPCC 2006",
            region="全球",
            year=2023,
            is_default=True,
        ),
    ]
    
    for factor in factors:
        db.add(factor)
    
    await db.commit()
    print(f"  ✅ 创建 {len(factors)} 个排放因子")
    return factors


async def create_demo_tenant(db, tenant_config: dict) -> tuple[Tenant, User] | None:
    """创建演示租户和管理员"""
    from sqlalchemy import select
    
    # 检查租户是否已存在
    result = await db.execute(select(Tenant).where(Tenant.code == tenant_config["code"]))
    existing = result.scalars().first()
    if existing:
        print(f"  ⏭️  租户已存在，跳过")
        return None
    
    # 创建租户
    tenant = Tenant(
        id=uuid.uuid4(),
        name=tenant_config["name"],
        code=tenant_config["code"],
        plan=tenant_config["plan"],
        status=TenantStatus.ACTIVE,
        contact_email=tenant_config["contact_email"],
    )
    db.add(tenant)
    
    # 创建租户管理员
    admin = User(
        id=uuid.uuid4(),
        tenant_id=tenant.id,
        email=tenant_config["admin_email"],
        password_hash=hash_password(DEFAULT_PASSWORD),
        full_name=f"{tenant_config['name']} 管理员",
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_superuser=False,
    )
    db.add(admin)
    
    await db.commit()
    return tenant, admin


async def create_organizations(db, tenant: Tenant) -> list[Organization]:
    """为租户创建组织架构"""
    # 创建园区（顶级组织）
    park = Organization(
        id=uuid.uuid4(),
        tenant_id=tenant.id,
        name=tenant.name,
        code=f"{tenant.code}_park",
        type=OrganizationType.PARK,
        parent_id=None,
        address="江苏省苏州市工业园区",
        industry_code="7212",
        area_sqm=random.randint(50000, 200000),
    )
    db.add(park)
    
    # 创建 2-3 个企业
    enterprises = []
    enterprise_names = ["智能科技有限公司", "新材料有限公司", "生物科技有限公司"]
    for i, name in enumerate(random.sample(enterprise_names, random.randint(2, 3))):
        enterprise = Organization(
            id=uuid.uuid4(),
            tenant_id=tenant.id,
            name=f"{tenant.code.upper()}_{name}",
            code=f"{tenant.code}_ent_{i+1}",
            type=OrganizationType.ENTERPRISE,
            parent_id=park.id,
            industry_code=random.choice(["3511", "2631", "2761"]),
            area_sqm=random.randint(5000, 30000),
        )
        db.add(enterprise)
        enterprises.append(enterprise)
    
    await db.commit()
    print(f"  📍 创建组织架构: 1 园区 + {len(enterprises)} 企业")
    return [park] + enterprises


async def create_energy_data(db, organizations: list[Organization], days: int = 30):
    """生成过去 N 天的能源数据"""
    today = datetime.now().date()
    energy_count = 0
    
    for org in organizations:
        if org.type == OrganizationType.PARK:
            continue  # 园区不直接产生能耗数据
            
        for day_offset in range(days):
            data_date = today - timedelta(days=day_offset)
            
            # 电力数据
            electricity = EnergyData(
                id=uuid.uuid4(),
                organization_id=org.id,
                energy_type=EnergyType.ELECTRICITY,
                data_date=data_date,
                consumption=random.uniform(500, 2000),
                unit="kWh",
                cost=random.uniform(300, 1200),
                source=DataSource.MANUAL,
            )
            db.add(electricity)
            energy_count += 1
            
            # 天然气数据（50% 概率）
            if random.random() > 0.5:
                gas = EnergyData(
                    id=uuid.uuid4(),
                    organization_id=org.id,
                    energy_type=EnergyType.NATURAL_GAS,
                    data_date=data_date,
                    consumption=random.uniform(50, 200),
                    unit="m³",
                    cost=random.uniform(100, 400),
                    source=DataSource.MANUAL,
                )
                db.add(gas)
                energy_count += 1
    
    await db.commit()
    print(f"  ⚡ 生成 {energy_count} 条能源数据记录 (过去 {days} 天)")


async def create_demo_users(db, tenant: Tenant, count: int = 5):
    """为租户创建普通用户"""
    users = []
    for i in range(count):
        user = User(
            id=uuid.uuid4(),
            tenant_id=tenant.id,
            email=f"user{i}@{tenant.code.replace('_', '-')}.com",
            password_hash=hash_password(DEFAULT_PASSWORD),
            full_name=f"用户 {i+1}",
            role=random.choice([UserRole.USER, UserRole.MANAGER, UserRole.VIEWER]),
            status=UserStatus.ACTIVE,
            is_superuser=False,
        )
        db.add(user)
        users.append(user)
    
    await db.commit()
    print(f"  👥 创建 {len(users)} 个普通用户")
    return users


async def seed_demo_data():
    """主种子函数"""
    print("\n🌱 开始创建演示数据...\n")
    
    async with AsyncSessionLocal() as db:
        # 1. 创建排放因子库
        print("📊 创建排放因子库...")
        await create_emission_factors(db)
        
        # 2. 创建每个演示租户
        for tenant_config in DEMO_TENANTS:
            print(f"\n🏢 创建租户: {tenant_config['name']} ({tenant_config['plan'].value})")
            
            result = await create_demo_tenant(db, tenant_config)
            if result is None:
                continue  # 租户已存在，跳过
                
            tenant, admin = result
            print(f"  ✅ 租户管理员: {admin.email}")
            
            orgs = await create_organizations(db, tenant)
            await create_energy_data(db, orgs, days=30)
            
            user_count = random.randint(3, 10)
            await create_demo_users(db, tenant, count=user_count)
    
    print("\n✅ 演示数据创建完成!\n")


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
