'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { APPS_SCRIPT_URL, type DanceEventData } from '@/lib/events'
import {
  hasErrors,
  submitTickets,
  validateBuyer,
  validateTicket,
  type BuyerInput,
  type TicketErrorCode,
  type TicketInput,
} from './ticketing'

/**
 * Ticket purchase form for an event: quantity → Yape payment → registration.
 * A single scrolling flow with numbered steps (no hidden wizard panes) so the
 * whole purchase fits one thumb-scroll on mobile. POSTs to the Apps Script
 * backend per docs/knowledge/apps-script-ticketing.md.
 */
export default function TicketForm({ event, qrSrc }: { event: DanceEventData; qrSrc: string }) {
  const formId = useId()

  const [tickets, setTickets] = useState<TicketInput[]>([{ fullName: '', dni: '' }])
  const [buyer, setBuyer] = useState<BuyerInput>({ email: '', whatsapp: '', yapeOperation: '' })
  // Honeypot stays uncontrolled: read at submit; bots that bypass React events still get caught.
  const websiteRef = useRef<HTMLInputElement>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [errorCode, setErrorCode] = useState<TicketErrorCode | null>(null)
  // Snapshot of what was actually sent — the live `tickets` state can change
  // while the request is in flight, which would misalign codes and names.
  const [confirmed, setConfirmed] = useState<{ codes: string[]; tickets: TicketInput[] } | null>(
    null
  )
  const [copied, setCopied] = useState(false)

  const quantity = tickets.length
  const total = event.presalePrice * quantity
  const ticketErrors = tickets.map(validateTicket)
  const buyerErrors = validateBuyer(buyer)
  const formValid = !hasErrors(buyerErrors) && ticketErrors.every((errors) => !hasErrors(errors))

  function setQuantity(next: number) {
    const clamped = Math.min(Math.max(next, 1), event.maxTicketsPerPurchase)
    setTickets((prev) =>
      Array.from({ length: clamped }, (_, i) => prev[i] ?? { fullName: '', dni: '' })
    )
  }

  function updateTicket(index: number, patch: Partial<TicketInput>) {
    setTickets((prev) =>
      prev.map((ticket, i) => (i === index ? { ...ticket, ...patch } : ticket))
    )
  }

  function markTouched(key: string) {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }

  async function copyYapeNumber() {
    const digits = event.yapeNumber.replace(/\s/g, '')
    try {
      await navigator.clipboard.writeText(digits)
    } catch {
      if (!legacyCopy(digits)) return // no clipboard support — number stays selectable
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formValid || submitting) return
    const snapshot = tickets
    setSubmitting(true)
    setErrorCode(null)
    const result = await submitTickets(APPS_SCRIPT_URL, snapshot, buyer, websiteRef.current?.value ?? '')
    setSubmitting(false)
    if (result.ok) {
      setConfirmed({ codes: result.codes, tickets: snapshot })
    } else {
      setErrorCode(result.error)
    }
  }

  if (confirmed) {
    return (
      <div className="evento__form-panel evento__form-panel--success" role="status">
        <p className="evento__form-panel-title">🎉 ¡Estás en la lista!</p>
        <ul className="evento__form-codes">
          {confirmed.codes.map((code, i) => (
            <li key={code}>
              <span className="evento__form-code">{code}</span>
              {confirmed.tickets[i]?.fullName.trim()}
            </li>
          ))}
        </ul>
        <p className="evento__form-panel-note">
          Revisa tu correo 📧 Tu nombre estará en la lista en puerta — trae tu DNI.
        </p>
      </div>
    )
  }

  if (errorCode === 'closed') {
    return (
      <p className="evento__form-panel" role="alert">
        La venta online cerró. Entradas en puerta a S/ {event.doorPrice}.
      </p>
    )
  }

  return (
    <form className="evento__form" onSubmit={handleSubmit} noValidate>
      {/* Paso 1 — cantidad */}
      <section className="evento__form-step">
        <h3 className="evento__form-step-title">
          <span className="evento__form-step-num" aria-hidden="true">
            1
          </span>
          ¿Cuántos van?
        </h3>
        <div className="evento__form-qty">
          <button
            type="button"
            className="evento__form-qty-btn"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1 || submitting}
            aria-label="Una entrada menos"
          >
            −
          </button>
          <span className="evento__form-qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="evento__form-qty-btn"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= event.maxTicketsPerPurchase || submitting}
            aria-label="Una entrada más"
          >
            +
          </button>
        </div>
        <p className="evento__form-total">
          Total: <strong>S/ {total}</strong>
        </p>
      </section>

      {/* Paso 2 — pago */}
      <section className="evento__form-step">
        <h3 className="evento__form-step-title">
          <span className="evento__form-step-num" aria-hidden="true">
            2
          </span>
          Paga con Yape
        </h3>
        <div className="evento__form-yape">
          <img
            src={qrSrc}
            alt={`Código QR de Yape de ${event.yapeHolder}`}
            className="evento__form-qr"
            width={900}
            height={1325}
            loading="lazy"
          />
          <div className="evento__form-yape-info">
            <p className="evento__form-yape-holder">{event.yapeHolder}</p>
            <p className="evento__form-yape-number">
              <span>{event.yapeNumber}</span>
              <button type="button" className="evento__form-copy" onClick={copyYapeNumber}>
                {copied ? 'copiado ✓' : 'copiar'}
              </button>
            </p>
            <p className="evento__form-yape-note">
              Yapea exactamente <strong>S/ {total}</strong> y guarda el número de operación de tu
              constancia.
            </p>
          </div>
        </div>
      </section>

      {/* Paso 3 — registro */}
      <section className="evento__form-step">
        <h3 className="evento__form-step-title">
          <span className="evento__form-step-num" aria-hidden="true">
            3
          </span>
          Registra tus entradas
        </h3>

        {tickets.map((ticket, i) => (
          <fieldset className="evento__form-ticket" key={i}>
            <legend className="evento__form-ticket-legend">Entrada {i + 1}</legend>
            <TextField
              id={`${formId}-t${i}-name`}
              label="Nombre completo"
              value={ticket.fullName}
              error={ticketErrors[i].fullName}
              touched={!!touched[`t${i}-name`]}
              autoComplete={i === 0 ? 'name' : 'off'}
              onChange={(fullName) => updateTicket(i, { fullName })}
              onBlur={() => markTouched(`t${i}-name`)}
            />
            <TextField
              id={`${formId}-t${i}-dni`}
              label="DNI / CE / Pasaporte"
              value={ticket.dni}
              error={ticketErrors[i].dni}
              touched={!!touched[`t${i}-dni`]}
              autoComplete="off"
              onChange={(dni) => updateTicket(i, { dni })}
              onBlur={() => markTouched(`t${i}-dni`)}
            />
          </fieldset>
        ))}

        <TextField
          id={`${formId}-email`}
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={buyer.email}
          error={buyerErrors.email}
          touched={!!touched.email}
          help="Ahí te llegan tus entradas."
          onChange={(email) => setBuyer((prev) => ({ ...prev, email }))}
          onBlur={() => markTouched('email')}
        />
        <TextField
          id={`${formId}-whatsapp`}
          label="WhatsApp"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={buyer.whatsapp}
          error={buyerErrors.whatsapp}
          touched={!!touched.whatsapp}
          onChange={(whatsapp) => setBuyer((prev) => ({ ...prev, whatsapp }))}
          onBlur={() => markTouched('whatsapp')}
        />
        <TextField
          id={`${formId}-yape-op`}
          label="N° de operación Yape"
          inputMode="numeric"
          autoComplete="off"
          value={buyer.yapeOperation}
          error={buyerErrors.yapeOperation}
          touched={!!touched.yapeOperation}
          help="Aparece en tu constancia de Yape."
          onChange={(yapeOperation) => setBuyer((prev) => ({ ...prev, yapeOperation }))}
          onBlur={() => markTouched('yapeOperation')}
        />

        {/* Honeypot — hidden from humans, bots auto-fill it and get rejected */}
        <div className="evento__form-hp" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            id={`${formId}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            ref={websiteRef}
          />
        </div>

        {errorCode === 'validation' && (
          <p className="evento__form-banner" role="alert">
            Hay datos que no pasaron la validación. Revisa los campos e inténtalo de nuevo.
          </p>
        )}
        {errorCode === 'server' && (
          <p className="evento__form-banner" role="alert">
            Algo falló. Escríbenos por{' '}
            <a href={buildSupportUrl(event.whatsappNumber, tickets, buyer)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{' '}
            y te registramos manualmente, o inténtalo de nuevo.
          </p>
        )}

        <button
          type="submit"
          className="evento__cta evento__cta--primary evento__form-submit"
          disabled={!formValid || submitting}
        >
          {submitting ? 'Registrando…' : `Registrar entradas — S/ ${total}`}
        </button>
        {!formValid && (
          <p className="evento__form-hint">Completa los campos para registrar tus entradas.</p>
        )}
      </section>
    </form>
  )
}

function TextField({
  id,
  label,
  value,
  error,
  touched,
  help,
  type = 'text',
  inputMode,
  autoComplete,
  onChange,
  onBlur,
}: {
  id: string
  label: string
  value: string
  error?: string
  touched: boolean
  help?: string
  type?: string
  inputMode?: 'text' | 'email' | 'numeric'
  autoComplete?: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  const showError = touched && !!error
  const describedBy = showError ? `${id}-error` : help ? `${id}-help` : undefined

  return (
    <div className="evento__form-field">
      <label className="evento__form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`evento__form-input${showError ? ' evento__form-input--error' : ''}`}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={showError || undefined}
        aria-describedby={describedBy}
      />
      {showError ? (
        <p className="evento__form-error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        help && (
          <p className="evento__form-help" id={`${id}-help`}>
            {help}
          </p>
        )
      )}
    </div>
  )
}

/** WhatsApp fallback for failed registrations, built only when that error shows. */
function buildSupportUrl(whatsappNumber: string, tickets: TicketInput[], buyer: BuyerInput): string {
  const names = tickets.map((ticket) => ticket.fullName.trim()).filter(Boolean).join(', ')
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola Cris, el registro online falló y quiero mis entradas 🙏 Nombres: ${names || '(pendiente)'}. N° de operación Yape: ${buyer.yapeOperation.trim() || '(pendiente)'}.`
  )}`
}

/** execCommand fallback for browsers without the async Clipboard API. */
function legacyCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}
