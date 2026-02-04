"""
组织 Schema（Pydantic 模型）
"""

import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class OrganizationBase(BaseModel):
    """组织基础信息"""
    name: str
    code: str
    type: str  # park, enterprise, workshop
    parent_id: Optional[uuid.UUID] = None
    address: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    industry_code: Optional[str] = None
    area_sqm: Optional[float] = None


class OrganizationCreate(OrganizationBase):
    """创建组织请求"""
    pass


class OrganizationUpdate(BaseModel):
    """更新组织请求"""
    name: Optional[str] = None
    address: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    industry_code: Optional[str] = None
    area_sqm: Optional[float] = None


class OrganizationResponse(OrganizationBase):
    """组织响应"""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrganizationTree(OrganizationResponse):
    """组织树结构（包含子组织）"""
    children: list["OrganizationTree"] = []


class UserOrganizationCreate(BaseModel):
    """添加用户到组织"""
    user_id: uuid.UUID
    organization_id: uuid.UUID
    role: str = "member"


class UserOrganizationResponse(BaseModel):
    """用户-组织关联响应"""
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: uuid.UUID
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
