## 贡献指南（维护规范）

### 开发环境

- Node.js：建议使用当前 LTS 或较新版本
- 包管理器：npm

### 分支与提交

- 分支建议：`main` + `feature/*` + `fix/*`
- 提交信息建议（中文即可）：
  - `feat: 增加学习卡片翻面`
  - `fix: 修复复习到期计算`
  - `chore: 更新依赖`
  - `docs: 补充接口文档`

### 提交前检查

前端（仓库根目录）：

```bash
npm run build
npm run lint
```

后端（`server/`）：

```bash
npm run build
```

若涉及数据库结构：

```bash
npm run prisma:migrate
```

### 代码风格

- 优先写清晰可读的代码；避免“过度抽象”。
- 不要提交包含真实密钥/账号的文件（例如生产数据库连接串）。

