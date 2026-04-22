import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, Package, ArrowRight, Shield, Layers, Zap, Box, RefreshCw, Code2 } from 'lucide-react'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { CodeBlock } from './code'
import { SITE_URL, BASE, VERSION, REPO_URL } from './constants'

export const metadata: Metadata = {
  title: 'kotlin-events — Type-Safe Event Bus for Kotlin',
  description:
    'A lightweight, type-safe event bus for Kotlin with DI-resolved listeners, middleware pipeline, coroutines support, and thread safety.',
  keywords: [
    'kotlin event bus',
    'kotlin events',
    'kotlin event dispatcher',
    'kotlin listener pattern',
    'kotlin dependency injection events',
    'kotlin middleware pipeline',
    'kotlin coroutines event bus',
    'kotlin observer pattern',
    'kotlin pub sub',
    'kotlin event driven architecture',
  ],
  openGraph: {
    title: 'kotlin-events — Type-Safe Event Bus for Kotlin',
    description:
      'DI-resolved listeners, middleware pipeline, coroutines support, and thread safety — lightweight and type-safe.',
    url: `${SITE_URL}/projects/kotlin-events/`,
    type: 'website',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events.png`, width: 1200, height: 630, alt: 'kotlin-events — Type-Safe Event Bus for Kotlin' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kotlin-events — Type-Safe Event Bus for Kotlin',
    description:
      'DI-resolved listeners, middleware, coroutines — lightweight and thread-safe.',
    images: [`${SITE_URL}/img/og/kotlin-events.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/projects/kotlin-events/`,
    languages: {
      es: `${SITE_URL}/blog/eventos-en-kotlin-con-inyeccion-de-dependencias/`,
    },
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: '/projects/kotlin-events/' },
])

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'kotlin-events',
  description:
    'A lightweight, type-safe event bus for Kotlin with DI-resolved listeners, middleware pipeline, coroutines support, and thread safety.',
  url: `${SITE_URL}/projects/kotlin-events/`,
  codeRepository: REPO_URL,
  programmingLanguage: 'Kotlin',
  runtimePlatform: 'JVM',
  version: VERSION,
  license: 'https://opensource.org/licenses/MIT',
  author: AUTHOR,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is kotlin-events?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'kotlin-events is a lightweight, type-safe event bus for Kotlin. Listeners are resolved from a DI container on each emit, so their dependencies are auto-injected. It includes a middleware pipeline, lambda and one-shot listeners, and full thread safety.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does kotlin-events support coroutines?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The events-coroutines module adds suspending listeners and a suspend emit function. You can mix synchronous and suspending handlers on the same bus, and the onError handler is also a suspend function.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is kotlin-events thread-safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Both EventBus and SuspendingEventBus use synchronized state with snapshot-based dispatch. You can subscribe, unsubscribe, emit, and clear concurrently. One-shot listeners are guaranteed to fire at most once, even under concurrent or reentrant emit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which module should I use — events-core or events-coroutines?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use events-core if your listeners only do synchronous work. Use events-coroutines if any listener needs to call suspend functions (database writes, HTTP requests, channel sends). events-coroutines includes events-core as a transitive dependency, so you only need one line.',
      },
    },
  ],
}

const features = [
  {
    icon: Zap,
    title: 'Type-Safe Events',
    href: `${BASE}/guide`,
    description:
      'Events are data classes. Listeners are generic. The compiler catches type mismatches at build time.',
  },
  {
    icon: Box,
    title: 'DI-Resolved Listeners',
    href: `${BASE}/guide`,
    description:
      'Listeners are resolved from the container on each emit — dependencies auto-injected, no manual wiring.',
  },
  {
    icon: Code2,
    title: 'Lambda & One-Shot',
    href: `${BASE}/listeners`,
    description:
      'Inline handlers, auto-unsubscribing one-shots, and catch-all listeners without creating a class.',
  },
  {
    icon: Layers,
    title: 'Middleware Pipeline',
    href: `${BASE}/middleware`,
    description:
      'Intercept every dispatch for logging, metrics, or tracing. Call next to continue or omit to short-circuit.',
  },
  {
    icon: RefreshCw,
    title: 'Coroutines Support',
    href: `${BASE}/coroutines`,
    description:
      'Suspending listeners and emit. Mix sync and async handlers on the same bus.',
  },
  {
    icon: Shield,
    title: 'Thread-Safe',
    href: `${BASE}/advanced`,
    description:
      'Snapshot-based dispatch, atomic once, concurrent subscribe/emit/clear from any thread.',
  },
]

const guides = [
  { href: `${BASE}/guide`, title: 'Getting Started', desc: 'Install, define events and listeners, wire up with a DI container.' },
  { href: `${BASE}/listeners`, title: 'Listeners', desc: 'Lambda handlers, one-shot, catch-all, registration DSL, unsubscribe.' },
  { href: `${BASE}/middleware`, title: 'Middleware & Errors', desc: 'Middleware pipeline, error resilience, inspector, event hierarchy.' },
  { href: `${BASE}/coroutines`, title: 'Coroutines', desc: 'Suspending listeners and emit, mixed handlers, incremental migration.' },
  { href: `${BASE}/advanced`, title: 'Advanced', desc: 'Thread safety, interface segregation, once guarantees.' },
  { href: `${BASE}/api`, title: 'API Reference', desc: 'Complete public API: interfaces, extension functions, types, and exceptions.' },
  { href: `${BASE}/changelog`, title: 'Changelog', desc: 'Release history and notable changes.' },
]

export default function KotlinEventsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero */}
      <section className="lib-hero">
        <div className="lib-hero__badge">
          <Package size={14} />
          <span>v{VERSION} on Maven Central</span>
        </div>
        <h1 className="lib-hero__title">
          <span className="gradient-text">kotlin-events</span>
        </h1>
        <p className="lib-hero__tagline">
          Type-safe event bus for Kotlin.{' '}
          <span className="lib-hero__tagline-accent">
            DI-resolved listeners, middleware, coroutines
          </span>{' '}
          — lightweight and thread-safe.
        </p>
        <div className="lib-hero__install">
          <code>{`implementation("com.cristianllanos:events:${VERSION}")`}</code>
        </div>
        <div className="lib-hero__actions">
          <a href="#quick-start" className="lib-hero__cta lib-hero__cta--primary">
            Quick Start <ArrowRight size={16} />
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="lib-hero__cta lib-hero__cta--secondary">
            <Github size={16} /> GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="lib-features">
        <h2 className="lib-section__title">Features</h2>
        <div className="lib-features__grid">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href} className="lib-feature">
              <div className="lib-feature__icon">
                <feature.icon size={20} />
              </div>
              <h3 className="lib-feature__title">{feature.title}</h3>
              <p className="lib-feature__desc">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="lib-section" id="quick-start">
        <h2 className="lib-section__title">Quick Start</h2>
        <p className="lib-section__subtitle">
          Define events as data classes, listeners with injected dependencies, and emit.
        </p>
        <div className="lib-code">
          <CodeBlock code={`data class UserCreated(val name: String) : Event

class SendWelcomeEmail(private val mailer: Mailer) : Listener<UserCreated> {
    override fun handle(event: UserCreated) {
        mailer.send("Welcome, \${event.name}!")
    }
}

val container = Container()
EventServiceProvider().register(container)

val bus = container.resolve<EventBus>()
bus.subscribe<UserCreated, SendWelcomeEmail>()
bus.emit(UserCreated("Alice"))`} />
        </div>
      </section>

      {/* Lambda & One-Shot */}
      <section className="lib-section">
        <h2 className="lib-section__title">Lambda & One-Shot Listeners</h2>
        <p className="lib-section__subtitle">
          Inline handlers without creating a class. One-shots auto-unsubscribe after the first invocation.
        </p>
        <div className="lib-code">
          <CodeBlock code={`val sub = bus.on<UserCreated> { event ->
    println("New user: \${event.name}")
}
sub.cancel()

bus.once<UserCreated> { event ->
    println("First user only: \${event.name}")
}

bus.onAny { event -> println("All events: $event") }`} />
        </div>
      </section>

      {/* Middleware */}
      <section className="lib-section">
        <h2 className="lib-section__title">Middleware</h2>
        <p className="lib-section__subtitle">
          Intercept event dispatch for cross-cutting concerns like timing, logging, or tracing.
        </p>
        <div className="lib-code">
          <CodeBlock code={`bus.use { event, next ->
    val start = System.nanoTime()
    next(event) // call next to continue the pipeline
    println("\${event::class.simpleName} in \${System.nanoTime() - start}ns")
}`} />
        </div>
      </section>

      {/* Coroutines */}
      <section className="lib-section">
        <h2 className="lib-section__title">Coroutines</h2>
        <p className="lib-section__subtitle">
          Suspending listeners and emit — mix sync and async handlers on the same bus.
        </p>
        <div className="lib-code">
          <CodeBlock code={`class AsyncWelcomeEmail(private val mailer: SuspendingMailer) : SuspendingListener<UserCreated> {
    override suspend fun handle(event: UserCreated) {
        mailer.send("Welcome, \${event.name}!")
    }
}

val bus = SuspendingEventBus(container)
bus.subscribeSuspending<UserCreated, AsyncWelcomeEmail>()
bus.on<UserCreated> { event -> delay(100); println(event.name) }

coroutineScope { bus.emit(UserCreated("Alice")) }`} />
        </div>
      </section>

      {/* Guides */}
      <section className="lib-guides">
        <h2 className="lib-section__title">Learn</h2>
        <div className="lib-guides__grid">
          {guides.map((guide, i) => (
            <Link key={guide.href} href={guide.href} className="lib-guide">
              <span className="lib-guide__number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="lib-guide__title">{guide.title}</h3>
                <p className="lib-guide__desc">{guide.desc}</p>
              </div>
              <ArrowRight size={16} className="lib-guide__arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lib-cta">
        <h2 className="lib-cta__title">Get started in seconds</h2>
        <p className="lib-cta__desc">
          Add the dependency, subscribe a listener, and emit. That&apos;s it.
        </p>
        <div className="lib-hero__actions">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="lib-hero__cta lib-hero__cta--primary">
            <Github size={16} /> View on GitHub
          </a>
          <a
            href="https://central.sonatype.com/artifact/com.cristianllanos/events"
            target="_blank"
            rel="noopener noreferrer"
            className="lib-hero__cta lib-hero__cta--secondary"
          >
            <Package size={16} /> Maven Central
          </a>
        </div>
      </section>
    </>
  )
}
