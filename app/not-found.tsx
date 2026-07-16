import Link from 'next/link'
import Footer from '@/components/footer'

export default function NotFound() {
  return (
    <div className="site-container">
      <div className="not-found">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Página no encontrada</h1>
        <p className="not-found__text">
          El enlace que seguiste está roto o la página ya no existe.
        </p>
        <Link href="/" className="not-found__link">
          ← Volver al inicio
        </Link>
      </div>
      <Footer />
    </div>
  )
}
