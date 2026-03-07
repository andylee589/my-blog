import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          jagger小站
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors pointer-events-auto"
            prefetch={true}
          >
            首页
          </Link>
          <Link
            href="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors pointer-events-auto"
            prefetch={true}
          >
            关于
          </Link>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
            title="RSS Feed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
