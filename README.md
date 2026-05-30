# my-blog

基于 **Next.js 14 (App Router)** 搭建的个人博客，支持 MDX 写作、亮/暗主题切换和 RSS 订阅。

## ✨ 特性

- **MDX 文章** —— 在 Markdown 中直接使用 React 组件
- **亮 / 暗主题** —— 基于 [`next-themes`](https://github.com/pacocoursey/next-themes) 的主题切换
- **RSS 订阅** —— 构建时自动生成 `public/feed.xml`
- **响应式设计** —— 使用 Tailwind CSS，适配移动端
- **双模式内容管理** —— 本地读写 `content/posts/`，或通过 GitHub API 远程管理

## 🛠 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14.2（App Router）|
| 语言 | TypeScript（严格模式）|
| 样式 | Tailwind CSS 3.4 |
| 内容 | MDX + gray-matter |
| 主题 | next-themes |
| RSS | feed |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev
```

## 📜 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生成 RSS 并构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |
| `npm run generate-rss` | 单独生成 RSS feed |

## ✍️ 写文章

在 `content/posts/` 下新建 `.mdx` 文件，并包含如下 frontmatter：

```yaml
---
title: "文章标题"
date: "2024-01-01"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
---
```

## ⚙️ 环境变量（可选）

远程内容管理（通过 GitHub API 读写文章）需要配置以下变量，本地开发可不配置。
参考 [`.env.example`](.env.example)：

```bash
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_BRANCH=main
```

## 📁 项目结构

```
app/              # App Router 页面与布局
components/       # React 组件
content/posts/    # MDX 文章
lib/              # 文章读写、GitHub API、RSS 等工具
scripts/          # 构建脚本（如 RSS 生成）
public/           # 静态资源（含生成的 feed.xml）
```

## 🚢 部署

部署到 Vercel，详见 [`VERCEL_DEPLOY.md`](VERCEL_DEPLOY.md) 与 [`DEPLOY.md`](DEPLOY.md)。
