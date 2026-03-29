import Link from 'next/link'
import ThemeToggle from '@/components/theme-toggle'

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav__brand">
          <img
            src="/img/avatar.jpg"
            alt="Cristian Llanos"
            className="nav__avatar"
          />
          <span className="nav__brand-name">Cristian Llanos</span>
        </Link>
        <div className="nav__links">
          <Link href="/blog" className="nav__link">Blog</Link>
          <Link href="/projects" className="nav__link">Proyectos</Link>
          <Link href="/credits" className="nav__link">Créditos</Link>
          <ThemeToggle />
        </div>
      </nav>
      {children}
    </>
  )
}
