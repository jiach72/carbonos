"""
API 集成测试
"""

import pytest
from httpx import AsyncClient

# 1. 认证测试
@pytest.mark.asyncio
async def test_auth_flow(client: AsyncClient):
    # 注册
    resp = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    })
    assert resp.status_code == 201
    
    # 登录
    resp = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    return resp.json()["access_token"]


# 2. 组织管理测试
@pytest.mark.asyncio
async def test_organization_flow(client: AsyncClient):
    # 获取 Token
    token = await test_auth_flow(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # 创建园区
    resp = await client.post(
        "/api/v1/organizations/",
        headers=headers,
        json={
            "name": "Test Park",
            "code": "TP001",
            "type": "park"
        }
    )
    assert resp.status_code == 201
    park_id = resp.json()["id"]
    
    # 获取组织树
    resp = await client.get("/api/v1/organizations/tree", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) > 0
    
    return park_id, headers


# 3. 碳核算流程测试
@pytest.mark.asyncio
async def test_carbon_calculation_flow(client: AsyncClient):
    park_id, headers = await test_organization_flow(client)
    
    # 录入能源数据
    resp = await client.post(
        "/api/v1/data/energy",
        headers=headers,
        json={
            "organization_id": park_id,
            "energy_type": "electricity",
            "data_date": "2026-02-01",
            "consumption": 1000,
            "unit": "kWh",
            "cost": 800
        }
    )
    assert resp.status_code == 201
    
    # 计算碳排放
    resp = await client.post(
        "/api/v1/carbon/calculate",
        headers=headers,
        json={
            "organization_id": park_id,
            "energy_type": "electricity",
            "activity_data": 1000,
            "activity_unit": "kWh"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["emission_amount"] > 0
    assert data["scope"] == "scope_2"  # 电力默认范围二
