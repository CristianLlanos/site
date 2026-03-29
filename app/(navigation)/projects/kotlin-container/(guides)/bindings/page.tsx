import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Bindings — kotlin-container',
  description:
    'Learn how to register factory, singleton, and scoped bindings in kotlin-container. Bind interfaces to implementations, use auto-resolution, and wire shared instances.',
  alternates: { canonical: `${SITE_URL}${BASE}/bindings/` },
  openGraph: {
    title: 'Bindings — kotlin-container',
    description: 'Factory, singleton, and scoped bindings — control how instances are created and shared.',
    url: `${SITE_URL}${BASE}/bindings/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-bindings.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bindings — kotlin-container',
    description: 'Factory, singleton, and scoped — control how instances are created and shared.',
    images: [`${SITE_URL}/img/og/kotlin-container-bindings.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Bindings in kotlin-container',
  description: 'Learn how to register factory, singleton, and scoped bindings in kotlin-container.',
  url: `${SITE_URL}${BASE}/bindings/`,
  author: { '@type': 'Person', name: 'Cristian Llanos', url: SITE_URL },
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Bindings', url: `${BASE}/bindings/` },
])

export default function BindingsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticle) }}
      />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/bindings`)}</p>
            <h1 className="guide-content__title">Bindings</h1>
            <p className="guide-content__lead">
              Control how instances are created and shared across your application.
            </p>
          </header>

          <section>
            <h2 id="three-lifetimes">Three lifetimes</h2>
            <div className="guide-table">
              <table>
                <thead>
                  <tr>
                    <th>Lifetime</th>
                    <th>Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>factory</code></td>
                    <td>New instance every <code>resolve()</code> call</td>
                  </tr>
                  <tr>
                    <td><code>singleton</code></td>
                    <td>One instance forever (global)</td>
                  </tr>
                  <tr>
                    <td><code>scoped</code></td>
                    <td>One instance per scope</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 id="binding-interfaces">Binding interfaces to implementations</h2>
            <p>
              Use <code>factory</code> or <code>singleton</code> when you need explicit control —
              typically for binding interfaces to concrete classes:
            </p>
            <CodeBlock code={`val container = Container()

// New instance every time
container.factory<PaymentGateway> { StripeGateway() }

// Shared instance (created once, reused)
container.singleton<NotificationService> { SlackNotificationService() }`} />
          </section>

          <section>
            <h2 id="auto-resolved-registration">Auto-resolved registration</h2>
            <p>
              For concrete classes that just need a specific lifetime, skip the lambda entirely.
              The container auto-resolves the constructor dependencies:
            </p>
            <CodeBlock code={`container.singleton<TenantService>()
container.singleton<CalendarService>()
container.scoped<RequestContext>()
container.factory<TempProcessor>()

// Equivalent to:
container.singleton<TenantService> { resolve() }`} />
          </section>

          <section>
            <h2 id="resolve-inside-lambdas">Using resolve() inside lambdas</h2>
            <p>
              Inside registration lambdas, <code>resolve&lt;T&gt;()</code> is available to reference
              other bindings. This is useful when one binding depends on another, or when the same
              implementation backs multiple interfaces:
            </p>
            <CodeBlock code={`container.singleton<EventBus> { EventBus(this) }
container.singleton<Emitter> { resolve<EventBus>() }
container.singleton<Subscriber> { resolve<EventBus>() }`} />
            <p>
              <code>this</code> refers to the container itself, so you can pass it directly to
              classes that need it. <code>resolve&lt;T&gt;()</code> pulls from the container's
              registry, letting you wire shared instances across multiple interface bindings.
            </p>
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Learn how <Link href={`${BASE}/scopes`}>scopes</Link> give you per-context
              instance management with automatic cleanup.
            </p>
          </section>

          <GuideNav current={`${BASE}/bindings`} />
      </article>
    </>
  )
}
