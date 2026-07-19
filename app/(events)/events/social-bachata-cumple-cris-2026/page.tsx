import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { cumpleCris2026 as event, presaleTotal, CUMPLE_CRIS_ASSETS as assets } from '@/lib/events'
import JsonLd from '@/components/json-ld'
import ScrollReveal from '@/components/events/ScrollReveal'
import DeadlineGate from '@/components/events/DeadlineGate'
import TicketForm from '@/components/events/TicketForm'

const PAGE_URL = `${SITE_URL}${event.path}/`
const OG_IMAGE = `${SITE_URL}${event.ogImage}`
const PAGE_TITLE = 'Social de Bachata · Cumple de Cris — Mié 5 de agosto'
const PAGE_DESCRIPTION =
  'Social de bachata por el cumple de Cris: miércoles 5 de agosto, 8:30 pm, Centro de Convenciones Javier Prado (tercer piso), La Victoria. Clase de Zouk con Cris + Xio 9:00 pm incluida. Preventa online S/ 15.'

const WHATSAPP_URL = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(
  'Hola Cris, tengo una duda sobre el Social de Bachata del 5 de agosto 🙂'
)}`

const RESERVA_URL = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(
  'Hola Cris, quiero reservar un box o una mesa para el Social de Bachata del 5 de agosto 🙌'
)}`

/* Intrinsic sizes of the processed images (CLS reservation). */
const XIO_CUTOUT = { width: 390, height: 804 }
const CROQUIS = { width: 900, height: 822 }

/* Order and times mirror the official flyer. */
const TIMELINE = [
  { time: '8:30 pm', label: 'Puertas + social' },
  { time: '9:00 pm', label: `Clase de Zouk · ${event.instructor}` },
  { time: '1:00 am', label: '¡Cantamos el cumple! 🎂' },
]

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: event.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: { url: OG_IMAGE, alt: event.name },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DanceEvent',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  inLanguage: 'es-PE',
  image: OG_IMAGE,
  url: PAGE_URL,
  location: {
    '@type': 'Place',
    name: event.venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: event.venue.streetAddress,
      addressLocality: event.venue.locality,
      addressRegion: event.venue.region,
      addressCountry: event.venue.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: event.venue.latitude,
      longitude: event.venue.longitude,
    },
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Preventa online',
      price: String(event.presalePrice),
      priceCurrency: 'PEN',
      availability: 'https://schema.org/InStock',
      validThrough: event.presaleDeadline,
      url: PAGE_URL,
    },
    {
      '@type': 'Offer',
      name: 'En puerta',
      price: String(event.doorPrice),
      priceCurrency: 'PEN',
      availability: 'https://schema.org/InStock',
      url: PAGE_URL,
    },
  ],
  performer: [
    { '@type': 'Person', name: event.dj },
    { '@type': 'Person', name: 'Xio' },
  ],
  organizer: [AUTHOR, { '@type': 'Organization', name: 'Bachata Club Lima-Perú' }],
}

const breadcrumbs = breadcrumbList([
  { name: 'Eventos', url: '/events/' },
  { name: event.name, url: `${event.path}/` },
])

