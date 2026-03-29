import type { MetadataRoute } from 'next'
import { getBlogPosts, getProjectPosts } from '@/lib/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cristianllanos.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/projects/`, changeFrequency: 'monthly', priority: 0.5 },
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

  return [...staticPages, ...blogPages, ...projectPages]
}
