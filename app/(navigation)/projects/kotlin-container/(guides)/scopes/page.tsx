import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE } from '../../constants'

export const metadata: Metadata = {
  title: 'Scopes — kotlin-container',
  description:
    'Manage instance lifecycles with scoped bindings in kotlin-container. Nested scopes, dispose hooks, AutoCloseable support, child containers, and contextual scopes for HTTP requests and background jobs.',
  alternates: { canonical: `${SITE_URL}${BASE}/scopes/` },
  openGraph: {
    title: 'Scopes — kotlin-container',
    description: 'Lifecycle management, dispose hooks, nested scopes, and contextual environments.',
    url: `${SITE_URL}${BASE}/scopes/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-scopes.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scopes — kotlin-container',
    description: 'Lifecycle management, dispose hooks, nested scopes, and contextual environments.',
    images: [`${SITE_URL}/img/og/kotlin-container-scopes.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Scopes in kotlin-container',
  description: 'Manage instance lifecycles with scoped bindings, nested scopes, dispose hooks, and contextual environments.',
  url: `${SITE_URL}${BASE}/scopes/`,
  author: { '@type': 'Person', name: 'Cristian Llanos', url: SITE_URL },
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Scopes', url: `${BASE}/scopes/` },
])

export default function ScopesPage() {
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
            <p className="guide-content__step">{guideStep(`${BASE}/scopes`)}</p>
            <h1 className="guide-content__title">Scopes</h1>
            <p className="guide-content__lead">
              One instance per scope — shared within a context, isolated between contexts.
            </p>
          </header>

          <section>
            <h2 id="basic-scoped-bindings">Basic scoped bindings</h2>
            <p>
              Scoped bindings create one instance per scope — a singleton within a lifecycle boundary.
              Useful when a dependency must be shared within a context (like an HTTP request) but
              isolated between contexts.
            </p>
            <CodeBlock code={`container.scoped<DbConnection> { DbConnection(resolve<Config>()) }

// Scoped bindings can only be resolved within a scope:
container.resolve<DbConnection>() // throws ScopeRequiredException

val scope = container.child()
scope.resolve<DbConnection>()     // creates instance
scope.resolve<DbConnection>()     // same instance
scope.close()                      // instance disposed`} />
          </section>

          <section>
            <h2 id="block-based-scopes">Block-based scopes</h2>
            <p>
              Use the block syntax for automatic cleanup — the scope closes when the block ends:
            </p>
            <CodeBlock code={`container.scope { scope ->
    val db = scope.resolve<DbConnection>()
    // use db...
}  // scope auto-closes here`} />
          </section>

          <section>
            <h2 id="dispose-hooks">Dispose hooks</h2>
            <p>
              Attach <code>onClose</code> to run cleanup when the scope closes:
            </p>
            <CodeBlock code={`container.scoped<DbConnection> { DbConnection() }
    .onClose { it.disconnect() }`} />
            <p>
              Instances implementing <code>AutoCloseable</code> are closed automatically — no hook needed:
            </p>
            <CodeBlock code={`container.scoped<InputStream> { FileInputStream("data.bin") }
// .close() called automatically when scope closes`} />
            <p>
              If both <code>onClose</code> and <code>AutoCloseable</code> apply, only the
              explicit <code>onClose</code> runs.
            </p>
          </section>

          <section>
            <h2 id="nested-scopes">Nested scopes</h2>
            <p>
              Scopes can be nested. Each scope gets its own scoped instances, and closing a parent
              cascades to children (deepest first):
            </p>
            <CodeBlock code={`container.scope { outer ->
    val outerDb = outer.resolve<DbConnection>()

    outer.scope { inner ->
        val innerDb = inner.resolve<DbConnection>()  // different instance
        // inner closes first
    }
    // outer closes after
}`} />
          </section>

          <section>
            <h2 id="scopes-as-child-containers">Scopes as child containers</h2>
            <p>
              A scope is a full <code>Container</code> — you can register ad-hoc bindings on it:
            </p>
            <CodeBlock code={`container.scope { scope ->
    scope.singleton<RequestId> { RequestId.generate() }
    scope.resolve<RequestHandler>()  // can depend on RequestId
}`} />
          </section>

          <section>
            <h2 id="contextual-scopes">Contextual scopes</h2>
            <p>
              Use <Link href={`${BASE}/providers`}>service providers</Link> to set up different
              scope contexts. The scope's purpose is defined by what you register on it:
            </p>
            <CodeBlock code={`// HTTP request scope
fun handleRequest(container: Container, request: HttpRequest) {
    container.scope { scope ->
        scope.register(RequestScopeProvider(request))
        scope.resolve<RequestHandler>().handle()
    }
}

// Background job scope
fun processJob(container: Container, job: Job) {
    container.scope { scope ->
        scope.register(JobScopeProvider(job))
        scope.resolve<JobProcessor>().run()
    }
}`} />
          </section>

          <section>
            <h2 id="android">Android</h2>
            <p>
              In Android, the system controls Activity and Fragment lifecycles — you can't wrap
              them in a <code>scope {"{"} {"}"}</code> block. Instead, tie scopes to lifecycle callbacks:
            </p>
            <CodeBlock code={`class MyActivity : AppCompatActivity() {
    private lateinit var scope: Scope

    override fun onCreate(savedInstanceState: Bundle?) {
        scope = appContainer.child()
        scope.register(ActivityScopeProvider(this))
        val presenter = scope.resolve<Presenter>()
    }

    override fun onDestroy() {
        scope.close()
        super.onDestroy()
    }
}`} />
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Learn how to organize registrations into reusable modules with{' '}
              <Link href={`${BASE}/providers`}>service providers</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/scopes`} />
      </article>
    </>
  )
}
