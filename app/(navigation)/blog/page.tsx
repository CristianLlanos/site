import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'
import { breadcrumbList } from '@/lib/structured-data'
import BlogCard from '@/components/blog-card'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cristianllanos.com'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.',
  alternates: {
    canonical: `${SITE_URL}/blog/`,
  },
  openGraph: {
    title: 'Blog | Cristian Llanos',
    description:
      'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.',
    url: `${SITE_URL}/blog/`,
    images: [{ url: `${SITE_URL}/img/og/site-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Cristian Llanos',
    description:
      'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.',
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
    />
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
