# CarbonOS API 错误码参考

## HTTP 状态码约定

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功，无返回体 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或 Token 过期 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如邮箱已注册） |
| 422 | Unprocessable Entity | 参数校验失败 (Pydantic) |
| 429 | Too Many Requests | 触发限流 |
| 500 | Internal Server Error | 服务器内部错误 |

## 业务错误码 (detail 字段)

### 认证模块 (`/api/v1/auth/*`)

| detail | 状态码 | 说明 | 处理建议 |
|--------|--------|------|----------|
| `邮箱或密码错误` | 401 | 登录凭据不正确 | 检查邮箱/密码 |
| `账户已被锁定` | 403 | 连续 5 次登录失败后锁定 | 等待 30 分钟后重试 |
| `该邮箱已注册` | 409 | 注册时邮箱重复 | 提示登录或找回密码 |
| `Token 已过期` | 401 | access_token 已失效 | 前端自动跳转登录 |
| `无效 Token` | 401 | Token 签名验证失败 | 清除本地存储并重新登录 |

### 租户模块 (`/api/v1/tenant/*`)

| detail | 状态码 | 说明 |
|--------|--------|------|
| `租户不存在` | 404 | 查询的 tenant_id 无效 |
| `租户名称已存在` | 409 | 创建租户时名称重复 |
| `租户订阅已过期` | 403 | 租户订阅到期 |

### 组织模块 (`/api/v1/organization/*`)

| detail | 状态码 | 说明 |
|--------|--------|------|
| `组织不存在` | 404 | 查询的组织 ID 无效 |
| `权限不足` | 403 | 非管理员操作 |

### 能源数据模块 (`/api/v1/energy/*`)

| detail | 状态码 | 说明 |
|--------|--------|------|
| `数据源未连接` | 503 | IoT 数据采集中断 |
| `时间范围无效` | 400 | 查询时间范围参数错误 |

### 限流

| detail | 状态码 | 说明 |
|--------|--------|------|
| `请求过于频繁，请稍后重试` | 429 | 触发 RateLimitMiddleware |
| `登录尝试过多` | 429 | 触发 AuthRateLimitMiddleware |

## 前端 ApiError 使用

```typescript
import { apiClient, ApiError } from "@/lib/api-client";

try {
  const data = await apiClient.get<UserResponse>("/api/v1/auth/me");
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      // 自动跳转登录（api-client 已内置处理）
    } else if (err.status === 429) {
      toast.error("请求过于频繁，请稍后重试");
    } else {
      toast.error(err.detail); // 直接显示后端返回的中文错误
    }
  }
}
```

## Pydantic 校验错误 (422)

FastAPI 验证失败时返回结构化错误：

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

前端处理建议：提取 `detail[0].msg` 展示给用户。
