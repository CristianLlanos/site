'use client'

import { useEffect, useState } from 'react'
import { findPromoter, PROMOTER_STORAGE_KEY, type Promoter } from '@/lib/promoters'

/**
 * Shows the official promoter when the visitor arrives via their fragment
 * (e.g. #duffoo): a fixed side card on desktop that accompanies the scroll,
 * and a compact inline card (rendered where this component is mounted —
 * right before the ticket form) on smaller screens. The slug is persisted in
 * sessionStorage so in-page anchor navigation (#entradas) keeps attribution.
 */
export default function PromoterPanel() {
  const [promoter, setPromoter] = useState<Promoter | null>(null)

  useEffect(() => {
    const fromHash = findPromoter(window.location.hash.replace('#', '').toLowerCase())
    if (fromHash) {
      try {
        sessionStorage.setItem(PROMOTER_STORAGE_KEY, fromHash.slug)
      } catch {
        // storage unavailable (private mode) — the card still shows this visit
      }
      setPromoter(fromHash)
      return
    }
    try {
      const stored = sessionStorage.getItem(PROMOTER_STORAGE_KEY)
      if (stored) setPromoter(findPromoter(stored) ?? null)
    } catch {
      // ignore
    }
  }, [])

  if (!promoter) return null

  const photo = (
    <picture>
      <source srcSet={promoter.photoWebp} type="image/webp" />
      <img
        src={promoter.photoPng}
        alt={promoter.name}
        width={promoter.photoWidth}
        height={promoter.photoHeight}
        loading="lazy"
      />
    </picture>
  )

  return (
    <>
      <aside className="evento__promoter evento__promoter--side" aria-label="Promotor oficial">
        <div className="evento__promoter-figure">{photo}</div>
        <p className="evento__promoter-eyebrow">Te invita</p>
        <p className="evento__promoter-name">{promoter.name}</p>
        <p className="evento__promoter-role">Promotor oficial</p>
      </aside>
      <div className="evento__promoter evento__promoter--inline" aria-label="Promotor oficial">
        <div className="evento__promoter-figure">{photo}</div>
        <div>
          <p className="evento__promoter-eyebrow">Te invita</p>
          <p className="evento__promoter-name">{promoter.name}</p>
          <p className="evento__promoter-role">Promotor oficial</p>
        </div>
      </div>
    </>
  )
}
