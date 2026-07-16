import Link from 'next/link'

/**
 * Nav-less, full-bleed shell for the events section: the (events) route group
 * renders outside .site-container and without the global footer (both live in
 * the other route groups' layouts), so event pages own the whole viewport and
 * close with this mini footer linking back home.
 */
export default function EventosLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <div className="eventos-shell">
      {children}
      <footer className="eventos-footer">
        <Link href="/" className="eventos-footer__link">
          cristianllanos.com
        </Link>
        <span className="eventos-footer__copyright">© {year} Cristian Llanos</span>
      </footer>
    </div>
  )
}
