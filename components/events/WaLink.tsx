'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { detectPromoter, promoterFirstName } from '@/lib/promoters'

/**
 * WhatsApp link that switches to the active promoter's number (and greets
 * them by name) when the visitor arrived through a promoter fragment.
 * SSR renders the organizer's link; the swap happens on mount.
 *
 * `messageTemplate` uses `{nombre}` for the recipient's first name.
 */
export default function WaLink({
  fallbackNumber,
  fallbackName,
  messageTemplate,
  className,
  children,
}: {
  fallbackNumber: string
  fallbackName: string
  messageTemplate: string
  className?: string
  children: ReactNode
}) {
  const [recipient, setRecipient] = useState({ number: fallbackNumber, name: fallbackName })

  useEffect(() => {
    const promoter = detectPromoter()
    if (promoter) {
      setRecipient({ number: promoter.whatsappNumber, name: promoterFirstName(promoter) })
    }
  }, [fallbackNumber, fallbackName])

  const href = `https://wa.me/${recipient.number}?text=${encodeURIComponent(
    messageTemplate.replace('{nombre}', recipient.name)
  )}`

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
