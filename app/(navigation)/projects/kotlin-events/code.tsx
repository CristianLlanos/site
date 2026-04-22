import hljs from 'highlight.js'

export function CodeBlock({ code, lang = 'kotlin' }: { code: string; lang?: string }) {
  const html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{lang}</span>
      </div>
      <pre className="code-block__body">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
