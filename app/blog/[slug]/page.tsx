import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'
import { longDate } from '@/lib/date-formats'
import DisqusComments from '@/components/disqus-comments'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cristianllanos.com'

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const imageUrl = `${SITE_URL}${post.image}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: { url: imageUrl, alt: post.title },
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const bodyHtml = renderMarkdown(post.body)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.image}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Cristian Llanos',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Cristian Llanos',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}/`,
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <article className="article">
      <img className="article__cover" src={post.image} alt={post.title} />

      <header className="article__header">
        <Link href="/blog" className="article__author">
          <img
            src="/img/avatar.jpg"
            alt="Cristian Llanos"
            className="article__author-avatar"
          />
          <div className="article__author-info">
            <span className="article__author-name">Cristian Llanos</span>
            {post.date && (
              <time className="article__date">{longDate(post.date)}</time>
            )}
          </div>
        </Link>
        <h1 className="article__title article__title--gradient">{post.title}</h1>
      </header>

      <div className="article__body">
        <div className="content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>

      <DisqusComments />
    </article>
    </>
  )
}
