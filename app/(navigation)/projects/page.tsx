import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectPosts } from '@/lib/content'
import { breadcrumbList } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Proyectos open-source y experimentos de software de Cristian Llanos.',
  openGraph: {
    title: 'Proyectos | Cristian Llanos',
    description: 'Proyectos open-source y experimentos de software de Cristian Llanos.',
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
]

export default function ProjectsListPage() {
  const projectPosts = getProjectPosts()

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
    />
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
