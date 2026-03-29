import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import tocPlugin from 'markdown-it-toc-done-right'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  linkify: true,
  breaks: false,
  highlight(str: string, lang: string) {
    const langLabel = lang ? lang.toUpperCase() : ''
    let codeHtml = ''

    if (lang && hljs.getLanguage(lang)) {
      try {
        codeHtml = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch {
        codeHtml = md.utils.escapeHtml(str)
      }
    } else {
      codeHtml = md.utils.escapeHtml(str)
    }

    const header = langLabel
      ? `<div class="code-block__header"><span class="code-block__lang">${langLabel}</span></div>`
      : ''

    return (
      `<div class="code-block">` +
      header +
      `<pre class="code-block__body"><code>${codeHtml}</code></pre>` +
      `</div>`
    )
  },
})

md.use(anchor)
md.use(tocPlugin, { listType: 'ul' })

const defaultTableOpen = md.renderer.rules.table_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
  return '<div class="table-wrapper">' + defaultTableOpen(tokens, idx, options, env, self)
}

const defaultTableClose = md.renderer.rules.table_close || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
  return defaultTableClose(tokens, idx, options, env, self) + '</div>'
}

export function renderMarkdown(body: string): string {
  return md.render(body)
}
