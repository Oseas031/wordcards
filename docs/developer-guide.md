# WordCards 开发者指南

## 快速开始

### 环境准备

#### 必需软件

| 软件 | 最低版本 | 推荐版本 | 安装方式 |
|------|----------|----------|----------|
| Node.js | 20.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 16.0 | 16.x | [postgresql.org](https://postgresql.org) |
| npm | 10.0.0 | 10.x | 随 Node.js 安装 |
| Git | 2.0.0 | 最新版 | [git-scm.com](https://git-scm.com) |

#### 推荐工具

| 工具 | 用途 |
|------|------|
| VS Code | 代码编辑器 |
| Prisma Extension | Prisma 语法高亮 |
| ESLint Extension | 代码检查 |
| Prettier Extension | 代码格式化 |

### 项目初始化

```bash
# 1. 克隆项目
git clone <repository-url>
cd React-1.0

# 2. 安装前端依赖
npm install

# 3. 安装后端依赖
cd server && npm install && cd ..

# 4. 创建 PostgreSQL 数据库
psql -U postgres -c "CREATE DATABASE wordcards;"
psql -U postgres -c "CREATE USER wordcards WITH PASSWORD 'wordcards';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;"
psql -U postgres -c "ALTER DATABASE wordcards OWNER TO wordcards;"

# 5. 配置环境变量
cat > server/.env << EOF
DATABASE_URL="postgresql://wordcards:wordcards@localhost:5432/wordcards?schema=public"
PORT=3100
EOF

# 6. 初始化数据库
cd server
npx prisma generate
npx prisma db push
npm run db:seed
cd ..

# 7. 启动开发服务器
# 终端 1
cd server && npm run dev

# 终端 2
npm run dev
```

---

## 开发规范

### 代码风格

#### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `DashboardPage.tsx` |
| 工具文件 | camelCase | `apiClient.ts` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 变量/函数 | camelCase | `loadBooks`, `selectedBookId` |
| 类型/接口 | PascalCase | `Book`, `WordState` |
| CSS 类 | kebab-case | `card__body` |

#### 目录结构约定

```
src/
├── components/     # 可复用组件
├── pages/          # 页面组件（路由对应）
├── lib/            # 核心逻辑、工具函数
├── hooks/          # 自定义 Hooks
├── data/           # 静态数据
└── types/          # 类型定义（可选，大型项目）
```

### Git 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

| 类型 | 描述 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具相关 |

#### 示例

```
feat(study): 添加单词学习反馈功能

- 实现 SRS 算法计算下次复习时间
- 添加"认识/模糊/不认识"三个反馈按钮
- 更新学习状态到数据库

Closes #123
```

### TypeScript 规范

#### 类型定义

```typescript
// ✅ 推荐：使用 interface 定义对象类型
interface Book {
  id: string
  name: string
  wordCount: number
}

// ✅ 推荐：使用 type 定义联合类型、工具类型
type Rating = '不认识' | '模糊' | '认识'
type PartialBook = Partial<Book>

// ❌ 避免：any 类型
const data: any = fetchData()  // 不推荐

// ✅ 推荐：使用 unknown + 类型守卫
const data: unknown = fetchData()
if (isBook(data)) {
  // ...
}
```

#### 函数签名

```typescript
// ✅ 推荐：明确参数和返回类型
async function loadBooks(): Promise<Book[]> {
  // ...
}

// ✅ 推荐：使用解构参数
async function loadWords(options: {
  bookId: string
  q?: string
  limit?: number
}): Promise<{ items: Word[]; total: number }> {
  // ...
}
```

---

## 前端开发

### 组件开发

#### 组件模板

```tsx
import { useState, useEffect } from 'react'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 副作用逻辑
  }, [])

  return (
    <div className="my-component">
      <h1>{title}</h1>
      <button onClick={onAction} disabled={loading}>
        {loading ? '加载中...' : '操作'}
      </button>
    </div>
  )
}
```

#### 样式约定

```tsx
// ✅ 推荐：使用内联样式 + CSS Variables
<div style={{
  padding: '12px 14px',
  borderRadius: 14,
  background: 'rgba(255,255,255,0.66)',
  color: 'var(--text)',
}}>
  内容
</div>

// ✅ 推荐：动态样式
<div style={{
  background: isActive ? 'var(--primary)' : 'transparent',
  opacity: disabled ? 0.6 : 1,
}}>
  内容
</div>
```

### API 调用

#### 使用 API Client

```typescript
import { booksApi, studyApi, statsApi } from '../lib/api'

// 获取词库列表
const books = await booksApi.list()

// 获取下一个单词
const nextWord = await studyApi.next(bookId)

// 提交反馈
await studyApi.feedback({
  bookId: 'xxx',
  wordId: 'yyy',
  rating: '认识',
})

// 获取统计
const stats = await statsApi.get(bookId)
```

### 状态管理

#### localStorage 持久化

```typescript
const STORAGE_KEY = 'wordcards.settings.v1'

function loadSettings(): Settings {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
```

---

## 后端开发

### 添加新 API

#### 1. 创建 Controller

```typescript
// server/src/controllers/example.controller.ts
import { Controller, Get, Query } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('api/example')
export class ExampleController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('q') q?: string) {
    const items = await this.prisma.example.findMany({
      where: q ? { name: { contains: q } } : undefined,
    })
    return items
  }
}
```

#### 2. 注册到 Module

```typescript
// server/src/app.module.ts
import { ExampleController } from './controllers/example.controller'

@Module({
  controllers: [
    BooksController,
    WordsController,
    StudyController,
    StatsController,
    HealthController,
    ExampleController,  // 添加
  ],
  providers: [PrismaService],
})
export class AppModule {}
```

### 数据库操作

#### Prisma 查询示例

```typescript
// 创建
const book = await this.prisma.book.create({
  data: { code: 'TEST', name: '测试词库' },
})

// 查询
const books = await this.prisma.book.findMany({
  where: { code: 'CET4' },
  include: { _count: { select: { words: true } } },
})

// 更新
await this.prisma.book.update({
  where: { id: bookId },
  data: { name: '新名称' },
})

// 删除
await this.prisma.book.delete({
  where: { id: bookId },
})

// 事务
await this.prisma.$transaction([
  this.prisma.word.deleteMany({ where: { bookId } }),
  this.prisma.book.delete({ where: { id: bookId } }),
])
```

### 参数验证

```typescript
import { z } from 'zod'

const CreateBookBody = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(100),
})

@Post()
async create(@Body() body: unknown) {
  const parsed = CreateBookBody.safeParse(body)
  if (!parsed.success) {
    throw new BadRequestException(parsed.error.issues)
  }
  const { code, name } = parsed.data
  // ...
}
```

---

## 测试

### 前端测试

```bash
# 运行测试
npm test

# 监听模式
npm test -- --watch
```

### 后端测试

```bash
cd server

# 运行测试
npm test

# 测试覆盖率
npm test -- --coverage
```

### API 测试

```bash
# 健康检查
curl http://localhost:3100/api/health

# 获取词库列表
curl -H "x-device-id: test-123" http://localhost:3100/api/books

# 提交反馈
curl -X POST http://localhost:3100/api/study/feedback \
  -H "Content-Type: application/json" \
  -H "x-device-id: test-123" \
  -d '{"bookId":"xxx","wordId":"yyy","rating":"认识"}'
```

---

## 调试技巧

### 前端调试

```typescript
// 控制台日志
console.log('Books:', books)
console.error('Error:', error)

// React DevTools
// 安装 React Developer Tools 浏览器扩展
```

### 后端调试

```typescript
// 日志输出
console.log(`[${new Date().toISOString()}] GET /api/books`)

// Prisma 查询日志
// 在 schema.prisma 中添加：
// generator client {
//   provider = "prisma-client-js"
//   log = ["query", "info", "warn", "error"]
// }
```

### 数据库调试

```bash
# 连接数据库
psql -U wordcards -d wordcards

# 查看表结构
\d "Book"
\d "Word"
\d "DeviceWordState"

# 查询数据
SELECT * FROM "Book";
SELECT COUNT(*) FROM "Word";
```

---

## 常见问题

### Q: 前端无法连接后端？

```bash
# 检查后端是否运行
curl http://localhost:3100/api/health

# 检查 CORS 配置
# server/src/main.ts
app.enableCors({ origin: true, credentials: true })
```

### Q: 数据库连接失败？

```bash
# 检查 PostgreSQL 服务
# Windows
net start postgresql-x64-18

# 检查连接字符串
# server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/wordcards"
```

### Q: Prisma 命令失败？

```bash
# 重新生成客户端
cd server
npx prisma generate

# 重置数据库
npx prisma db push --force-reset
```

### Q: 端口被占用？

```bash
# Windows - 查找占用端口的进程
netstat -ano | findstr :3100

# 结束进程
taskkill /PID <PID> /F
```

---

## 性能优化建议

### 前端

1. **使用虚拟列表**：大量数据时使用 `@tanstack/react-virtual`
2. **防抖/节流**：搜索输入、滚动事件
3. **懒加载**：动态 import 大型组件
4. **避免不必要渲染**：使用 `React.memo`、`useMemo`、`useCallback`

### 后端

1. **数据库索引**：查询频繁的字段添加索引
2. **分页查询**：避免一次性返回大量数据
3. **连接池**：Prisma 默认使用连接池
4. **缓存**：频繁访问的数据可使用 Redis 缓存

---

## 发布检查清单

### 代码检查

- [ ] TypeScript 无类型错误
- [ ] ESLint 无警告
- [ ] 所有测试通过
- [ ] 无 console.log 残留

### 功能检查

- [ ] 词库切换正常
- [ ] 学习功能正常
- [ ] 反馈提交正常
- [ ] 统计数据正确

### 部署检查

- [ ] 环境变量配置正确
- [ ] 数据库迁移完成
- [ ] API 跨域配置正确
- [ ] HTTPS 配置正确
