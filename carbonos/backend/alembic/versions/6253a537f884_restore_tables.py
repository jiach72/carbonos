"""Restore missing tables

Revision ID: 6253a537f884
Revises: c7ac7f8360a2
Create Date: 2026-02-06 13:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6253a537f884'
down_revision: Union[str, Sequence[str], None] = 'c7ac7f8360a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### Restore platform_settings ###
    op.create_table('platform_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('allow_self_registration', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('require_approval', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('ai_api_key', sa.String(length=255), nullable=True),
        sa.Column('ai_api_base', sa.String(length=255), nullable=True, server_default='https://api.openai.com/v1'),
        sa.Column('ai_model', sa.String(length=100), nullable=True, server_default='gpt-4'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    
    # ### Restore tenant_configs ###
    op.create_table('tenant_configs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('rate_limit_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('rate_limit_per_minute', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('feature_ai_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('feature_export_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('feature_report_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('data_retention_days', sa.Integer(), nullable=False, server_default='365'),
        sa.Column('notification_email', sa.String(length=255), nullable=True),
        sa.Column('notification_webhook', sa.String(length=500), nullable=True),
        sa.Column('custom_settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tenant_configs_tenant_id'), 'tenant_configs', ['tenant_id'], unique=True)
    
    # ### Restore audit_logs ###
    op.create_table('audit_logs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('action', sa.String(length=50), nullable=False), # Simplified ENUM to String for robustness or recreate ENUM
        sa.Column('resource_type', sa.String(length=100), nullable=False),
        sa.Column('resource_id', sa.String(length=100), nullable=True),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('user_email', sa.String(length=255), nullable=True),
        sa.Column('tenant_id', sa.UUID(), nullable=True),
        sa.Column('ip_address', sa.String(length=50), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('success', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_user_id'), 'audit_logs', ['user_id'], unique=False)
    op.create_index(op.f('ix_audit_logs_timestamp'), 'audit_logs', ['timestamp'], unique=False)
    op.create_index(op.f('ix_audit_logs_tenant_id'), 'audit_logs', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_audit_logs_resource_type'), 'audit_logs', ['resource_type'], unique=False)
    op.create_index(op.f('ix_audit_logs_action'), 'audit_logs', ['action'], unique=False)


def downgrade() -> None:
    # ### Drop tables again ###
    op.drop_index(op.f('ix_audit_logs_action'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_resource_type'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_tenant_id'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_timestamp'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_user_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_tenant_configs_tenant_id'), table_name='tenant_configs')
    op.drop_table('tenant_configs')
    op.drop_table('platform_settings')
