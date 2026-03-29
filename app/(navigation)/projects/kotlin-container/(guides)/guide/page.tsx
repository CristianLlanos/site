import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbList } from '@/lib/structured-data'
import { GuideNav, guideStep } from '../../guide-nav'
import { CodeBlock } from '../../code'
import { SITE_URL, BASE, VERSION } from '../../constants'

export const metadata: Metadata = {
  title: 'Getting Started — kotlin-container',
  description:
    'Install kotlin-container and resolve your first dependency tree in under a minute. Zero configuration, no annotations, no code generation.',
  alternates: { canonical: `${SITE_URL}${BASE}/guide/` },
  openGraph: {
    title: 'Getting Started — kotlin-container',
    description: 'Install kotlin-container and resolve your first dependency tree in under a minute.',
    url: `${SITE_URL}${BASE}/guide/`,
    type: 'article',
    images: [{ url: `${SITE_URL}/img/og/kotlin-container-guide.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started — kotlin-container',
    description: 'Install and resolve your first dependency tree in under a minute.',
    images: [`${SITE_URL}/img/og/kotlin-container-guide.png`],
  },
}

const techArticle = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Getting Started with kotlin-container',
  description: 'Install kotlin-container and resolve your first dependency tree in under a minute.',
  url: `${SITE_URL}${BASE}/guide/`,
  author: { '@type': 'Person', name: 'Cristian Llanos', url: SITE_URL },
  isPartOf: { '@type': 'SoftwareSourceCode', name: 'kotlin-container', url: `${SITE_URL}${BASE}/` },
}

const breadcrumbs = breadcrumbList([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'kotlin-container', url: `${BASE}/` },
  { name: 'Getting Started', url: `${BASE}/guide/` },
])

export default function GuidePage() {
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
            <p className="guide-content__step">{guideStep(`${BASE}/guide`)}</p>
            <h1 className="guide-content__title">Getting Started</h1>
            <p className="guide-content__lead">
              Install kotlin-container and resolve your first dependency tree in under a minute.
            </p>
          </header>

          <section>
            <h2 id="installation">Installation</h2>
            <p>Add the dependency to your <code>build.gradle.kts</code>:</p>
            <CodeBlock lang="kotlin" code={`dependencies {
    implementation("com.cristianllanos:container:${VERSION}")
}`} />
          </section>

          <section>
            <h2 id="your-first-container">Your first container</h2>
            <p>
              Concrete classes are resolved automatically — the container inspects primary constructors
              and recursively resolves each parameter. No registration needed.
            </p>
            <CodeBlock code={`class Logger
class UserRepository(val logger: Logger)
class UserService(val repo: UserRepository)

val container = Container()
val service = container.resolve<UserService>()
// resolves Logger → UserRepository → UserService automatically`} />
            <p>
              Auto-resolution handles:
            </p>
            <ul>
              <li><strong>Concrete classes</strong> — resolved recursively via their primary constructor</li>
              <li><strong>Registered interfaces/abstracts</strong> — resolved from the registry</li>
              <li><strong>Optional parameters with defaults</strong> — skipped when unresolvable, using the default value instead</li>
              <li><strong>Required primitives</strong> (String, Int, etc.) — throws <code>UnresolvableDependencyException</code></li>
            </ul>

            <CodeBlock code={`class Greeter(val name: String = "World", val logger: Logger)

val container = Container()
val greeter = container.resolve<Greeter>()
println(greeter.name)  // "World" — default value used

// Without a default, resolution fails:
class Greeter(val name: String, val logger: Logger)
container.resolve<Greeter>()  // ❌ UnresolvableDependencyException`} />
            <p>
              See <Link href={`${BASE}/advanced#default-values`}>Advanced → Default values</Link> for
              resolution priority and more examples.
            </p>
          </section>

          <section>
            <h2 id="dsl-builder">DSL builder</h2>
            <p>
              Use the lambda builder for setup-in-one-shot — register everything at construction time:
            </p>
            <CodeBlock code={`val container = Container {
    singleton<NotificationService> { SlackNotificationService() }
    factory<PaymentGateway> { StripeGateway() }
    scoped<DbConnection> { DbConnection(resolve<Config>()) }
}`} />
          </section>

          <section>
            <h2>Next steps</h2>
            <p>
              Now that you have a container, learn how to control instance lifetimes with{' '}
              <Link href={`${BASE}/bindings`}>bindings</Link>.
            </p>
          </section>

          <GuideNav current={`${BASE}/guide`} />
      </article>
    </>
  )
}
