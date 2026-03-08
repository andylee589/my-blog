import { NextRequest, NextResponse } from 'next/server'
import { savePost, getAllPosts } from '@/lib/posts'
import { savePostToGitHub, isGitHubConfigured } from '@/lib/github'

export async function GET() {
  try {
    const posts = getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, frontmatter, content } = body

    if (!slug || !frontmatter?.title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      )
    }

    // 判断是否配置了 GitHub
    if (isGitHubConfigured()) {
      // 使用 GitHub API 保存
      await savePostToGitHub({ slug, frontmatter, content })
      return NextResponse.json({
        success: true,
        message: 'Post saved to GitHub. It will be live after deployment.',
        mode: 'github'
      })
    } else {
      // 本地模式：直接写入文件系统
      await savePost(slug, frontmatter, content)
      return NextResponse.json({
        success: true,
        message: 'Post saved successfully',
        mode: 'local'
      })
    }
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: 'Failed to save post: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, frontmatter, content } = body

    if (!slug || !frontmatter?.title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      )
    }

    // 判断是否配置了 GitHub
    if (isGitHubConfigured()) {
      // 使用 GitHub API 更新
      await savePostToGitHub({ slug, frontmatter, content })
      return NextResponse.json({
        success: true,
        message: 'Post updated in GitHub. It will be live after deployment.',
        mode: 'github'
      })
    } else {
      // 本地模式
      await savePost(slug, frontmatter, content)
      return NextResponse.json({
        success: true,
        message: 'Post updated successfully',
        mode: 'local'
      })
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
