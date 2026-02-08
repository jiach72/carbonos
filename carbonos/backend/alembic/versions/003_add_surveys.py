"""Add surveys table for online diagnosis

Revision ID: 003_add_surveys
Revises: 002_add_user_lockout
Create Date: 2026-02-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '003_add_surveys'
down_revision: Union[str, None] = '002_add_user_lockout'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add surveys table for online diagnosis questionnaire"""
    op.create_table(
        'surveys',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('tenants.id'), nullable=True),
        sa.Column('scenario', sa.String(50), nullable=False),
        sa.Column('industry', sa.String(50), nullable=False),
        sa.Column('electricity_range', sa.String(50), nullable=False),
        sa.Column('exports_to_eu', sa.Boolean(), default=False, nullable=False),
        sa.Column('has_carbon_audit', sa.Boolean(), nullable=True),
        sa.Column('contact_info', postgresql.JSONB(), nullable=True),
        sa.Column('diagnosis_score', sa.Integer(), nullable=True),
        sa.Column('diagnosis_summary', sa.Text(), nullable=True),
        sa.Column('recommended_plan', sa.String(50), nullable=True),
        sa.Column('report_url', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
    )
    
    # 创建索引
    op.create_index('ix_surveys_tenant_id', 'surveys', ['tenant_id'])
    op.create_index('ix_surveys_created_at', 'surveys', ['created_at'])
    op.create_index('ix_surveys_scenario', 'surveys', ['scenario'])


def downgrade() -> None:
    """Remove surveys table"""
    op.drop_index('ix_surveys_scenario', table_name='surveys')
    op.drop_index('ix_surveys_created_at', table_name='surveys')
    op.drop_index('ix_surveys_tenant_id', table_name='surveys')
    op.drop_table('surveys')
