# ToDoList API 文档

## 概述

本文档详细描述了 ToDoList 系统的所有 API 接口，包括请求方法、路径、参数、请求体、响应格式以及错误处理。

## 基础信息

- **Base URL**: `http://localhost:3000` (开发环境)
- **API 版本**: v1
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 认证说明

### 获取 Token

在请求头中添加 JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

### 公开接口

以下接口不需要认证：
- `POST /users` - 创建用户

### 需要认证的接口

其他所有接口都需要在请求头中包含有效的 JWT Token。

## 用户模块 (Users)

### 1. 创建用户

创建新用户账户。

**请求**
```
POST /users
```

**请求体**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，3-20个字符 |
| email | string | 是 | 邮箱地址，需符合邮箱格式 |
| password | string | 是 | 密码，至少6个字符 |

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "用户创建成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `409 Conflict`: 用户名或邮箱已存在
- `400 Bad Request`: 请求参数验证失败

---

### 2. 获取所有用户

获取系统中的所有用户列表（仅管理员）。

**请求**
```
GET /users
```

**权限要求**
- 需要认证
- 仅管理员可访问

**响应示例**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "获取用户列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 权限不足

---

### 3. 获取当前用户信息

获取当前登录用户的个人信息。

**请求**
```
GET /users/profile
```

**权限要求**
- 需要认证

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "获取用户信息成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证

---

### 4. 获取指定用户信息

根据用户 ID 获取用户详细信息（仅管理员）。

**请求**
```
GET /users/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 用户 ID |

**权限要求**
- 需要认证
- 仅管理员可访问

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "获取用户信息成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 权限不足
- `404 Not Found`: 用户不存在

---

### 5. 更新用户信息

更新指定用户的信息。

**请求**
```
PATCH /users/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 用户 ID |

**请求体**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 否 | 用户名，3-20个字符 |
| email | string | 否 | 邮箱地址 |
| password | string | 否 | 密码，至少6个字符 |

**权限要求**
- 需要认证
- 用户只能更新自己的信息，管理员可以更新任何用户

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john_updated@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "用户信息更新成功",
  "timestamp": "2024-01-01T01:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 权限不足
- `404 Not Found`: 用户不存在
- `409 Conflict`: 用户名或邮箱已存在

---

### 6. 删除用户

删除指定用户（仅管理员）。

**请求**
```
DELETE /users/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 用户 ID |

**权限要求**
- 需要认证
- 仅管理员可访问

**响应**
- 状态码: `204 No Content`
- 无响应体

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 权限不足
- `404 Not Found`: 用户不存在

---

## 待办事项模块 (Todos)

### 1. 创建待办事项

为当前用户创建新的待办事项。

**请求**
```
POST /todos
```

**请求体**
```json
{
  "title": "string",
  "description": "string",
  "priority": "string",
  "dueDate": "string"
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 待办事项标题，1-200个字符 |
| description | string | 否 | 待办事项描述，最多1000个字符 |
| priority | string | 否 | 优先级：low、medium、high，默认为medium |
| dueDate | string | 否 | 截止日期，ISO 8601格式 |

**权限要求**
- 需要认证

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目文档",
    "description": "编写完整的项目文档",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "completedAt": null,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "待办事项创建成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `400 Bad Request`: 请求参数验证失败

---

### 2. 获取待办事项列表

获取当前用户的所有待办事项，支持按状态筛选。

**请求**
```
GET /todos
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 筛选状态：pending、in_progress、completed |

**权限要求**
- 需要认证

**响应示例**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "完成项目文档",
      "description": "编写完整的项目文档",
      "priority": "high",
      "status": "pending",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "completedAt": null,
      "userId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "获取待办事项列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证

---

### 3. 获取待办事项统计

获取当前用户的待办事项统计信息。

**请求**
```
GET /todos/statistics
```

**权限要求**
- 需要认证

**响应示例**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 5,
    "inProgress": 3,
    "completed": 2,
    "overdue": 1
  },
  "message": "获取统计信息成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| total | number | 总待办事项数 |
| pending | number | 待处理数量 |
| inProgress | number | 进行中数量 |
| completed | number | 已完成数量 |
| overdue | number | 已过期数量 |

**错误响应**
- `401 Unauthorized`: 未认证

---

### 4. 获取指定待办事项

根据 ID 获取待办事项详情。

**请求**
```
GET /todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项 ID |

**权限要求**
- 需要认证
- 只能访问自己的待办事项

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目文档",
    "description": "编写完整的项目文档",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "completedAt": null,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "获取待办事项成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权访问
- `404 Not Found`: 待办事项不存在

---

### 5. 更新待办事项

更新指定待办事项的信息。

**请求**
```
PATCH /todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项 ID |

**请求体**
```json
{
  "title": "string",
  "description": "string",
  "priority": "string",
  "status": "string",
  "dueDate": "string"
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 待办事项标题，1-200个字符 |
| description | string | 否 | 待办事项描述，最多1000个字符 |
| priority | string | 否 | 优先级：low、medium、high |
| status | string | 否 | 状态：pending、in_progress、completed |
| dueDate | string | 否 | 截止日期，ISO 8601格式 |

**权限要求**
- 需要认证
- 只能更新自己的待办事项

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目文档（更新）",
    "description": "编写完整的项目文档",
    "priority": "high",
    "status": "in_progress",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "completedAt": null,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "待办事项更新成功",
  "timestamp": "2024-01-01T01:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权访问
- `404 Not Found`: 待办事项不存在
- `400 Bad Request`: 请求参数验证失败

---

### 6. 标记待办事项为已完成

将指定待办事项标记为已完成状态。

**请求**
```
PATCH /todos/:id/complete
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项 ID |

**权限要求**
- 需要认证
- 只能操作自己的待办事项

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目文档",
    "description": "编写完整的项目文档",
    "priority": "high",
    "status": "completed",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "completedAt": "2024-01-01T01:00:00.000Z",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "待办事项已标记为完成",
  "timestamp": "2024-01-01T01:00:00.000Z"
}
```

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权访问
- `404 Not Found`: 待办事项不存在

---

### 7. 删除待办事项

删除指定的待办事项。

**请求**
```
DELETE /todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项 ID |

**权限要求**
- 需要认证
- 只能删除自己的待办事项

**响应**
- 状态码: `204 No Content`
- 无响应体

**错误响应**
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权访问
- `404 Not Found`: 待办事项不存在

---

## 错误代码

| HTTP 状态码 | 错误代码 | 说明 |
|------------|---------|------|
| 400 | BAD_REQUEST | 请求参数错误 |
| 401 | UNAUTHORIZED | 未认证或 Token 无效 |
| 403 | FORBIDDEN | 权限不足 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如用户名已存在） |
| 422 | UNPROCESSABLE_ENTITY | 请求格式正确但语义错误 |
| 500 | INTERNAL_SERVER_ERROR | 服务器内部错误 |
| 503 | SERVICE_UNAVAILABLE | 服务不可用 |

## 限流策略

- **默认限制**: 每个用户每分钟最多 100 次请求
- **超过限制**: 返回 `429 Too Many Requests`
- **响应头**:
  - `X-RateLimit-Limit`: 请求限制总数
  - `X-RateLimit-Remaining`: 剩余请求次数
  - `X-RateLimit-Reset`: 重置时间戳

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |

## 联系方式

如有问题或建议，请联系开发团队。

---

**最后更新**: 2024-01-01
