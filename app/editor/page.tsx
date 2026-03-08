'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DeployStatus } from '@/components/DeployStatus'
import { ToastContainer, useToast } from '@/components/Toast'

interface PostForm {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string
}

type DeployState = 'idle' | 'submitting' | 'deploying' | 'completed' | 'error'

export default function NewPostPage() {
  const router = useRouter()
  const { toasts, addToast, removeToast, success, error, loading } = useToast()

  const [form, setForm] = useState<PostForm>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    tags: '',
  })
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deployStatus, setDeployStatus] = useState<DeployState>('idle')
  const [deployMessage, setDeployMessage] = useState('')
  const [savedSlug, setSavedSlug] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.slug || !content) {
      error('请填写标题、Slug 和文章内容')
      return
    }

    setIsSubmitting(true)
    setDeployStatus('submitting')
    setSavedSlug(form.slug)

    const toastId = loading('正在提交文章...')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug,
          frontmatter: {
            title: form.title,
            date: form.date,
            excerpt: form.excerpt,
            tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          },
          content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '保存失败')
      }

      // 移除 loading toast
      removeToast(toastId)

      // 判断保存模式
      if (data.mode === 'github') {
        // GitHub 模式：显示部署状态
        setDeployStatus('deploying')
        success('文章已提交到 GitHub，正在部署...', 3000)

        // 模拟部署完成（实际可以轮询检查部署状态）
        setTimeout(() => {
          setDeployStatus('completed')
          success('部署完成！', 5000)
        }, 3000)
      } else {
        // 本地模式：直接跳转
        success('文章发布成功！', 2000)
        setTimeout(() => {
          window.location.href = `/blog/${form.slug}`
        }, 1000)
      }
    } catch (err) {
      console.error('Save error:', err)
      removeToast(toastId)
      setDeployStatus('error')
      setDeployMessage(err instanceof Error ? err.message : '保存失败，请重试')
      error(err instanceof Error ? err.message : '保存失败，请重试')
      setIsSubmitting(false)
    }
  }

  const handleViewSite = () => {
    window.open(`/blog/${savedSlug}`, '_blank')
    setDeployStatus('idle')
    setIsSubmitting(false)
    // 重置表单
    setForm({
      slug: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      tags: '',
    })
    setContent('')
  }

  const handleRetry = () => {
    setDeployStatus('idle')
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <DeployStatus
        isDeploying={isSubmitting}
        status={deployStatus}
        message={deployMessage}
        onViewSite={handleViewSite}
        onRetry={handleRetry}
      />

      <div className="mb-6">
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          发布新文章
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          创建一篇新的博客文章
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标题 *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入文章标题"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章 Slug *
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/g, '') })}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="article-slug"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Slug 将用于 URL，只能包含小写字母、数字和连字符
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            发布日期 *
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章摘要
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入文章摘要"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            标签
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="标签1, 标签2, 标签3"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            多个标签请用逗号分隔
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章内容 *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="# 文章标题

这里是文章内容，支持 Markdown 语法。

## 小标题

- 列表项 1
- 列表项 2

```javascript
// 代码块
console.log('Hello World');
```"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            支持 MDX 格式，可以在 Markdown 中使用 React 组件
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                发布中...
              </>
            ) : (
              '发布文章'
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors font-medium"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
