import { Feed } from 'feed'
import { getAllPosts } from './posts'

export function generateRssFeed(): string {
  const siteUrl = process.env.SITE_URL || 'https://jagger-blog.vercel.app'
  const posts = getAllPosts()

  const feed = new Feed({
    title: 'jagger小站',
    description: 'jagger的个人博客，分享技术与生活',
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, jagger`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
    author: {
      name: 'jagger',
      link: siteUrl,
    },
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.excerpt,
      date: new Date(post.date),
    })
  })

  return feed.rss2()
}
