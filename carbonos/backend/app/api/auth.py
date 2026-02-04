"""
认证 API 路由
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserPasswordUpdate

def get_role_str(role_obj) -> str | None:
    if not role_obj:
        return None
    # Try getting .value (Enum)
    if hasattr(role_obj, "value"):
        s = str(role_obj.value)
    else:
        s = str(role_obj)
    
    # Clean up "UserRole.ADMIN" if it appears
    if "UserRole" in s:
        s = s.split(".")[-1]
    return s.lower()

router = APIRouter(prefix="/auth", tags=["认证"])


from app.models.tenant import Tenant, TenantPlan
from app.models.organization import Organization, OrganizationType
from app.schemas.tenant import TenantCreateRequest

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: TenantCreateRequest, db: AsyncSession = Depends(get_db)):
    """
    企业入驻流程 (Transaction):
    1. 创建 Tenant
    2. 创建 Root Organization (园区)
    3. 创建 Admin User
    """
    # 0. 检查平台是否开放注册
    from app.models.settings import PlatformSettings
    settings_result = await db.execute(select(PlatformSettings).where(PlatformSettings.id == 1))
    platform_settings = settings_result.scalar_one_or_none()
    
    if platform_settings and not platform_settings.allow_self_registration:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="平台暂未开放自助注册，请联系管理员"
        )
    
    # 1. 检查邮箱
    result = await db.execute(select(User).where(User.email == data.admin_email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="该邮箱已被注册")
        
    # 2. 生成租户代码 (简单的拼音或随机码，这里简化处理)
    import random
    import string
    tenant_code = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    
    try:
        # Start Transaction
        # A. Create Tenant
        tenant = Tenant(
            name=data.company_name,
            code=tenant_code,
            plan=TenantPlan.FREE
        )
        db.add(tenant)
        await db.flush() # 获取 tenant.id
        
        # B. Create Root Organization
        org = Organization(
            name=data.company_name + "园区",
            code=tenant_code + "_main",
            type=OrganizationType.PARK,
            tenant_id=tenant.id
        )
        db.add(org)
        await db.flush()
        
        # C. Create Admin User
        user = User(
            email=data.admin_email,
            password_hash=get_password_hash(data.admin_password),
            full_name=data.admin_name,
            phone=data.phone,
            tenant_id=tenant.id,
            role="admin" # 假设 UserRole 枚举兼容字符串，或者需要在 user.py 确认
        )
        db.add(user)
        
        await db.commit()
        await db.refresh(user)
        return user
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"注册失败: {str(e)}")


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """用户登录 (返回带 Tenant 信息的 Token)"""
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check User Status (Active?) - 略
    
    # 更新最后登录时间
    user.last_login_at = datetime.utcnow()
    await db.commit()
    
    # 生成 Token，Payload 包含 tenant_id
    access_token = create_access_token(data={
        "sub": str(user.id),
        "tenant_id": str(user.tenant_id) if user.tenant_id else None,
        "role": get_role_str(user.role),
        "email": user.email,
        "name": user.full_name
    })
    return Token(
        access_token=access_token,
        role=get_role_str(user.role),
        tenant_id=str(user.tenant_id) if user.tenant_id else None
    )


from app.api.deps import get_current_active_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserPasswordUpdate

# ... imports ...

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """获取当前用户信息"""
    return current_user


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    data: UserPasswordUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    用户修改密码
    需要验证旧密码
    """
    # 1. 验证旧密码
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="旧密码错误"
        )
        
    # 2. 更新新密码
    current_user.password_hash = get_password_hash(data.new_password)
    db.add(current_user)
    await db.commit()
    
    return {"message": "密码修改成功"}

