"""
租户相关 Schema
"""

from pydantic import BaseModel, EmailStr

class TenantCreateRequest(BaseModel):
    """企业入驻请求"""
    company_name: str
    admin_email: EmailStr
    admin_password: str
    admin_name: str
    phone: str | None = None
