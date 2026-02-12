"""
认证 API 测试
- 登录错误场景
- 账户锁定机制
- 权限验证
"""

import pytest
from httpx import AsyncClient


# ============ 注册测试 ============

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    """正常注册应返回 201"""
    resp = await client.post("/api/v1/auth/register", json={
        "company_name": "测试公司",
        "admin_email": "newuser@test.com",
        "admin_password": "Str0ngP@ss!",
        "admin_name": "测试管理员",
        "phone": "13800138000"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "newuser@test.com"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    """重复邮箱注册应返回 400"""
    payload = {
        "company_name": "公司A",
        "admin_email": "dup@test.com",
        "admin_password": "Password123!",
        "admin_name": "管理员",
        "phone": "13800000001"
    }
    # 第一次注册
    resp1 = await client.post("/api/v1/auth/register", json=payload)
    assert resp1.status_code == 201

    # 重复注册
    payload["company_name"] = "公司B"
    resp2 = await client.post("/api/v1/auth/register", json=payload)
    assert resp2.status_code == 400
    assert "已被注册" in resp2.json()["detail"]


# ============ 登录测试 ============

async def _register_and_get_token(client: AsyncClient, email: str = "login@test.com") -> str:
    """辅助函数：注册并返回 Token"""
    await client.post("/api/v1/auth/register", json={
        "company_name": "登录测试公司",
        "admin_email": email,
        "admin_password": "LoginP@ss123",
        "admin_name": "登录用户",
        "phone": "13800000002"
    })
    resp = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "LoginP@ss123"
    })
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    """正确凭据登录应返回 Token"""
    await client.post("/api/v1/auth/register", json={
        "company_name": "登录公司",
        "admin_email": "good@test.com",
        "admin_password": "GoodPass123!",
        "admin_name": "用户",
        "phone": "13800000003"
    })
    resp = await client.post("/api/v1/auth/login", json={
        "email": "good@test.com",
        "password": "GoodPass123!"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["role"] == "admin"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    """错误密码应返回 401"""
    await client.post("/api/v1/auth/register", json={
        "company_name": "公司",
        "admin_email": "wrong@test.com",
        "admin_password": "CorrectPass1!",
        "admin_name": "用户",
        "phone": "13800000004"
    })
    resp = await client.post("/api/v1/auth/login", json={
        "email": "wrong@test.com",
        "password": "WrongPassword!"
    })
    assert resp.status_code == 401
    assert "剩余尝试次数" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    """不存在的用户应返回 401"""
    resp = await client.post("/api/v1/auth/login", json={
        "email": "noexist@test.com",
        "password": "AnyPass123!"
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_lockout_after_max_attempts(client: AsyncClient):
    """连续失败 5 次应锁定账户"""
    # 注册
    await client.post("/api/v1/auth/register", json={
        "company_name": "锁定公司",
        "admin_email": "lock@test.com",
        "admin_password": "LockTest123!",
        "admin_name": "用户",
        "phone": "13800000005"
    })

    # 连续 5 次错误登录
    for i in range(5):
        resp = await client.post("/api/v1/auth/login", json={
            "email": "lock@test.com",
            "password": "WrongPassword!"
        })

    # 第 5 次应返回 403（锁定）
    assert resp.status_code == 403
    assert "锁定" in resp.json()["detail"]

    # 锁定后即使正确密码也被拒绝
    resp = await client.post("/api/v1/auth/login", json={
        "email": "lock@test.com",
        "password": "LockTest123!"
    })
    assert resp.status_code == 403


# ============ 鉴权测试 ============

@pytest.mark.asyncio
async def test_get_me_authenticated(client: AsyncClient):
    """/auth/me 应返回当前用户信息"""
    token = await _register_and_get_token(client, "me@test.com")
    resp = await client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@test.com"


@pytest.mark.asyncio
async def test_get_me_unauthenticated(client: AsyncClient):
    """/auth/me 无 Token 应返回 401"""
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient):
    """/auth/me 无效 Token 应返回 401"""
    resp = await client.get("/api/v1/auth/me", headers={
        "Authorization": "Bearer invalid.token.here"
    })
    assert resp.status_code == 401
