import Link from 'next/link'
import { longDate } from '@/lib/date-formats'
import type { BlogPost } from '@/lib/types'

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <h3 className="blog-card__title">{post.title}</h3>
      <p className="blog-card__description">{post.description}</p>
      <span className="blog-card__date">{longDate(post.date)}</span>
    </Link>
  )
}
