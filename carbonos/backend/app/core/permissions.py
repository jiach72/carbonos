"""
权限控制工具
P1-001: 统一权限装饰器和依赖项
"""

from functools import wraps
from typing import Callable, List
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.models.user import User, UserRole
from app.core.database import get_db


# ============ 权限检查依赖项 ============

async def get_superuser(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    要求当前用户必须是超级管理员
    P0-003: 使用 is_superuser 字段而非 tenant_id==null 判断
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要超级管理员权限"
        )
    return current_user


async def get_tenant_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    要求当前用户必须属于某个租户（非超级管理员）
    用于租户业务 API
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="超级管理员请使用管理后台"
        )
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户未关联租户"
        )
    return current_user


async def get_admin_or_manager(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    要求当前用户是管理员或经理角色
    用于需要管理权限的租户 API
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员或经理权限"
        )
    return current_user


# ============ 角色检查函数 ============

def require_roles(allowed_roles: List[UserRole]):
    """
    角色检查依赖项工厂
    使用示例: Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
    """
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"需要以下角色之一: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker


# ============ 租户数据访问控制 ============

def tenant_filter(query, model, current_user: User):
    """
    为查询添加租户过滤条件
    P0-002: 防止跨租户数据泄露
    
    Args:
        query: SQLAlchemy 查询对象
        model: 包含 tenant_id 字段的模型类
        current_user: 当前用户
    
    Returns:
        添加了租户过滤的查询对象
    """
    if current_user.is_superuser:
        # 超级管理员可以访问所有数据
        return query
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户未关联租户，无法访问数据"
        )
    return query.where(model.tenant_id == current_user.tenant_id)


def get_tenant_id(current_user: User) -> str:
    """
    获取当前用户的租户 ID
    P0-002: 用于数据创建时自动填充 tenant_id
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="超级管理员无法执行租户级操作"
        )
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户未关联租户"
        )
    return current_user.tenant_id
