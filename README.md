# WordCards - 智能单词记忆应用

<p align="center">
  <img src="docs/architecture-overview.png" alt="WordCards Architecture" width="600">
</p>

<p align="center">
  <strong>基于间隔重复算法（SRS）的现代化单词学习应用</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#文档">文档</a>
</p>

---

## 功能特性

### 🎯 核心功能

| 功能 | 描述 |
|------|------|
| **智能学习** | 基于 SM-2 改进算法的间隔重复系统（SRS） |
| **多词库支持** | 内置 CET-4、CET-6 词库，支持自定义导入 |
| **学习统计** | 实时追踪学习进度、复习计划、连续学习天数 |
| **词库浏览** | 虚拟列表优化，支持 10000+ 单词流畅滚动 |
| **离线优先** | 设备 ID 标识，无需登录即可使用 |

### 🧠 SRS 算法特点

```
反馈等级          下次复习时间          难度因子变化
─────────────────────────────────────────────────
不认识    →    10分钟后           →    ease - 0.2
模糊      →    1.2x 间隔天数       →    ease - 0.05
认识      →    ease × 间隔天数     →    ease + 0.05
```

- **动态难度调整**：根据用户反馈自动调整单词难度因子
- **遗忘曲线优化**：结合艾宾浩斯遗忘曲线进行复习安排
- **连续学习激励**：追踪学习连续天数，激励持续学习

---

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2 | UI 框架 |
| TypeScript | 5.9 | 类型安全 |
| Vite | 8.0 | 构建工具 |
| @tanstack/react-virtual | 3.13 | 虚拟列表 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | 11.1 | 后端框架 |
| Prisma | 6.16 | ORM |
| PostgreSQL | 16+ | 数据库 |
| Zod | 4.1 | 参数验证 |

---

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- PostgreSQL >= 16.0
- npm >= 10.0.0

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd React-1.0

# 2. 安装前端依赖
npm install

# 3. 安装后端依赖
cd server && npm install && cd ..

# 4. 配置数据库
# 创建 PostgreSQL 数据库
psql -U postgres -c "CREATE DATABASE wordcards;"
psql -U postgres -c "CREATE USER wordcards WITH PASSWORD 'wordcards';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;"

# 5. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 设置 DATABASE_URL

# 6. 初始化数据库
cd server
npx prisma generate
npx prisma db push
npm run db:seed
cd ..

# 7. 启动开发服务器
# 终端 1 - 后端
cd server && npm run dev

# 终端 2 - 前端
npm run dev
```

### 访问地址

- 前端：http://localhost:5173
- 后端 API：http://localhost:3100
- API 文档：http://localhost:3100/api/health

---

## 项目结构

```
React-1.0/
├── src/                      # 前端源码
│   ├── components/           # 可复用组件
│   │   ├── BookSelector.tsx  # 词库选择器（Portal 下拉框）
│   │   ├── BottomTabBar.tsx  # 底部导航栏
│   │   └── WordVirtualList.tsx # 虚拟列表（性能优化）
│   ├── pages/                # 页面组件
│   │   ├── DashboardPage.tsx # 首页/统计
│   │   ├── StudyPage.tsx     # 学习页面
│   │   ├── LibraryPage.tsx   # 词库浏览
│   │   └── SettingsPage.tsx  # 设置页面
│   ├── lib/                  # 核心逻辑
│   │   ├── api.ts            # API 客户端 + 类型定义
│   │   ├── srs.ts            # 前端 SRS 算法（备用）
│   │   └── storage.ts        # 本地存储工具
│   ├── hooks/                # 自定义 Hooks
│   │   └── useLocalState.ts  # 本地状态持久化
│   └── data/                 # 静态数据
│       └── demoWords.ts      # 演示数据
│
├── server/                   # 后端源码
│   ├── src/
│   │   ├── controllers/      # 控制器（路由处理）
│   │   │   ├── books.controller.ts
│   │   │   ├── words.controller.ts
│   │   │   ├── study.controller.ts
│   │   │   ├── stats.controller.ts
│   │   │   └── health.controller.ts
│   │   ├── app.module.ts     # NestJS 模块
│   │   ├── main.ts           # 入口文件
│   │   ├── prisma.service.ts # Prisma 服务
│   │   └── srs.ts            # SRS 算法实现
│   └── prisma/
│       ├── schema.prisma     # 数据库模型
│       └── seed*.ts          # 种子数据脚本
│
├── docs/                     # 文档
│   ├── api.md                # API 文档
│   └── architecture.md       # 架构设计
│
├── DEPLOYMENT.md             # 部署指南
├── STARTUP_GUIDE.md          # 启动指南
└── README.md                 # 本文档
```

---

## 文档

| 文档 | 描述 |
|------|------|
| [API 文档](docs/api.md) | 完整的 REST API 接口说明 |
| [架构设计](docs/architecture.md) | 系统架构与技术选型 |
| [部署指南](DEPLOYMENT.md) | 生产环境部署方案 |
| [启动指南](STARTUP_GUIDE.md) | 本地开发环境配置 |

---

## API 概览

### 词库管理

```http
GET    /api/books              # 获取词库列表
GET    /api/books/:id/words    # 获取词库单词
```

### 学习功能

```http
GET    /api/study/next?bookId=xxx     # 获取下一个单词
POST   /api/study/feedback            # 提交学习反馈
```

### 统计数据

```http
GET    /api/stats?bookId=xxx          # 获取学习统计
```

详细 API 文档请参考 [docs/api.md](docs/api.md)

---

## 数据模型

```prisma
model Book {
  id         String   @id @default(uuid())
  code       String   @unique
  name       String
  words      Word[]
  createdAt  DateTime @default(now())
}

model Word {
  id         String   @id @default(uuid())
  bookId     String
  word       String
  wordKey    String
  phonetic   String?
  meaning    String
  example    String?
  book       Book     @relation(fields: [bookId], references: [id])
  states     DeviceWordState[]
  createdAt  DateTime @default(now())
  
  @@unique([bookId, wordKey])
}

model DeviceWordState {
  id           String   @id @default(uuid())
  deviceId     String
  wordId       String
  bookId       String
  intervalDay  Int      @default(0)
  ease         Float    @default(2.3)
  dueAt        DateTime
  reviewedAt   DateTime?
  streak       Int      @default(0)
  reviews      Int      @default(0)
  
  @@unique([deviceId, wordId])
}
```

---

## 性能优化

### 前端优化

1. **虚拟列表**：使用 `@tanstack/react-virtual` 实现 10000+ 单词流畅滚动
2. **防抖搜索**：300ms 防抖避免频繁 API 调用
3. **Portal 渲染**：下拉框使用 Portal 避免层叠问题
4. **CSS 动画**：使用 GPU 加速的 CSS 动画

### 后端优化

1. **索引优化**：关键字段添加数据库索引
2. **连接池**：Prisma 连接池管理
3. **响应压缩**：生产环境启用 gzip

---

## 测试

```bash
# 运行前端测试
npm test

# 运行后端测试
cd server && npm test
```

---

## 贡献指南

请参考 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 许可证

MIT License

---

## 致谢

- SRS 算法基于 [SuperMemo SM-2](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) 改进
- UI 设计参考现代移动端学习应用
