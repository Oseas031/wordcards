# WordCards API 文档

## 概述

WordCards API 是一个 RESTful API，提供词库管理、学习功能和统计数据的接口。

### 基础信息

| 项目 | 值 |
|------|-----|
| 基础 URL | `http://localhost:3100` |
| API 前缀 | `/api` |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

### 认证方式

本系统使用**设备 ID** 进行身份识别，无需用户登录。

```http
x-device-id: dev_1234567890_abc123def456
```

- 首次请求时，后端会自动生成设备 ID 并在响应头返回
- 前端需要持久化存储设备 ID（localStorage）
- 后续请求必须携带 `x-device-id` 请求头

---

## 接口列表

### 健康检查

#### GET /api/health

检查服务是否正常运行。

**请求示例**

```http
GET /api/health HTTP/1.1
Host: localhost:3100
```

**响应示例**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 词库管理

#### GET /api/books

获取所有词库列表。

**请求示例**

```http
GET /api/books HTTP/1.1
Host: localhost:3100
x-device-id: dev_1234567890_abc123
```

**响应示例**

```json
[
  {
    "id": "4c24d0cc-69e6-4b93-8b06-83324de2e3ad",
    "code": "DEMO",
    "name": "演示词库（少量）",
    "wordCount": 2
  },
  {
    "id": "7e0811a8-2f3a-4bbb-b387-43fbd99d5b96",
    "code": "CET4",
    "name": "CET-4（四级）词库",
    "wordCount": 121
  }
]
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 词库唯一标识（UUID） |
| code | string | 词库代码（如 CET4、CET6） |
| name | string | 词库显示名称 |
| wordCount | number | 词库包含的单词数量 |

---

#### GET /api/books/:bookId/words

获取指定词库的单词列表，支持搜索和分页。

**路径参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| bookId | string | 是 | 词库 ID |

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| q | string | 否 | - | 搜索关键词（匹配单词、释义、例句） |
| limit | number | 否 | 50 | 返回数量限制（最大 2000） |
| offset | number | 否 | 0 | 偏移量（分页用） |

**请求示例**

```http
GET /api/books/7e0811a8-2f3a-4bbb-b387-43fbd99d5b96/words?q=abandon&limit=10 HTTP/1.1
Host: localhost:3100
x-device-id: dev_1234567890_abc123
```

**响应示例**

```json
{
  "items": [
    {
      "id": "ee1c7ea4-d4a5-4bbd-9a91-88de1a874c6e",
      "word": "abandon",
      "phonetic": "/əˈbændən/",
      "meaning": "放弃；抛弃",
      "example": "Never abandon your dreams."
    }
  ],
  "total": 1
}
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| items | Word[] | 单词列表 |
| total | number | 匹配的总数量 |

**Word 对象**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 单词唯一标识 |
| word | string | 单词文本 |
| phonetic | string \| null | 音标 |
| meaning | string | 中文释义 |
| example | string \| null | 例句 |

---

### 学习功能

#### GET /api/study/next

获取下一个需要学习的单词。

**查询参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| bookId | string | 是 | 词库 ID |

**请求示例**

```http
GET /api/study/next?bookId=7e0811a8-2f3a-4bbb-b387-43fbd99d5b96 HTTP/1.1
Host: localhost:3100
x-device-id: dev_1234567890_abc123
```

**响应示例**

```json
{
  "word": {
    "id": "ee1c7ea4-d4a5-4bbd-9a91-88de1a874c6e",
    "word": "abandon",
    "phonetic": "/əˈbændən/",
    "meaning": "放弃；抛弃",
    "example": "Never abandon your dreams."
  },
  "state": {
    "intervalDay": 0,
    "ease": 2.3,
    "dueAt": "2024-01-15T10:30:00.000Z",
    "streak": 0,
    "reviews": 0
  }
}
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| word | Word | 单词信息 |
| state | WordState | 学习状态 |

**WordState 对象**

| 字段 | 类型 | 描述 |
|------|------|------|
| intervalDay | number | 间隔天数 |
| ease | number | 难度因子（1.3-2.8） |
| dueAt | string | 下次复习时间（ISO 8601） |
| streak | number | 连续认识次数 |
| reviews | number | 总复习次数 |

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | 词库为空 | 词库中没有单词 |
| 400 | 所有单词已学完 | 今日没有需要复习的单词 |

---

#### POST /api/study/feedback

提交学习反馈，更新单词学习状态。

**请求体**

```typescript
{
  bookId: string    // 词库 ID
  wordId: string    // 单词 ID
  rating: '不认识' | '模糊' | '认识'  // 记忆程度
}
```

**请求示例**

```http
POST /api/study/feedback HTTP/1.1
Host: localhost:3100
Content-Type: application/json
x-device-id: dev_1234567890_abc123

{
  "bookId": "7e0811a8-2f3a-4bbb-b387-43fbd99d5b96",
  "wordId": "ee1c7ea4-d4a5-4bbd-9a91-88de1a874c6e",
  "rating": "认识"
}
```

**响应示例**

```json
{
  "success": true,
  "state": {
    "intervalDay": 1,
    "ease": 2.35,
    "dueAt": "2024-01-16T10:30:00.000Z",
    "streak": 1,
    "reviews": 1
  }
}
```

**SRS 算法规则**

| 反馈 | 间隔计算 | ease 变化 |
|------|----------|-----------|
| 不认识 | 10 分钟后 | ease - 0.2（最低 1.3） |
| 模糊 | 1.2 × 当前间隔 | ease - 0.05（最低 1.3） |
| 认识 | ease × 当前间隔 | ease + 0.05（最高 2.8） |

---

### 统计数据

#### GET /api/stats

获取学习统计数据。

**查询参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| bookId | string | 是 | 词库 ID |

**请求示例**

```http
GET /api/stats?bookId=7e0811a8-2f3a-4bbb-b387-43fbd99d5b96 HTTP/1.1
Host: localhost:3100
x-device-id: dev_1234567890_abc123
```

**响应示例**

```json
{
  "learnedToday": 15,
  "totalTracked": 120,
  "dueCount": 8
}
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| learnedToday | number | 今日已学单词数 |
| totalTracked | number | 累计学习单词数 |
| dueCount | number | 待复习单词数 |

---

## 错误处理

### 错误响应格式

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request"
}
```

### 常见错误码

| 状态码 | 描述 | 可能原因 |
|--------|------|----------|
| 400 | Bad Request | 参数缺失或格式错误 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 跨域配置

后端已启用 CORS，允许跨域请求：

```typescript
app.enableCors({
  origin: true,
  credentials: true,
})
```

---

## 请求示例（JavaScript）

### 使用 fetch

```javascript
const API_BASE_URL = 'http://localhost:3100'

async function getBooks() {
  const response = await fetch(`${API_BASE_URL}/api/books`, {
    headers: {
      'x-device-id': getDeviceId(),
    },
  })
  return response.json()
}

async function submitFeedback(bookId, wordId, rating) {
  const response = await fetch(`${API_BASE_URL}/api/study/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': getDeviceId(),
    },
    body: JSON.stringify({ bookId, wordId, rating }),
  })
  return response.json()
}
```

### 使用 axios

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3100/api',
  headers: {
    'x-device-id': getDeviceId(),
  },
})

const books = await api.get('/books')
const nextWord = await api.get('/study/next', { params: { bookId } })
```

---

## 版本控制

当前 API 版本：`v1`

未来如有破坏性变更，将使用版本前缀：`/api/v2/...`
