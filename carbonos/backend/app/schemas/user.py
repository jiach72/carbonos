"""
用户 Schema（Pydantic 模型）
"""

import uuid
from datetime import datetime
import re
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserBase(BaseModel):
    """用户基础信息"""
    email: EmailStr
    full_name: str | None = None
    phone: str | None = None


class UserCreate(UserBase):
    """创建用户请求（含密码强度验证）"""
    password: str = Field(..., min_length=8, max_length=128, description="密码需8-128字符")
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """密码强度验证：大小写+数字"""
        if not re.search(r'[A-Z]', v):
            raise ValueError('密码必须包含至少一个大写字母')
        if not re.search(r'[a-z]', v):
            raise ValueError('密码必须包含至少一个小写字母')
        if not re.search(r'[0-9]', v):
            raise ValueError('密码必须包含至少一个数字')
        return v


class UserLogin(BaseModel):
    """用户登录请求"""
    email: EmailStr
    password: str


class UserPasswordUpdate(BaseModel):
    """用户修改密码请求"""
    old_password: str
    new_password: str


class UserResponse(UserBase):
    """用户响应"""
    id: uuid.UUID
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token 响应"""
    access_token: str
    token_type: str = "bearer"
    role: str | None = None
    tenant_id: str | None = None


class TokenData(BaseModel):
    """Token 数据"""
    user_id: str | None = None
