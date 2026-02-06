"""
超级管理员 API
P0-003: 使用 get_superuser 依赖替代手动检查
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.permissions import get_superuser  # P0-003: 统一权限依赖
from app.models.user import User
from app.models.tenant import Tenant, TenantStatus, TenantPlan
from app.models.carbon import CarbonEmission
from app.models.user import UserRole


router = APIRouter(prefix="/admin", tags=["超级管理员"])

import uuid
from datetime import datetime

class TenantStats(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    user_count: int
    created_at: datetime
    status: str
    plan: str = "free"

class TenantStatusUpdate(BaseModel):
    status: str

class GlobalStats(BaseModel):
    total_tenants: int
    active_tenants: int
    total_users: int
    total_emissions: float

class TenantPlanUpdate(BaseModel):
    plan: str

class TenantPasswordReset(BaseModel):
    password: str

@router.patch("/tenants/{tenant_id}/status", response_model=TenantStats)
async def update_tenant_status(
    tenant_id: uuid.UUID,
    status_update: TenantStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 使用统一权限依赖
):
    """更新租户状态 (停用/启用)"""
        
    result = await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    tenant = result.scalar_one_or_none()
    
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
        
    try:
        tenant.status = TenantStatus(status_update.status)
        await db.commit()
    except ValueError:
        raise HTTPException(status_code=400, detail="无效的状态值")
        
    # Return updated stats logic (simplified reuse)
    # 实际项目中可能只需返回 tenant 对象即可，这里为了兼容 stats 格式
    return TenantStats(
        id=tenant.id,
        name=tenant.name,
        code=tenant.code,
        user_count=0, # 简化处理，不重新查询 count
        created_at=tenant.created_at,
        status=tenant.status.value,
        plan=tenant.plan.value
    )

@router.patch("/tenants/{tenant_id}/plan", response_model=TenantStats)
async def update_tenant_plan(
    tenant_id: uuid.UUID,
    plan_update: TenantPlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """更新租户订阅套餐"""
        
    tenant = await db.get(Tenant, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
        
    try:
        tenant.plan = TenantPlan(plan_update.plan)
        await db.commit()
    except ValueError:
        raise HTTPException(status_code=400, detail="无效的套餐类型")
        
    return TenantStats(
        id=tenant.id,
        name=tenant.name,
        code=tenant.code,
        user_count=0, 
        created_at=tenant.created_at,
        status=tenant.status.value,
        plan=tenant.plan.value
    )

@router.post("/tenants/{tenant_id}/reset-password")
async def reset_tenant_password(
    tenant_id: uuid.UUID,
    reset_data: TenantPasswordReset,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """重置租户管理员密码 (根据 Tenant.contact_email 查找用户)"""
    from app.core.security import get_password_hash
        
    tenant = await db.get(Tenant, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
        
    if not tenant.contact_email:
        raise HTTPException(status_code=400, detail="租户未设置联系邮箱，无法定位管理员")
        
    # 查找匹配 contact_email 的用户
    stmt = select(User).where(User.email == tenant.contact_email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        # Fallback: find any admin in this tenant
        stmt = select(User).where(
            User.tenant_id == tenant.id, 
            User.role == UserRole.ADMIN
        ).limit(1)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
    if not user:
         raise HTTPException(status_code=404, detail="无法找到该租户的管理员账户")
         
    user.password_hash = get_password_hash(reset_data.password)
    await db.commit()
    
    return {"message": f"管理员 {user.email} 密码已重置"}

@router.get("/stats", response_model=GlobalStats)
async def get_global_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """获取全平台运营数据"""
        
    # 1. Total Tenants
    tenant_count = await db.scalar(select(func.count(Tenant.id)))
    
    # 2. Active Tenants
    active_count = await db.scalar(select(func.count(Tenant.id)).where(Tenant.status == TenantStatus.ACTIVE))
    
    # 3. Total Users
    user_count = await db.scalar(select(func.count(User.id)))
    
    # 4. Total Emissions (跨租户聚合)
    emission_total = await db.scalar(select(func.sum(CarbonEmission.emission_amount))) or 0.0
    
    return GlobalStats(
        total_tenants=tenant_count or 0,
        active_tenants=active_count or 0,
        total_users=user_count or 0,
        total_emissions=emission_total
    )

@router.get("/tenants/{tenant_id}", response_model=TenantStats)
async def get_tenant_detail(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """获取租户详情"""
        
    # 查询租户信息及管理员邮箱
    # 这里简化处理，TenantStats 已经包含了主要信息
    # 如果需要更多信息（如 Admin Email），需要在模型/Schema中扩展
    # 为了演示，我们复用 TenantStats 并重新查询 user_count
    
    stmt = (
        select(Tenant, func.count(User.id).label("user_count"))
        .outerjoin(User, User.tenant_id == Tenant.id)
        .where(Tenant.id == tenant_id)
        .group_by(Tenant.id)
    )
    
    result = await db.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="租户不存在")
        
    tenant = row[0]
    count = row[1]
    
    return TenantStats(
        id=tenant.id,
        name=tenant.name,
        code=tenant.code,
        user_count=count,
        created_at=tenant.created_at,
        status=tenant.status.value
    )

@router.get("/tenants", response_model=list[TenantStats])
async def list_all_tenants(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """获取所有租户列表 (仅限超级管理员)"""
        
    # 查询租户及用户数量
    # select t.*, count(u.id) from tenants t left join users u on u.tenant_id = t.id group by t.id
    stmt = (
        select(Tenant, func.count(User.id).label("user_count"))
        .outerjoin(User, User.tenant_id == Tenant.id)
        .group_by(Tenant.id)
    )
    
    result = await db.execute(stmt)
    
    tenants = []
    for row in result.all():
        tenant = row[0]
        count = row[1]
        tenants.append(TenantStats(
            id=tenant.id,
            name=tenant.name,
            code=tenant.code,
            user_count=count,
            created_at=tenant.created_at,
            status=tenant.status.value,
            plan=tenant.plan.value
        ))
        
    return tenants

class TrendData(BaseModel):
    date: str
    count: int

class PlanDistribution(BaseModel):
    name: str
    value: int

class DashboardCharts(BaseModel):
    trends: list[TrendData]
    distribution: list[PlanDistribution]

@router.get("/stats/trend", response_model=DashboardCharts)
async def get_dashboard_charts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """获取仪表盘图表数据 (趋势与分布)"""
        
    # 1. 租户增长趋势 (最近6个月)
    # PostgreSQL date_trunc
    today = datetime.now()
    # 简单实现：获取所有数据后在内存处理 (数据量小时可行，且兼容性好)
    stmt = select(Tenant.created_at)
    result = await db.execute(stmt)
    dates = result.scalars().all()
    
    from collections import defaultdict
    trend_map = defaultdict(int)
    
    # 格式化为 YYYY-MM
    for dt in dates:
        month_str = dt.strftime("%Y-%m")
        trend_map[month_str] += 1
        
    # 补全最近6个月的 key
    trends = []
    for i in range(5, -1, -1):
        # 计算月份 (Simple logic without dateutil)
        # target_date = today - i months
        year = today.year
        month = today.month - i
        while month <= 0:
            month += 12
            year -= 1
            
        month_key = f"{year}-{month:02d}"
        
        trends.append(TrendData(
            date=month_key,
            count=trend_map.get(month_key, 0)
        ))
        
    # 2. 套餐分布
    # select plan, count(*) from tenants group by plan
    stmt = select(Tenant.plan, func.count(Tenant.id)).group_by(Tenant.plan)
    result = await db.execute(stmt)
    
    distribution = []
    for plan, count in result.all():
        distribution.append(PlanDistribution(
            name=plan.value.capitalize(), # e.g. "Free", "Pro"
            value=count
        ))
        
    return DashboardCharts(
        trends=trends,
        distribution=distribution
    )


# ==================== 平台设置 API ====================

from app.models.settings import PlatformSettings

class PlatformSettingsResponse(BaseModel):
    allow_self_registration: bool
    require_approval: bool
    ai_api_key: str | None = None
    ai_api_base: str | None = None
    ai_model: str | None = None

class PlatformSettingsUpdate(BaseModel):
    allow_self_registration: bool | None = None
    require_approval: bool | None = None
    ai_api_key: str | None = None
    ai_api_base: str | None = None
    ai_model: str | None = None


@router.get("/settings", response_model=PlatformSettingsResponse)
async def get_platform_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """获取平台全局设置"""
    
    result = await db.execute(select(PlatformSettings).where(PlatformSettings.id == 1))
    settings = result.scalar_one_or_none()
    
    if not settings:
        # 首次访问，创建默认设置
        settings = PlatformSettings(id=1, allow_self_registration=True, require_approval=False)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    
    return PlatformSettingsResponse(
        allow_self_registration=settings.allow_self_registration,
        require_approval=settings.require_approval
    )


@router.patch("/settings", response_model=PlatformSettingsResponse)
async def update_platform_settings(
    data: PlatformSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)  # P0-003: 统一权限
):
    """更新平台全局设置"""
    
    result = await db.execute(select(PlatformSettings).where(PlatformSettings.id == 1))
    settings = result.scalar_one_or_none()
    
    if not settings:
        settings = PlatformSettings(id=1)
        db.add(settings)
        await db.flush()
    
    if data.allow_self_registration is not None:
        settings.allow_self_registration = data.allow_self_registration
    if data.require_approval is not None:
        settings.require_approval = data.require_approval
    if data.ai_api_key is not None:
        settings.ai_api_key = data.ai_api_key
    if data.ai_api_base is not None:
        settings.ai_api_base = data.ai_api_base
    if data.ai_model is not None:
        settings.ai_model = data.ai_model
        
    await db.commit()
    await db.refresh(settings)
    
    return PlatformSettingsResponse(
        allow_self_registration=settings.allow_self_registration,
        require_approval=settings.require_approval,
        ai_api_key=settings.ai_api_key,
        ai_api_base=settings.ai_api_base,
        ai_model=settings.ai_model
    )


# ============ 平台员工管理 API ============

class StaffRole(str, enum.Enum):
    """平台员工角色"""
    OPERATOR = "operator"    # 运营：租户管理、数据查看
    SUPPORT = "support"      # 客服：租户只读、工单处理
    AUDITOR = "auditor"      # 审计：审计日志查看


class StaffCreate(BaseModel):
    """创建平台员工"""
    email: str
    password: str
    full_name: str
    role: StaffRole = StaffRole.OPERATOR


class StaffUpdate(BaseModel):
    """更新平台员工"""
    full_name: Optional[str] = None
    role: Optional[StaffRole] = None
    is_active: Optional[bool] = None


class StaffResponse(BaseModel):
    """平台员工响应"""
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    role: str
    status: str
    created_at: datetime
    last_login_at: Optional[datetime]


import enum
from typing import Optional
from app.core.security import get_password_hash


@router.get("/staff", response_model=list[StaffResponse])
async def list_staff(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)
):
    """获取平台员工列表（仅超管可访问）"""
    # 平台员工 = 非租户用户且非超管
    result = await db.execute(
        select(User)
        .where(User.tenant_id.is_(None))
        .where(User.is_superuser == False)
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    
    return [
        StaffResponse(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            role=u.role.value if hasattr(u.role, 'value') else str(u.role),
            status=u.status.value if hasattr(u.status, 'value') else str(u.status),
            created_at=u.created_at,
            last_login_at=u.last_login_at
        )
        for u in users
    ]


@router.post("/staff", response_model=StaffResponse, status_code=201)
async def create_staff(
    data: StaffCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)
):
    """创建平台员工（仅超管可操作）"""
    # 检查邮箱重复
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="该邮箱已被注册")
    
    # 映射员工角色到 UserRole
    role_map = {
        StaffRole.OPERATOR: UserRole.MANAGER,
        StaffRole.SUPPORT: UserRole.USER,
        StaffRole.AUDITOR: UserRole.VIEWER,
    }
    
    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        full_name=data.full_name,
        role=role_map.get(data.role, UserRole.USER),
        tenant_id=None,  # 平台员工无租户
        is_superuser=False  # 禁止创建超管
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return StaffResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=data.role.value,
        status=user.status.value if hasattr(user.status, 'value') else str(user.status),
        created_at=user.created_at,
        last_login_at=user.last_login_at
    )


@router.patch("/staff/{staff_id}", response_model=StaffResponse)
async def update_staff(
    staff_id: uuid.UUID,
    data: StaffUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)
):
    """更新平台员工（仅超管可操作）"""
    user = await db.get(User, staff_id)
    if not user or user.tenant_id is not None or user.is_superuser:
        raise HTTPException(status_code=404, detail="员工不存在")
    
    if data.full_name is not None:
        user.full_name = data.full_name
    if data.role is not None:
        role_map = {
            StaffRole.OPERATOR: UserRole.MANAGER,
            StaffRole.SUPPORT: UserRole.USER,
            StaffRole.AUDITOR: UserRole.VIEWER,
        }
        user.role = role_map.get(data.role, UserRole.USER)
    if data.is_active is not None:
        from app.models.user import UserStatus
        user.status = UserStatus.ACTIVE if data.is_active else UserStatus.INACTIVE
    
    await db.commit()
    await db.refresh(user)
    
    # 获取显示用的角色
    reverse_role_map = {
        UserRole.MANAGER: "operator",
        UserRole.USER: "support",
        UserRole.VIEWER: "auditor",
    }
    
    return StaffResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=reverse_role_map.get(user.role, "operator"),
        status=user.status.value if hasattr(user.status, 'value') else str(user.status),
        created_at=user.created_at,
        last_login_at=user.last_login_at
    )


@router.delete("/staff/{staff_id}", status_code=204)
async def delete_staff(
    staff_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_superuser)
):
    """删除平台员工（仅超管可操作）"""
    user = await db.get(User, staff_id)
    if not user or user.tenant_id is not None or user.is_superuser:
        raise HTTPException(status_code=404, detail="员工不存在")
    
    await db.delete(user)
    await db.commit()
    return None

