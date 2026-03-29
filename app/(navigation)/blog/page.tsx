import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.',
  openGraph: {
    title: 'Blog | Cristian Llanos',
    description:
      'Artículos sobre arquitectura de software, liderazgo técnico y buenas prácticas de desarrollo.',
  },
}
import BlogCard from '@/components/blog-card'

export default function BlogListPage() {
  const blogPosts = getBlogPosts()

  return (
    <div className="blog-list">
      <h1 className="blog-list__title">Blog</h1>
      <div className="blog-list__grid">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
