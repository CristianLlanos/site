'use client'

import { useEffect } from 'react'

export default function DisqusComments() {
  useEffect(() => {
    const d = document
    const s = d.createElement('script')
    s.src = 'https://cristianllanos.disqus.com/embed.js'
    s.setAttribute('data-timestamp', String(+new Date()))
    ;(d.head || d.body).appendChild(s)

    return () => {
      s.remove()
    }
  }, [])

  return (
    <section className="comments-section">
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </section>
  )
}
