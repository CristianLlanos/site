import type { MetadataRoute } from 'next'
import { getBlogPosts, getProjectPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/projects/`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const kotlinContainerPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/projects/kotlin-container/`, changeFrequency: 'monthly', priority: 0.8, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/guide/`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/bindings/`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/scopes/`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/providers/`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/advanced/`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/api/`, changeFrequency: 'monthly', priority: 0.6, lastModified: new Date('2026-03-29') },
    { url: `${baseUrl}/projects/kotlin-container/changelog/`, changeFrequency: 'weekly', priority: 0.6, lastModified: new Date('2026-03-29') },
  ]

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  const projectPages: MetadataRoute.Sitemap = getProjectPosts().map((post) => ({
    url: `${baseUrl}/projects/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  return [...staticPages, ...kotlinContainerPages, ...blogPages, ...projectPages]
}
