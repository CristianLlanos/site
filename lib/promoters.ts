/**
 * Official promoters for event landings.
 *
 * To add a promoter: process their photo like the other cutouts (transparent
 * background, exported to /img/events/<event>/<slug>-cutout.{webp,png}), add
 * an entry here, and share the landing URL with `#<slug>` appended — e.g.
 * /events/social-bachata-cumple-cris-2026/#duffoo. The fragment is detected
 * client-side, shown as a trust card, kept in sessionStorage so in-page
 * anchors don't lose it, and written to the Sheet's "Promotor" column with
 * each sale.
 */

export interface Promoter {
  /** URL fragment that activates this promoter (lowercase, no #). */
  slug: string
  name: string
  /** WhatsApp number in wa.me format (country code, no +). All WhatsApp
   * links on the landing switch to this number in the promoter's view. */
  whatsappNumber: string
  photoWebp: string
  photoPng: string
  photoWidth: number
  photoHeight: number
}

export const promoters: Promoter[] = [
  {
    slug: 'duffoo',
    name: 'Miguel Duffoó',
    whatsappNumber: '51970393185',
    photoWebp: '/img/events/cumple-cris-2026/duffoo-cutout.webp',
    photoPng: '/img/events/cumple-cris-2026/duffoo-cutout.png',
    photoWidth: 686,
    photoHeight: 1200,
  },
]

/** sessionStorage key holding the active promoter slug for attribution. */
export const PROMOTER_STORAGE_KEY = 'evento-promoter'

export function findPromoter(slug: string): Promoter | undefined {
  return promoters.find((promoter) => promoter.slug === slug)
}

/**
 * Client-side: resolves the active promoter from the URL fragment (persisting
 * it when asked) or from a previous visit's sessionStorage. Single source for
 * PromoterPanel, WhatsApp links, and purchase attribution — the hash always
 * wins so a fresh promoter link overrides a stale stored one.
 */
export function detectPromoter(options?: { persist?: boolean }): Promoter | null {
  if (typeof window === 'undefined') return null
  const fromHash = findPromoter(window.location.hash.replace('#', '').toLowerCase())
  if (fromHash) {
    if (options?.persist) {
      try {
        sessionStorage.setItem(PROMOTER_STORAGE_KEY, fromHash.slug)
      } catch {
        // storage unavailable (private mode) — hash detection still works
      }
    }
    return fromHash
  }
  try {
    const stored = sessionStorage.getItem(PROMOTER_STORAGE_KEY)
    return stored ? (findPromoter(stored) ?? null) : null
  } catch {
    return null
  }
}

/** First name for WhatsApp greetings ("Hola Miguel, …"). */
export function promoterFirstName(promoter: Promoter): string {
  return promoter.name.split(' ')[0]
}
