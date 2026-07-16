/**
 * Event data for the /eventos section.
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
  /** Uber deep link pinned to coordinates + formatted address. */
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

/** Processed asset paths for the cumple-cris-2026 event (Session A output). */
export const CUMPLE_CRIS_ASSETS = {
  crisCutoutWebp: '/img/eventos/cumple-cris-2026/cris-cutout.webp',
  crisCutoutPng: '/img/eventos/cumple-cris-2026/cris-cutout.png',
  djNathanCutoutWebp: '/img/eventos/cumple-cris-2026/dj-nathan-cutout.webp',
  djNathanCutoutPng: '/img/eventos/cumple-cris-2026/dj-nathan-cutout.png',
  yapeQr: '/img/eventos/cumple-cris-2026/yape-qr.png',
} as const

const CUMPLE_CRIS_SLUG = 'social-bachata-cumple-cris'

export const cumpleCris2026: DanceEventData = {
  slug: CUMPLE_CRIS_SLUG,
  path: `/eventos/${CUMPLE_CRIS_SLUG}`,
  name: 'Social de Bachata · Cumple de Cris',
  description:
    'Social de bachata por el cumpleaños de Cris. Clase de Zouk a las 9:30 pm incluida con tu entrada, DJ Nathan en cabina y pista hasta que el cuerpo aguante.',
  startDate: '2026-08-05T20:00:00-05:00',
  endDate: '2026-08-06T05:00:00-05:00',
  doorsLabel: '8:00 pm',
  presalePrice: 15,
  presaleDeadline: '2026-08-05T18:00:00-05:00',
  presaleDeadlineLabel: 'las 6:00 pm del 5/8',
  doorPrice: 20,
  maxTicketsPerPurchase: 5,
  yapeNumber: '986 821 895',
  yapeHolder: 'Cristian Alberto Llanos Malca',
  whatsappNumber: '51986821895',
  dj: 'DJ Nathan',
  instructor: 'Cristian Llanos',
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
      'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=-12.0892749&dropoff[longitude]=-77.0151988&dropoff[nickname]=Centro%20de%20Convenciones%20Javier%20Prado&dropoff[formatted_address]=Av.%20Javier%20Prado%20Este%201179%2C%20La%20Victoria',
  },
  icsPath: '/eventos/cumple-cris-2026.ics',
  ogImage: '/img/og/eventos-cumple-cris-2026.png',
}

/** Events shown on the /eventos index, newest first. */
export const events: DanceEventData[] = [cumpleCris2026]
