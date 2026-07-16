/**
 * Ticket purchase contract with the Apps Script backend.
 * Request/response shapes and CORS strategy: docs/knowledge/apps-script-ticketing.md
 * — keep validation here in sync with the script's rules.
 */

export interface TicketInput {
  fullName: string
  dni: string
}

export interface BuyerInput {
  email: string
  whatsapp: string
  yapeOperation: string
}

export type TicketErrorCode = 'closed' | 'validation' | 'server'

export type SubmitResult = { ok: true; codes: string[] } | { ok: false; error: TicketErrorCode }

export interface TicketErrors {
  fullName?: string
  dni?: string
}

export interface BuyerErrors {
  email?: string
  whatsapp?: string
  yapeOperation?: string
}

/** Mirrors the script: 8-digit DNI, but also CE / passport — 6–12 alphanumeric. */
const DNI_PATTERN = /^[A-Za-z0-9]{6,12}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WHATSAPP_PATTERN = /^\d{9,12}$/

export function validateTicket(ticket: TicketInput): TicketErrors {
  const errors: TicketErrors = {}
  if (!ticket.fullName.trim()) {
    errors.fullName = 'Ingresa el nombre completo.'
  }
  if (!DNI_PATTERN.test(ticket.dni.trim())) {
    errors.dni = 'Entre 6 y 12 letras o números, sin espacios ni guiones.'
  }
  return errors
}

export function validateBuyer(buyer: BuyerInput): BuyerErrors {
  const errors: BuyerErrors = {}
  if (!EMAIL_PATTERN.test(buyer.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }
  if (!WHATSAPP_PATTERN.test(buyer.whatsapp.trim())) {
    errors.whatsapp = 'Solo dígitos, de 9 a 12 (ej. 986821895).'
  }
  if (!buyer.yapeOperation.trim()) {
    errors.yapeOperation = 'Ingresa el número de operación.'
  }
  return errors
}

export function hasErrors(errors: TicketErrors | BuyerErrors): boolean {
  return Object.values(errors).some(Boolean)
}

/**
 * POSTs the purchase as a CORS "simple request": the JSON travels as a plain
 * string (fetch's default text/plain content type — never application/json,
 * no custom headers) so Apps Script gets no preflight, and `redirect: 'follow'`
 * chases the /exec 302 to script.googleusercontent.com.
 *
 * `website` is the honeypot input's value — empty for humans; a non-empty
 * value (a bot auto-filling the hidden field) makes the server reject.
 */
export async function submitTickets(
  url: string,
  tickets: TicketInput[],
  buyer: BuyerInput,
  website: string
): Promise<SubmitResult> {
  const payload = {
    tickets: tickets.map((ticket) => ({
      fullName: ticket.fullName.trim(),
      dni: ticket.dni.trim(),
    })),
    email: buyer.email.trim(),
    whatsapp: buyer.whatsapp.trim(),
    yapeOperation: buyer.yapeOperation.trim(),
    website,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      redirect: 'follow',
    })
    const data: unknown = await response.json()
    if (isSubmitResult(data)) return data
    return { ok: false, error: 'server' }
  } catch {
    // Network failure or a non-JSON (error page) response.
    return { ok: false, error: 'server' }
  }
}

function isSubmitResult(data: unknown): data is SubmitResult {
  if (typeof data !== 'object' || data === null || !('ok' in data)) return false
  const result = data as { ok: unknown; codes?: unknown; error?: unknown }
  if (result.ok === true) return Array.isArray(result.codes)
  if (result.ok === false) {
    return result.error === 'closed' || result.error === 'validation' || result.error === 'server'
  }
  return false
}
