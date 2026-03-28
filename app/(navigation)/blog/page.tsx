import { getBlogPosts } from '@/lib/content'
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
