import type { MetadataRoute } from 'next'
import { getBlogPosts, getProjectPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { guides, resources } from './(navigation)/projects/kotlin-container/guide-data'
import { BASE } from './(navigation)/projects/kotlin-container/constants'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/credits/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/projects/`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const kotlinContainerPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}${BASE}/`, changeFrequency: 'monthly', priority: 0.8 },
    ...[...guides, ...resources].map((g) => ({
      url: `${baseUrl}${g.href}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  const projectPages: MetadataRoute.Sitemap = getProjectPosts().map((post) => ({
    url: `${baseUrl}/projects/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...kotlinContainerPages, ...blogPages, ...projectPages]
}
