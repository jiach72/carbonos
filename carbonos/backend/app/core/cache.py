"""
Redis 缓存模块
P1-002: 启用 Redis 缓存提升高频查询性能
"""

import json
import hashlib
from typing import Any, Optional, Callable
from functools import wraps
from datetime import timedelta

import redis.asyncio as redis
from redis.asyncio import Redis

from app.core.config import get_settings


# 全局 Redis 客户端
_redis_client: Optional[Redis] = None


async def get_redis() -> Redis:
    """获取 Redis 连接"""
    global _redis_client
    if _redis_client is None:
        settings = get_settings()
        _redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis_client


async def close_redis():
    """关闭 Redis 连接"""
    global _redis_client
    if _redis_client:
        await _redis_client.close()
        _redis_client = None


class CacheManager:
    """
    缓存管理器
    支持多种缓存策略和自动过期
    """
    
    # 缓存键前缀
    PREFIX = "carbonos:"
    
    # 默认过期时间（秒）
    DEFAULT_TTL = 300  # 5 分钟
    
    # 缓存键模板
    KEYS = {
        "dashboard_summary": "dashboard:{tenant_id}:{org_id}:summary",
        "dashboard_trends": "dashboard:{tenant_id}:{org_id}:trends:{period}",
        "emission_factors": "factors:all",
        "tenant_stats": "admin:tenant_stats",
        "global_stats": "admin:global_stats",
    }
    
    def __init__(self, redis: Redis):
        self.redis = redis
    
    def _make_key(self, template: str, **kwargs) -> str:
        """生成缓存键"""
        key = template.format(**kwargs)
        return f"{self.PREFIX}{key}"
    
    async def get(self, key: str) -> Optional[Any]:
        """获取缓存"""
        data = await self.redis.get(key)
        if data:
            return json.loads(data)
        return None
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: int = DEFAULT_TTL
    ) -> None:
        """设置缓存"""
        await self.redis.setex(key, ttl, json.dumps(value, default=str))
    
    async def delete(self, key: str) -> None:
        """删除缓存"""
        await self.redis.delete(key)
    
    async def delete_pattern(self, pattern: str) -> int:
        """批量删除匹配的键"""
        full_pattern = f"{self.PREFIX}{pattern}"
        keys = []
        async for key in self.redis.scan_iter(full_pattern):
            keys.append(key)
        if keys:
            return await self.redis.delete(*keys)
        return 0
    
    # ============ 业务缓存方法 ============
    
    async def get_dashboard_summary(
        self, 
        tenant_id: str, 
        org_id: str
    ) -> Optional[dict]:
        """获取仪表盘摘要缓存"""
        key = self._make_key(
            self.KEYS["dashboard_summary"],
            tenant_id=tenant_id,
            org_id=org_id
        )
        return await self.get(key)
    
    async def set_dashboard_summary(
        self, 
        tenant_id: str, 
        org_id: str, 
        data: dict,
        ttl: int = 60  # 仪表盘缓存 1 分钟
    ) -> None:
        """设置仪表盘摘要缓存"""
        key = self._make_key(
            self.KEYS["dashboard_summary"],
            tenant_id=tenant_id,
            org_id=org_id
        )
        await self.set(key, data, ttl)
    
    async def invalidate_tenant_cache(self, tenant_id: str) -> int:
        """清除租户相关所有缓存"""
        return await self.delete_pattern(f"*:{tenant_id}:*")
    
    async def get_emission_factors(self) -> Optional[list]:
        """获取排放因子缓存"""
        key = self._make_key(self.KEYS["emission_factors"])
        return await self.get(key)
    
    async def set_emission_factors(
        self, 
        factors: list,
        ttl: int = 3600  # 因子缓存 1 小时
    ) -> None:
        """设置排放因子缓存"""
        key = self._make_key(self.KEYS["emission_factors"])
        await self.set(key, factors, ttl)


def cached(
    key_template: str,
    ttl: int = 300,
    key_builder: Optional[Callable] = None
):
    """
    缓存装饰器
    
    使用示例:
    @cached("user:{user_id}", ttl=60)
    async def get_user(user_id: str):
        ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                redis = await get_redis()
                cache = CacheManager(redis)
                
                # 构建缓存键
                if key_builder:
                    cache_key = key_builder(*args, **kwargs)
                else:
                    cache_key = key_template.format(**kwargs)
                
                full_key = f"{CacheManager.PREFIX}{cache_key}"
                
                # 尝试从缓存获取
                cached_data = await cache.get(full_key)
                if cached_data is not None:
                    return cached_data
                
                # 执行原函数
                result = await func(*args, **kwargs)
                
                # 存入缓存
                await cache.set(full_key, result, ttl)
                
                return result
            except Exception:
                # 缓存失败时直接执行原函数
                return await func(*args, **kwargs)
        
        return wrapper
    return decorator
