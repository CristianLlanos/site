/**
 * Event data for the /events section.
 * Single source of truth for event facts: ROADMAP.md § "Event facts".
 * All dates are ISO 8601 with the America/Lima offset (-05:00, no DST).
 */

/**
 * Google Apps Script web app endpoint for ticket registration (public by design).
 * Deployed 2026-07-16 via clasp from apps-script/tickets/ — redeploys keep this URL
 * (Manage deployments → edit → New version; never "New deployment").
 */
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw_NqME4t91UFCsqZav6DEn45Z_JVm8fR9qPGHth6ZNcNJ1Js2rnSILCwkt9pVFiFlyjg/exec'

export interface EventVenue {
  name: string
  /** Street address including floor — Uber/Maps by *name* mislocates this venue. */
  streetAddress: string
  locality: string
  region: string
  country: string
  latitude: number
  longitude: number
  /** Exact place URL — never link by venue name alone. */
  mapsUrl: string
  /** Uber universal link (https) pinned to coordinates + formatted address.
   * Opens the app directly when installed, falls back to Uber web otherwise —
   * and unlike the uber:// scheme it works in Gmail and on desktop. */
  uberUrl: string
}

export interface DanceEventData {
  slug: string
  /** Route path, no trailing slash. */
  path: string
  name: string
  description: string
  /** Doors open. */
  startDate: string
  /** Social winds down ("hasta que el cuerpo aguante"). */
  endDate: string
  doorsLabel: string
  /** Presale price in PEN, online only. */
  presalePrice: number
  /** Presale cutoff — after this, door sales only. */
  presaleDeadline: string
  /** Human copy for the cutoff, used everywhere prose mentions it. */
  presaleDeadlineLabel: string
  /** Door price in PEN. */
  doorPrice: number
  /** Form sanity cap per purchase. */
  maxTicketsPerPurchase: number
  /** Yape destination number as displayed to buyers. */
  yapeNumber: string
  yapeHolder: string
  /** WhatsApp number in wa.me format (country code, no +). */
  whatsappNumber: string
  dj: string
  instructor: string
  venue: EventVenue
  /** Calendar file served from public/. */
  icsPath: string
  /** OG image (1200×630) under public/img/og/. */
  ogImage: string
}

/** Processed asset paths for the cumple-cris-2026 event. */
export const CUMPLE_CRIS_ASSETS = {
  crisCutoutWebp: '/img/events/cumple-cris-2026/cris2-cutout.webp',
  crisCutoutPng: '/img/events/cumple-cris-2026/cris2-cutout.png',
  xioCutoutWebp: '/img/events/cumple-cris-2026/xio-cutout.webp',
  xioCutoutPng: '/img/events/cumple-cris-2026/xio-cutout.png',
  djNathanCutoutWebp: '/img/events/cumple-cris-2026/dj-nathan-cutout.webp',
  djNathanCutoutPng: '/img/events/cumple-cris-2026/dj-nathan-cutout.png',
  yapeQr: '/img/events/cumple-cris-2026/yape-qr.png',
  /** Google Maps crop of the venue block — links to mapsUrl on click. */
  croquis: '/img/events/cumple-cris-2026/croquis.jpg',
} as const

const CUMPLE_CRIS_SLUG = 'social-bachata-cumple-cris-2026'

export const cumpleCris2026: DanceEventData = {
  slug: CUMPLE_CRIS_SLUG,
  path: `/events/${CUMPLE_CRIS_SLUG}`,
  name: 'Social de Bachata · Cumple de Cris',
  description:
    'Social de bachata por el cumpleaños de Cris. Clase de Zouk con Cris + Xio a las 9:00 pm incluida con tu entrada, DJ Nathan en cabina y pista hasta que el cuerpo aguante.',
  startDate: '2026-08-05T20:00:00-05:00',
  endDate: '2026-08-06T05:00:00-05:00',
  doorsLabel: '8:00 pm',
  presalePrice: 15,
  presaleDeadline: '2026-08-05T18:00:00-05:00',
  presaleDeadlineLabel: 'las 6:00 pm del 5/8',
  doorPrice: 20,
  maxTicketsPerPurchase: 12,
  yapeNumber: '986 821 895',
  yapeHolder: 'Cristian Alberto Llanos Malca',
  whatsappNumber: '51986821895',
  dj: 'DJ Nathan',
  instructor: 'Cris + Xio',
  venue: {
    name: 'Centro de Convenciones Javier Prado',
    streetAddress: 'Av. Javier Prado Este 1179, Tercer piso',
    locality: 'La Victoria',
    region: 'Lima',
    country: 'PE',
    latitude: -12.0892749,
    longitude: -77.0151988,
    mapsUrl:
      'https://www.google.com/maps/place/Centro+de+Convenciones+Javier+Prado/@-12.0892179,-77.0179075,17z/data=!3m1!4b1!4m6!3m5!1s0x9105c87ebb8eb213:0xa908be93d1d0521!8m2!3d-12.0892232!4d-77.0153326!16s%2Fg%2F1ptxkll54',
    uberUrl:
      'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=-12.0892749&dropoff[longitude]=-77.0151988&dropoff[nickname]=Av.%20Javier%20Prado%20Este%201179&dropoff[formatted_address]=Av.%20Javier%20Prado%20Este%201179%2C%20La%20Victoria',
  },
  icsPath: '/events/cumple-cris-2026.ics',
  ogImage: '/img/og/eventos-cumple-cris-2026.png',
}

/** Events shown on the /events index, newest first. */
export const events: DanceEventData[] = [cumpleCris2026]

/** Group promo: one free ticket per 5 paid — 6 cost 5, 12 cost 10. */
export function freeTicketsFor(quantity: number): number {
  return Math.floor(quantity / 6)
}

/** Presale total in PEN applying the group promo. */
export function presaleTotal(event: DanceEventData, quantity: number): number {
  return (quantity - freeTicketsFor(quantity)) * event.presalePrice
}
