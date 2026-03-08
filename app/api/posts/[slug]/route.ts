import { NextRequest, NextResponse } from 'next/server'
import { savePost, deletePost, getPostBySlug } from '@/lib/posts'
import { deletePostFromGitHub, isGitHubConfigured } from '@/lib/github'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const post = getPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const post = getPostBySlug(slug)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 判断是否配置了 GitHub
    if (isGitHubConfigured()) {
      // 使用 GitHub API 删除
      await deletePostFromGitHub(slug)
      return NextResponse.json({
        success: true,
        message: 'Post deleted from GitHub. It will be removed after deployment.',
        mode: 'github'
      })
    } else {
      // 本地模式
      await deletePost(slug)
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully',
        mode: 'local'
      })
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
