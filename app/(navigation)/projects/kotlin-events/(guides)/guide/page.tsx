import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE, VERSION } from '../../constants'

export const metadata: Metadata = {
  title: 'Getting Started — kotlin-events',
  description:
    'Install kotlin-events, define events and listeners, and wire them up with a DI container in under a minute.',
  alternates: { canonical: `${SITE_URL}${BASE}/guide/` },
  openGraph: {
    title: 'Getting Started — kotlin-events',
    description: 'Install kotlin-events and emit your first event in under a minute.',
    url: `${SITE_URL}${BASE}/guide/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started — kotlin-events',
    description: 'Install kotlin-events and emit your first event in under a minute.',
    images: [`${SITE_URL}/img/og/kotlin-events-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Getting Started with kotlin-events',
  description: 'Install kotlin-events, define events and listeners, and wire them up with a DI container.',
  url: `${SITE_URL}${BASE}/guide/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Getting Started', url: `${BASE}/guide/` },
])

export default function GuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/guide`)}</p>
            <h1 className="guide-content__title">Getting Started</h1>
            <p className="guide-content__lead">
              Install kotlin-events, define events and listeners, and emit your first event.
            </p>
          </header>

          <section>
            <h2 id="installation">Installation</h2>
            <p>Add the dependency to your <code>build.gradle.kts</code>:</p>
            <CodeBlock lang="kotlin" code={`dependencies {
    implementation("com.cristianllanos:events:${VERSION}")
}`} />
            <p>
              If your listeners need to call suspend functions, use the coroutines module instead — it
              includes <code>events-core</code> as a transitive dependency:
            </p>
            <CodeBlock lang="kotlin" code={`dependencies {
    implementation("com.cristianllanos:events-coroutines:${VERSION}")
}`} />
            <p>
              Both modules pull in{' '}
              <Link href="/projects/kotlin-container">kotlin-container</Link>{' '}
              for dependency injection.
            </p>
          </section>

          <section>
            <h2 id="events-and-listeners">Events and listeners</h2>
            <p>
              Events are data classes that implement <code>Event</code>. Listeners implement{' '}
              <code>Listener&lt;T&gt;</code> with a typed <code>handle</code> method:
            </p>
            <CodeBlock code={`data class UserCreated(val name: String) : Event

class SendWelcomeEmail(private val mailer: Mailer) : Listener<UserCreated> {
    override fun handle(event: UserCreated) {
        mailer.send("Welcome, \${event.name}!")
    }
}`} />
            <p>
              Listeners are resolved from the DI container on each emit, so their constructor
              dependencies are auto-injected. No manual wiring needed.
            </p>
          </section>

          <section>
            <h2 id="wiring-up">Wiring up</h2>
            <p>
              Create an <code>EventBus</code>, subscribe listeners to event types, and emit:
            </p>
            <CodeBlock code={`val bus = EventBus(container)
bus.subscribe<UserCreated, SendWelcomeEmail>()
bus.emit(UserCreated("Alice"))`} />
            <p>
              The <code>EventBus</code> factory takes a <code>Resolver</code> (any{' '}
              <Link href="/projects/kotlin-container">kotlin-container</Link> <code>Container</code>{' '}
              implements this). When you emit an event, the bus resolves each registered listener class
              from the container and calls <code>handle</code>.
            </p>
          </section>

          <section>
            <h2 id="service-provider">Service provider</h2>
            <p>
              <code>EventServiceProvider</code> registers <code>EventBus</code>, <code>Emitter</code>,
              and <code>Subscriber</code> as singletons in a container:
            </p>
            <CodeBlock code={`val container = Container()
EventServiceProvider().register(container)

val bus = container.resolve<EventBus>()
bus.subscribe<UserCreated, SendWelcomeEmail>()
bus.emit(UserCreated("Alice"))`} />
            <p>
              This is the recommended setup — the bus is shared across your application, and any
              component resolved from the container can receive <code>Emitter</code> or{' '}
              <code>Subscriber</code> through constructor injection.
            </p>
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Now that you have a working event bus, learn about{' '}
              <Link href={`${BASE}/listeners`}>lambda handlers, one-shots, and the registration DSL</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/guide`} />
      </article>
    </>
  )
}
