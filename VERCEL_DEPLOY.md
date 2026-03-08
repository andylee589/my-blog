# Vercel 自动部署配置指南

## 🎯 目标

配置 Vercel 自动部署，实现：
- 提交到 GitHub → Vercel 自动构建 → 网站自动更新

## 📋 前置条件

- ✅ 代码已推送到 GitHub
- ✅ GitHub 仓库：`andylee589/my-blog`
- ✅ 已有 Vercel 账号（可以用 GitHub 账号登录）

## 🚀 配置步骤

### 方法一：通过 Vercel Dashboard（推荐）

#### 1. 登录 Vercel

访问：https://vercel.com/login

- 点击 **"Continue with GitHub"**
- 授权 Vercel 访问你的 GitHub 仓库

#### 2. 导入项目

1. 登录后点击 **"Add New Project"**
2. 在 **"Import Git Repository"** 中找到 `andylee589/my-blog`
3. 点击 **"Import"**

#### 3. 配置项目

**Framework Preset**: 选择 `Next.js`

**Root Directory**: 保持默认 `./`

**Build Command**: 保持默认（Vercel 会自动检测）

#### 4. 配置环境变量（⚠️ 重要！）

点击 **"Environment Variables"** 展开，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_TOKEN` | `ghp_8EYp1...` | 你的 GitHub Token |
| `GITHUB_OWNER` | `andylee589` | GitHub 用户名 |
| `GITHUB_REPO` | `my-blog` | 仓库名 |
| `GITHUB_BRANCH` | `main` | 分支名 |

**添加方法**：
- 依次填入 `Name` 和 `Value`
- 点击 **"Add"**
- 四个变量都添加完成后，点击 **"Deploy"**

#### 5. 等待部署

Vercel 会自动：
1. 克隆仓库
2. 安装依赖
3. 构建项目
4. 部署到全球 CDN

大约需要 1-3 分钟。

#### 6. 查看部署结果

部署成功后：
- **Production URL**: `https://my-blog-xxx.vercel.app`（自动生成）
- 可以绑定自定义域名

---

### 方法二：通过 Vercel CLI

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

按提示使用 GitHub 账号登录。

#### 3. 在项目目录中初始化

```bash
cd /Users/liyuejia/Desktop/claudeProject/my-blog
vercel
```

按提示操作：
- Set up and deploy? **Y**
- Link to existing project? **N**（首次部署）
- Project name: **my-blog**（或你喜欢的名字）
- Directory: **./**（默认）

#### 4. 设置环境变量

```bash
vercel env add GITHUB_TOKEN
# 输入你的 Token

vercel env add GITHUB_OWNER
# 输入 andylee589

vercel env add GITHUB_REPO
# 输入 my-blog

vercel env add GITHUB_BRANCH
# 输入 main
```

#### 5. 重新部署

```bash
vercel --prod
```

---

## 📝 验证自动部署

### 测试 1：检查初始部署

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 点击你的项目
3. 点击 **"Deployments"**
4. 应该看到成功的部署记录

### 测试 2：测试自动更新

1. 在本地编辑器中新建一篇文章
2. 发布后等待 GitHub 提交成功
3. 观察 Vercel Dashboard：
   - 应该出现新的 **Build**
   - 状态从 **Building** → **Ready**
4. 部署完成后，访问网站查看新文章

---

## 🎨 自定义域名（可选）

1. 在 Vercel Dashboard 中点击项目
2. 点击 **"Settings"** → **"Domains"**
3. 输入你的域名，如 `blog.andylee589.com`
4. 按提示配置 DNS

---

## 🔧 常见问题

### 问题 1：构建失败

**现象**：部署状态显示 **Error**

**解决**：
1. 点击部署记录查看 **Build Logs**
2. 常见原因：
   - 缺少环境变量 → 在 Settings → Environment Variables 中添加
   - 依赖安装失败 → 检查 package.json
   - TypeScript 错误 → 本地先运行 `npm run build` 排查

### 问题 2：文章发布后网站没更新

**现象**：GitHub 已提交，但网站内容没变

**解决**：
1. 检查 Vercel Dashboard 是否有新的 Build
2. 检查 Build 是否成功
3. 如果 Build 被跳过，可能是因为没有文件变化
4. 强制重新部署：
   - 在项目页面点击 **"Redeploy"**

### 问题 3：本地编辑正常，远程保存失败

**现象**：远程部署后无法保存文章

**解决**：
1. 检查环境变量是否正确设置
2. 检查 GitHub Token 是否过期
3. 查看 Vercel Functions Logs：
   - Dashboard → 项目 → Functions → 查看日志

---

## 📊 部署流程图

```
用户编辑文章
    ↓
点击"发布文章"
    ↓
提交到 GitHub (通过 API)
    ↓
Vercel 检测到新提交
    ↓
自动触发 Build
    ↓
构建完成，网站更新
    ↓
用户访问看到新文章！
```

---

## ✅ 部署检查清单

- [ ] Vercel 项目已创建
- [ ] 环境变量已配置（GITHUB_TOKEN 等）
- [ ] 初始部署成功
- [ ] 测试发布一篇文章
- [ ] 确认 Vercel 自动构建
- [ ] 确认网站显示新文章

完成以上步骤后，你的博客就完整配置好了！🎉
