import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, Package, ArrowRight, Shield, Layers, Zap, Box, RefreshCw, Code2 } from 'lucide-react'
import { breadcrumbList } from '@/lib/structured-data'
import { CodeBlock } from './code'
import { SITE_URL, BASE, VERSION, REPO_URL } from './constants'

export const metadata: Metadata = {
  title: 'kotlin-container — Lightweight Dependency Injection for Kotlin',
  description:
    'A lightweight, thread-safe dependency injection container for Kotlin. Constructor auto-resolution, scoped lifecycles, service providers — no code generation, no annotations, zero configuration.',
  keywords: [
    'kotlin dependency injection',
    'kotlin DI container',
    'kotlin IoC container',
    'kotlin service container',
    'constructor injection kotlin',
    'lightweight DI kotlin',
    'kotlin auto-resolution',
    'dependency injection without annotations',
    'kotlin service provider',
    'kotlin scoped lifecycle',
  ],
  openGraph: {
    title: 'kotlin-container — Lightweight DI for Kotlin',
    description:
      'Constructor auto-resolution, scoped lifecycles, service providers, and thread safety — no code generation, no annotations, zero configuration.',
    url: `${SITE_URL}/projects/kotlin-container/`,
    type: 'website',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container.png`, width: 1200, height: 630, alt: 'kotlin-container — Lightweight Dependency Injection for Kotlin' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kotlin-container — Lightweight DI for Kotlin',
    description:
      'Constructor auto-resolution, scoped lifecycles, service providers — zero configuration.',
    images: [`${SITE_URL}/img/og/kotlin-container.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/projects/kotlin-container/`,
    languages: {
      es: `${SITE_URL}/blog/inyeccion-de-dependencias-en-kotlin-sin-configuracion/`,
    },
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: '/projects/kotlin-container/' },
])

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'kotlin-container',
  description:
    'A lightweight, thread-safe dependency injection container for Kotlin with constructor auto-resolution, scoped lifecycles, and service providers.',
  url: `${SITE_URL}/projects/kotlin-container/`,
  codeRepository: REPO_URL,
  programmingLanguage: 'Kotlin',
  runtimePlatform: 'JVM',
  version: VERSION,
  license: 'https://opensource.org/licenses/MIT',
  author: {
    '@type': 'Person',
    name: 'Cristian Llanos',
    url: SITE_URL,
  },
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
      name: 'What is kotlin-container?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'kotlin-container is a lightweight, thread-safe dependency injection container for Kotlin. It provides constructor auto-resolution, scoped lifecycles, and service providers with no code generation, no annotations, and zero configuration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does kotlin-container require annotations or code generation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. kotlin-container uses constructor reflection to auto-resolve concrete classes. There are no annotations to add and no code generation step — just create a Container and resolve your dependencies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is kotlin-container thread-safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Singletons are created exactly once even under contention, scoped instances are created once per scope, and circular dependency detection is per-thread with no false positives.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does kotlin-container support Android?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. kotlin-container runs on any Kotlin/JVM target including Android. Scoped bindings with dispose hooks are ideal for managing Activity or ViewModel lifecycles.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does auto-resolution work in kotlin-container?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When you call container.resolve<T>(), kotlin-container inspects T\'s primary constructor via reflection, recursively resolves each parameter, and builds the full dependency tree automatically. No manual registration is needed for concrete classes.',
      },
    },
  ],
}

const features = [
  {
    icon: Zap,
    title: 'Auto-Resolution',
    href: `${BASE}/guide`,
    description:
      'Concrete classes resolve automatically via constructor reflection. No registration, no annotations — just works.',
  },
  {
    icon: Layers,
    title: 'Scoped Lifecycles',
    href: `${BASE}/scopes`,
    description:
      'Factory, singleton, and scoped bindings with nested scopes, dispose hooks, and AutoCloseable support.',
  },
  {
    icon: Shield,
    title: 'Thread-Safe',
    href: `${BASE}/advanced`,
    description:
      'Singletons created exactly once under contention. Per-thread circular dependency detection with no false positives.',
  },
  {
    icon: Box,
    title: 'Service Providers',
    href: `${BASE}/providers`,
    description:
      'Group registrations into providers with auto-resolved parameters. Clean, modular setup.',
  },
  {
    icon: RefreshCw,
    title: 'Callable Injection',
    href: `${BASE}/advanced`,
    description:
      'Invoke any function with dependencies resolved from the container. Works with free functions and instance methods.',
  },
  {
    icon: Code2,
    title: 'Interface Segregation',
    href: `${BASE}/advanced`,
    description:
      'Registrar, Resolver, Caller, Container, Scope — give each part of your code only the access it needs.',
  },
]

const guides = [
  { href: `${BASE}/guide`, title: 'Getting Started', desc: 'Install, create a container, resolve your first dependency tree.' },
  { href: `${BASE}/bindings`, title: 'Bindings', desc: 'Factory, singleton, and scoped — control how instances are created and shared.' },
  { href: `${BASE}/scopes`, title: 'Scopes', desc: 'Lifecycle management, dispose hooks, nested scopes, and contextual environments.' },
  { href: `${BASE}/providers`, title: 'Service Providers', desc: 'Group registrations into reusable, modular units with auto-resolved parameters.' },
  { href: `${BASE}/advanced`, title: 'Advanced', desc: 'Thread safety, callable injection, custom resolvers, and interface segregation.' },
  { href: `${BASE}/api`, title: 'API Reference', desc: 'Complete public API: interfaces, extension functions, types, and exceptions.' },
  { href: `${BASE}/changelog`, title: 'Changelog', desc: 'Release history and notable changes.' },
]

export default function KotlinContainerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="lib-hero">
        <div className="lib-hero__badge">
          <Package size={14} />
          <span>v{VERSION} on Maven Central</span>
        </div>
        <h1 className="lib-hero__title">
          <span className="gradient-text">kotlin-container</span>
        </h1>
        <p className="lib-hero__tagline">
          Lightweight dependency injection for Kotlin.{' '}
          <span className="lib-hero__tagline-accent">
            Auto-resolution, scoped lifecycles, thread safety
          </span>{' '}
          — no code generation, no annotations, zero configuration.
        </p>
        <div className="lib-hero__install">
          <code>{`implementation("com.cristianllanos:container:${VERSION}")`}</code>
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
          Concrete classes resolve automatically — no registration needed.
        </p>
        <div className="lib-code">
          <CodeBlock code={`class Logger
class UserRepository(val logger: Logger)
class UserService(val repo: UserRepository)

val container = Container()
val service = container.resolve<UserService>()
// resolves Logger → UserRepository → UserService automatically`} />
        </div>
      </section>

      {/* Bindings */}
      <section className="lib-section">
        <h2 className="lib-section__title">Bindings</h2>
        <p className="lib-section__subtitle">
          Use factory, singleton, or scoped when you need explicit control.
        </p>
        <div className="lib-code">
          <CodeBlock code={`val container = Container {
    // New instance every time
    factory<PaymentGateway> { StripeGateway() }

    // One instance forever
    singleton<NotificationService> { SlackNotificationService() }

    // One instance per scope
    scoped<DbConnection> { DbConnection(resolve<Config>()) }
}

// Auto-resolved registration (no lambda needed)
container.singleton<TenantService>()
container.factory<TempProcessor>()`} />
        </div>
      </section>

      {/* Scopes */}
      <section className="lib-section">
        <h2 className="lib-section__title">Scoped Lifecycles</h2>
        <p className="lib-section__subtitle">
          One instance per scope — shared within a context, isolated between contexts.
        </p>
        <div className="lib-code">
          <CodeBlock code={`container.scoped<DbConnection> { DbConnection() }
    .onClose { it.disconnect() }

container.scope { scope ->
    val db = scope.resolve<DbConnection>()   // created once
    scope.resolve<DbConnection>()            // same instance
}  // scope closes → db.disconnect() called

// Nested scopes cascade close (deepest first)
// AutoCloseable instances close automatically`} />
        </div>
      </section>

      {/* Service Providers */}
      <section className="lib-section">
        <h2 className="lib-section__title">Service Providers</h2>
        <p className="lib-section__subtitle">
          Group related registrations. Parameters are auto-resolved from the container.
        </p>
        <div className="lib-code">
          <CodeBlock code={`class AuthServiceProvider {
    fun register(container: Container) {
        container.singleton<TokenStore> { RedisTokenStore() }
        container.singleton<AuthGuard> { AuthGuard(resolve<TokenStore>()) }
    }
}

class EventServiceProvider {
    fun register(subscriber: Subscriber) {  // auto-resolved!
        subscriber.subscribe<OrderPlaced>(
            InventoryListener::class,
            NotificationListener::class,
        )
    }
}

val container = Container()
container.register(AuthServiceProvider(), EventServiceProvider())`} />
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
          Add the dependency, create a container, and resolve. That's it.
        </p>
        <div className="lib-hero__actions">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="lib-hero__cta lib-hero__cta--primary">
            <Github size={16} /> View on GitHub
          </a>
          <a
            href="https://central.sonatype.com/artifact/com.cristianllanos/container"
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
