import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SITE_URL = 'https://cristianllanos.com'
const contentDir = path.join(process.cwd(), 'content', 'blog')
const outputPath = path.join(process.cwd(), 'public', 'feed.xml')

const posts = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(contentDir, f), 'utf-8'))
    return { ...data, slug: path.basename(f, '.md') } as {
      title: string
      date: string
      description: string
      slug: string
    }
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const items = posts
  .map(
    (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid>${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
  )
  .join('')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cristian Llanos</title>
    <link>${SITE_URL}</link>
    <description>Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas</description>
    <language>es-PE</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

fs.writeFileSync(outputPath, rss)
console.log('RSS feed generated at public/feed.xml')
