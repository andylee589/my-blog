import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        tags: data.tags || [],
      }
    })

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function savePost(
  slug: string,
  frontmatter: {
    title: string
    date: string
    excerpt?: string
    tags?: string[]
  },
  content: string
): Promise<void> {
  try {
    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    // 使用 matter 生成 frontmatter
    const fileContents = matter.stringify(content, {
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt || '',
      tags: frontmatter.tags || [],
    })

    // 同步写入文件（更可靠）
    fs.writeFileSync(fullPath, fileContents, 'utf8')

    console.log(`Post saved successfully: ${fullPath}`)
  } catch (error) {
    console.error('Error in savePost:', error)
    throw error
  }
}

export async function deletePost(slug: string): Promise<void> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  await fs.promises.unlink(fullPath)
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    content,
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''))
}
