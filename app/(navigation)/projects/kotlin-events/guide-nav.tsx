import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BASE } from './constants'
import { GuideSearch } from './search'
import { guides, resources } from './guide-data'

export { guides }

export function guideStep(href: string): string {
  const idx = guides.findIndex((g) => g.href === href)
  return idx >= 0 ? `${idx + 1} of ${guides.length}` : ''
}

export function GuideNav({ current }: { current: string }) {
  const idx = guides.findIndex((g) => g.href === current)
  const prev = idx > 0 ? guides[idx - 1] : null
  const next = idx < guides.length - 1 ? guides[idx + 1] : null

  return (
    <nav className="guide-nav">
      {prev ? (
        <Link href={prev.href} className="guide-nav__link guide-nav__link--prev">
          <ChevronLeft size={16} />
          <span>
            <span className="guide-nav__label">Previous</span>
            <span className="guide-nav__title">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="guide-nav__link guide-nav__link--next">
          <span>
            <span className="guide-nav__label">Next</span>
            <span className="guide-nav__title">{next.title}</span>
          </span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <Link href={BASE} className="guide-nav__link guide-nav__link--next">
          <span>
            <span className="guide-nav__label">Back to</span>
            <span className="guide-nav__title">Overview</span>
          </span>
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  )
}

export function GuideSidebar({ current }: { current: string }) {
  const norm = current.replace(/\/$/, '')
  return (
    <aside className="guide-sidebar">
      <Link href={BASE} className="guide-sidebar__back">kotlin-events</Link>
      <GuideSearch />
      <div className="guide-sidebar__section-label">Guides</div>
      <ul className="guide-sidebar__list">
        {guides.map((g) => {
          const active = g.href === norm
          return (
          <li key={g.href}>
            <Link
              href={g.href}
              className={`guide-sidebar__link${active ? ' guide-sidebar__link--active' : ''}`}
            >
              {g.title}
            </Link>
            {active && g.sections && (
              <ul className="guide-sidebar__sublist">
                {g.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="guide-sidebar__sublink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          )
        })}
      </ul>
      <div className="guide-sidebar__section-label">Reference</div>
      <ul className="guide-sidebar__list">
        {resources.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className={`guide-sidebar__link${r.href === norm ? ' guide-sidebar__link--active' : ''}`}
            >
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
