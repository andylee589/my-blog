import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          欢迎来到 jagger小站
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          分享技术心得、学习笔记和生活感悟
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          最新文章
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            暂无文章，敬请期待...
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
