import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectPosts, getProjectPost } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'
import { breadcrumbList } from '@/lib/structured-data'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cristianllanos.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getProjectPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.cover && {
        images: [{ url: `${SITE_URL}${post.cover}`, alt: post.title }],
      }),
    },
  }
}

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

  const breadcrumbs = breadcrumbList([
    { name: 'Inicio', url: '/' },
    { name: 'Proyectos', url: '/projects/' },
    { name: post.title, url: `/projects/${post.slug}/` },
  ])

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
    />
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
    </>
  )
}
