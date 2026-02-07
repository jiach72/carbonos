"""
应用配置
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用
    app_name: str = "CarbonOS™ API"
    debug: bool = False
    api_v1_str: str = "/api/v1"
    
    # 数据库
    database_url: str = "postgresql+asyncpg://carbonos:carbonos@localhost:5432/carbonos"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # JWT（安全强化：移除不安全默认值）
    secret_key: str  # 必须从 .env 配置，无默认值
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    jwt_issuer: str = "carbonos"
    jwt_audience: str = "carbonos-api"
    
    # AI 配置
    ai_provider: str = "qwen"
    ai_api_key: str = ""

    # 文件存储
    upload_dir: str = "/app/uploads"
    
    # 前端 URL
    frontend_url: str = "https://scdc.cloud"
    
    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()
