import fs from 'fs'
import path from 'path'
import { renderMarkdown } from './markdown'
import type { BlogPost, ProjectPost, SiteInfo } from './types'

const contentDir = path.join(process.cwd(), 'content')

export function getSiteInfo(): SiteInfo {
  const filePath = path.join(contentDir, 'site', 'info.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(contentDir, 'blog')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      data.slug = path.basename(file, '.json')
      return data as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  const dir = path.join(contentDir, 'blog')
  const decoded = decodeURIComponent(slug)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
  const file = files.find((f) => {
    const name = path.basename(f, '.json')
    return name === slug || name === decoded
  })
  if (!file) return null

  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
  data.slug = slug
  return data as BlogPost
}

export function getProjectPosts(): ProjectPost[] {
  const dir = path.join(contentDir, 'projects')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      data.slug = path.basename(file, '.json')
      return data as ProjectPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getProjectPost(slug: string): ProjectPost | null {
  const dir = path.join(contentDir, 'projects')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
  const file = files.find((f) => path.basename(f, '.json') === slug)
  if (!file) return null

  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
  data.slug = slug
  return data as ProjectPost
}

export function getCreditsHtml(): string {
  const filePath = path.join(contentDir, 'site', 'credits.md')
  const markdown = fs.readFileSync(filePath, 'utf-8')
  return renderMarkdown(markdown)
}
