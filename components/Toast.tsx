'use client'

import { useEffect, useState } from 'react'

export interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'loading'
  duration?: number
  onClose?: (id: string) => void
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // 入场动画
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (duration && type !== 'loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval)
            handleClose()
            return 0
          }
          return prev - (100 / (duration / 100))
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [duration, type])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(id), 300)
  }

  const icons = {
    success: (
      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    loading: (
      <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
  }

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    loading: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  }

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-md ${bgColors[type]}`}
      >
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
        </div>
        {type !== 'loading' && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {type !== 'loading' && duration && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Toast 管理 Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (message: string, type: ToastProps['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const updateToast = (id: string, updates: Partial<Omit<ToastProps, 'id'>>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    // 便捷方法
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    loading: (message: string) => addToast(message, 'loading', 0),
  }
}

// Toast 容器组件
export function ToastContainer({ toasts, removeToast }: { toasts: ToastProps[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}
