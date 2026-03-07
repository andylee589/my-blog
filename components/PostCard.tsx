import Link from 'next/link'
import { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {post.title}
        </h2>
      </Link>

      <time className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(post.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>

      {post.excerpt && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
