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
  photoWebp: string
  photoPng: string
  photoWidth: number
  photoHeight: number
}

export const promoters: Promoter[] = [
  {
    slug: 'duffoo',
    name: 'Miguel Duffoó',
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
