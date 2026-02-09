"""添加用户安全相关列

Revision ID: 002_add_user_security_columns
Revises: 001_initial_schema
Create Date: 2026-02-09

添加账户锁定机制所需的列：
- failed_login_attempts: 登录失败次数
- locked_until: 账户锁定截止时间
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_add_user_security_columns'
down_revision: Union[str, Sequence[str], None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """添加用户安全列（如果不存在）"""
    # 使用 DO 块检查列是否已存在，避免重复添加
    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'failed_login_attempts'
            ) THEN
                ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0;
            END IF;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'locked_until'
            ) THEN
                ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
            END IF;
        END $$;
    """)


def downgrade() -> None:
    """删除用户安全列"""
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'failed_login_attempts'
            ) THEN
                ALTER TABLE users DROP COLUMN failed_login_attempts;
            END IF;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'locked_until'
            ) THEN
                ALTER TABLE users DROP COLUMN locked_until;
            END IF;
        END $$;
    """)
