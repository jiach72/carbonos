"""
Alembic 迁移环境配置
支持 PostgreSQL (使用同步驱动 psycopg2 进行迁移)
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# 导入应用配置和模型
from app.core.config import get_settings
from app.core.database import Base

# 导入所有模型以确保 Alembic 能检测到
from app.models.tenant import Tenant
from app.models.user import User
from app.models.organization import Organization
from app.models.carbon import CarbonEmission, CarbonInventory, EmissionFactor
from app.models.energy import EnergyData
from app.models.audit import AuditLog  # P2: 审计日志
from app.models.tenant_config import TenantConfig  # P2: 租户配置
from app.models.settings import PlatformSettings  # P0: 全局设置

# Alembic 配置对象
config = context.config

# 设置日志
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 从应用配置获取数据库 URL 并转换为同步驱动
settings = get_settings()
# asyncpg -> psycopg2
sync_db_url = settings.database_url.replace("postgresql+asyncpg", "postgresql+psycopg2")
config.set_main_option("sqlalchemy.url", sync_db_url)

# 目标元数据（用于 autogenerate）
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    离线模式迁移
    仅生成 SQL 脚本，不连接数据库
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # 检测字段类型变化
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    在线模式迁移
    使用同步连接执行迁移
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # 检测字段类型变化
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
