"""初始数据库架构

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-02-06

CarbonOS v2.0 完整数据库架构
包含所有12张核心表
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """创建完整数据库架构"""
    
    # ================== 创建 ENUM 类型 ==================
    # 使用 op.execute 显式创建，避免 SQLAlchemy 缓存问题
    
    op.execute("CREATE TYPE IF NOT EXISTS tenantstatus AS ENUM ('active', 'suspended', 'pending')")
    op.execute("CREATE TYPE IF NOT EXISTS tenantplan AS ENUM ('free', 'pro', 'enterprise')")
    op.execute("CREATE TYPE IF NOT EXISTS userrole AS ENUM ('ADMIN', 'MANAGER', 'USER', 'VIEWER')")
    op.execute("CREATE TYPE IF NOT EXISTS userstatus AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED')")
    op.execute("CREATE TYPE IF NOT EXISTS organizationtype AS ENUM ('park', 'enterprise', 'workshop')")
    op.execute("CREATE TYPE IF NOT EXISTS energytype AS ENUM ('electricity', 'natural_gas', 'coal', 'diesel', 'gasoline', 'steam', 'heat', 'water')")
    op.execute("CREATE TYPE IF NOT EXISTS datasource AS ENUM ('manual', 'excel', 'api', 'iot')")
    op.execute("CREATE TYPE IF NOT EXISTS emissionscope AS ENUM ('scope_1', 'scope_2', 'scope_3')")
    op.execute("CREATE TYPE IF NOT EXISTS auditaction AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'admin_action')")
    
    # 定义 ENUM 类型引用（用于表创建，不再创建类型）
    tenant_status_enum = postgresql.ENUM('active', 'suspended', 'pending', name='tenantstatus', create_type=False)
    tenant_plan_enum = postgresql.ENUM('free', 'pro', 'enterprise', name='tenantplan', create_type=False)
    user_role_enum = postgresql.ENUM('ADMIN', 'MANAGER', 'USER', 'VIEWER', name='userrole', create_type=False)
    user_status_enum = postgresql.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', name='userstatus', create_type=False)
    org_type_enum = postgresql.ENUM('park', 'enterprise', 'workshop', name='organizationtype', create_type=False)
    energy_type_enum = postgresql.ENUM('electricity', 'natural_gas', 'coal', 'diesel', 'gasoline', 'steam', 'heat', 'water', name='energytype', create_type=False)
    data_source_enum = postgresql.ENUM('manual', 'excel', 'api', 'iot', name='datasource', create_type=False)
    emission_scope_enum = postgresql.ENUM('scope_1', 'scope_2', 'scope_3', name='emissionscope', create_type=False)
    audit_action_enum = postgresql.ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'admin_action', name='auditaction', create_type=False)
    
    # ================== 创建表 ==================
    
    # 1. 租户表 (tenants)
    op.create_table('tenants',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('domain', sa.String(length=255), nullable=True),
        sa.Column('plan', tenant_plan_enum, nullable=False, server_default='free'),
        sa.Column('status', tenant_status_enum, nullable=False, server_default='active'),
        sa.Column('contact_email', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tenants_code'), 'tenants', ['code'], unique=True)
    
    # 2. 用户表 (users)
    op.create_table('users',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('tenant_id', sa.UUID(), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('role', user_role_enum, nullable=False, server_default='USER'),
        sa.Column('status', user_status_enum, nullable=False, server_default='ACTIVE'),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_tenant_id'), 'users', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_users_status'), 'users', ['status'], unique=False)
    op.create_index(op.f('ix_users_is_superuser'), 'users', ['is_superuser'], unique=False)
    
    # 3. 组织表 (organizations)
    op.create_table('organizations',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('type', org_type_enum, nullable=False),
        sa.Column('parent_id', sa.UUID(), nullable=True),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('address', sa.String(length=500), nullable=True),
        sa.Column('contact_name', sa.String(length=100), nullable=True),
        sa.Column('contact_phone', sa.String(length=20), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('industry_code', sa.String(length=20), nullable=True),
        sa.Column('area_sqm', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['parent_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_organizations_name'), 'organizations', ['name'], unique=False)
    op.create_index(op.f('ix_organizations_code'), 'organizations', ['code'], unique=True)
    op.create_index(op.f('ix_organizations_type'), 'organizations', ['type'], unique=False)
    op.create_index(op.f('ix_organizations_parent_id'), 'organizations', ['parent_id'], unique=False)
    op.create_index(op.f('ix_organizations_tenant_id'), 'organizations', ['tenant_id'], unique=False)
    
    # 4. 用户-组织关联表 (user_organizations)
    op.create_table('user_organizations',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='member'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_organizations_user_id'), 'user_organizations', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_organizations_organization_id'), 'user_organizations', ['organization_id'], unique=False)
    
    # 5. 能源数据表 (energy_data)
    op.create_table('energy_data',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('energy_type', energy_type_enum, nullable=False),
        sa.Column('data_date', sa.Date(), nullable=False),
        sa.Column('consumption', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=20), nullable=False),
        sa.Column('cost', sa.Float(), nullable=True),
        sa.Column('source', data_source_enum, nullable=False, server_default='manual'),
        sa.Column('remarks', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('created_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_energy_data_organization_id'), 'energy_data', ['organization_id'], unique=False)
    op.create_index(op.f('ix_energy_data_energy_type'), 'energy_data', ['energy_type'], unique=False)
    op.create_index(op.f('ix_energy_data_data_date'), 'energy_data', ['data_date'], unique=False)
    
    # 6. 导入记录表 (import_records)
    op.create_table('import_records',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('total_rows', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('success_rows', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('failed_rows', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('created_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # 7. 排放因子库 (emission_factors)
    op.create_table('emission_factors',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('energy_type', sa.String(length=50), nullable=False),
        sa.Column('scope', emission_scope_enum, nullable=False),
        sa.Column('factor_value', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=50), nullable=False),
        sa.Column('source', sa.String(length=500), nullable=True),
        sa.Column('region', sa.String(length=100), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_emission_factors_category'), 'emission_factors', ['category'], unique=False)
    op.create_index(op.f('ix_emission_factors_energy_type'), 'emission_factors', ['energy_type'], unique=False)
    
    # 8. 碳排放记录表 (carbon_emissions)
    op.create_table('carbon_emissions',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('energy_data_id', sa.UUID(), nullable=True),
        sa.Column('emission_factor_id', sa.UUID(), nullable=False),
        sa.Column('scope', emission_scope_enum, nullable=False),
        sa.Column('activity_data', sa.Float(), nullable=False),
        sa.Column('activity_unit', sa.String(length=50), nullable=False),
        sa.Column('emission_amount', sa.Float(), nullable=False),
        sa.Column('calculation_date', sa.DateTime(), nullable=False),
        sa.Column('period_start', sa.DateTime(), nullable=True),
        sa.Column('period_end', sa.DateTime(), nullable=True),
        sa.Column('remarks', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['emission_factor_id'], ['emission_factors.id'], ),
        sa.ForeignKeyConstraint(['energy_data_id'], ['energy_data.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_carbon_emissions_organization_id'), 'carbon_emissions', ['organization_id'], unique=False)
    op.create_index(op.f('ix_carbon_emissions_tenant_id'), 'carbon_emissions', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_carbon_emissions_scope'), 'carbon_emissions', ['scope'], unique=False)
    # 复合索引优化多租户查询
    op.create_index('ix_carbon_emissions_tenant_org', 'carbon_emissions', ['tenant_id', 'organization_id'], unique=False)
    op.create_index('ix_carbon_emissions_tenant_date', 'carbon_emissions', ['tenant_id', 'calculation_date'], unique=False)
    op.create_index('ix_carbon_emissions_tenant_scope', 'carbon_emissions', ['tenant_id', 'scope'], unique=False)
    
    # 9. 碳盘查汇总表 (carbon_inventories)
    op.create_table('carbon_inventories',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('month', sa.Integer(), nullable=True),
        sa.Column('scope_1_total', sa.Float(), nullable=False, server_default='0'),
        sa.Column('scope_2_total', sa.Float(), nullable=False, server_default='0'),
        sa.Column('scope_3_total', sa.Float(), nullable=False, server_default='0'),
        sa.Column('total_emission', sa.Float(), nullable=False, server_default='0'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='draft'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_carbon_inventories_organization_id'), 'carbon_inventories', ['organization_id'], unique=False)
    op.create_index(op.f('ix_carbon_inventories_tenant_id'), 'carbon_inventories', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_carbon_inventories_year'), 'carbon_inventories', ['year'], unique=False)
    
    # 10. 审计日志表 (audit_logs)
    op.create_table('audit_logs',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('action', audit_action_enum, nullable=False),
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
    op.create_index(op.f('ix_audit_logs_timestamp'), 'audit_logs', ['timestamp'], unique=False)
    op.create_index(op.f('ix_audit_logs_action'), 'audit_logs', ['action'], unique=False)
    op.create_index(op.f('ix_audit_logs_resource_type'), 'audit_logs', ['resource_type'], unique=False)
    op.create_index(op.f('ix_audit_logs_user_id'), 'audit_logs', ['user_id'], unique=False)
    op.create_index(op.f('ix_audit_logs_tenant_id'), 'audit_logs', ['tenant_id'], unique=False)
    
    # 11. 租户配置表 (tenant_configs)
    op.create_table('tenant_configs',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('rate_limit_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('rate_limit_per_minute', sa.Integer(), nullable=False, server_default='1000'),
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
    
    # 12. 平台设置表 (platform_settings) - 单例模式
    op.create_table('platform_settings',
        sa.Column('id', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('allow_self_registration', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('require_approval', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('ai_api_key', sa.String(length=255), nullable=True),
        sa.Column('ai_api_base', sa.String(length=255), nullable=True, server_default="'https://api.openai.com/v1'"),
        sa.Column('ai_model', sa.String(length=100), nullable=True, server_default="'gpt-4'"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """删除所有表和类型"""
    # 按照外键依赖顺序删除
    op.drop_table('platform_settings')
    op.drop_index(op.f('ix_tenant_configs_tenant_id'), table_name='tenant_configs')
    op.drop_table('tenant_configs')
    op.drop_index(op.f('ix_audit_logs_tenant_id'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_user_id'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_resource_type'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_action'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_timestamp'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_carbon_inventories_year'), table_name='carbon_inventories')
    op.drop_index(op.f('ix_carbon_inventories_tenant_id'), table_name='carbon_inventories')
    op.drop_index(op.f('ix_carbon_inventories_organization_id'), table_name='carbon_inventories')
    op.drop_table('carbon_inventories')
    op.drop_index('ix_carbon_emissions_tenant_scope', table_name='carbon_emissions')
    op.drop_index('ix_carbon_emissions_tenant_date', table_name='carbon_emissions')
    op.drop_index('ix_carbon_emissions_tenant_org', table_name='carbon_emissions')
    op.drop_index(op.f('ix_carbon_emissions_scope'), table_name='carbon_emissions')
    op.drop_index(op.f('ix_carbon_emissions_tenant_id'), table_name='carbon_emissions')
    op.drop_index(op.f('ix_carbon_emissions_organization_id'), table_name='carbon_emissions')
    op.drop_table('carbon_emissions')
    op.drop_index(op.f('ix_emission_factors_energy_type'), table_name='emission_factors')
    op.drop_index(op.f('ix_emission_factors_category'), table_name='emission_factors')
    op.drop_table('emission_factors')
    op.drop_table('import_records')
    op.drop_index(op.f('ix_energy_data_data_date'), table_name='energy_data')
    op.drop_index(op.f('ix_energy_data_energy_type'), table_name='energy_data')
    op.drop_index(op.f('ix_energy_data_organization_id'), table_name='energy_data')
    op.drop_table('energy_data')
    op.drop_index(op.f('ix_user_organizations_organization_id'), table_name='user_organizations')
    op.drop_index(op.f('ix_user_organizations_user_id'), table_name='user_organizations')
    op.drop_table('user_organizations')
    op.drop_index(op.f('ix_organizations_tenant_id'), table_name='organizations')
    op.drop_index(op.f('ix_organizations_parent_id'), table_name='organizations')
    op.drop_index(op.f('ix_organizations_type'), table_name='organizations')
    op.drop_index(op.f('ix_organizations_code'), table_name='organizations')
    op.drop_index(op.f('ix_organizations_name'), table_name='organizations')
    op.drop_table('organizations')
    op.drop_index(op.f('ix_users_is_superuser'), table_name='users')
    op.drop_index(op.f('ix_users_status'), table_name='users')
    op.drop_index(op.f('ix_users_tenant_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_tenants_code'), table_name='tenants')
    op.drop_table('tenants')
    
    # 删除 ENUM 类型
    op.execute('DROP TYPE IF EXISTS auditaction')
    op.execute('DROP TYPE IF EXISTS emissionscope')
    op.execute('DROP TYPE IF EXISTS datasource')
    op.execute('DROP TYPE IF EXISTS energytype')
    op.execute('DROP TYPE IF EXISTS organizationtype')
    op.execute('DROP TYPE IF EXISTS userstatus')
    op.execute('DROP TYPE IF EXISTS userrole')
    op.execute('DROP TYPE IF EXISTS tenantplan')
    op.execute('DROP TYPE IF EXISTS tenantstatus')
