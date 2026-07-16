export function longDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('es-PE', options)
}

/* Hoisted: constructing the Intl formatter is the expensive part. */
const eventDateFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Lima',
})

/**
 * Formats an event date in Spanish with weekday, pinned to America/Lima so a
 * UTC build machine can't shift the date (unlike `longDate`).
 */
export function formatEventDate(isoDate: string): string {
  const formatted = eventDateFormatter.format(new Date(isoDate))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
