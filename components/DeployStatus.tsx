'use client'

import { useEffect, useState } from 'react'

interface DeployStatusProps {
  isDeploying: boolean
  status: 'idle' | 'submitting' | 'deploying' | 'completed' | 'error'
  message?: string
  onViewSite?: () => void
  onRetry?: () => void
}

export function DeployStatus({
  isDeploying,
  status,
  message,
  onViewSite,
  onRetry,
}: DeployStatusProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (status === 'submitting' || status === 'deploying') {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [status])

  if (status === 'idle') return null

  const statusConfig = {
    submitting: {
      icon: (
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ),
      title: '正在提交到 GitHub',
      description: '文章正在保存到 GitHub 仓库' + dots,
      color: 'blue',
    },
    deploying: {
      icon: (
        <div className="relative">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        </div>
      ),
      title: 'Vercel 正在部署',
      description: '构建中，约需 1-2 分钟' + dots,
      color: 'orange',
    },
    completed: {
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '部署完成！',
      description: message || '文章已成功发布，可以访问网站查看了',
      color: 'green',
    },
    error: {
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '发布失败',
      description: message || '请检查网络连接或稍后重试',
      color: 'red',
    },
  }

  const config = statusConfig[status]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">{config.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {config.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {config.description}
            </p>
          </div>
        </div>

        {(status === 'submitting' || status === 'deploying') && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  status === 'submitting'
                    ? 'bg-blue-500 w-1/3'
                    : 'bg-orange-500 w-2/3 animate-pulse'
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>提交</span>
              <span>构建</span>
              <span>部署</span>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={onViewSite}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              查看文章
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              重试
            </button>
          </div>
        )}

        {status === 'deploying' && (
          <p className="mt-4 text-xs text-gray-500 text-center">
            提示：构建完成后会自动刷新页面
          </p>
        )}
      </div>
    </div>
  )
}
