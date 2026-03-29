import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Service Providers — kotlin-container',
  description:
    'Organize dependency registrations into reusable service providers with auto-resolved parameters. Group related bindings, wire event systems, and build modular Kotlin applications.',
  alternates: { canonical: `${SITE_URL}${BASE}/providers/` },
  openGraph: {
    title: 'Service Providers — kotlin-container',
    description: 'Modular, reusable registration groups with auto-resolved parameters.',
    url: `${SITE_URL}${BASE}/providers/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-providers.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Providers — kotlin-container',
    description: 'Modular, reusable registration groups with auto-resolved parameters.',
    images: [`${SITE_URL}/img/og/kotlin-container-providers.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Service Providers in kotlin-container',
  description: 'Organize dependency registrations into reusable service providers with auto-resolved parameters.',
  url: `${SITE_URL}${BASE}/providers/`,
  author: { '@type': 'Person', name: 'Cristian Llanos', url: SITE_URL },
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Service Providers', url: `${BASE}/providers/` },
])

export default function ProvidersPage() {
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
            <p className="guide-content__step">{guideStep(`${BASE}/providers`)}</p>
            <h1 className="guide-content__title">Service Providers</h1>
            <p className="guide-content__lead">
              Group related registrations into reusable, modular units.
            </p>
          </header>

          <section>
            <h2 id="basic-providers">Basic providers</h2>
            <p>
              Any class with a <code>register()</code> method works as a service provider.
              The simplest form takes the container as a parameter:
            </p>
            <CodeBlock code={`class AuthServiceProvider {
    fun register(container: Container) {
        container.singleton<TokenStore> { RedisTokenStore() }
        container.singleton<AuthGuard> { AuthGuard(resolve<TokenStore>()) }
    }
}

val container = Container()
container.register(AuthServiceProvider())`} />
          </section>

          <section>
            <h2 id="auto-resolved-parameters">Auto-resolved parameters</h2>
            <p>
              Providers can ask for any dependency, not just the container — parameters are
              auto-resolved:
            </p>
            <CodeBlock code={`class OrderEventProvider {
    fun register(subscriber: Subscriber) {
        subscriber.subscribe<OrderPlaced>(
            InventoryListener::class,
            NotificationListener::class,
        )
    }
}

// The container resolves Subscriber automatically
container.register(OrderEventProvider())`} />
            <p>
              This keeps providers decoupled from the container itself. They only depend
              on the interfaces they actually need.
            </p>
          </section>

          <section>
            <h2 id="registering-multiple-providers">Registering multiple providers</h2>
            <p>
              Pass multiple providers in one call for a clean bootstrap:
            </p>
            <CodeBlock code={`val container = Container()
container.register(
    AuthServiceProvider(),
    PaymentServiceProvider(),
    EventServiceProvider(),
    NotificationServiceProvider(),
)`} />
          </section>

          <section>
            <h2 id="scope-providers">Scope providers</h2>
            <p>
              Providers work with <Link href={`${BASE}/scopes`}>scopes</Link> to set up
              contextual environments. Define what each scope context needs:
            </p>
            <CodeBlock code={`class RequestScopeProvider(private val request: HttpRequest) {
    fun register(container: Container) {
        container.singleton<RequestId> { RequestId(request.id) }
        container.singleton<CurrentUser> { CurrentUser(request.userId) }
        container.scoped<DbTransaction> { DbTransaction(resolve<DataSource>()) }
            .onClose { it.rollbackIfOpen() }
    }
}

// Use with the shorthand extension
container.scope(RequestScopeProvider(request)) { scope ->
    scope.resolve<RequestHandler>().handle()
}`} />
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Explore <Link href={`${BASE}/advanced`}>advanced features</Link> like thread safety,
              callable injection, and interface segregation.
            </p>
          </section>

          <GuideNav current={`${BASE}/providers`} />
      </article>
    </>
  )
}
