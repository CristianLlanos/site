import type { Metadata } from 'next'
import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail, Package, Download } from 'lucide-react'
import { getBlogPosts, getSiteInfo } from '@/lib/content'
import BlogCard from '@/components/blog-card'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cristianllanos.com'

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = getSiteInfo()
  const socialImage = `${SITE_URL}/img/cristian-llanos-1350x904.jpg`

  return {
    openGraph: {
      title: siteInfo.sitename,
      description: siteInfo.sitedescription,
      images: [{ url: socialImage, width: 1350, height: 904, alt: siteInfo.sitename }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteInfo.sitename,
      description: siteInfo.sitedescription,
      images: { url: socialImage, alt: siteInfo.sitename },
    },
  }
}

export default function HomePage() {
  const blogPosts = getBlogPosts()

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__avatar-wrapper">
          <img
            src="/img/avatar.jpg"
            alt="Cristian Llanos"
            className="hero__avatar"
          />
        </div>
        <h1 className="hero__title">Cristian Llanos</h1>
        <p className="hero__subtitle">
          Escribo sobre cómo construir software que escala a millones
        </p>
        <p className="hero__meta">Engineering Lead · Lima, Perú</p>
        <div className="hero__social">
          <a href="https://x.com/cris_decode" target="_blank" rel="noopener noreferrer" className="hero__social-link">
            <Twitter size={20} />
          </a>
          <a href="https://github.com/CristianLlanos" target="_blank" rel="noopener noreferrer" className="hero__social-link">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/cristian-llanos/" target="_blank" rel="noopener noreferrer" className="hero__social-link">
            <Linkedin size={20} />
          </a>
          <a href="mailto:hello@cristianllanos.com" className="hero__social-link">
            <Mail size={20} />
          </a>
        </div>
      </section>

      {/* Bio */}
      <section className="bio">
        <p className="bio__text">
          <span className="bio__highlight">+11 años</span> construyendo plataformas que sirven a{' '}
          <span className="bio__highlight">millones de usuarios en 18+ países</span>.
          Creador de{' '}
          <a href="https://github.com/reliese/laravel" target="_blank" rel="noopener noreferrer">
            reliese/laravel
          </a>{' '}
          con <span className="bio__highlight">3M+ descargas</span>.
          Aquí comparto lo que aprendo sobre arquitectura, liderazgo técnico y el arte de escribir código que sobrevive al paso del tiempo.
        </p>
      </section>

      {/* Experience */}
      <section className="experience">
        <h2 className="experience__title">Trayectoria</h2>
        <div className="experience__list">
          <div className="experience__item">
            <div className="experience__marker">
              <div className="experience__dot experience__dot--active" />
              <div className="experience__line" />
            </div>
            <div className="experience__content">
              <div className="experience__role">
                Lead Engineer ·{' '}
                <span className="experience__company">
                  <a href="https://captiview.com" target="_blank" rel="noopener noreferrer">Captiview</a>
                </span>
              </div>
              <div className="experience__period">2023 – Presente</div>
              <div className="experience__detail">
                Founding engineer. Plataforma SaaS para 1,025+ pantallas digitales en 352 venues.
              </div>
            </div>
          </div>
          <div className="experience__item">
            <div className="experience__marker">
              <div className="experience__dot" />
              <div className="experience__line" />
            </div>
            <div className="experience__content">
              <div className="experience__role">
                Head of Engineering ·{' '}
                <span className="experience__company">
                  <a href="https://vivela.lat" target="_blank" rel="noopener noreferrer">Vívela</a>
                </span>
              </div>
              <div className="experience__period">2021 – 2023</div>
              <div className="experience__detail">
                Fintech. Lideré el equipo de ingeniería. +1000% en adquisición de clientes.
              </div>
            </div>
          </div>
          <div className="experience__item">
            <div className="experience__marker">
              <div className="experience__dot" />
            </div>
            <div className="experience__content">
              <div className="experience__role">
                Staff Engineer ·{' '}
                <span className="experience__company">Fandango Latam</span>
              </div>
              <div className="experience__period">2015 – 2020</div>
              <div className="experience__detail">
                E-commerce regional. 10M+ usuarios mensuales, 18 países, certificación PCI DSS.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="opensource">
        <h2 className="opensource__title">Open Source</h2>
        <a
          href="https://github.com/reliese/laravel"
          target="_blank"
          rel="noopener noreferrer"
          className="opensource__card"
        >
          <div className="opensource__card-header">
            <Package size={20} className="opensource__card-icon" />
            <span className="opensource__card-name">reliese/laravel</span>
          </div>
          <p className="opensource__card-desc">
            Generador de modelos de Eloquent desde bases de datos existentes. Ideal para migrar proyectos legacy a Laravel sin escribir modelos a mano.
          </p>
          <div className="opensource__card-stats">
            <span className="opensource__stat">
              <Download size={14} /> 3M+ descargas
            </span>
            <span className="opensource__stat">PHP · Laravel</span>
          </div>
        </a>
      </section>

      {/* Blog */}
      <section className="blog-section">
        <h2 className="section__title">Últimas entradas</h2>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="blog-section__footer">
          <Link href="/blog" className="blog-section__link">
            Ver todas las entradas →
          </Link>
        </div>
      </section>
    </>
  )
}
