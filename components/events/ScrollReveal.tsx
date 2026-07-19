'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Fade-and-rise reveal on first scroll into view. Content is VISIBLE by
 * default (static HTML, no-JS, missing IntersectionObserver all degrade to a
 * plain page); only elements still below the fold when the effect runs are
 * hidden (`reveal--pending`) and revealed by the observer. Transitions live in
 * CSS (`.reveal`), disabled under `prefers-reduced-motion: reduce`.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** Transition delay in ms, for staggered groups. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    // Already on screen (or above it): leave it visible, no animation.
    if (element.getBoundingClientRect().top < window.innerHeight - 40) return

    element.classList.add('reveal--pending')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.remove('reveal--pending')
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : 'reveal'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
