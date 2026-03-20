## 后端（TypeScript + NestJS + PostgreSQL + Prisma）

### 1) 准备 PostgreSQL

你当前电脑未检测到 Docker（`docker` 命令不存在），所以有两种方式：

- **方式 A（推荐）**：安装 Docker Desktop，然后在仓库根目录执行：

```bash
docker compose up -d
```

- **方式 B**：本机安装 PostgreSQL（Windows 安装包），并创建数据库：
  - 用户：`wordcards`
  - 密码：`wordcards`
  - 数据库：`wordcards`

然后确认 `server/.env` 的 `DATABASE_URL` 能连上你的本机 PostgreSQL。

### 2) 安装依赖

在 `server/` 目录：

```bash
npm install
npm run prisma:generate
```

### 3) 初始化数据库（迁移 + 演示数据）

```bash
npm run prisma:migrate
npm run db:seed
```

种子数据会创建 3 个词库（少量示例）：
- `DEMO`：演示词库（少量）
- `CET4`：CET-4（四级）示例词库（少量）
- `CET6`：CET-6（六级）示例词库（少量）

### 4) 启动后端

```bash
npm run dev
```

默认端口：`http://localhost:3100`

### 5) REST 接口

所有接口都支持用请求头 `x-device-id` 标识设备（不需要登录）。
如果你不传，后端会自动生成，并通过响应头 `x-device-id` 返回给你。

- `GET /api/books`
  - 返回词库列表（含单词数）
- `GET /api/books/:bookId/words?q=&limit=&offset=`
  - 按词库分页拉取词条（支持搜索）
- `GET /api/study/next?bookId=<uuid>&mode=study|review`
  - 拉取下一张（优先返回到期复习，否则返回一张学习卡）
- `POST /api/study/feedback`
  - body: `{ "bookId": "<uuid>", "wordId": "<uuid>", "rating": "不认识"|"模糊"|"认识" }`
- `GET /api/stats?bookId=<uuid>`
  - 返回今日学习数、到期复习数等

