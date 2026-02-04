"""
用户 Schema（Pydantic 模型）
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """用户基础信息"""
    email: EmailStr
    full_name: str | None = None
    phone: str | None = None


class UserCreate(UserBase):
    """创建用户请求"""
    password: str


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
