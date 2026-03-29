import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { renderMarkdown } from '@/lib/markdown'
import { longDate } from '@/lib/date-formats'
import JsonLd from '@/components/json-ld'
import GiscusComments from '@/components/giscus-comments'

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

  const ogUrl = `${SITE_URL}${post.og ?? post.image}`

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Cristian Llanos'],
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: { url: ogUrl, alt: post.title },
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
    image: `${SITE_URL}${post.og ?? post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: AUTHOR,
    publisher: AUTHOR,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}/`,
    },
  }

  const breadcrumbs = breadcrumbList([
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog/' },
    { name: post.title, url: `/blog/${post.slug}/` },
  ])

  return (
    <>
    <JsonLd data={jsonLd} />
    <JsonLd data={breadcrumbs} />
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

      <GiscusComments />
    </article>
    </>
  )
}
