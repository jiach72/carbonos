"""
租户配置模块
P2: 支持租户级别的个性化配置
"""

import uuid
from datetime import datetime
from typing import Optional, Any
from enum import Enum

from sqlalchemy import String, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, Field

from app.core.database import Base


class TenantConfig(Base):
    """租户配置表"""
    __tablename__ = "tenant_configs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    # 关联租户
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        unique=True,
        index=True
    )
    
    # API 限流配置
    rate_limit_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    rate_limit_per_minute: Mapped[int] = mapped_column(Integer, default=1000)
    
    # 功能开关
    feature_ai_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    feature_export_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    feature_report_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # 数据保留策略
    data_retention_days: Mapped[int] = mapped_column(Integer, default=365)
    
    # 通知配置
    notification_email: Mapped[str | None] = mapped_column(String(255))
    notification_webhook: Mapped[str | None] = mapped_column(String(500))
    
    # 自定义配置（JSON）
    custom_settings: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    
    # 时间戳
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


# ============ Pydantic Schemas ============

class TenantConfigCreate(BaseModel):
    """创建租户配置"""
    tenant_id: uuid.UUID
    rate_limit_per_minute: int = 1000
    feature_ai_enabled: bool = True
    feature_export_enabled: bool = True
    feature_report_enabled: bool = True
    data_retention_days: int = 365


class TenantConfigUpdate(BaseModel):
    """更新租户配置"""
    rate_limit_enabled: Optional[bool] = None
    rate_limit_per_minute: Optional[int] = None
    feature_ai_enabled: Optional[bool] = None
    feature_export_enabled: Optional[bool] = None
    feature_report_enabled: Optional[bool] = None
    data_retention_days: Optional[int] = None
    notification_email: Optional[str] = None
    notification_webhook: Optional[str] = None
    custom_settings: Optional[dict] = None


class TenantConfigResponse(BaseModel):
    """租户配置响应"""
    id: uuid.UUID
    tenant_id: uuid.UUID
    rate_limit_enabled: bool
    rate_limit_per_minute: int
    feature_ai_enabled: bool
    feature_export_enabled: bool
    feature_report_enabled: bool
    data_retention_days: int
    notification_email: Optional[str]
    notification_webhook: Optional[str]
    custom_settings: Optional[dict]
    
    class Config:
        from_attributes = True


# ============ 仓库 ============

class TenantConfigRepository:
    """租户配置仓库"""
    
    # 默认配置（缓存）
    _defaults = TenantConfigCreate(
        tenant_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
        rate_limit_per_minute=1000,
    )
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_tenant(self, tenant_id: uuid.UUID) -> Optional[TenantConfig]:
        """获取租户配置"""
        result = await self.db.execute(
            select(TenantConfig).where(TenantConfig.tenant_id == tenant_id)
        )
        return result.scalar_one_or_none()
    
    async def get_or_create(self, tenant_id: uuid.UUID) -> TenantConfig:
        """获取或创建租户配置"""
        config = await self.get_by_tenant(tenant_id)
        if config:
            return config
        
        # 创建默认配置
        config = TenantConfig(tenant_id=tenant_id)
        self.db.add(config)
        await self.db.commit()
        await self.db.refresh(config)
        return config
    
    async def update(
        self,
        tenant_id: uuid.UUID,
        data: TenantConfigUpdate
    ) -> Optional[TenantConfig]:
        """更新租户配置"""
        config = await self.get_or_create(tenant_id)
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(config, key, value)
        
        await self.db.commit()
        await self.db.refresh(config)
        return config
    
    async def is_feature_enabled(
        self,
        tenant_id: uuid.UUID,
        feature: str
    ) -> bool:
        """检查功能是否启用"""
        config = await self.get_by_tenant(tenant_id)
        if not config:
            return True  # 默认启用
        
        feature_map = {
            "ai": config.feature_ai_enabled,
            "export": config.feature_export_enabled,
            "report": config.feature_report_enabled,
        }
        return feature_map.get(feature, True)
    
    async def get_rate_limit(self, tenant_id: uuid.UUID) -> tuple[bool, int]:
        """获取租户限流配置"""
        config = await self.get_by_tenant(tenant_id)
        if not config:
            return True, 1000  # 默认值
        return config.rate_limit_enabled, config.rate_limit_per_minute


# ============ 依赖注入 ============

async def get_tenant_config(
    tenant_id: uuid.UUID,
    db: AsyncSession
) -> TenantConfig:
    """
    获取租户配置（带缓存）
    
    使用示例:
    @router.get("/feature")
    async def check_feature(
        config: TenantConfig = Depends(get_tenant_config)
    ):
        return {"ai_enabled": config.feature_ai_enabled}
    """
    repo = TenantConfigRepository(db)
    return await repo.get_or_create(tenant_id)
