"""
安全模块单元测试
- 密码哈希 & 验证
- JWT Token 创建 & 解码
"""

import pytest
from datetime import timedelta
from unittest.mock import patch, MagicMock

# 模拟 settings 以避免依赖真实 .env
mock_settings = MagicMock()
mock_settings.secret_key = "test-secret-key-12345678901234567890"
mock_settings.algorithm = "HS256"
mock_settings.access_token_expire_minutes = 30
mock_settings.jwt_issuer = "carbonos-test"
mock_settings.jwt_audience = "carbonos-api-test"

with patch("app.core.config.get_settings", return_value=mock_settings):
    from app.core.security import (
        verify_password,
        get_password_hash,
        create_access_token,
        decode_token,
    )


class TestPasswordHashing:
    """密码哈希与验证测试"""

    def test_hash_and_verify_correct_password(self):
        """正确密码应验证通过"""
        password = "SecureP@ss123"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) is True

    def test_hash_and_verify_wrong_password(self):
        """错误密码应验证失败"""
        hashed = get_password_hash("correct-password")
        assert verify_password("wrong-password", hashed) is False

    def test_hash_is_not_plaintext(self):
        """哈希值不应等于明文"""
        password = "mypassword"
        hashed = get_password_hash(password)
        assert hashed != password

    def test_different_hashes_for_same_password(self):
        """同一密码多次哈希应得到不同结果 (salt)"""
        password = "same-password"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        assert hash1 != hash2

    def test_empty_password(self):
        """空密码也应该能哈希和验证"""
        hashed = get_password_hash("")
        assert verify_password("", hashed) is True
        assert verify_password("non-empty", hashed) is False

    def test_unicode_password(self):
        """中文密码应能正常处理"""
        password = "密码测试123"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) is True


class TestJWTToken:
    """JWT Token 创建与解码测试"""

    def test_create_and_decode_token(self):
        """创建的 Token 应能正确解码"""
        data = {"sub": "user-123", "role": "admin"}
        token = create_access_token(data)
        decoded = decode_token(token)

        assert decoded is not None
        assert decoded["sub"] == "user-123"
        assert decoded["role"] == "admin"
        assert decoded["iss"] == "carbonos-test"
        assert decoded["aud"] == "carbonos-api-test"

    def test_token_contains_expiry(self):
        """Token 应包含过期时间"""
        token = create_access_token({"sub": "user-1"})
        decoded = decode_token(token)
        assert "exp" in decoded

    def test_custom_expiry(self):
        """自定义过期时间应生效"""
        token = create_access_token(
            {"sub": "user-1"},
            expires_delta=timedelta(hours=2)
        )
        decoded = decode_token(token)
        assert decoded is not None

    def test_expired_token_returns_none(self):
        """过期 Token 解码应返回 None"""
        token = create_access_token(
            {"sub": "user-1"},
            expires_delta=timedelta(seconds=-1)  # 已过期
        )
        decoded = decode_token(token)
        assert decoded is None

    def test_invalid_token_returns_none(self):
        """无效 Token 解码应返回 None"""
        decoded = decode_token("invalid.token.string")
        assert decoded is None

    def test_tampered_token_returns_none(self):
        """篡改过的 Token 解码应返回 None"""
        token = create_access_token({"sub": "user-1"})
        # 修改 token 最后几个字符
        tampered = token[:-4] + "XXXX"
        decoded = decode_token(tampered)
        assert decoded is None

    def test_token_with_tenant_id(self):
        """含 tenant_id 的 Token 应正确解码"""
        data = {
            "sub": "user-1",
            "tenant_id": "tenant-abc",
            "role": "admin"
        }
        token = create_access_token(data)
        decoded = decode_token(token)
        assert decoded["tenant_id"] == "tenant-abc"
