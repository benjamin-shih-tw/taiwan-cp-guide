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
  React.useEffect(() => {
    entry.onReady?.()
  }, [entry.recordMap, entry.onReady])

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
    { className: 'coding-course-notion-renderer', onClickCapture: handleClick },
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
}

function renderEntry(entry) {
  entry.root.render(React.createElement(NotionContent, { entry }))
}

function render(container, recordMap, options = {}) {
  if (!container || !recordMap?.block) return false

  let entry = mounts.get(container)
  if (!entry) {
    container.replaceChildren()
    entry = {
      root: createRoot(container),
      recordMap,
      onReady: options.onReady
    }
    mounts.set(container, entry)
  } else {
    entry.recordMap = recordMap
    entry.onReady = options.onReady
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
