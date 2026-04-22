import type { Metadata } from 'next'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Changelog — kotlin-events',
  description:
    'Release history for kotlin-events — a type-safe event bus for Kotlin.',
  alternates: { canonical: `${SITE_URL}${BASE}/changelog/` },
  openGraph: {
    title: 'Changelog — kotlin-events',
    description: 'Release history and notable changes across every version.',
    url: `${SITE_URL}${BASE}/changelog/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-changelog.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — kotlin-events',
    description: 'Release history and notable changes.',
    images: [`${SITE_URL}/img/og/kotlin-events-changelog.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'kotlin-events Changelog',
  description: 'Release history for kotlin-events — a type-safe event bus for Kotlin.',
  url: `${SITE_URL}${BASE}/changelog/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Changelog', url: `${BASE}/changelog/` },
])

const releases = [
  {
    version: '1.0.0',
    date: '2026-04-21',
    added: [
      <>Multi-module architecture: <code>events-core</code> (synchronous) and <code>events-coroutines</code> (suspending)</>,
      <>Type-safe event bus with DI-resolved listeners via <code>Listener&lt;T&gt;</code> and <code>SuspendingListener&lt;T&gt;</code></>,
      <>Lambda listeners (<code>on</code>), one-shot listeners (<code>once</code>), and catch-all (<code>onAny</code>)</>,
      <>Middleware pipeline with <code>use</code> — intercept dispatch for logging, metrics, or short-circuiting</>,
      <>Registration DSL for bulk event-listener mappings</>,
      <>Event hierarchy dispatch — parent listeners receive child events</>,
      <>Thread-safe implementation with snapshot-based dispatch and <code>AtomicBoolean</code> once guarantees</>,
      <>Error resilience — remaining listeners execute after failures, errors collected into <code>CompositeEventException</code></>,
      <>Suspend <code>onError</code> handler in coroutines module</>,
      <>Interface segregation: <code>Emitter</code>, <code>Subscriber</code>, <code>Inspector</code></>,
      <><code>EventServiceProvider</code> and <code>SuspendingEventServiceProvider</code> for container integration</>,
      'Reified extension functions for ergonomic type-safe API',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
        <header className="guide-content__header">
          <h1 className="guide-content__title">Changelog</h1>
          <p className="guide-content__lead">
            All notable changes to kotlin-events.
          </p>
        </header>

        {releases.map((release) => (
          <section key={release.version} className="changelog-release">
            <h2 className="changelog-release__version">
              {release.version}
              <span className="changelog-release__date">{release.date}</span>
            </h2>
            {release.added && (
              <>
                <h3 className="changelog-release__label changelog-release__label--added">Added</h3>
                <ul>
                  {release.added.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ))}
      </article>
    </>
  )
}
