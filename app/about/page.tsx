import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于',
  description: '关于 jagger小站 和作者介绍',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        关于我
      </h1>

      <div className="prose max-w-none">
        <p>
          你好！欢迎来到 <strong>jagger小站</strong>。
        </p>

        <h2>关于这个博客</h2>
        <p>
          这是一个使用 Next.js 构建的个人博客，在这里我会分享：
        </p>
        <ul>
          <li>技术学习笔记和心得</li>
          <li>有趣的项目和想法</li>
          <li>日常生活的点滴感悟</li>
        </ul>

        <h2>技术栈</h2>
        <p>本站使用以下技术构建：</p>
        <ul>
          <li><strong>Next.js 14</strong> - React 框架，使用 App Router</li>
          <li><strong>TypeScript</strong> - 类型安全的 JavaScript 超集</li>
          <li><strong>Tailwind CSS</strong> - 实用优先的 CSS 框架</li>
          <li><strong>MDX</strong> - Markdown + JSX，让写作更灵活</li>
          <li><strong>next-themes</strong> - 深色模式主题切换</li>
        </ul>

        <h2>发布架构</h2>
        <p>
          这个博客采用独特的<strong>Git-based 发布流程</strong>，实现了从编辑到部署的全自动化：
        </p>

        <h3>工作流程</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`在线编辑器撰写文章
    ↓
GitHub API 提交到仓库
    ↓
Vercel 自动检测变更
    ↓
自动构建 & 部署
    ↓
全球 CDN 加速访问`}
        </pre>

        <h3>核心组件</h3>
        <ul>
          <li>
            <strong>📝 在线编辑器</strong> - 直接在浏览器中编写 MDX 格式的文章，
            支持实时预览和元数据管理
          </li>
          <li>
            <strong>🔗 GitHub 集成</strong> - 通过 Octokit 将文章提交到 GitHub 仓库，
            天然支持版本控制和历史追溯
          </li>
          <li>
            <strong>🚀 Vercel 自动部署</strong> - 每次提交自动触发构建，
            支持增量更新和全球 CDN 分发
          </li>
          <li>
            <strong>📦 文件化存储</strong> - 文章以 MDX 文件形式存储，
            无需数据库，可移植性强
          </li>
        </ul>

        <h3>技术优势</h3>
        <ul>
          <li>✅ <strong>无数据库依赖</strong> - 纯文件系统，部署简单</li>
          <li>✅ <strong>版本控制</strong> - 所有变更都有 Git 历史记录</li>
          <li>✅ <strong>自动化</strong> - 写完后自动部署，无需手动操作</li>
          <li>✅ <strong>高性能</strong> - 静态生成 + CDN，访问速度快</li>
          <li>✅ <strong>低成本</strong> - 利用免费额度即可运行</li>
        </ul>

        <h2>特性</h2>
        <ul>
          <li>📝 支持 MDX 格式的博客文章</li>
          <li>🌙 亮色/暗色主题自动切换</li>
          <li>📱 响应式设计，适配各种设备</li>
          <li>🔖 文章标签分类</li>
          <li>📡 RSS 订阅支持</li>
          <li>⚡ 快速加载和优化的性能</li>
          <li>✏️ 在线编辑和发布</li>
          <li>🔄 自动部署流程</li>
        </ul>

        <p className="mt-8">感谢你的访问！</p>
      </div>
    </div>
  )
}
