import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { breadcrumbList } from '@/lib/structured-data'
import JsonLd from '@/components/json-ld'

const DESCRIPTION = 'Proyectos open-source y experimentos de software de Cristian Llanos.'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/projects/`,
  },
  openGraph: {
    title: 'Proyectos | Cristian Llanos',
    description: DESCRIPTION,
    url: `${SITE_URL}/projects/`,
    images: [{ url: `${SITE_URL}/img/og/site-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyectos | Cristian Llanos',
    description: DESCRIPTION,
  },
}

const breadcrumbs = breadcrumbList([
  { name: 'Inicio', url: '/' },
  { name: 'Proyectos', url: '/projects/' },
])

const featured = [
  {
    slug: 'kotlin-container',
    title: 'kotlin-container',
    description: 'Inyección de dependencias liviana para Kotlin. Auto-resolución, scopes, service providers — sin configuración.',
    project_type: 'open-source',
  },
  {
    slug: 'kotlin-events',
    title: 'kotlin-events',
    description: 'Event bus type-safe para Kotlin. Listeners con inyección de dependencias, middleware, coroutines — ligero y thread-safe.',
    project_type: 'open-source',
  },
]

export default function ProjectsListPage() {
  const projectPosts = getProjectPosts()

  return (
    <>
    <JsonLd data={breadcrumbs} />
    <div className="projects-list">
      <h1 className="projects-list__title">Proyectos</h1>
      {[...featured, ...projectPosts].map((project) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="project-item"
        >
          <h3 className="project-item__title">{project.title}</h3>
          <div>
            <span className="project-item__badge">{project.project_type}</span>
            <span className="project-item__description">{project.description}</span>
          </div>
        </Link>
      ))}
    </div>
    </>
  )
}
