import type { Metadata } from 'next'
import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail, Package, Download } from 'lucide-react'
import { getBlogPosts, getSiteInfo } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { AUTHOR } from '@/lib/structured-data'
import BlogCard from '@/components/blog-card'
import JsonLd from '@/components/json-ld'
import ThemeToggle from '@/components/theme-toggle'

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = getSiteInfo()
  const ogImage = `${SITE_URL}/img/og/site-default.png`

  return {
    alternates: {
      canonical: `${SITE_URL}/`,
    },
    openGraph: {
      title: siteInfo.sitename,
      description: siteInfo.sitedescription,
      url: `${SITE_URL}/`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteInfo.sitename }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteInfo.sitename,
      description: siteInfo.sitedescription,
      images: { url: ogImage, alt: siteInfo.sitename },
    },
  }
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cristian Llanos',
  url: SITE_URL,
  description: 'Creemos software escalable, seguro y mantenible juntos.',
  inLanguage: 'es-PE',
  author: AUTHOR,
}

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cristian Llanos',
  url: SITE_URL,
  jobTitle: 'Engineering Lead',
  knowsAbout: ['Software Architecture', 'Kotlin', 'TypeScript', 'PHP', 'Laravel', 'AWS', 'Dependency Injection'],
  worksFor: { '@type': 'Organization', name: 'Captiview', url: 'https://captiview.com' },
  alumniOf: { '@type': 'Organization', name: 'Fandango Latam' },
  sameAs: [
    'https://x.com/cris_decode',
    'https://github.com/CristianLlanos',
    'https://www.linkedin.com/in/cristian-llanos/',
  ],
}

export default function HomePage() {
  const blogPosts = getBlogPosts()

  return (
    <>
      <div className="theme-toggle--floating">
        <ThemeToggle />
      </div>
      <JsonLd data={jsonLdWebSite} />
      <JsonLd data={jsonLdPerson} />
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
          <a href="https://x.com/cris_decode" target="_blank" rel="me noopener noreferrer" className="hero__social-link">
            <Twitter size={20} />
          </a>
          <a href="https://github.com/CristianLlanos" target="_blank" rel="me noopener noreferrer" className="hero__social-link">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/cristian-llanos/" target="_blank" rel="me noopener noreferrer" className="hero__social-link">
            <Linkedin size={20} />
          </a>
          <a href="mailto:hello@cristianllanos.com" className="hero__social-link">
            <Mail size={20} />
          </a>
        </div>
        <nav className="hero__nav">
          <Link href="/blog" className="hero__nav-link">Blog</Link>
          <span className="hero__nav-separator">·</span>
          <Link href="/projects" className="hero__nav-link">Proyectos</Link>
          <span className="hero__nav-separator">·</span>
          <Link href="/credits" className="hero__nav-link">Créditos</Link>
        </nav>
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
        {[
          {
            href: 'https://github.com/reliese/laravel',
            external: true,
            name: 'reliese/laravel',
            desc: 'Generador de modelos de Eloquent desde bases de datos existentes. Ideal para migrar proyectos legacy a Laravel sin escribir modelos a mano.',
            stats: [<><Download size={14} /> 3M+ descargas</>, 'PHP · Laravel'],
          },
          {
            href: '/projects/kotlin-container',
            external: false,
            name: 'kotlin-container',
            desc: 'Inyección de dependencias liviana para Kotlin. Auto-resolución, scopes, service providers — sin anotaciones, sin generación de código.',
            stats: ['Kotlin · JVM', 'Maven Central'],
          },
          {
            href: '/projects/kotlin-events',
            external: false,
            name: 'kotlin-events',
            desc: 'Event bus type-safe para Kotlin. Listeners con DI, middleware, coroutines — ligero y thread-safe.',
            stats: ['Kotlin · JVM', 'Maven Central'],
          },
        ].map((project) => (
          <a
            key={project.name}
            href={project.href}
            className="opensource__card"
            {...(project.external && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <div className="opensource__card-header">
              <Package size={20} className="opensource__card-icon" />
              <span className="opensource__card-name">{project.name}</span>
            </div>
            <p className="opensource__card-desc">{project.desc}</p>
            <div className="opensource__card-stats">
              {project.stats.map((stat, i) => (
                <span key={i} className="opensource__stat">{stat}</span>
              ))}
            </div>
          </a>
        ))}
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
