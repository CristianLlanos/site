import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Advanced — kotlin-events',
  description:
    'Thread safety guarantees, interface segregation, and once-listener atomicity in kotlin-events.',
  alternates: { canonical: `${SITE_URL}${BASE}/advanced/` },
  openGraph: {
    title: 'Advanced — kotlin-events',
    description: 'Thread safety, interface segregation, and once guarantees.',
    url: `${SITE_URL}${BASE}/advanced/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced — kotlin-events',
    description: 'Thread safety, interface segregation, and once guarantees.',
    images: [`${SITE_URL}/img/og/kotlin-events-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Advanced — kotlin-events',
  description: 'Thread safety guarantees, interface segregation, and once-listener atomicity.',
  url: `${SITE_URL}${BASE}/advanced/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'Advanced', url: `${BASE}/advanced/` },
])

export default function AdvancedPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
          <header className="guide-content__header">
            <p className="guide-content__step">{guideStep(`${BASE}/advanced`)}</p>
            <h1 className="guide-content__title">Advanced</h1>
            <p className="guide-content__lead">
              Thread safety internals, interface segregation, and once-listener guarantees.
            </p>
          </header>

          <section>
            <h2 id="thread-safety">Thread safety</h2>
            <p>
              Both <code>EventBus</code> and <code>SuspendingEventBus</code> are fully thread-safe.
              You can subscribe, unsubscribe, emit, and clear concurrently from different threads or
              coroutines without external synchronization.
            </p>
            <p>
              The implementation uses <code>synchronized</code> blocks around all mutable state.
              Dispatch uses snapshot-based iteration — the listener list is copied under a lock before
              dispatch begins, so mutations during emit never cause{' '}
              <code>ConcurrentModificationException</code>:
            </p>
            <CodeBlock code={`// Safe: subscribe from one thread while emitting from another
thread { bus.subscribe<UserCreated, SendWelcomeEmail>() }
thread { bus.emit(UserCreated("Alice")) }

// Safe: cancel a subscription during emit
bus.on<UserCreated> { event ->
    if (event.name == "stop") subscription.cancel()
}`} />
            <p>
              The middleware chain is cached and invalidated only when <code>use()</code> or{' '}
              <code>clear()</code> is called, avoiding per-emit allocation.
            </p>
          </section>

          <section>
            <h2 id="interface-segregation">Interface segregation</h2>
            <p>
              The event bus is split into focused interfaces so each component receives only
              the capabilities it needs:
            </p>
            <CodeBlock code={`interface Emitter     // emit()
interface Subscriber  // subscribe(), unsubscribe(), on(), once(), use(), register(), clear()
interface Inspector   // hasListeners(), listenerCount()
interface EventBus : Emitter, Subscriber, Inspector`} />
            <p>
              Inject only what each part of your code requires:
            </p>
            <CodeBlock code={`class OrderService(private val events: Emitter) {
    fun placeOrder(order: Order) {
        // can only emit — cannot subscribe or inspect
        events.emit(OrderPlaced(order.id))
    }
}

class EventConfigurer(private val subscriber: Subscriber) {
    fun configure() {
        // can only subscribe — cannot emit
        subscriber.subscribe<OrderPlaced, NotifyWarehouse>()
    }
}`} />
            <p>
              The coroutines module follows the same pattern with <code>SuspendingEmitter</code>,{' '}
              <code>SuspendingSubscriber</code>, and <code>Inspector</code>.
            </p>
          </section>

          <section>
            <h2 id="once-guarantees">Once guarantees</h2>
            <p>
              One-shot listeners (<code>once()</code>) are guaranteed to fire at most once, even under
              concurrent or reentrant emit. The implementation uses <code>AtomicBoolean</code> to
              ensure exactly-once semantics:
            </p>
            <CodeBlock code={`// Guaranteed to print exactly once, even if emitted concurrently
bus.once<UserCreated> { event ->
    println("First: \${event.name}")
}

// Reentrant: emitting inside a handler doesn't double-fire once listeners
bus.once<UserCreated> { event ->
    bus.emit(UserCreated("reentrant"))
}`} />
            <p>
              If you cancel a once-subscription before it fires, it will never fire. If you cancel
              after it has already fired, the cancel is a no-op.
            </p>
          </section>

          <GuideNav current={`${BASE}/advanced`} />
      </article>
    </>
  )
}
