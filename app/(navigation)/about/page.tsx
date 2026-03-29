import type { Metadata } from 'next'
import { getCreditsHtml } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Acerca de',
  description:
    'Sobre Cristian Llanos — Engineering Lead con más de 10 años construyendo plataformas que sirven a millones de usuarios.',
  openGraph: {
    title: 'Acerca de | Cristian Llanos',
    description:
      'Sobre Cristian Llanos — Engineering Lead con más de 10 años construyendo plataformas que sirven a millones de usuarios.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cristian Llanos',
  url: 'https://cristianllanos.com',
  jobTitle: 'Engineering Lead',
  sameAs: [
    'https://x.com/cris_decode',
    'https://github.com/CristianLlanos',
    'https://www.linkedin.com/in/cristian-llanos/',
  ],
}

export default function AboutPage() {
  const about = getCreditsHtml()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-content">
        <div className="content" dangerouslySetInnerHTML={{ __html: about }} />
      </div>
    </>
  )
}
