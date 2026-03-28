export default function SkillCard({
  title,
  tags,
}: {
  title: string
  tags: string[]
}) {
  return (
    <div className="skill-card">
      <div className="skill-card__inner">
        <h3 className="skill-card__title">{title}</h3>
        <div className="skill-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="skill-card__tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
