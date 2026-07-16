import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { SITE_URL } from '@/lib/constants'
import { breadcrumbList } from '@/lib/structured-data'
import { formatEventDate } from '@/lib/date-formats'
import { events } from '@/lib/events'

const PAGE_TITLE = 'Eventos'
const PAGE_DESCRIPTION =
  'Eventos de baile organizados por Cristian Llanos en Lima: sociales de bachata y zouk, clases incluidas y buena música.'
/* The newest event's OG doubles as the index OG. */
const OG_IMAGE = `${SITE_URL}${events[0].ogImage}`

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/eventos/`,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/eventos/`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: { url: OG_IMAGE, alt: PAGE_TITLE },
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Eventos', url: '/eventos/' },
])

export default function EventosPage() {
  return (
    <main className="eventos-index">
      <JsonLd data={breadcrumbs} />
      <h1 className="eventos-index__title">Eventos</h1>
      <div className="eventos-index__list">
        {events.map((event) => (
          <Link key={event.slug} href={event.path} className="eventos-index__card">
            <span className="eventos-index__card-date">
              {formatEventDate(event.startDate)} · {event.doorsLabel}
            </span>
            <h2 className="eventos-index__card-title">{event.name}</h2>
            <p className="eventos-index__card-venue">
              {event.venue.name} · {event.venue.locality}
            </p>
            <span className="eventos-index__card-price">
              Entradas desde S/ {event.presalePrice}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
