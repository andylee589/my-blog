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

        <h2>特性</h2>
        <ul>
          <li>📝 支持 MDX 格式的博客文章</li>
          <li>🌙 亮色/暗色主题自动切换</li>
          <li>📱 响应式设计，适配各种设备</li>
          <li>🔖 文章标签分类</li>
          <li>📡 RSS 订阅支持</li>
          <li>⚡ 快速加载和优化的性能</li>
        </ul>

        <p className="mt-8">感谢你的访问！</p>
      </div>
    </div>
  )
}
