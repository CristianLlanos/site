import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE, VERSION } from '../../constants'

export const metadata: Metadata = {
  title: 'Coroutines — kotlin-events',
  description:
    'Suspending listeners and emit, mixed sync/async handlers, suspend onError, and incremental migration from events-core.',
  alternates: { canonical: `${SITE_URL}${BASE}/coroutines/` },
  openGraph: {
    title: 'Coroutines — kotlin-events',
    description: 'Suspending listeners and emit, mixed handlers, and incremental migration.',
    url: `${SITE_URL}${BASE}/coroutines/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coroutines — kotlin-events',
    description: 'Suspending listeners and emit, mixed handlers, and migration.',
    images: [`${SITE_URL}/img/og/kotlin-events-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Coroutines — kotlin-events',
  description: 'Suspending listeners and emit, mixed sync/async handlers, suspend onError, and incremental migration.',
  url: `${SITE_URL}${BASE}/coroutines/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Coroutines', url: `${BASE}/coroutines/` },
])

export default function CoroutinesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/coroutines`)}</p>
            <h1 className="guide-content__title">Coroutines</h1>
            <p className="guide-content__lead">
              The <code>events-coroutines</code> module adds suspending listeners, suspend emit,
              and mixed sync/async handlers.
            </p>
          </header>

          <section>
            <h2 id="suspending-listeners">Suspending listeners</h2>
            <p>
              Implement <code>SuspendingListener&lt;T&gt;</code> when your handler needs to perform
              suspend operations like database writes, HTTP requests, or channel sends:
            </p>
            <CodeBlock code={`class AsyncWelcomeEmail(private val mailer: SuspendingMailer) : SuspendingListener<UserCreated> {
    override suspend fun handle(event: UserCreated) {
        mailer.send("Welcome, \${event.name}!")
    }
}`} />
            <p>
              Register suspending listeners with <code>subscribeSuspending</code>:
            </p>
            <CodeBlock code={`val bus = SuspendingEventBus(container)
bus.subscribeSuspending<UserCreated, AsyncWelcomeEmail>()`} />
          </section>

          <section>
            <h2 id="suspending-emit">Suspending emit</h2>
            <p>
              <code>SuspendingEventBus.emit()</code> is a suspend function that awaits all handlers
              before returning. Call it from any coroutine scope:
            </p>
            <CodeBlock code={`coroutineScope {
    bus.emit(UserCreated("Alice"))
    // all listeners (sync and async) have completed here
}`} />
          </section>

          <section>
            <h2 id="mixed-handlers">Mixed handlers</h2>
            <p>
              A <code>SuspendingEventBus</code> accepts both <code>Listener</code> and{' '}
              <code>SuspendingListener</code> registrations on the same bus. Lambda handlers registered
              with <code>on</code> are suspending by default:
            </p>
            <CodeBlock code={`// Plain listener (sync)
bus.subscribe<UserCreated, AuditLogListener>()

// Suspending listener (async)
bus.subscribeSuspending<UserCreated, AsyncWelcomeEmail>()

// Lambda — suspending by default on SuspendingEventBus
bus.on<UserCreated> { event ->
    delay(100)
    println(event.name)
}`} />
            <p>
              All handlers run in sequence during <code>emit</code>, regardless of whether they
              are sync or async.
            </p>
          </section>

          <section>
            <h2 id="suspend-onerror">Suspend onError</h2>
            <p>
              In the coroutines module, <code>onError</code> is a suspend function, so you can perform
              async work like writing to a database or sending to a channel:
            </p>
            <CodeBlock code={`val bus = SuspendingEventBus(container, onError = { e ->
    errorChannel.send(e)
})`} />
          </section>

          <section>
            <h2 id="migration">Migration</h2>
            <p>
              You can migrate from <code>events-core</code> to <code>events-coroutines</code>
              incrementally:
            </p>
            <ol>
              <li>Add the <code>events-coroutines</code> dependency (it includes <code>events-core</code> transitively).</li>
              <li>Replace <code>EventBus</code> with <code>SuspendingEventBus</code> and <code>EventServiceProvider</code> with <code>SuspendingEventServiceProvider</code>.</li>
              <li>Existing <code>Listener</code> implementations work as-is — no changes needed.</li>
              <li>Convert listeners to <code>SuspendingListener</code> one at a time as needed.</li>
            </ol>
            <p>
              The coroutines module mirrors the core API one-to-one:
            </p>
            <CodeBlock code={`// Core                    →  Coroutines
// Listener<T>            →  SuspendingListener<T>
// Emitter                →  SuspendingEmitter
// Subscriber             →  SuspendingSubscriber
// EventBus               →  SuspendingEventBus
// EventServiceProvider   →  SuspendingEventServiceProvider`} />
            <CodeBlock lang="kotlin" code={`dependencies {
    implementation("com.cristianllanos:events-coroutines:${VERSION}")
}`} />
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Learn about{' '}
              <Link href={`${BASE}/advanced`}>thread safety, interface segregation, and once guarantees</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/coroutines`} />
      </article>
    </>
  )
}
