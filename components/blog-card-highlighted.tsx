import Link from 'next/link'
import { longDate } from '@/lib/date-formats'
import type { BlogPost } from '@/lib/types'

export default function BlogCardHighlighted({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card--featured">
      <img
        className="blog-card--featured__image"
        src={post.image}
        alt={post.title}
      />
      <div className="blog-card--featured__content">
        <h3 className="blog-card--featured__title">{post.title}</h3>
        <p className="blog-card--featured__description">{post.description}</p>
        <span className="blog-card--featured__date">{longDate(post.date)}</span>
      </div>
    </Link>
  )
}
