import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
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
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        ...data,
        body: content,
        slug: path.basename(file, '.md'),
      } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  const dir = path.join(contentDir, 'blog')
  const decoded = decodeURIComponent(slug)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const file = files.find((f) => {
    const name = path.basename(f, '.md')
    return name === slug || name === decoded
  })
  if (!file) return null

  const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...data,
    body: content,
    slug,
  } as BlogPost
}

export function getProjectPosts(): ProjectPost[] {
  const dir = path.join(contentDir, 'projects')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        ...data,
        body: content,
        slug: path.basename(file, '.md'),
      } as ProjectPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getProjectPost(slug: string): ProjectPost | null {
  const dir = path.join(contentDir, 'projects')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const file = files.find((f) => path.basename(f, '.md') === slug)
  if (!file) return null

  const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...data,
    body: content,
    slug,
  } as ProjectPost
}

export function getCreditsHtml(): string {
  const filePath = path.join(contentDir, 'site', 'credits.md')
  const markdown = fs.readFileSync(filePath, 'utf-8')
  return renderMarkdown(markdown)
}
