import type { Metadata } from 'next'
import JsonLd from '@/components/json-ld'
import { AUTHOR, breadcrumbList } from '@/lib/structured-data'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'API Reference — kotlin-container',
  description:
    'Complete API reference for kotlin-container: interfaces, extension functions, types, and exceptions.',
  alternates: { canonical: `${SITE_URL}${BASE}/api/` },
  openGraph: {
    title: 'API Reference — kotlin-container',
    description: 'Complete public API — interfaces, extension functions, types, and exceptions.',
    url: `${SITE_URL}${BASE}/api/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-api.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Reference — kotlin-container',
    description: 'Complete public API documentation for kotlin-container.',
    images: [`${SITE_URL}/img/og/kotlin-container-api.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'kotlin-container API Reference',
  description: 'Complete API reference: interfaces, extension functions, types, and exceptions.',
  url: `${SITE_URL}${BASE}/api/`,
  author: AUTHOR,
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
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
            Complete public API surface of <code>com.cristianllanos.container</code>.
          </p>
        </header>

        <section id="core-interfaces">
          <h2>Core Interfaces</h2>

          <h3 id="registrar"><code>Registrar</code></h3>
          <p>Registration of bindings and service providers.</p>
          <CodeBlock code={`interface Registrar {
    fun register(vararg providers: Any): Registrar
    fun <T : Any> factory(type: Class<T>, factory: Container.() -> T): Registrar
    fun <T : Any> singleton(type: Class<T>, factory: Container.() -> T): Registrar
    fun <T : Any> scoped(type: Class<T>, factory: Container.() -> T): ScopedRegistration<T>
}`} />

          <h3 id="resolver"><code>Resolver</code></h3>
          <p>Resolution of dependencies from the container.</p>
          <CodeBlock code={`interface Resolver {
    fun <T : Any> resolve(type: Class<T>): T
}`} />

          <h3 id="caller"><code>Caller</code></h3>
          <p>Invocation of functions with auto-resolved parameters.</p>
          <CodeBlock code={`interface Caller {
    fun <T> call(callable: KCallable<T>): T
}`} />

          <h3 id="container"><code>Container</code></h3>
          <p>Combines registration, resolution, and calling. Creates child scopes.</p>
          <CodeBlock code={`interface Container : Registrar, Resolver, Caller {
    fun child(): Scope
}`} />

          <h3 id="scope"><code>Scope</code></h3>
          <p>A child container with a closeable lifecycle.</p>
          <CodeBlock code={`interface Scope : Container, AutoCloseable`} />

          <h3 id="auto-resolver"><code>AutoResolver</code></h3>
          <p>
            Strategy for resolving unregistered types. The default implementation uses reflection
            on primary constructors. Parameters with default values are skipped when their type
            cannot be resolved — Kotlin&apos;s default value is used instead.
          </p>
          <CodeBlock code={`interface AutoResolver {
    fun <T : Any> resolve(type: Class<T>, resolver: Resolver): T
}`} />
        </section>

        <section id="container-creation">
          <h2>Container Creation</h2>
          <CodeBlock code={`// Basic constructor
fun Container(
    autoResolver: AutoResolver = ReflectionAutoResolver()
): Container

// DSL builder
fun Container(
    autoResolver: AutoResolver = ReflectionAutoResolver(),
    init: Container.() -> Unit,
): Container`} />
        </section>

        <section id="extension-functions">
          <h2>Extension Functions</h2>

          <h3 id="registration-extensions">Registration (on <code>Registrar</code>)</h3>
          <CodeBlock code={`// With factory lambda
inline fun <reified T : Any> Registrar.factory(noinline factory: Container.() -> T): Registrar
inline fun <reified T : Any> Registrar.singleton(noinline factory: Container.() -> T): Registrar
inline fun <reified T : Any> Registrar.scoped(noinline factory: Container.() -> T): ScopedRegistration<T>

// Auto-resolved (no lambda — resolves via primary constructor)
inline fun <reified T : Any> Registrar.factory(): Registrar
inline fun <reified T : Any> Registrar.singleton(): Registrar
inline fun <reified T : Any> Registrar.scoped(): ScopedRegistration<T>`} />

          <h3 id="resolution-extensions">Resolution (on <code>Resolver</code>)</h3>
          <CodeBlock code={`inline fun <reified T : Any> Resolver.resolve(): T
inline fun <reified T : Any> Resolver.resolveOrNull(): T?   // null if unresolvable
inline fun <reified T : Any> Resolver.has(): Boolean         // true if resolvable
inline fun <reified T : Any> Resolver.lazy(): Lazy<T>        // deferred resolution`} />

          <h3 id="scoping-extensions">Scoping (on <code>Container</code>)</h3>
          <CodeBlock code={`// Block-based scope with automatic cleanup
inline fun <R> Container.scope(block: (Scope) -> R): R

// Scope with pre-registered providers
inline fun <R> Container.scope(vararg providers: Any, block: (Scope) -> R): R`} />
        </section>

        <section id="types">
          <h2>Types</h2>

          <h3 id="scoped-registration"><code>ScopedRegistration&lt;T&gt;</code></h3>
          <p>Returned by <code>scoped()</code> to allow attaching dispose hooks.</p>
          <CodeBlock code={`class ScopedRegistration<T : Any> {
    fun onClose(action: (T) -> Unit): Registrar
}`} />
        </section>

        <section id="exceptions">
          <h2>Exceptions</h2>

          <h3 id="unresolvable"><code>UnresolvableDependencyException</code></h3>
          <p>
            Thrown when a dependency cannot be resolved — typically a required primitive
            (<code>String</code>, <code>Int</code>, etc.) or an unregistered interface with no concrete fallback.
          </p>

          <h3 id="scope-required"><code>ScopeRequiredException</code></h3>
          <p>
            Thrown when a scoped binding is resolved from the root container instead of within a scope.
          </p>
        </section>
      </article>
    </>
  )
}
