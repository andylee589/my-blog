export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} jagger小站. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
