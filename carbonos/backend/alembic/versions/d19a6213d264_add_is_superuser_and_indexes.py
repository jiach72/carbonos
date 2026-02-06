"""Add is_superuser and indexes

Revision ID: d19a6213d264
Revises: 
Create Date: 2026-02-06 10:05:12.270294

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd19a6213d264'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. 添加复合索引到 carbon_emissions
    op.create_index('ix_carbon_emissions_tenant_date', 'carbon_emissions', ['tenant_id', 'calculation_date'], unique=False)
    op.create_index('ix_carbon_emissions_tenant_org', 'carbon_emissions', ['tenant_id', 'organization_id'], unique=False)
    op.create_index('ix_carbon_emissions_tenant_scope', 'carbon_emissions', ['tenant_id', 'scope'], unique=False)
    
    # 2. 添加 is_superuser 列（先设置为可空，带默认值）
    op.add_column('users', sa.Column('is_superuser', sa.Boolean(), nullable=True, server_default='false'))
    
    # 3. 更新现有记录：tenant_id 为空的用户设为超管
    op.execute("UPDATE users SET is_superuser = true WHERE tenant_id IS NULL")
    op.execute("UPDATE users SET is_superuser = false WHERE is_superuser IS NULL")
    
    # 4. 将列改为非空
    op.alter_column('users', 'is_superuser', nullable=False)
    
    # 5. 创建索引
    op.create_index(op.f('ix_users_is_superuser'), 'users', ['is_superuser'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_is_superuser'), table_name='users')
    op.drop_column('users', 'is_superuser')
    op.drop_index('ix_carbon_emissions_tenant_scope', table_name='carbon_emissions')
    op.drop_index('ix_carbon_emissions_tenant_org', table_name='carbon_emissions')
    op.drop_index('ix_carbon_emissions_tenant_date', table_name='carbon_emissions')