export default function CumpleCrisPage() {
  return (
    <main className="evento evento--cumple-cris">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="evento__hero">
        <div className="evento__hero-bg" aria-hidden="true" />
        <div className="evento__hero-figure" aria-hidden="true">
          <picture>
            <source srcSet={assets.crisCutoutWebp} type="image/webp" />
            <img src={assets.crisCutoutPng} alt="" loading="eager" />
          </picture>
        </div>
        <div className="evento__hero-content">
          <p className="evento__hero-badge">MIÉ 05 AGO · 8:30 PM</p>
          <h1 className="evento__hero-title">
            <span className="evento__hero-title-line">Social de Bachata</span>
            <span className="evento__hero-title-line evento__hero-title-line--gradient">
              <span className="evento__hero-cake">🎂</span> Cumple de Cris
            </span>
          </h1>
          <p className="evento__hero-subtitle">Clase de Zouk 9:00 PM incluida</p>
          <div className="evento__hero-actions">
            <DeadlineGate
              deadline={event.presaleDeadline}
              fallback={
                <a href="#entradas" className="evento__cta evento__cta--primary">
                  Entradas en puerta — S/ {event.doorPrice}
                </a>
              }
            >
              <a href="#entradas" className="evento__cta evento__cta--primary">
                Compra tu entrada — S/ {event.presalePrice}
              </a>
            </DeadlineGate>
            <a href={event.icsPath} className="evento__cta evento__cta--ghost">
              + Calendario
            </a>
          </div>
        </div>
        <div className="evento__scroll-hint" aria-hidden="true">
          ↓ desliza
        </div>
      </section>

      {/* LA NOCHE */}
      <section className="evento__section">
        <ScrollReveal>
          <h2 className="evento__section-title">La noche</h2>
        </ScrollReveal>
        <div className="evento__timeline">
          {TIMELINE.map((item, index) => (
            <ScrollReveal key={item.time} className="evento__timeline-item" delay={index * 90}>
              <p className="evento__timeline-time">{item.time}</p>
              <p className="evento__timeline-label">{item.label}</p>
            </ScrollReveal>
          ))}
          <ScrollReveal
            className="evento__timeline-item evento__timeline-item--open"
            delay={TIMELINE.length * 90}
          >
            <p className="evento__timeline-note">hasta que el cuerpo aguante (~5 am)</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ENTRADAS */}
      <section id="entradas" className="evento__section">
        <ScrollReveal>
          <h2 className="evento__section-title">Entradas</h2>
        </ScrollReveal>
        <ScrollReveal>
          <div className="evento__prices">
            <div className="evento__price-card evento__price-card--presale">
              <p className="evento__price-tag">Preventa online</p>
              <p className="evento__price-amount">S/ {event.presalePrice}</p>
              <p className="evento__price-note">por persona · hasta {event.presaleDeadlineLabel}</p>
            </div>
            <div className="evento__price-card">
              <p className="evento__price-tag">En puerta</p>
              <p className="evento__price-amount">S/ {event.doorPrice}</p>
              <p className="evento__price-note">después de {event.presaleDeadlineLabel}, solo en puerta</p>
            </div>
          </div>
          <p className="evento__prices-promo">
            🎁 Trae al grupo: por cada 5 entradas, una gratis — 6 pagan S/{' '}
            {presaleTotal(event, 6)} y 12 pagan S/ {presaleTotal(event, 12)}.
          </p>
        </ScrollReveal>
        <div className="evento__form-slot">
          <DeadlineGate
            deadline={event.presaleDeadline}
            fallback={
              <p className="evento__form-panel" role="status">
                Venta online cerrada — entradas solo en puerta (S/ {event.doorPrice}). No se
                responderán mensajes.
              </p>
            }
          >
            <TicketForm event={event} qrSrc={assets.yapeQr} />
          </DeadlineGate>
        </div>
        <p className="evento__deadline">
          ⏰ Preventa online hasta {event.presaleDeadlineLabel}. Después, solo en puerta a S/{' '}
          {event.doorPrice}.
        </p>
      </section>

      {/* LA CLASE */}
      <section className="evento__section">
        <ScrollReveal>
          <div className="evento__dj evento__dj--clase">
            <div className="evento__dj-figure">
              <picture>
                <source srcSet={assets.xioCutoutWebp} type="image/webp" />
                <img
                  src={assets.xioCutoutPng}
                  alt="Xio"
                  width={XIO_CUTOUT.width}
                  height={XIO_CUTOUT.height}
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="evento__dj-info">
              <p className="evento__dj-eyebrow">La clase · 9:00 pm</p>
              <p className="evento__dj-name">Zouk con {event.instructor}</p>
              <p className="evento__dj-tags">incluida con tu entrada</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* DJ */}
      <section className="evento__section">
        <ScrollReveal>
          <div className="evento__dj">
            <div className="evento__dj-figure">
              <picture>
                <source srcSet={assets.djNathanCutoutWebp} type="image/webp" />
                <img
                  src={assets.djNathanCutoutPng}
                  alt={event.dj}
                  width={466}
                  height={1600}
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="evento__dj-info">
              <div className="evento__eq" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
              <p className="evento__dj-eyebrow">En cabina</p>
              <p className="evento__dj-name">{event.dj}</p>
              <p className="evento__dj-tags">bachata</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* BOX Y MESAS */}
      <section className="evento__section">
        <ScrollReveal>
          <h2 className="evento__section-title">Box y mesas</h2>
          <a
            href={assets.boxMap}
            target="_blank"
            rel="noopener noreferrer"
            className="evento__boxmap"
            aria-label="Ver el plano de box y mesas a tamaño completo"
          >
            <img
              src={assets.boxMap}
              alt="Plano del local: escenario y DJ al frente, pista de baile al centro, 19 box alrededor, 12 mesas altas a los lados, barra a la derecha, ingreso y baños a la izquierda"
              width={1254}
              height={1254}
              loading="lazy"
            />
          </a>
          <div className="evento__boxmap-prices">
            <span className="evento__boxmap-price">
              Box · <strong>S/ {event.boxPrice}</strong>
            </span>
            <span className="evento__boxmap-price">
              Mesa alta · <strong>S/ {event.tablePrice}</strong>
            </span>
          </div>
          <p className="evento__boxmap-note">
            Asegura el tuyo para tu grupo:{' '}
            <a href={RESERVA_URL} target="_blank" rel="noopener noreferrer">
              reserva por WhatsApp
            </a>
            .
          </p>
        </ScrollReveal>
      </section>

      {/* LUGAR */}
      <section className="evento__section">
        <ScrollReveal>
          <h2 className="evento__section-title">Lugar</h2>
          <p className="evento__venue-name">{event.venue.name}</p>
          <p className="evento__venue-brand">Bachata Club · Lima-Perú</p>
          <p className="evento__venue-address">
            {event.venue.streetAddress}, {event.venue.locality}
          </p>
          <p className="evento__venue-note">
            Estamos en el <strong>tercer piso</strong> — sube las escaleras al llegar.
          </p>
          <a
            href={event.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="evento__croquis"
            aria-label="Abrir la ubicación en Google Maps"
          >
            <img
              src={assets.croquis}
              alt="Croquis: Centro de Convenciones Javier Prado, en Av. Javier Prado Este a la altura del cruce con Av. José Gálvez Barrenechea"
              width={CROQUIS.width}
              height={CROQUIS.height}
              loading="lazy"
            />
          </a>
          <div className="evento__venue-actions">
            <a
              href={event.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="evento__cta evento__cta--primary"
            >
              Abrir en Google Maps
            </a>
            <a
              href={event.venue.uberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="evento__cta evento__cta--ghost"
            >
              Pedir Uber
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA FINAL */}
      <section className="evento__section evento__final">
        <ScrollReveal>
          <h2 className="evento__final-title">Nos vemos en la pista</h2>
          <DeadlineGate
            deadline={event.presaleDeadline}
            fallback={
              <p className="evento__whatsapp">
                Entradas en puerta a S/ {event.doorPrice} — nos vemos ahí 🎉
              </p>
            }
          >
            <a href="#entradas" className="evento__cta evento__cta--primary">
              Compra tu entrada — S/ {event.presalePrice}
            </a>
            <p className="evento__whatsapp">
              ¿Dudas?{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Escríbeme por WhatsApp
              </a>
            </p>
          </DeadlineGate>
        </ScrollReveal>
      </section>
    </main>
  )
}
