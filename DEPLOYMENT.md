# WordCards 部署指南

## 部署架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   前端 (Vite)   │────▶│  后端 (NestJS)  │────▶│  PostgreSQL     │
│   静态文件托管   │     │   API 服务      │     │   数据库        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 方案一：Vercel + Railway（推荐，最简单）

### 0. 前置准备

确保您的代码已提交到 Git：
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

### 1. 创建 Railway 项目并添加数据库（已完成）

您已经完成了这一步！数据库已创建，连接字符串为：
```
postgresql://postgres:mnsFSAmpoHaZEnfZTyQvbGuyPhvDzySU@postgres.railway.internal:5432/railway
```

### 2. 部署后端服务到 Railway

**方法 A：使用 Railway 网页界面（推荐）**

1. 访问 https://railway.com/dashboard
2. 点击 "New Project" 或在现有项目中
3. 选择 "Deploy from GitHub repo"
4. 连接您的 GitHub 账户并选择该仓库
5. 配置部署：
   - **Root Directory**: 留空（项目根目录）
   - **Build Command**: `cd server && npm install && npm run build && npx prisma generate`
   - **Start Command**: `cd server && npm start`
6. 在 "Variables" 部分添加环境变量：
   - `DATABASE_URL`: `postgresql://postgres:mnsFSAmpoHaZEnfZTyQvbGuyPhvDzySU@postgres.railway.internal:5432/railway`
   - `PORT`: `3100`
   - `NODE_ENV`: `production`
7. 点击 "Deploy" 开始部署

**方法 B：使用 Railway CLI**

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录 Railway
railway login

# 3. 在项目根目录初始化
railway init

# 4. 链接到已有的数据库服务
# 在网页界面中，将数据库添加到同一项目中

# 5. 设置环境变量
railway variables set DATABASE_URL="postgresql://postgres:mnsFSAmpoHaZEnfZTyQvbGuyPhvDzySU@postgres.railway.internal:5432/railway"
railway variables set PORT=3100
railway variables set NODE_ENV=production

# 6. 部署
railway up
```

### 3. 数据库初始化

部署成功后，需要运行数据库迁移和种子数据：

**方法 A：使用 Railway CLI 运行命令**
```bash
# 连接到部署的服务
railway run cd server && npx prisma migrate deploy
railway run cd server && npm run db:seed
```

**方法 B：在本地使用远程数据库运行**
```bash
# 创建 .env 文件
cd server
echo "DATABASE_URL=postgresql://postgres:mnsFSAmpoHaZEnfZTyQvbGuyPhvDzySU@postgres.railway.internal:5432/railway" > .env

# 运行迁移和种子数据
npx prisma migrate deploy
npm run db:seed
```

### 2. 部署前端到 Vercel

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 在项目根目录执行
vercel

# 3. 设置环境变量（在 Vercel 控制台）
# VITE_API_URL=https://your-railway-app.railway.app
```

### 3. 修改前端 API 地址

创建 `.env.production` 文件：
```env
VITE_API_URL=https://your-railway-app.railway.app
```

修改 `src/lib/api.ts`：
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100'
```

---

## 方案二：云服务器部署（阿里云/腾讯云）

### 1. 准备服务器

```bash
# 购买服务器后，安装 Node.js 和 PostgreSQL
# Ubuntu/Debian 示例：

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 安装 PM2（进程管理）
sudo npm install -g pm2
```

### 2. 配置 PostgreSQL

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE wordcards;
CREATE USER wordcards WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wordcards TO wordcards;
ALTER DATABASE wordcards OWNER TO wordcards;
\q
```

### 3. 部署后端

```bash
# 上传代码到服务器（使用 git clone 或 scp）
git clone <your-repo> /var/www/wordcards
cd /var/www/wordcards/server

# 安装依赖
npm ci --production

# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 导入种子数据
npm run db:seed

# 创建 .env 文件
cat > .env << EOF
DATABASE_URL="postgresql://wordcards:your_secure_password@localhost:5432/wordcards?schema=public"
PORT=3100
NODE_ENV=production
EOF

# 使用 PM2 启动
pm2 start npm --name "wordcards-api" -- start
pm2 save
pm2 startup
```

### 4. 部署前端

```bash
cd /var/www/wordcards

# 创建 .env.production
cat > .env.production << EOF
VITE_API_URL=http://your-server-ip:3100
EOF

# 安装依赖并构建
npm ci
npm run build

# 使用 Nginx 托管静态文件
sudo apt-get install -y nginx

# 配置 Nginx
sudo nano /etc/nginx/sites-available/wordcards
```

Nginx 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/wordcards/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/wordcards /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 方案三：Docker 部署

### 1. 创建 Dockerfile（后端）

在 `server/Dockerfile`：
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY prisma ./prisma/
RUN npx prisma generate

COPY dist ./dist/

EXPOSE 3100

CMD ["node", "dist/main.js"]
```

### 2. 创建 docker-compose.yml

在项目根目录：
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: wordcards
      POSTGRES_USER: wordcards
      POSTGRES_PASSWORD: wordcards_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: ./server
    environment:
      DATABASE_URL: postgresql://wordcards:wordcards_secure_password@db:5432/wordcards
      PORT: 3100
      NODE_ENV: production
    ports:
      - "3100:3100"
    depends_on:
      - db

  frontend:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  postgres_data:
```

### 3. 构建和部署

```bash
# 构建前端
npm run build

# 构建后端
cd server
npm run build

# 启动所有服务
docker-compose up -d

# 初始化数据库
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npm run db:seed
```

---

## 方案四：免费部署（适合测试）

### 使用 Render.com（完全免费）

1. **后端部署**：
   - 访问 https://render.com
   - 创建新的 Web Service
   - 连接 GitHub 仓库
   - 设置：
     - Build Command: `cd server && npm install && npm run build && npx prisma generate`
     - Start Command: `cd server && npm start`
   - 添加 PostgreSQL 数据库

2. **前端部署**：
   - 创建新的 Static Site
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - 设置环境变量 `VITE_API_URL`

---

## 部署检查清单

- [ ] 后端 API 正常运行（访问 /api/health）
- [ ] 数据库连接正常
- [ ] 前端静态文件可访问
- [ ] API 跨域配置正确
- [ ] 环境变量配置正确
- [ ] HTTPS 配置（生产环境推荐）

---

## 常见问题

### 1. 跨域问题

在后端添加 CORS 配置：
```typescript
// server/src/main.ts
app.enableCors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true,
})
```

### 2. 数据库连接失败

检查：
- DATABASE_URL 格式是否正确
- 数据库服务是否运行
- 防火墙是否开放端口

### 3. 前端 404 错误

确保 Nginx/Vercel 配置了 SPA 路由回退：
```nginx
try_files $uri $uri/ /index.html;
```
