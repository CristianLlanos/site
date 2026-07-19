/**
 * Invisible reCAPTCHA v3 for the ticket form.
 *
 * Empty RECAPTCHA_SITE_KEY disables the whole feature client-side (no script
 * loaded, empty token sent); the Apps Script likewise skips verification
 * until its RECAPTCHA_SECRET script property is set. This lets both sides
 * deploy independently. The site key is public by design — the secret lives
 * ONLY in the Apps Script's script properties, never in this repo.
 */

export const RECAPTCHA_SITE_KEY = '6Le8TVstAAAAAD86c99-DnDXhpgNpYmrOjZqCwkQ'

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void
      execute(siteKey: string, options: { action: string }): Promise<string>
    }
  }
}

let loader: Promise<void> | null = null

/** Injects the reCAPTCHA script once. No-op when the feature is disabled. */
export function loadRecaptcha(): Promise<void> {
  if (!RECAPTCHA_SITE_KEY || typeof document === 'undefined') return Promise.resolve()
  loader ??= new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => resolve() // blocked/offline — submit degrades to an empty token
    document.head.appendChild(script)
  })
  return loader
}

/**
 * Returns a v3 token for the given action, or '' when the feature is
 * disabled or the script could not run (the server decides what to do
 * with an empty token).
 */
export async function getCaptchaToken(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) return ''
  try {
    await loadRecaptcha()
    const grecaptcha = window.grecaptcha
    if (!grecaptcha) return ''
    await new Promise<void>((resolve) => grecaptcha.ready(resolve))
    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
  } catch {
    return ''
  }
}
