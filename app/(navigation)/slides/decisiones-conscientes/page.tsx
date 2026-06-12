import type { Metadata } from 'next'
import { ArrowUpRight, Github, Presentation } from 'lucide-react'
import { SITE_URL } from '@/lib/constants'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import JsonLd from '@/components/json-ld'

const DECK_URL = '/slides/decisiones-conscientes/deck/'

const DESCRIPTION =
  'Charla técnica: diseñar con IA antes de escribir código, con el método /spec — discovery, tradeoffs y captura de decisiones. Por Cris Llanos.'

export const metadata: Metadata = {
  title: 'Decisiones conscientes — diseñar con IA antes de codear',
  description: DESCRIPTION,
  keywords: [
    'diseño de software con IA',
    'spec-driven development',
    'Claude Code skill',
    'charla técnica de IA',
    'diseñar antes de codear',
    'captura de decisiones',
    'product design before code',
  ],
  alternates: {
    canonical: `${SITE_URL}/slides/decisiones-conscientes/`,
  },
  openGraph: {
    title: 'Decisiones conscientes — Diseñar con IA antes de escribir código',
    description: DESCRIPTION,
    url: `${SITE_URL}/slides/decisiones-conscientes/`,
    type: 'article',
    images: [
      {
        url: `${SITE_URL}/img/og/decisiones-conscientes.png`,
        width: 1200,
        height: 630,
        alt: 'Decisiones conscientes — Diseñar con IA antes de escribir código',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decisiones conscientes — Diseñar con IA antes de escribir código',
    description: DESCRIPTION,
    images: [`${SITE_URL}/img/og/decisiones-conscientes.png`],
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Slides', url: '/slides/' },
  { name: 'Decisiones conscientes', url: '/slides/decisiones-conscientes/' },
])

const talkJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PresentationDigitalDocument',
  name: 'Decisiones conscientes — Diseñar con IA antes de escribir código',
  description: DESCRIPTION,
  url: `${SITE_URL}/slides/decisiones-conscientes/`,
  inLanguage: 'es',
  author: AUTHOR,
  about: ['Inteligencia Artificial', 'Diseño de software', 'Spec-driven development'],
}

export default function DecisionesConscientesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={talkJsonLd} />

      <section className="lib-hero">
        <div className="lib-hero__badge">
          <Presentation size={14} />
          <span>Charla técnica · IA + diseño de software</span>
        </div>
        <h1 className="lib-hero__title">
          <span className="gradient-text">Decisiones conscientes</span>
        </h1>
        <p className="lib-hero__tagline">
          Diseñar con IA <span className="lib-hero__tagline-accent">antes</span> de escribir código —
          el método <code>/spec</code> en vivo.
        </p>
        <div className="lib-hero__actions">
          <a
            href={DECK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lib-hero__cta lib-hero__cta--primary"
          >
            Abrir presentación <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="lib-section">
        <div
          id="deck-embed"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <iframe
            id="deck-frame"
            src={DECK_URL}
            title="Deck: Decisiones conscientes"
            loading="lazy"
            scrolling="no"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1280px',
              height: '720px',
              border: 0,
              transformOrigin: 'top left',
            }}
          />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var b=document.getElementById('deck-embed'),f=document.getElementById('deck-frame');if(!b||!f)return;function fit(){var s=b.clientWidth/1280;if(s>0)f.style.transform='scale('+s+')';}if(window.ResizeObserver){new ResizeObserver(fit).observe(b);}else{window.addEventListener('resize',fit);}requestAnimationFrame(fit);})();",
          }}
        />
        <p
          className="lib-section__subtitle"
          style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}
        >
          Una vista previa interactiva. Pulsa <strong>Abrir presentación</strong> para verla a
          pantalla completa (← → para navegar, <strong>Ctrl E</strong> para saltar de slide).
        </p>
      </section>

      <section className="lib-section">
        <h2 className="lib-section__title">Sobre la charla</h2>
        <p className="lib-section__subtitle">
          El mundo habla de IA que <em>escribe</em> código. Esta charla trata de IA que te ayuda a{' '}
          <em>pensar</em>: articular la tensión, sopesar tradeoffs y dejar las decisiones por escrito —
          incluidas las que rechazas— para que tú (o un agente) implementen sin perder contexto. Recorre
          el método <code>/spec</code> de principio a fin, con el ejemplo real de{' '}
          <a href="https://github.com/CristianLlanos/anvil" target="_blank" rel="noopener noreferrer">
            anvil
          </a>
          .
        </p>
      </section>

      <section className="lib-section" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <h2 className="lib-section__title">Recursos</h2>
        <div className="lib-hero__actions">
          <a
            href="https://github.com/CristianLlanos/anvil"
            target="_blank"
            rel="noopener noreferrer"
            className="lib-hero__cta lib-hero__cta--secondary"
          >
            <Github size={16} /> anvil — el ejemplo
          </a>
          <a
            href="https://github.com/CristianLlanos/spec-skill"
            target="_blank"
            rel="noopener noreferrer"
            className="lib-hero__cta lib-hero__cta--secondary"
          >
            <Github size={16} /> spec — el skill
          </a>
        </div>
      </section>
    </>
  )
}
