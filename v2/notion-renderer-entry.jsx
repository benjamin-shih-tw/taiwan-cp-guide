import React from 'react'
import { createRoot } from 'react-dom/client'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/third-party/code'
import { Collection } from 'react-notion-x/third-party/collection'
import { Equation } from 'react-notion-x/third-party/equation'
import { Modal } from 'react-notion-x/third-party/modal'
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
  const ids = Array.isArray(window.CODING_COURSE_IDS)
    ? window.CODING_COURSE_IDS
    : []
  if (ids.includes(clean)) return '#/lesson/' + clean
  return 'https://www.notion.so/' + clean
}

function renderEntry(entry) {
  entry.root.render(
    React.createElement(
      'div',
      { className: 'coding-course-notion-renderer' },
      React.createElement(NotionRenderer, {
        recordMap: entry.recordMap,
        fullPage: false,
        darkMode,
        mapPageUrl,
        components: {
          Code,
          Collection,
          Equation,
          Modal,
          Pdf
        }
      })
    )
  )
}

function render(container, recordMap) {
  if (!container || !recordMap?.block) return false

  let entry = mounts.get(container)
  if (!entry) {
    container.replaceChildren()
    entry = {
      root: createRoot(container),
      recordMap
    }
    mounts.set(container, entry)
  } else {
    entry.recordMap = recordMap
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
