import Link from 'next/link'
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
