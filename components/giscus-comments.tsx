'use client'

import { useEffect, useState } from 'react'
import Giscus from '@giscus/react'

export default function GiscusComments() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const resolve = () => {
      const dt = document.documentElement.getAttribute('data-theme')
      setTheme(dt === 'light' ? 'light' : 'dark')
    }

    resolve()

    const observer = new MutationObserver(resolve)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Giscus
      repo="CristianLlanos/site"
      repoId="MDEwOlJlcG9zaXRvcnkzMzg4NTY5MDA="
      category="General"
      categoryId="DIC_kwDOFDKLxM4C5g1e"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="es"
      loading="lazy"
    />
  )
}
