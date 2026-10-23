import React from 'react'
import { createRoot } from 'react-dom/client'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/third-party/code'
import { Collection } from 'react-notion-x/third-party/collection'
import { Equation } from 'react-notion-x/third-party/equation'
import { Pdf } from 'react-notion-x/third-party/pdf'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import renderMathInElement from 'katex/contrib/auto-render'

import 'react-notion-x/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-cpp.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-bash.js'

const mounts = new Map()
let darkMode = document.documentElement.dataset.theme === 'dark'

const DEFAULT_LINK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E"

function normalizeRecordMap(recordMap) {
  if (!recordMap?.block) return recordMap
  for (const blockId of Object.keys(recordMap.block)) {
    const block = recordMap.block[blockId]?.value
    if (!block?.properties) continue
    for (const key of Object.keys(block.properties)) {
      const val = block.properties[key]
      if (Array.isArray(val)) {
        for (const item of val) {
          if (Array.isArray(item) && Array.isArray(item[1])) {
            for (const format of item[1]) {
              if (format[0] === 'lm' && format[1] && typeof format[1] === 'object') {
                if (!format[1].icon_url || !String(format[1].icon_url).trim()) {
                  format[1].icon_url = DEFAULT_LINK_ICON
                }
              }
            }
          }
        }
      }
    }
  }
  return recordMap
}

const compact = value => String(value || '').replace(/-/g, '').toLowerCase()

function mapPageUrl(id) {
  const clean = compact(id)
  if (/^[0-9a-f]{32}$/.test(clean)) return '#/lesson/' + clean

  // Never send an internal Notion page/block click out to notion.so.
  // Unknown non-page targets stay on the current Coding Course route.
  return window.location.hash || '#/courses'
}

function CourseCode(props) {
  const language = props.block?.properties?.language?.[0]?.[0] || props.defaultLanguage || 'code'
  return React.createElement(
    'div',
    { className: 'course-code-block' },
    React.createElement('span', { className: 'course-code-language' }, language),
    React.createElement(Code, props)
  )
}

class NotionErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    this.props.onError?.(error)
  }

  render() {
    if (this.state.error) return null
    return this.props.children
  }
}

function internalNotionRoute(href) {
  const raw = String(href || '')
  const routeMatch = raw.match(/^#\/lesson\/([0-9a-f-]{32,36})(?:#([0-9a-f-]{32,36}))?$/i)
  if (routeMatch) {
    const pageId = compact(routeMatch[1])
    const blockId = compact(routeMatch[2])
    return '#/lesson/' + pageId + (blockId ? '?block=' + blockId : '')
  }

  try {
    const url = new URL(raw, window.location.href)
    if (!/(^|\.)notion\.(?:so|com)$/i.test(url.hostname)) return ''
    const pageMatch = url.pathname.match(/([0-9a-f]{32})(?:$|\/)/i)
    if (!pageMatch) return ''
    const blockMatch = url.hash.match(/^#([0-9a-f]{32})$/i)
    return '#/lesson/' + compact(pageMatch[1]) + (blockMatch ? '?block=' + compact(blockMatch[1]) : '')
  } catch (_) {
    return ''
  }
}

function NotionContent({ entry }) {
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    entry.onReady?.()
  }, [entry.recordMap, entry.onReady])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleError = event => {
      const target = event.target
      if (target instanceof HTMLImageElement && target.classList.contains('notion-link-mention-icon')) {
        if (target.src !== DEFAULT_LINK_ICON) {
          target.src = DEFAULT_LINK_ICON
        }
      }
    }
    container.addEventListener('error', handleError, true)
    return () => container.removeEventListener('error', handleError, true)
  }, [])

  const handleClick = event => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor) return
    const route = internalNotionRoute(anchor.getAttribute('href'))
    if (!route) return
    event.preventDefault()
    window.location.hash = route
  }

  return React.createElement(
    'div',
    { ref: containerRef, className: 'coding-course-notion-renderer', onClickCapture: handleClick },
    React.createElement(
      NotionErrorBoundary,
      { key: entry.version, onError: entry.onError },
      React.createElement(NotionRenderer, {
        recordMap: entry.recordMap,
        fullPage: false,
        darkMode,
        mapPageUrl,
        components: {
          Code: CourseCode,
          Collection,
          Equation,
          Pdf
        }
      })
    )
  )
}

function renderEntry(entry) {
  entry.root.render(React.createElement(NotionContent, { entry }))
}

function render(container, recordMap, options = {}) {
  if (!container || !recordMap?.block) return false
  normalizeRecordMap(recordMap)

  let entry = mounts.get(container)
  if (!entry) {
    container.replaceChildren()
    entry = {
      root: createRoot(container),
      recordMap,
      onReady: options.onReady,
      onError: options.onError,
      version: 1
    }
    mounts.set(container, entry)
  } else {
    entry.recordMap = recordMap
    entry.onReady = options.onReady
    entry.onError = options.onError
    entry.version += 1
  }

  renderEntry(entry)
  return true
}

function unmount(container) {
  const entry = mounts.get(container)
  if (!entry) return
  try {
    entry.root.unmount()
  } catch (_) {}
  mounts.delete(container)
}

function unmountWithin(parent) {
  if (!parent) return
  for (const container of [...mounts.keys()]) {
    if (container === parent || parent.contains(container)) unmount(container)
  }
}

function setTheme(nextDark) {
  darkMode = Boolean(nextDark)
  for (const entry of mounts.values()) renderEntry(entry)
}

window.marked = marked
window.hljs = hljs
window.renderMathInElement = renderMathInElement

window.NotionXBridge = {
  render,
  unmount,
  unmountWithin,
  setTheme
}
