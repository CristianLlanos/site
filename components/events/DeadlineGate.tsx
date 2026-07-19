'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Shows `children` while `deadline` is in the future and `fallback` once it
 * passes. The deadline must be an ISO 8601 string with an explicit UTC offset
 * (e.g. 2026-08-05T18:00:00-05:00): parsing it yields an absolute instant, so
 * the comparison against Date.now() is correct in every visitor timezone.
 *
 * SSR and the first client render always show `children` so the static-export
 * HTML matches hydration; the real check runs on mount and every minute after.
 * This gate is UX only — the Apps Script backend enforces the cutoff.
 */
export default function DeadlineGate({
  deadline,
  fallback,
  children,
}: {
  deadline: string
  fallback: ReactNode
  children: ReactNode
}) {
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const deadlineMs = new Date(deadline).getTime()
    const check = () => {
      if (Date.now() > deadlineMs) {
        setIsClosed(true)
        window.clearInterval(intervalId) // closed is terminal — stop polling
      }
    }
    const intervalId = window.setInterval(check, 60_000)
    check()
    return () => window.clearInterval(intervalId)
  }, [deadline])

  return <>{isClosed ? fallback : children}</>
}
