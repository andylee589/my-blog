import { Octokit } from '@octokit/rest'

// GitHub 配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER // 你的 GitHub 用户名
const GITHUB_REPO = process.env.GITHUB_REPO   // 仓库名，如 my-blog
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'

// 文章存储路径
const POSTS_PATH = 'content/posts'

export interface GitHubFile {
  slug: string
  content: string
  frontmatter: {
    title: string
    date: string
    excerpt?: string
    tags?: string[]
  }
}

/**
 * 获取文件的 SHA（用于更新文件）
 */
export async function getFileSha(slug: string): Promise<string | null> {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub configuration missing')
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const path = `${POSTS_PATH}/${slug}.mdx`

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH,
    })

    // 如果是文件，返回 SHA
    if ('sha' in data) {
      return data.sha
    }
    return null
  } catch (error: any) {
    // 文件不存在返回 null
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * 保存文章到 GitHub
 * 如果文件存在则更新，不存在则创建
 */
export async function savePostToGitHub({
  slug,
  frontmatter,
  content,
}: GitHubFile): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error(
      'Missing GitHub configuration. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.'
    )
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const path = `${POSTS_PATH}/${slug}.mdx`

  // 生成 MDX 文件内容
  const matter = require('gray-matter')
  const fileContent = matter.stringify(content, {
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt || '',
    tags: frontmatter.tags || [],
  })

  // 获取现有文件的 SHA（如果存在）
  const sha = await getFileSha(slug)

  // 提交到 GitHub
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message: sha ? `Update post: ${frontmatter.title}` : `Add new post: ${frontmatter.title}`,
    content: Buffer.from(fileContent).toString('base64'),
    sha: sha || undefined,
    branch: GITHUB_BRANCH,
  })

  console.log(`Post saved to GitHub: ${path}`)
}

/**
 * 从 GitHub 删除文章
 */
export async function deletePostFromGitHub(slug: string): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub configuration missing')
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const path = `${POSTS_PATH}/${slug}.mdx`

  // 获取文件 SHA
  const sha = await getFileSha(slug)
  if (!sha) {
    throw new Error('File not found')
  }

  // 删除文件
  await octokit.repos.deleteFile({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message: `Delete post: ${slug}`,
    sha,
    branch: GITHUB_BRANCH,
  })

  console.log(`Post deleted from GitHub: ${path}`)
}

/**
 * 检查是否配置了 GitHub
 */
export function isGitHubConfigured(): boolean {
  return !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO)
}

/**
 * 获取提交状态
 */
export async function getLatestCommit(): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub configuration missing')
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  const { data } = await octokit.repos.getCommit(
    {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: GITHUB_BRANCH,
    }
  )

  return data.sha
}
