import { getCreditsHtml } from '@/lib/content'

export default function AboutPage() {
  const about = getCreditsHtml()

  return (
    <div className="page-content">
      <div className="content" dangerouslySetInnerHTML={{ __html: about }} />
    </div>
  )
}
