import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Proyectos de software y experimentos técnicos de Cristian Llanos.',
  openGraph: {
    title: 'Proyectos | Cristian Llanos',
    description: 'Proyectos de software y experimentos técnicos de Cristian Llanos.',
  },
}
import { getProjectPosts } from '@/lib/content'

export default function ProjectsListPage() {
  const projectPosts = getProjectPosts()

  return (
    <div className="projects-list">
      <h1 className="projects-list__title">Projects</h1>
      {projectPosts.map((project) => (
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
  )
}
