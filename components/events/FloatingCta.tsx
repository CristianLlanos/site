'use client'

import { useEffect, useState } from 'react'

/**
 * Fixed buy pill that appears once the visitor scrolls away from the hero,
 * the ticket form, and the final CTA — the three places that already show a
 * purchase action. Pure convenience on a long page; hidden from keyboards
 * and readers duplicating content is avoided by reusing the same anchor.
 */
export default function FloatingCta({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const targets = ['.evento__hero', '#entradas', '.evento__final']
      .map((selector) => document.querySelector(selector))
      .filter((el): el is Element => el !== null)
    if (!targets.length) return

    const inView = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target)
          else inView.delete(entry.target)
        }
        setVisible(inView.size === 0)
      },
      { threshold: 0.05 }
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href={href}
      className={`evento__floating-cta${visible ? ' evento__floating-cta--visible' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      {label}
    </a>
  )
}
