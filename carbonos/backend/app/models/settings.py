"""
平台全局设置模型
"""

from datetime import datetime
from sqlalchemy import Integer, Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class PlatformSettings(Base):
    """
    平台全局设置 (单例模式 - 只有一行 id=1)
    用于控制平台级别的注册与入驻策略
    """
    __tablename__ = "platform_settings"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    
    # 是否开放自助注册 (/register 页面)
    allow_self_registration: Mapped[bool] = mapped_column(Boolean, default=True)
    
    require_approval: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # AI 服务配置
    ai_api_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ai_api_base: Mapped[str | None] = mapped_column(String(255), nullable=True, default="https://api.openai.com/v1")
    ai_model: Mapped[str | None] = mapped_column(String(100), nullable=True, default="gpt-4")
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
