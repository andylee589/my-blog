'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DeployStatus } from '@/components/DeployStatus'
import { ToastContainer, useToast } from '@/components/Toast'

interface PostData {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  content?: string
}

type DeployState = 'idle' | 'submitting' | 'deploying' | 'completed' | 'error'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { toasts, removeToast, success, error, loading } = useToast()

  const [post, setPost] = useState<PostData>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    tags: [],
  })
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deployStatus, setDeployStatus] = useState<DeployState>('idle')
  const [deployMessage, setDeployMessage] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (slug) {
      fetch(`/api/posts/${slug}`)
        .then((res) => {
          if (!res.ok) {
            setNotFound(true)
            return null
          }
          return res.json()
        })
        .then((data) => {
          if (data) {
            setPost({
              slug: data.slug,
              title: data.title || '',
              date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              excerpt: data.excerpt || '',
              tags: data.tags || [],
            })
            setContent(data.content || '')
          }
        })
        .catch((err) => {
          console.error('Failed to load post:', err)
          setNotFound(true)
        })
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post.title || !content) {
      error('请填写标题和文章内容')
      return
    }

    setIsSubmitting(true)
    setDeployStatus('submitting')

    const toastId = loading('正在保存修改...')

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: post.slug,
          frontmatter: {
            title: post.title,
            date: post.date,
            excerpt: post.excerpt,
            tags: post.tags,
          },
          content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '保存失败')
      }

      removeToast(toastId)

      if (data.mode === 'github') {
        setDeployStatus('deploying')
        success('修改已提交到 GitHub，正在部署...', 3000)

        setTimeout(() => {
          setDeployStatus('completed')
          success('部署完成！', 5000)
        }, 3000)
      } else {
        success('修改保存成功！', 2000)
        setTimeout(() => {
          window.location.href = `/blog/${post.slug}`
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
    window.open(`/blog/${post.slug}`, '_blank')
    setDeployStatus('idle')
    setIsSubmitting(false)
  }

  const handleRetry = () => {
    setDeployStatus('idle')
    setIsSubmitting(false)
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            文章未找到
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            抱歉，找不到 slug 为 &quot;{slug}&quot; 的文章
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <DeployStatus
        isDeploying={isSubmitting}
        status={deployStatus}
        message={deployMessage}
        onViewSite={handleViewSite}
        onRetry={handleRetry}
      />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          ← 返回首页
        </Link>

        <Link
          href={`/blog/${post.slug}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          预览文章
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          编辑文章
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          修改 &quot;{post.title || slug}&quot; 的内容
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标题 *
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入文章标题"
          />
        </div>

        {/* Slug (只读) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章 Slug
          </label>
          <input
            type="text"
            value={post.slug}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Slug 不可修改
          </p>
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            发布日期 *
          </label>
          <input
            type="date"
            value={post.date}
            onChange={(e) => setPost({ ...post, date: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章摘要
          </label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            rows={3}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入文章摘要"
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            标签
          </label>
          <input
            type="text"
            value={post.tags?.join(', ') || ''}
            onChange={(e) => {
              const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
              setPost({ ...post, tags })
            }}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="标签1, 标签2, 标签3"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            多个标签请用逗号分隔
          </p>
        </div>

        {/* 内容 */}
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
            placeholder="请输入文章内容，支持 MDX 格式"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            支持 MDX 格式，可以在 Markdown 中使用 React 组件
          </p>
        </div>

        {/* 按钮 */}
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
                保存中...
              </>
            ) : (
              '保存修改'
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
