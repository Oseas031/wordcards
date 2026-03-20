# 项目启动指南（本地 PostgreSQL 版本）

## 前置要求

- Node.js (v24.11.1 已安装)
- PostgreSQL 数据库（本地安装）
- PowerShell 执行策略配置

---

## 一、配置 PowerShell 执行策略

### 临时允许（推荐）

以管理员身份打开 PowerShell，执行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 永久允许当前用户

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 二、安装和配置 PostgreSQL

### 下载 PostgreSQL

1. 访问 PostgreSQL 官方下载页面：
   https://www.postgresql.org/download/windows/

2. 下载 PostgreSQL 16.x for Windows x86-64

### 安装 PostgreSQL

1. 运行安装程序
2. 设置超级用户密码：`wordcards`
3. 端口：`5432`（默认）
4. 完成安装

### 创建数据库和用户

#### 方法 A：使用 pgAdmin 4（推荐）

1. 打开 pgAdmin 4
2. 连接到服务器（localhost:5432，用户名：postgres，密码：wordcards）
3. 创建数据库：`wordcards`
4. 创建用户：`wordcards`（密码：wordcards）
5. 授予权限：GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards

#### 方法 B：使用命令行

```powershell
psql -U postgres -h localhost
```

输入密码：`wordcards`

然后执行：
```sql
CREATE DATABASE wordcards;
CREATE USER wordcards WITH PASSWORD 'wordcards';
GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;
\q
```

### 验证安装

1. 检查 PostgreSQL 服务是否运行：
   - 打开服务管理器（services.msc）
   - 查找 `postgresql-x64-16` 服务

2. 测试连接：
   ```powershell
   psql -U postgres -h localhost
   ```

---

## 三、启动后端服务

### 1. 安装依赖

```powershell
cd server
npm install
```

### 2. 生成 Prisma Client

```powershell
npm run prisma:generate
```

### 3. 运行数据库迁移

```powershell
npm run prisma:migrate
```

### 4. 填充种子数据

```powershell
npm run db:seed
```

这将创建 3 个词库：
- DEMO：演示词库（2 个单词）
- CET4：CET-4 示例词库（12 个单词）
- CET6：CET-6 示例词库（12 个单词）

### 5. 启动后端

```powershell
npm run dev
```

后端将在 **http://localhost:3100** 启动。

---

## 四、启动前端服务

### 1. 打开新的 PowerShell 终端

### 2. 安装依赖

```powershell
cd c:\Users\ASUS\Documents\React-1.0
npm install
```

### 3. 启动开发服务器

```powershell
npm run dev
```

前端将在 **http://127.0.0.1:5173** 启动。

---

## 五、验证运行

### 1. 检查后端健康状态

访问：http://localhost:3100/api/health

应该返回：`{"status":"ok"}`

### 2. 检查词库列表

访问：http://localhost:3100/api/books

应该返回词库列表。

### 3. 访问前端应用

打开浏览器访问：http://127.0.0.1:5173

---

## 六、常见问题

### PowerShell 执行策略错误

```
npm : 无法加载文件 C:\Program Files\nodejs\npm.ps1
```

**解决方案**：执行 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### 数据库连接失败

```
Error: Can't reach database server
```

**解决方案**：
1. 检查 PostgreSQL 服务是否运行：打开 services.msc
2. 检查端口 5432 是否被占用
3. 验证 [server/.env](server/.env) 中的数据库连接字符串

### 端口已被占用

```
Error: listen EADDRINUSE: address already in use :::3100
```

**解决方案**：修改 [server/.env](server/.env) 中的 PORT

### psql 命令未找到

```
psql : 无法将"psql"项识别为 cmdlet...
```

**解决方案**：
1. 将 PostgreSQL bin 目录添加到 PATH：`C:\Program Files\PostgreSQL\16\bin`
2. 或使用完整路径：`& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost`

### 权限不足

```
Error: permission denied for database wordcards
```

**解决方案**：
1. 使用超级用户（postgres）重新授权
2. 或使用 pgAdmin 重新设置权限

---

## 七、API 配置

前端 API 配置位于 [src/lib/api.ts](src/lib/api.ts)：

```typescript
const API_BASE_URL = 'http://localhost:3100'
```

如需修改后端地址，请更新此常量。

---

## 八、数据库管理

### 使用 Prisma Studio（可视化数据库）

```powershell
cd server
npm run prisma:studio
```

访问：http://localhost:5555

### 重置数据库

```powershell
cd server
npm run prisma:migrate reset
npm run db:seed
```

**注意**：这将删除所有数据！

---

## 九、开发提示

### 热重载

- 前端：Vite 自动热重载
- 后端：tsx watch 自动重启

### 调试

- 前端：浏览器开发者工具
- 后端：VS Code 调试器或控制台日志

### 日志

- 前端：浏览器控制台
- 后端：PowerShell 终端

---

## 十、项目结构

```
React-1.0/
├── src/              # 前端源码
│   ├── lib/         # 工具函数
│   ├── components/   # React 组件
│   ├── pages/       # 页面组件
│   └── App.tsx      # 应用入口
├── server/          # 后端源码
│   ├── src/
│   │   ├── controllers/  # API 控制器
│   │   └── main.ts       # 后端入口
│   ├── prisma/      # 数据库配置
│   └── .env         # 环境变量
└── STARTUP_GUIDE.md # 启动指南（本文件）
```

---

## 十一、下一步

项目已完全配置并可以运行。您可以：

1. 开始使用应用学习单词
2. 根据需要添加更多词库
3. 自定义设置（主题、字体大小等）
4. 查看学习统计和进度

## 十二、详细安装指南

如需更详细的 PostgreSQL 安装步骤，请参考：
[POSTGRESQL_INSTALL_GUIDE.md](POSTGRESQL_INSTALL_GUIDE.md)

祝学习愉快！
