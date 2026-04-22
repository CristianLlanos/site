import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Middleware & Errors — kotlin-events',
  description:
    'Middleware pipeline, error resilience, event bus inspector, and event hierarchy dispatch in kotlin-events.',
  alternates: { canonical: `${SITE_URL}${BASE}/middleware/` },
  openGraph: {
    title: 'Middleware & Errors — kotlin-events',
    description: 'Middleware pipeline, error resilience, inspector, and event hierarchy dispatch.',
    url: `${SITE_URL}${BASE}/middleware/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Middleware & Errors — kotlin-events',
    description: 'Middleware pipeline, error resilience, inspector, and event hierarchy.',
    images: [`${SITE_URL}/img/og/kotlin-events-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Middleware & Errors — kotlin-events',
  description: 'Middleware pipeline, error resilience, event bus inspector, and event hierarchy dispatch.',
  url: `${SITE_URL}${BASE}/middleware/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Middleware & Errors', url: `${BASE}/middleware/` },
])

export default function MiddlewarePage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/middleware`)}</p>
            <h1 className="guide-content__title">Middleware & Errors</h1>
            <p className="guide-content__lead">
              Intercept dispatch, handle errors gracefully, inspect the bus, and leverage event hierarchy.
            </p>
          </header>

          <section>
            <h2 id="middleware">Middleware</h2>
            <p>
              Middleware wraps the dispatch pipeline. Each middleware receives the event and a{' '}
              <code>next</code> function. Call <code>next(event)</code> to continue to the next
              middleware or the actual listener dispatch. Omit the call to short-circuit:
            </p>
            <CodeBlock code={`bus.use { event, next ->
    val start = System.nanoTime()
    next(event)
    println("\${event::class.simpleName} in \${System.nanoTime() - start}ns")
}`} />
            <p>
              You can register multiple middleware — they form a chain and execute in registration
              order. Middleware runs even when individual listeners throw errors.
            </p>
            <CodeBlock code={`// Logging middleware
bus.use { event, next ->
    println("Before: \${event::class.simpleName}")
    next(event)
    println("After: \${event::class.simpleName}")
}

// Auth gate — short-circuits if not authenticated
bus.use { event, next ->
    if (isAuthenticated()) next(event)
}`} />
            <p>
              Middleware is cleared when you call <code>bus.clear()</code>.
            </p>
          </section>

          <section>
            <h2 id="error-resilience">Error resilience</h2>
            <p>
              When a listener throws, remaining listeners still execute. Errors are collected and
              rethrown after all listeners have run. A single error is thrown directly; multiple
              errors are wrapped in <code>CompositeEventException</code>:
            </p>
            <CodeBlock code={`try {
    bus.emit(UserCreated("Alice"))
} catch (e: CompositeEventException) {
    e.errors.forEach { println(it.message) }
}`} />
            <p>
              Provide a custom error handler to change this behavior — for example, to log instead of throw:
            </p>
            <CodeBlock code={`val bus = EventBus(container, onError = { e ->
    logger.error("Dispatch failed", e)
})`} />
            <p>
              In the{' '}
              <Link href={`${BASE}/coroutines#suspend-onerror`}>coroutines module</Link>,{' '}
              <code>onError</code> is a suspend function.
            </p>
          </section>

          <section>
            <h2 id="inspector">Inspector</h2>
            <p>
              Query the event bus state at runtime:
            </p>
            <CodeBlock code={`bus.hasListeners<UserCreated>()   // true/false
bus.listenerCount<UserCreated>()  // number of registered listeners`} />
            <p>
              The <code>Inspector</code> interface counts both class-based and lambda listeners,
              including catch-all handlers.
            </p>
          </section>

          <section>
            <h2 id="event-hierarchy">Event hierarchy</h2>
            <p>
              Listeners registered for a parent event type are also invoked when a subtype is emitted.
              This lets you define broad handlers alongside specific ones:
            </p>
            <CodeBlock code={`interface DomainEvent : Event
data class UserCreated(val name: String) : DomainEvent
data class OrderPlaced(val id: String) : DomainEvent

// Receives UserCreated, OrderPlaced, and any future DomainEvent
bus.on<DomainEvent> { event -> println("Domain: $event") }

// Receives only UserCreated
bus.on<UserCreated> { event -> println("User: \${event.name}") }

bus.emit(UserCreated("Alice"))
// prints: "Domain: UserCreated(name=Alice)"
// prints: "User: Alice"`} />
            <p>
              The <code>onAny</code> catch-all works the same way — it&apos;s registered on the{' '}
              <code>Event</code> root type, so it receives everything.
            </p>
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              If your listeners need to call suspend functions, see the{' '}
              <Link href={`${BASE}/coroutines`}>coroutines module</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/middleware`} />
      </article>
    </>
  )
}
