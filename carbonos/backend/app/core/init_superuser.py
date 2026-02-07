"""
超级管理员初始化模块
系统启动时自动创建/验证超级管理员账户

超级管理员是系统自带的固定账户：
- 邮箱: admin@scdc.cloud
- 默认密码: 123456 (首次创建)
- 不属于任何租户
- is_superuser = True
"""

import uuid
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.tenant import Tenant  # 确保 User/Tenant 关系配置完整
from app.models.user import User, UserRole, UserStatus

# 密码哈希（使用原生 bcrypt，避免 passlib 与 Python 3.14 兼容问题）
import bcrypt

def hash_password(password: str) -> str:
    """哈希密码"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# 日志
logger = logging.getLogger(__name__)

# ============ 超级管理员固定配置 ============
SUPERUSER_EMAIL = "admin@scdc.cloud"
SUPERUSER_DEFAULT_PASSWORD = "123456"  # 首次创建时的默认密码
SUPERUSER_NAME = "System Administrator"


async def get_superuser(db: AsyncSession) -> User | None:
    """
    获取超级管理员账户

    Returns:
        超级管理员用户对象，如不存在则返回 None
    """
    result = await db.execute(
        select(User).where(User.is_superuser == True)
    )
    return result.scalar_one_or_none()


async def create_superuser(db: AsyncSession) -> User:
    """
    创建超级管理员账户
    
    Returns:
        新创建的超级管理员用户对象
    """
    superuser = User(
        id=uuid.uuid4(),
        email=SUPERUSER_EMAIL,
        password_hash=hash_password(SUPERUSER_DEFAULT_PASSWORD),
        full_name=SUPERUSER_NAME,
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_superuser=True,
        tenant_id=None,  # 超级管理员不属于任何租户
    )
    db.add(superuser)
    await db.commit()
    await db.refresh(superuser)
    
    logger.info(f"超级管理员已创建: {SUPERUSER_EMAIL}")
    return superuser


async def init_superuser(db: AsyncSession) -> User:
    """
    初始化超级管理员
    
    如果超级管理员不存在，则创建；如果存在，则返回现有账户。
    此函数应在应用启动时调用。
    
    Returns:
        超级管理员用户对象
    """
    superuser = await get_superuser(db)
    
    if superuser:
        logger.debug(f"超级管理员已存在: {superuser.email}")
        return superuser
    
    return await create_superuser(db)


async def reset_superuser_password(db: AsyncSession, new_password: str | None = None) -> bool:
    """
    重置超级管理员密码
    
    Args:
        db: 数据库会话
        new_password: 新密码，如果为 None 则重置为默认密码
        
    Returns:
        是否重置成功
    """
    superuser = await get_superuser(db)
    
    if not superuser:
        logger.warning("超级管理员不存在，无法重置密码")
        return False
    
    password = new_password or SUPERUSER_DEFAULT_PASSWORD
    superuser.password_hash = hash_password(password)
    await db.commit()
    
    logger.info("超级管理员密码已重置")
    return True
