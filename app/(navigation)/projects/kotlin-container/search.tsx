'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Hash, FileText } from 'lucide-react'
import { guides } from './guide-data'

interface PagefindResult {
  url: string
  excerpt: string
  meta: { title?: string }
}

interface PagefindResponse {
  results: { data: () => Promise<PagefindResult> }[]
}

interface Pagefind {
  init: () => Promise<void>
  search: (query: string) => Promise<PagefindResponse>
}

interface SearchItem {
  url: string
  title: string
  parent?: string
  excerpt?: string
  type: 'page' | 'section'
}

// Build flat section index from guide-nav data
const sectionIndex: SearchItem[] = guides.flatMap((g) => [
  { url: `${g.href}/`, title: g.title, type: 'page' as const },
  ...g.sections.map((s) => ({
    url: `${g.href}/#${s.id}`,
    title: s.title,
    parent: g.title,
    type: 'section' as const,
  })),
])

function matchSections(query: string): SearchItem[] {
  const q = query.toLowerCase()
  return sectionIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.parent && item.parent.toLowerCase().includes(q)),
  )
}

export function GuideSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const pagefindRef = useRef<Pagefind | null>(null)

  useEffect(() => {
    async function load() {
      if (pagefindRef.current) return
      try {
        const pagefindPath = ['/pagefind', '/pagefind.js'].join('')
        const pf = await import(/* webpackIgnore: true */ pagefindPath) as unknown as Pagefind
        await pf.init()
        pagefindRef.current = pf
      } catch {
        // Pagefind not available (dev mode)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll('.guide-search__result')
    items[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const doSearch = useCallback(async (q: string) => {
    setQuery(q)
    setActiveIndex(-1)

    if (q.trim().length < 2) {
      setResults([])
      return
    }

    // Local section matches
    const sectionMatches = matchSections(q.trim())

    // Pagefind full-text matches
    let pagefindItems: SearchItem[] = []
    if (pagefindRef.current) {
      const response = await pagefindRef.current.search(q)
      const raw = await Promise.all(
        response.results.slice(0, 8).map((r) => r.data()),
      )
      pagefindItems = raw.map((r) => ({
        url: r.url,
        title: r.meta.title || 'Untitled',
        excerpt: r.excerpt,
        type: 'page' as const,
      }))
    }

    // Merge: section matches first, then pagefind results (deduplicated)
    const seen = new Set<string>()
    const merged: SearchItem[] = []

    for (const item of sectionMatches) {
      // For section results, also mark the parent page URL as seen
      const pageUrl = item.url.split('#')[0]
      seen.add(item.url)
      if (item.type === 'section') seen.add(pageUrl)
      merged.push(item)
    }

    for (const item of pagefindItems) {
      const normalized = item.url.replace(/index\.html$/, '')
      if (!seen.has(normalized)) {
        seen.add(normalized)
        merged.push(item)
      }
    }

    setResults(merged.slice(0, 10))
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      window.location.href = results[activeIndex].url
      close()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  function close() {
    setOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(-1)
  }

  return (
    <>
      <button
        type="button"
        className="guide-search__trigger"
        onClick={() => setOpen(true)}
      >
        <Search size={14} />
        <span>Search docs</span>
        <kbd className="guide-search__kbd">
          <span>⌘</span>K
        </kbd>
      </button>
      <button
        type="button"
        className="guide-search__fab"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
      >
        <Search size={18} />
      </button>

      {open && createPortal(
        <div className="guide-search__overlay" onClick={close}>
          <div
            className="guide-search__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="guide-search__input-wrap">
              <Search size={16} className="guide-search__icon" />
              <input
                ref={inputRef}
                type="text"
                className="guide-search__input"
                placeholder="Search kotlin-container docs..."
                value={query}
                onChange={(e) => doSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="guide-search__close"
                onClick={close}
              >
                <X size={16} />
              </button>
            </div>

            {results.length > 0 && (
              <ul className="guide-search__results" ref={listRef}>
                {results.map((r, i) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      className={`guide-search__result${i === activeIndex ? ' guide-search__result--active' : ''}`}
                      onClick={close}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <span className="guide-search__result-icon">
                        {r.type === 'section' ? <Hash size={14} /> : <FileText size={14} />}
                      </span>
                      <span className="guide-search__result-body">
                        {r.parent && (
                          <span className="guide-search__result-parent">
                            {r.parent}
                          </span>
                        )}
                        <span className="guide-search__result-title">
                          {r.title}
                        </span>
                        {r.excerpt && (
                          <span
                            className="guide-search__result-excerpt"
                            dangerouslySetInnerHTML={{ __html: r.excerpt }}
                          />
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
              <div className="guide-search__empty">No results found</div>
            )}

            <div className="guide-search__footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
