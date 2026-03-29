import type { Metadata } from 'next'
import { getCreditsHtml } from '@/lib/content'
import { breadcrumbList } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Créditos',
  description:
    'Atribuciones a los proyectos Open Source que hacen posible este sitio.',
  openGraph: {
    title: 'Créditos | Cristian Llanos',
    description:
      'Atribuciones a los proyectos Open Source que hacen posible este sitio.',
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Créditos', url: '/credits/' },
])

export default function CreditsPage() {
  const credits = getCreditsHtml()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="page-content">
        <div className="content" dangerouslySetInnerHTML={{ __html: credits }} />
      </div>
    </>
  )
}
