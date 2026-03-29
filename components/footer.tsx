import Link from 'next/link'
import { Twitter, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__social">
        <a
          href="https://x.com/cris_decode"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
        >
          <Twitter size={20} />
        </a>
        <a
          href="https://github.com/CristianLlanos"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
        >
          <Github size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/cristian-llanos/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
        >
          <Linkedin size={20} />
        </a>
      </div>
      <nav className="footer__nav">
        <Link href="/" className="footer__nav-link">Inicio</Link>
        <span className="footer__separator">·</span>
        <Link href="/blog" className="footer__nav-link">Blog</Link>
        <span className="footer__separator">·</span>
        <Link href="/credits" className="footer__nav-link">Créditos</Link>
      </nav>
      <p className="footer__copyright">© {year} Cristian Llanos</p>
      <p className="footer__license">
        Content licensed under{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
      </p>
    </footer>
  )
}
