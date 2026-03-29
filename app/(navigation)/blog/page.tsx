import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { breadcrumbList } from '@/lib/structured-data'
import BlogCard from '@/components/blog-card'
import JsonLd from '@/components/json-ld'

const DESCRIPTION =
  'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.'

export const metadata: Metadata = {
  title: 'Blog',
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/blog/`,
  },
  openGraph: {
    title: 'Blog | Cristian Llanos',
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/`,
    images: [{ url: `${SITE_URL}/img/og/site-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Cristian Llanos',
    description: DESCRIPTION,
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Blog', url: '/blog/' },
])

export default function BlogListPage() {
  const blogPosts = getBlogPosts()

  return (
    <>
    <JsonLd data={breadcrumbs} />
    <div className="blog-list">
      <h1 className="blog-list__title">Blog</h1>
      <div className="blog-list__grid">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
    </>
  )
}
