import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'
import { breadcrumbList } from '@/lib/structured-data'
import JsonLd from '@/components/json-ld'

const DESCRIPTION =
  'Charlas y presentaciones técnicas de Cristian Llanos — IA, arquitectura y diseño de software.'

export const metadata: Metadata = {
  title: 'Slides',
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/slides/`,
  },
  openGraph: {
    title: 'Slides | Cristian Llanos',
    description: DESCRIPTION,
    url: `${SITE_URL}/slides/`,
    images: [{ url: `${SITE_URL}/img/og/site-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slides | Cristian Llanos',
    description: DESCRIPTION,
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Slides', url: '/slides/' },
])

const talks = [
  {
    slug: 'decisiones-conscientes',
    title: 'Decisiones conscientes',
    description:
      'Diseñar con IA antes de escribir código — el método /spec en vivo: discovery, tradeoffs y captura de decisiones.',
    event: 'charla técnica',
  },
]

export default function SlidesListPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <div className="projects-list">
        <h1 className="projects-list__title">Slides</h1>
        {talks.map((talk) => (
          <Link key={talk.slug} href={`/slides/${talk.slug}`} className="project-item">
            <h3 className="project-item__title">{talk.title}</h3>
            <div>
              <span className="project-item__badge">{talk.event}</span>
              <span className="project-item__description">{talk.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
