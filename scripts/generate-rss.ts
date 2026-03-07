import fs from 'fs'
import path from 'path'
import { generateRssFeed } from '../lib/rss'

const publicDir = path.join(process.cwd(), 'public')
const rssPath = path.join(publicDir, 'feed.xml')

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const rssFeed = generateRssFeed()
fs.writeFileSync(rssPath, rssFeed)

console.log('RSS feed generated at public/feed.xml')
