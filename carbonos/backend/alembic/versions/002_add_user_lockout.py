"""添加用户账户锁定字段

Revision ID: 002_add_user_lockout
Revises: 001_initial_schema
Create Date: 2026-02-07

安全增强：支持账户锁定机制
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002_add_user_lockout'
down_revision: Union[str, Sequence[str], None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """添加账户锁定相关字段"""
    # 登录失败计数
    op.add_column('users', 
        sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default='0')
    )
    # 锁定截止时间
    op.add_column('users',
        sa.Column('locked_until', sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    """移除账户锁定字段"""
    op.drop_column('users', 'locked_until')
    op.drop_column('users', 'failed_login_attempts')
