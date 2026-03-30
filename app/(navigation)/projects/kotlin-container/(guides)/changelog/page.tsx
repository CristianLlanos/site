import type { Metadata } from 'next'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { SITE_URL, BASE } from '../../constants'
import { CodeBlock } from '../../code'

export const metadata: Metadata = {
  title: 'Changelog — kotlin-container',
  description:
    'Release history for kotlin-container — a lightweight dependency injection container for Kotlin.',
  alternates: { canonical: `${SITE_URL}${BASE}/changelog/` },
  openGraph: {
    title: 'Changelog — kotlin-container',
    description: 'Release history and notable changes across every version.',
    url: `${SITE_URL}${BASE}/changelog/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-changelog.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — kotlin-container',
    description: 'Release history and notable changes.',
    images: [`${SITE_URL}/img/og/kotlin-container-changelog.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'kotlin-container Changelog',
  description: 'Release history for kotlin-container — a lightweight dependency injection container for Kotlin.',
  url: `${SITE_URL}${BASE}/changelog/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Changelog', url: `${BASE}/changelog/` },
])

const releases = [
  {
    version: '0.4.0',
    date: '2026-03-29',
    added: [
      'Thread-safe concurrent resolution: singletons created exactly once, scoped instances once per scope, per-thread circular dependency detection',
      <>Convenience extensions: <code>resolveOrNull</code>, <code>has</code>, <code>lazy</code> on <code>Resolver</code></>,
      <><code>Container {"{ }"}</code> DSL builder for setup-in-one-shot</>,
      <><code>scope(vararg providers) {"{ }"}</code> extension for scopes with pre-registered providers</>,
      'Concurrency test suite',
    ],
    changed: [
      <>Internal collections replaced with <code>ConcurrentHashMap</code>, <code>ThreadLocal</code>, <code>@Volatile</code>, and <code>synchronized</code> double-checked locking</>,
    ],
  },
  {
    version: '0.3.1',
    date: '2026-03-29',
    added: [
      'Circular dependency detection with clear error messages and resolution chain reporting',
      'Deep auto-resolution tests',
    ],
    changed: [
      'Improved parameter resolution handling',
      <>Enforced single-assignment constraint on scoped <code>onClose</code> hooks</>,
    ],
  },
  {
    version: '0.3.0',
    date: '2026-03-28',
    added: [
      <>Parameterless registration overloads: <code>singleton&lt;T&gt;()</code>, <code>factory&lt;T&gt;()</code>, <code>scoped&lt;T&gt;()</code> for auto-resolved constructors</>,
      <>Convention-based service providers with auto-resolved <code>register()</code> parameters</>,
    ],
  },
  {
    version: '0.2.0',
    date: '2026-03-28',
    added: [
      <>Scoped bindings with lifecycle management (<code>scoped</code>, <code>onClose</code>, <code>AutoCloseable</code> support)</>,
      'Nested scopes with cascading close',
      <><code>scope {"{ }"}</code> block-based syntax for automatic cleanup</>,
      <><code>Scope</code> interface extending <code>Container</code> and <code>AutoCloseable</code></>,
      'Published to Maven Central via Vanniktech plugin',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-03-28',
    added: [
      <>Core container with <code>factory</code> and <code>singleton</code> bindings</>,
      'Auto-resolution of concrete classes via Kotlin reflection',
      <>Service providers with <code>register()</code> convention</>,
      <>Callable injection via <code>call()</code></>,
      <><code>AutoResolver</code> pluggable strategy</>,
      <>Interface segregation: <code>Registrar</code>, <code>Resolver</code>, <code>Caller</code>, <code>Container</code></>,
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
            All notable changes to kotlin-container.
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
            {release.changed && (
              <>
                <h3 className="changelog-release__label changelog-release__label--changed">Changed</h3>
                <ul>
                  {release.changed.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {release.version === '0.4.0' && (
              <>
                <h3 className="changelog-release__label changelog-release__label--added">DSL Builder — Container {"{ }"}</h3>
                <CodeBlock code={`// Before (0.3.1)
val container = Container()
container.singleton<Logger> { ConsoleLogger() }
container.factory<PaymentGateway> { StripeGateway() }

// Now (0.4.0)
val container = Container {
    singleton<Logger> { ConsoleLogger() }
    factory<PaymentGateway> { StripeGateway() }
}`} />
                <h3 className="changelog-release__label changelog-release__label--added">Scope block — scope {"{ }"}</h3>
                <CodeBlock code={`// Before (0.3.1)
val scope = container.child()
scope.scoped<DbConnection> { DbConnection() }
val db = scope.resolve<DbConnection>()
// ... use db
scope.close()

// Now (0.4.0)
container.scope { scope ->
    val db = scope.resolve<DbConnection>()
    // ... use db
}  // auto-closes`} />
                <h3 className="changelog-release__label changelog-release__label--added">Scope with providers — scope(providers) {"{ }"}</h3>
                <CodeBlock code={`// Before (0.3.1)
val scope = container.child()
scope.register(RequestScopeProvider(request))
scope.register(LoggingProvider())
scope.resolve<RequestHandler>().handle()
scope.close()

// Now (0.4.0)
container.scope(RequestScopeProvider(request), LoggingProvider()) { scope ->
    scope.resolve<RequestHandler>().handle()
}  // auto-closes, providers pre-registered`} />
              </>
            )}
          </section>
        ))}
      </article>
    </>
  )
}
