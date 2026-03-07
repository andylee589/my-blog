import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const { default: MDXContent } = await import(
    `@/content/posts/${params.slug}.mdx`
  )

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time>
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose max-w-none">
        <MDXContent />
      </div>
    </article>
  )
}
