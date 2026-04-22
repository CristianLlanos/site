import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Listeners — kotlin-events',
  description:
    'Lambda handlers, one-shot listeners, catch-all, multiple listeners, registration DSL, and unsubscribe.',
  alternates: { canonical: `${SITE_URL}${BASE}/listeners/` },
  openGraph: {
    title: 'Listeners — kotlin-events',
    description: 'Lambda handlers, one-shot listeners, catch-all, registration DSL, and unsubscribe.',
    url: `${SITE_URL}${BASE}/listeners/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listeners — kotlin-events',
    description: 'Lambda handlers, one-shot listeners, catch-all, registration DSL, and unsubscribe.',
    images: [`${SITE_URL}/img/og/kotlin-events-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Listeners — kotlin-events',
  description: 'Lambda handlers, one-shot listeners, catch-all, multiple listeners, registration DSL, and unsubscribe.',
  url: `${SITE_URL}${BASE}/listeners/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Listeners', url: `${BASE}/listeners/` },
])

export default function ListenersPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/listeners`)}</p>
            <h1 className="guide-content__title">Listeners</h1>
            <p className="guide-content__lead">
              Beyond class-based listeners — inline handlers, one-shots, catch-all, and bulk registration.
            </p>
          </header>

          <section>
            <h2 id="lambda-listeners">Lambda listeners</h2>
            <p>
              Register inline handlers without creating a class. The <code>on</code> method returns a{' '}
              <code>Subscription</code> you can cancel later:
            </p>
            <CodeBlock code={`val subscription = bus.on<UserCreated> { event ->
    println("New user: \${event.name}")
}

// later...
subscription.cancel()`} />
          </section>

          <section>
            <h2 id="one-shot">One-shot listeners</h2>
            <p>
              Listeners that fire once and auto-unsubscribe. Works with both lambdas and classes:
            </p>
            <CodeBlock code={`// Lambda one-shot
bus.once<UserCreated> { event ->
    println("First user: \${event.name}")
}

// Class-based one-shot
bus.once<UserCreated, SendWelcomeEmail>()`} />
            <p>
              One-shot listeners are guaranteed to fire at most once, even under concurrent or
              reentrant emit. See <Link href={`${BASE}/advanced#once-guarantees`}>Advanced → Once guarantees</Link>.
            </p>
          </section>

          <section>
            <h2 id="catch-all">Catch-all listener</h2>
            <p>
              Receive every event regardless of type — useful for logging, metrics, or debugging:
            </p>
            <CodeBlock code={`bus.onAny { event ->
    println("Event emitted: \${event::class.simpleName}")
}`} />
          </section>

          <section>
            <h2 id="multiple-listeners">Multiple listeners</h2>
            <p>
              Register several listener classes for the same event in one call:
            </p>
            <CodeBlock code={`bus.subscribe<UserCreated>(
    SendWelcomeEmail::class,
    AuditLogListener::class,
    AnalyticsListener::class,
)`} />
          </section>

          <section>
            <h2 id="registration-dsl">Registration DSL</h2>
            <p>
              Bulk-register event-listener mappings with a DSL block:
            </p>
            <CodeBlock code={`bus.register {
    UserCreated::class mappedTo listOf(SendWelcomeEmail::class, LogNewUser::class)
    OrderPlaced::class mappedTo listOf(NotifyWarehouse::class)
}`} />
          </section>

          <section>
            <h2 id="unsubscribe-and-clear">Unsubscribe and clear</h2>
            <p>
              Remove a specific class-based listener or clear everything:
            </p>
            <CodeBlock code={`// Remove a specific listener
bus.unsubscribe<UserCreated, SendWelcomeEmail>()

// Remove all listeners and middleware
bus.clear()`} />
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Learn how to intercept dispatch with{' '}
              <Link href={`${BASE}/middleware`}>middleware and handle errors gracefully</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/listeners`} />
      </article>
    </>
  )
}
