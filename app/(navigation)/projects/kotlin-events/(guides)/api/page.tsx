import type { Metadata } from 'next'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'API Reference — kotlin-events',
  description:
    'Complete API reference for kotlin-events: interfaces, factory functions, extension functions, types, and exceptions.',
  alternates: { canonical: `${SITE_URL}${BASE}/api/` },
  openGraph: {
    title: 'API Reference — kotlin-events',
    description: 'Complete public API — interfaces, factory functions, extension functions, types, and exceptions.',
    url: `${SITE_URL}${BASE}/api/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-events-api.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Reference — kotlin-events',
    description: 'Complete public API documentation for kotlin-events.',
    images: [`${SITE_URL}/img/og/kotlin-events-api.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'kotlin-events API Reference',
  description: 'Complete API reference: interfaces, factory functions, extension functions, types, and exceptions.',
  url: `${SITE_URL}${BASE}/api/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-events', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-events', url: `${BASE}/` },
  { name: 'API Reference', url: `${BASE}/api/` },
])

export default function ApiReferencePage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={techArticle} />
      <article className="guide-content">
        <header className="guide-content__header">
          <h1 className="guide-content__title">API Reference</h1>
          <p className="guide-content__lead">
            Complete public API surface of <code>com.cristianllanos.events</code> and{' '}
            <code>com.cristianllanos.events.coroutines</code>.
          </p>
        </header>

        <section id="core-interfaces">
          <h2>Core Interfaces (events-core)</h2>

          <h3 id="event"><code>Event</code></h3>
          <p>Marker interface for all events. Implement as a data class.</p>
          <CodeBlock code={`interface Event`} />

          <h3 id="listener"><code>Listener&lt;T : Event&gt;</code></h3>
          <p>Synchronous event handler. Resolved from the DI container on each emit.</p>
          <CodeBlock code={`interface Listener<T : Event> {
    fun handle(event: T)
}`} />

          <h3 id="emitter"><code>Emitter</code></h3>
          <p>Fires events to registered listeners.</p>
          <CodeBlock code={`interface Emitter {
    fun <T : Event> emit(event: T)
    fun emit(first: Event, vararg rest: Event)
}`} />

          <h3 id="subscriber"><code>Subscriber</code></h3>
          <p>Manages listener registration, middleware, and the registration DSL.</p>
          <CodeBlock code={`interface Subscriber {
    fun <E : Event, L : Listener<E>> subscribe(event: Class<E>, listener: Class<L>): Subscriber
    fun <E : Event> subscribe(event: Class<E>, vararg listeners: KClass<out Listener<E>>): Subscriber
    fun <E : Event, L : Listener<E>> unsubscribe(event: Class<E>, listener: Class<L>): Subscriber
    fun <E : Event> on(event: Class<E>, handler: (E) -> Unit): Subscription
    fun <E : Event, L : Listener<E>> once(event: Class<E>, listener: Class<L>): Subscriber
    fun <E : Event> once(event: Class<E>, handler: (E) -> Unit): Subscription
    fun onAny(handler: (Event) -> Unit): Subscription
    fun use(middleware: Middleware): Subscriber
    fun register(block: RegistrationDsl.() -> Unit): Subscriber
    fun clear()
}`} />

          <h3 id="inspector"><code>Inspector</code></h3>
          <p>Introspection into registered listeners.</p>
          <CodeBlock code={`interface Inspector {
    fun <E : Event> hasListeners(event: Class<E>): Boolean
    fun <E : Event> listenerCount(event: Class<E>): Int
}`} />

          <h3 id="eventbus"><code>EventBus</code></h3>
          <p>Combines Emitter, Subscriber, and Inspector.</p>
          <CodeBlock code={`interface EventBus : Emitter, Subscriber, Inspector`} />

          <h3 id="middleware"><code>Middleware</code></h3>
          <p>Intercepts event dispatch. Call <code>next</code> to continue or omit to short-circuit.</p>
          <CodeBlock code={`fun interface Middleware {
    fun handle(event: Event, next: (Event) -> Unit)
}`} />

          <h3 id="subscription"><code>Subscription</code></h3>
          <p>Handle returned by lambda registrations. Call <code>cancel()</code> to remove.</p>
          <CodeBlock code={`fun interface Subscription {
    fun cancel()
}`} />
        </section>

        <section id="factory-functions">
          <h2>Factory Functions</h2>

          <h3 id="eventbus-factory"><code>EventBus()</code></h3>
          <CodeBlock code={`fun EventBus(
    resolver: Resolver,
    onError: (Throwable) -> Unit = { throw it },
): EventBus`} />

          <h3 id="suspending-eventbus-factory"><code>SuspendingEventBus()</code></h3>
          <CodeBlock code={`fun SuspendingEventBus(
    resolver: Resolver,
    onError: suspend (Throwable) -> Unit = { throw it },
): SuspendingEventBus`} />
        </section>

        <section id="extension-functions">
          <h2>Extension Functions</h2>

          <h3 id="subscriber-extensions">Subscriber Extensions</h3>
          <CodeBlock code={`inline fun <reified E : Event, reified L : Listener<E>> Subscriber.subscribe(): Subscriber
inline fun <reified E : Event> Subscriber.subscribe(vararg listeners: KClass<out Listener<E>>): Subscriber
inline fun <reified E : Event, reified L : Listener<E>> Subscriber.unsubscribe(): Subscriber
inline fun <reified E : Event> Subscriber.on(noinline handler: (E) -> Unit): Subscription
inline fun <reified E : Event, reified L : Listener<E>> Subscriber.once(): Subscriber
inline fun <reified E : Event> Subscriber.once(noinline handler: (E) -> Unit): Subscription`} />

          <h3 id="inspector-extensions">Inspector Extensions</h3>
          <CodeBlock code={`inline fun <reified E : Event> Inspector.hasListeners(): Boolean
inline fun <reified E : Event> Inspector.listenerCount(): Int`} />
        </section>

        <section id="registration">
          <h2>Registration</h2>

          <h3 id="registration-dsl"><code>RegistrationDsl</code></h3>
          <p>DSL for bulk-registering event-listener mappings.</p>
          <CodeBlock code={`class RegistrationDsl {
    infix fun <E : Event> KClass<E>.mappedTo(listeners: List<KClass<out Listener<E>>>)
}`} />

          <h3 id="event-service-provider"><code>EventServiceProvider</code></h3>
          <p>Registers EventBus, Emitter, and Subscriber as singletons in a Container.</p>
          <CodeBlock code={`class EventServiceProvider {
    fun register(container: Container)
}`} />
        </section>

        <section id="coroutines-interfaces">
          <h2>Coroutines Interfaces (events-coroutines)</h2>

          <h3 id="suspending-listener"><code>SuspendingListener&lt;T : Event&gt;</code></h3>
          <p>Suspending event handler for async operations.</p>
          <CodeBlock code={`interface SuspendingListener<T : Event> {
    suspend fun handle(event: T)
}`} />

          <h3 id="suspending-emitter"><code>SuspendingEmitter</code></h3>
          <CodeBlock code={`interface SuspendingEmitter {
    suspend fun <T : Event> emit(event: T)
    suspend fun emit(first: Event, vararg rest: Event)
}`} />

          <h3 id="suspending-subscriber"><code>SuspendingSubscriber</code></h3>
          <p>
            Accepts both <code>Listener</code> and <code>SuspendingListener</code> registrations.
          </p>
          <CodeBlock code={`interface SuspendingSubscriber {
    fun <E : Event, L : Listener<E>> subscribe(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun <E : Event> subscribe(event: Class<E>, vararg listeners: KClass<out Listener<E>>): SuspendingSubscriber
    fun <E : Event, L : Listener<E>> unsubscribe(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun <E : Event, L : SuspendingListener<E>> subscribeSuspending(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun <E : Event> subscribeSuspending(event: Class<E>, vararg listeners: KClass<out SuspendingListener<E>>): SuspendingSubscriber
    fun <E : Event, L : SuspendingListener<E>> unsubscribeSuspending(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun <E : Event> on(event: Class<E>, handler: suspend (E) -> Unit): Subscription
    fun <E : Event> once(event: Class<E>, handler: suspend (E) -> Unit): Subscription
    fun <E : Event, L : Listener<E>> once(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun <E : Event, L : SuspendingListener<E>> onceSuspending(event: Class<E>, listener: Class<L>): SuspendingSubscriber
    fun onAny(handler: suspend (Event) -> Unit): Subscription
    fun clear()
}`} />

          <h3 id="suspending-eventbus"><code>SuspendingEventBus</code></h3>
          <p>Combines SuspendingEmitter, SuspendingSubscriber, and Inspector.</p>
          <CodeBlock code={`interface SuspendingEventBus : SuspendingEmitter, SuspendingSubscriber, Inspector`} />

          <h3 id="suspending-subscriber-extensions">SuspendingSubscriber Extensions</h3>
          <CodeBlock code={`inline fun <reified E : Event, reified L : Listener<E>> SuspendingSubscriber.subscribe(): SuspendingSubscriber
inline fun <reified E : Event> SuspendingSubscriber.subscribe(vararg listeners: KClass<out Listener<E>>): SuspendingSubscriber
inline fun <reified E : Event, reified L : Listener<E>> SuspendingSubscriber.unsubscribe(): SuspendingSubscriber
inline fun <reified E : Event, reified L : SuspendingListener<E>> SuspendingSubscriber.subscribeSuspending(): SuspendingSubscriber
inline fun <reified E : Event> SuspendingSubscriber.subscribeSuspending(vararg listeners: KClass<out SuspendingListener<E>>): SuspendingSubscriber
inline fun <reified E : Event, reified L : SuspendingListener<E>> SuspendingSubscriber.unsubscribeSuspending(): SuspendingSubscriber
inline fun <reified E : Event> SuspendingSubscriber.on(noinline handler: suspend (E) -> Unit): Subscription
inline fun <reified E : Event> SuspendingSubscriber.once(noinline handler: suspend (E) -> Unit): Subscription
inline fun <reified E : Event, reified L : Listener<E>> SuspendingSubscriber.once(): SuspendingSubscriber
inline fun <reified E : Event, reified L : SuspendingListener<E>> SuspendingSubscriber.onceSuspending(): SuspendingSubscriber`} />

          <h3 id="suspending-event-service-provider"><code>SuspendingEventServiceProvider</code></h3>
          <p>Registers SuspendingEventBus, SuspendingEmitter, and SuspendingSubscriber as singletons.</p>
          <CodeBlock code={`class SuspendingEventServiceProvider {
    fun register(container: Container)
}`} />
        </section>

        <section id="exceptions">
          <h2>Exceptions</h2>

          <h3 id="composite-event-exception"><code>CompositeEventException</code></h3>
          <p>
            Wraps multiple listener errors collected during a single emit. Thrown when more than
            one listener fails and no custom <code>onError</code> handler is provided.
          </p>
          <CodeBlock code={`class CompositeEventException(val errors: List<Throwable>) : RuntimeException`} />
        </section>
      </article>
    </>
  )
}
