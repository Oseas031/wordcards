# PostgreSQL 本地安装详细指南

## 问题说明

您的系统未安装 Docker，因此无法使用 `docker compose` 命令。请使用以下本地安装 PostgreSQL 的方案。

---

## 方案：本地安装 PostgreSQL（Windows）

### 第一步：下载 PostgreSQL

1. 访问 PostgreSQL 官方下载页面：
   https://www.postgresql.org/download/windows/

2. 选择以下版本：
   - **版本**：PostgreSQL 16.x（推荐最新稳定版）
   - **操作系统**：Windows x86-64

3. 下载安装程序（.exe 文件）

---

### 第二步：安装 PostgreSQL

1. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 选择语言：English 或 简体中文

2. **安装组件选择**
   - 默认选择所有组件即可
   - 包括：PostgreSQL Server, pgAdmin 4, Stack Builder

3. **设置安装目录**
   - 默认：`C:\Program Files\PostgreSQL\16`
   - 可以自定义，建议使用默认路径

4. **设置数据目录**
   - 默认：`C:\Program Files\PostgreSQL\16\data`
   - 建议使用默认路径

5. **设置超级用户密码** ⚠️ 重要
   - **密码**：`wordcards`（必须与项目配置一致）
   - **用户名**：`postgres`（默认超级用户）
   - **记住此密码**，后续需要使用

6. **设置端口**
   - **端口**：`5432`（默认）
   - 确保端口未被占用

7. **选择区域设置**
   - 默认：`Chinese, Simplified, China`

8. **开始安装**
   - 点击 Next 开始安装
   - 等待安装完成（约 2-5 分钟）

---

### 第三步：验证安装

1. **检查 PostgreSQL 服务**
   - 打开"服务管理器"（services.msc）
   - 查找 `postgresql-x64-16` 服务
   - 确认状态为"正在运行"

2. **测试连接**
   - 打开命令提示符（cmd）
   - 执行：
     ```cmd
     psql -U postgres -h localhost
     ```
   - 输入密码：`wordcards`
   - 如果成功连接，会看到 `postgres=#` 提示符

---

### 第四步：创建数据库和用户

#### 方法 A：使用 pgAdmin 4（图形界面，推荐）

1. **打开 pgAdmin 4**
   - 安装完成后自动启动
   - 或从开始菜单打开

2. **连接到服务器**
   - 右键 `Servers` > `Register` > `Server`
   - **Name**：`localhost`
   - **Host**：`localhost`
   - **Port**：`5432`
   - **Username**：`postgres`
   - **Password**：`wordcards`
   - 点击 `Save`

3. **创建数据库**
   - 展开 `Servers` > `localhost` > `Databases`
   - 右键 `Databases` > `Create` > `Database`
   - **Database name**：`wordcards`
   - 点击 `Save`

4. **创建用户**
   - 展开 `Servers` > `localhost` > `Login/Group Roles`
   - 右键 `Login/Group Roles` > `Create` > `Login/Group Role`
   - **Name**：`wordcards`
   - **Password**：`wordcards`
   - 点击 `Save`

5. **授权用户**
   - 展开 `Servers` > `localhost` > `Databases` > `wordcards`
   - 右键 `wordcards` > `Properties`
   - 切换到 `Security` 标签
   - 在 `Privileges` 中添加 `wordcards` 用户
   - 授予所有权限（ALL）
   - 点击 `Save`

#### 方法 B：使用命令行（快速）

1. **以管理员身份打开 PowerShell**

2. **连接到 PostgreSQL**
   ```powershell
   psql -U postgres -h localhost
   ```
   输入密码：`wordcards`

3. **执行 SQL 命令**
   ```sql
   -- 创建数据库
   CREATE DATABASE wordcards;

   -- 创建用户
   CREATE USER wordcards WITH PASSWORD 'wordcards';

   -- 授予权限
   GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;

   -- 退出
   \q
   ```

---

### 第五步：验证项目配置

1. **检查项目配置文件**
   - 打开：`server\.env`
   - 确认内容：
     ```
     DATABASE_URL="postgresql://wordcards:wordcards@localhost:5432/wordcards?schema=public"
     PORT=3100
     ```

2. **测试数据库连接**
   ```powershell
   cd server
   npm run prisma:studio
   ```
   - 如果成功，浏览器会打开 Prisma Studio
   - 访问：http://localhost:5555

---

### 第六步：初始化数据库

1. **安装后端依赖**
   ```powershell
   cd server
   npm install
   ```

2. **生成 Prisma Client**
   ```powershell
   npm run prisma:generate
   ```

3. **运行数据库迁移**
   ```powershell
   npm run prisma:migrate
   ```

4. **填充种子数据**
   ```powershell
   npm run db:seed
   ```

   这将创建 3 个词库：
   - DEMO：演示词库（2 个单词）
   - CET4：CET-4 示例词库（12 个单词）
   - CET6：CET-6 示例词库（12 个单词）

---

## 常见问题

### Q1：端口 5432 被占用

**错误信息**：
```
Error: Port 5432 is already in use
```

**解决方案**：
1. 检查占用端口的程序：
   ```powershell
   netstat -ano | findstr :5432
   ```

2. 如果有其他 PostgreSQL 实例在运行：
   - 停止该服务
   - 或修改项目端口（不推荐）

### Q2：无法连接到数据库

**错误信息**：
```
Error: connection refused
```

**解决方案**：
1. 确认 PostgreSQL 服务正在运行：
   - 打开服务管理器（services.msc）
   - 检查 `postgresql-x64-16` 服务状态

2. 检查防火墙设置：
   - 允许 PostgreSQL 通过防火墙
   - 端口：5432

3. 验证连接字符串：
   - 用户名：`wordcards`
   - 密码：`wordcards`
   - 数据库：`wordcards`
   - 主机：`localhost`
   - 端口：`5432`

### Q3：psql 命令未找到

**错误信息**：
```
psql : 无法将"psql"项识别为 cmdlet...
```

**解决方案**：
1. 将 PostgreSQL bin 目录添加到 PATH：
   - 路径：`C:\Program Files\PostgreSQL\16\bin`
   - 系统属性 > 环境变量 > Path > 编辑

2. 或使用完整路径：
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost
   ```

### Q4：权限不足

**错误信息**：
```
Error: permission denied for database wordcards
```

**解决方案**：
1. 使用超级用户（postgres）重新授权：
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;
   ```

2. 或使用 pgAdmin 重新设置权限

---

## 下一步

完成 PostgreSQL 安装和配置后：

1. **启动后端**
   ```powershell
   cd server
   npm run dev
   ```

2. **启动前端**（新终端）
   ```powershell
   cd c:\Users\ASUS\Documents\React-1.0
   npm install
   npm run dev
   ```

3. **访问应用**
   - 前端：http://127.0.0.1:5173
   - 后端：http://localhost:3100

---

## 卸载 PostgreSQL（如需要）

如果需要卸载 PostgreSQL：

1. **停止服务**
   - 打开服务管理器
   - 停止 `postgresql-x64-16` 服务

2. **卸载程序**
   - 控制面板 > 程序和功能
   - 找到 PostgreSQL 16
   - 卸载

3. **删除数据目录**（可选）
   - 删除：`C:\Program Files\PostgreSQL\16\data`

**注意**：卸载会删除所有数据库数据！

---

## 技术支持

如遇到问题：

1. **PostgreSQL 官方文档**：https://www.postgresql.org/docs/
2. **pgAdmin 文档**：https://www.pgadmin.org/docs/
3. **Prisma 文档**：https://www.prisma.io/docs

---

祝安装顺利！
