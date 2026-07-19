'use client'

import { useEffect, useState } from 'react'
import { detectPromoter, type Promoter } from '@/lib/promoters'

/**
 * Shows the official promoter when the visitor arrives via their fragment
 * (e.g. #duffoo): a fixed side card on desktop that accompanies the scroll —
 * appearing only once the hero (the poster) has scrolled out of view so it
 * never competes with it — and a compact inline card (rendered where this
 * component is mounted — right before the ticket form) on smaller screens.
 * The slug is persisted in sessionStorage so in-page anchor navigation
 * (#entradas) keeps attribution.
 */
export default function PromoterPanel() {
  const [promoter, setPromoter] = useState<Promoter | null>(null)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    setPromoter(detectPromoter({ persist: true }))
  }, [])

  useEffect(() => {
    if (!promoter || typeof IntersectionObserver === 'undefined') return
    const hero = document.querySelector('.evento__hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      (entries) => setPastHero(entries.every((entry) => !entry.isIntersecting)),
      { threshold: 0.05 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [promoter])

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
      <aside
        className={`evento__promoter evento__promoter--side${pastHero ? ' evento__promoter--side-visible' : ''}`}
        aria-label="Promotor oficial"
      >
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
