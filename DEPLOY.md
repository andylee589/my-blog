# Git 方案远程部署指南

## 🎯 方案简介

通过 GitHub API 提交文章到仓库，利用 Vercel 的自动部署功能，实现远程编辑和发布博客。

## 📊 工作流程

```
用户编辑文章
    ↓
调用 GitHub API 提交到仓库
    ↓
Vercel 自动检测提交
    ↓
自动构建和部署
    ↓
新文章上线！
```

## 🚀 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 登录 GitHub
2. 访问 https://github.com/settings/tokens
3. 点击 **"Generate new token"** → **"Generate new token (classic)"**
4. 填写 Note：如 "My Blog Token"
5. 选择过期时间：建议 90 天或更短
6. **勾选权限**：
   - ✅ **repo** - 完全控制私有仓库
   - ✅ **read:org** - 读取组织信息（如果使用组织仓库）
7. 点击 **Generate token**
8. **立即复制 Token**（只显示一次！）

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑文件，填入你的信息
```

编辑 `.env.local`：

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=你的GitHub用户名
GITHUB_REPO=你的仓库名
GITHUB_BRANCH=main
```

**示例**：

```env
GITHUB_TOKEN=ghp_1234567890abcdef1234567890abcdef12345678
GITHUB_OWNER=jagger
GITHUB_REPO=my-blog
GITHUB_BRANCH=main
```

### 3. 安装依赖

```bash
npm install
```

或

```bash
yarn install
```

### 4. 本地测试

```bash
npm run dev
```

访问 http://localhost:3000/editor 测试发布文章。

如果配置了 GitHub Token，文章会提交到 GitHub；否则保存到本地文件。

### 5. 部署到 Vercel

#### 方式一：通过 Vercel Dashboard

1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 在 **Environment Variables** 中添加：
   - `GITHUB_TOKEN` = 你的 Token
   - `GITHUB_OWNER` = 你的用户名
   - `GITHUB_REPO` = 仓库名
   - `GITHUB_BRANCH` = main
4. 点击 **Deploy**

#### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

部署时会提示输入环境变量，或者在 `vercel.json` 中配置。

## 📝 使用方法

### 发布新文章

1. 访问你的博客网站（如 https://my-blog.vercel.app）
2. 点击 **"新建文章"**
3. 填写文章信息
4. 点击 **"发布文章"**
5. 看到成功提示后，等待 1-2 分钟
6. 刷新首页，新文章就会出现！

### 编辑文章

1. 在首页点击文章卡片上的编辑图标
2. 修改内容
3. 点击 **"保存修改"**
4. 等待部署完成

### 删除文章

1. 在文章详情页添加删除按钮（需要你自己实现前端界面）
2. 调用 DELETE API
3. 等待部署完成

## ⚠️ 注意事项

### 1. Token 安全

- **不要将 Token 提交到 Git 仓库！**
- `.env.local` 已添加到 `.gitignore`
- 如果 Token 泄露，立即在 GitHub 上撤销并重新生成

### 2. 部署时间

- GitHub 提交几乎是即时的
- Vercel 构建需要 30-120 秒
- 可以使用 Vercel Dashboard 查看构建进度

### 3. 冲突处理

如果多人同时编辑，可能会产生 Git 冲突。目前简单处理方式是后提交的覆盖先提交的。

### 4. 本地开发 vs 远程

| 环境 | 存储方式 | 说明 |
|------|---------|------|
| 本地开发 | 文件系统 | 直接写入 `content/posts/` 目录 |
| 远程部署 | GitHub API | 提交到 GitHub，触发 Vercel 部署 |

系统会自动检测是否配置了 `GITHUB_TOKEN`：
- 配置了 → 使用 GitHub API
- 未配置 → 使用本地文件系统

## 🔧 故障排除

### 问题：保存时提示 "GitHub configuration missing"

**解决**：
1. 检查 `.env.local` 文件是否存在
2. 确认四个环境变量都已填写
3. 重启开发服务器

### 问题：保存时提示 "Bad credentials"

**解决**：
1. Token 已过期，需要重新生成
2. Token 权限不足，确保勾选了 "repo"

### 问题：保存成功但文章没有显示

**解决**：
1. 检查 GitHub 仓库是否有新的提交
2. 查看 Vercel Dashboard 的构建日志
3. 等待 1-2 分钟后刷新页面

### 问题：Vercel 构建失败

**解决**：
1. 访问 Vercel Dashboard → 你的项目 → Deployments
2. 查看最新部署的错误日志
3. 常见原因：
   - 缺少依赖：`npm install` 未执行
   - TypeScript 错误
   - 环境变量未设置

## 🎨 进阶配置

### 自定义提交信息

修改 `lib/github.ts` 中的 `message`：

```typescript
await octokit.repos.createOrUpdateFileContents({
  // ...
  message: `📝 ${frontmatter.title} by ${author}`,
  // ...
})
```

### 添加到指定分支

修改环境变量：

```env
GITHUB_BRANCH=content-updates
```

然后在 Vercel 设置中配置部署分支。

### 使用 GitHub Actions 预处理

可以在 `.github/workflows/` 中添加预处理流程，如：
- 图片压缩
- Markdown 格式化
- 自动生成摘要

## 📚 相关链接

- [GitHub Personal Access Token](https://github.com/settings/tokens)
- [Octokit.js 文档](https://github.com/octokit/octokit.js)
- [Vercel 环境变量](https://vercel.com/docs/concepts/projects/environment-variables)

---

有问题？随时询问！🚀
