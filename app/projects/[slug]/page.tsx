import { notFound } from 'next/navigation'
import { getProjectPosts, getProjectPost } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'

export async function generateStaticParams() {
  const posts = getProjectPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function ProjectPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getProjectPost(slug)
  if (!post) notFound()

  const bodyHtml = renderMarkdown(post.body || '')

  return (
    <article className="article">
      <header className="article__header">
        <h1 className="article__title">{post.title}</h1>
        {post.description && (
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
            {post.description}
          </p>
        )}
      </header>

      {post.cover && (
        <img className="article__cover" src={post.cover} alt={post.title} />
      )}

      <div className="article__body">
        <div className="content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>

      {post.gallery && (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {post.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              style={{ width: '100%', borderRadius: 'var(--border-radius)' }}
            />
          ))}
        </div>
      )}
    </article>
  )
}
