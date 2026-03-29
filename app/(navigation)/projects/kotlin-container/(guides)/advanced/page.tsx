import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Advanced — kotlin-container',
  description:
    'Thread-safe resolution, callable injection, custom auto-resolvers, interface segregation, and convenience extensions in kotlin-container.',
  alternates: { canonical: `${SITE_URL}${BASE}/advanced/` },
  openGraph: {
    title: 'Advanced — kotlin-container',
    description: 'Thread safety, callable injection, custom resolvers, and interface segregation.',
    url: `${SITE_URL}${BASE}/advanced/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-advanced.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced — kotlin-container',
    description: 'Thread safety, callable injection, custom resolvers, and interface segregation.',
    images: [`${SITE_URL}/img/og/kotlin-container-advanced.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Advanced kotlin-container',
  description: 'Thread-safe resolution, callable injection, custom auto-resolvers, and interface segregation.',
  url: `${SITE_URL}${BASE}/advanced/`,
  author: { '@type': 'Person', name: 'Cristian Llanos', url: SITE_URL },
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Advanced', url: `${BASE}/advanced/` },
])

export default function AdvancedPage() {
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
            <p className="guide-content__step">{guideStep(`${BASE}/advanced`)}</p>
            <h1 className="guide-content__title">Advanced</h1>
            <p className="guide-content__lead">
              Thread safety, callable injection, custom resolvers, and architectural patterns.
            </p>
          </header>

          <section>
            <h2 id="thread-safety">Thread safety</h2>
            <p>
              The container is safe for concurrent resolution from multiple threads:
            </p>
            <ul>
              <li><strong>Singletons</strong> are created exactly once. If multiple threads resolve the same singleton concurrently, one thread executes the factory while the others wait.</li>
              <li><strong>Scoped instances</strong> are created once per scope, even under contention.</li>
              <li><strong>Factories</strong> execute independently on each thread with no shared mutable state.</li>
              <li><strong>Circular dependency detection</strong> is per-thread and does not produce false positives under concurrency.</li>
            </ul>
            <p>
              Registration (<code>factory</code>, <code>singleton</code>, <code>scoped</code>,{' '}
              <code>register</code>) should happen during a single-threaded setup phase before
              concurrent resolution begins.
            </p>
          </section>

          <section>
            <h2 id="callable-injection">Callable injection</h2>
            <p>
              Invoke any function with its dependencies resolved from the container:
            </p>
            <CodeBlock code={`fun sendWelcomeEmail(userService: UserService, emailService: EmailService): Boolean {
    // ...
}

val result = container.call(::sendWelcomeEmail)`} />
            <p>Works with instance methods too:</p>
            <CodeBlock code={`val controller = OrderController()
container.call(controller::processOrder)`} />
          </section>

          <section>
            <h2 id="default-values">Default values</h2>
            <p>
              When the container cannot resolve a parameter — typically a primitive
              like <code>String</code> or <code>Int</code> — it checks whether the parameter
              has a Kotlin default value. If it does, the container skips that parameter and
              lets Kotlin use the default. If it doesn&apos;t, resolution fails
              with <code>UnresolvableDependencyException</code>.
            </p>

            <h3>In constructors</h3>
            <p>
              Default values let you mix auto-resolved services with configuration that has
              sensible defaults:
            </p>
            <CodeBlock code={`class NotificationService(
    val emailClient: EmailClient,       // auto-resolved
    val maxRetries: Int = 3,            // default used
    val from: String = "noreply@app",   // default used
    val logger: Logger,                 // auto-resolved
)

val container = Container()
val service = container.resolve<NotificationService>()
// emailClient and logger resolved from the container
// maxRetries = 3, from = "noreply@app"`} />

            <h3>In functions</h3>
            <p>
              The same behavior applies when
              using <Link href={`${BASE}/advanced#callable-injection`}>callable injection</Link>:
            </p>
            <CodeBlock code={`fun sendReport(analytics: AnalyticsService, format: String = "pdf"): ByteArray {
    // ...
}

container.call(::sendReport)  // analytics resolved, format = "pdf"`} />

            <h3>Resolution priority</h3>
            <p>
              If a type is registered in the container, the registration always wins — even when
              the parameter has a default value. This lets you override defaults when needed:
            </p>
            <CodeBlock code={`class ApiClient(
    val baseUrl: String = "https://api.example.com",
    val httpClient: HttpClient,
)

val container = Container()

// Without registration: baseUrl uses the default
container.resolve<ApiClient>().baseUrl  // "https://api.example.com"

// With registration: container value takes precedence
container.factory<String> { "https://staging.example.com" }
container.resolve<ApiClient>().baseUrl  // "https://staging.example.com"`} />
          </section>

          <section>
            <h2 id="convenience-extensions">Convenience extensions</h2>
            <h3>Optional resolution</h3>
            <CodeBlock code={`val logger = container.resolveOrNull<Logger>()   // null if unresolvable
val hasLogger = container.has<Logger>()           // true if resolvable`} />
            <p>
              Note: both trigger a full resolution — singleton and factory instances will be
              created as a side effect on success.
            </p>

            <h3>Lazy resolution</h3>
            <p>Defer resolution until first access:</p>
            <CodeBlock code={`val logger by container.lazy<Logger>()  // resolves on first use`} />
            <p>
              When used with a <code>Scope</code>, do not store the <code>Lazy</code> beyond
              that scope's lifetime.
            </p>
          </section>

          <section>
            <h2 id="custom-auto-resolver">Custom auto-resolver</h2>
            <p>
              Replace the default reflection-based auto-resolution with your own strategy:
            </p>
            <CodeBlock code={`class MyAutoResolver : AutoResolver {
    override fun <T : Any> resolve(type: Class<T>, resolver: Resolver): T {
        // your resolution logic
    }
}

val container = Container(MyAutoResolver())`} />
          </section>

          <section>
            <h2 id="interface-segregation">Interface segregation</h2>
            <p>
              The container is split into focused interfaces. Use them to restrict what each part
              of your code can do:
            </p>
            <CodeBlock code={`interface Registrar   // register(), factory(), singleton(), scoped()
interface Resolver    // resolve()
interface Caller      // call()
interface Container : Registrar, Resolver, Caller  // child()
interface Scope : Container, AutoCloseable          // close()`} />
            <p>Give application code only what it needs:</p>
            <CodeBlock code={`// Setup — full access
fun bootstrap(): Container {
    val container = Container()
    container.register(AuthServiceProvider(), PaymentServiceProvider())
    return container
}

// Routes — can only resolve, not register
fun userRoutes(resolver: Resolver) {
    val service = resolver.resolve<UserService>()
}

// Middleware — can only call functions
fun runMiddleware(caller: Caller) {
    caller.call(::authenticate)
}`} />
          </section>

          <GuideNav current={`${BASE}/advanced`} />
      </article>
    </>
  )
}
