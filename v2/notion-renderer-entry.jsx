import React from 'react'
import { createRoot } from 'react-dom/client'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Equation } from 'react-notion-x/build/third-party/equation'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

const mounts = new Map()

const compactId = id => String(id || '').replace(/-/g, '')

function mapPageUrl(id) {
  const clean = compactId(id)
  const courses = Array.isArray(window.NOTION_COURSES) ? window.NOTION_COURSES : []
  if (courses.some(course => compactId(course.id) === clean)) {
    return '#/lesson/' + clean
  }
  return 'https://benjaminshih.vercel.app/' + clean
}

function mapImageUrl(image, block) {
  if (!image) return null
  let url = image.startsWith('/') ? 'https://www.notion.so' + image : image
  const already = url.startsWith('https://www.notion.so/image')
  const notionHosted =
    url.startsWith('attachment:') ||
    url.includes('secure.notion-static.com') ||
    url.includes('prod-files-secure')

  if (!already && (notionHosted || block?.type === 'bookmark')) {
    url =
      'https://www.notion.so/image/' +
      encodeURIComponent(url) +
      '?table=block&id=' +
      encodeURIComponent(block?.id || '')
  }
  return url
}

function Link({ href, target, rel, ...props }) {
  const external = typeof href === 'string' && /^https?:\/\//i.test(href)
  return React.createElement('a', {
    ...props,
    href,
    target: external ? '_blank' : target,
    rel: external ? 'noopener noreferrer' : rel
  })
}

function Pdf({ file }) {
  if (!file) return null
  return React.createElement(
    'object',
    { data: file, type: 'application/pdf', width: '100%', height: '680' },
    React.createElement('a', { href: file, target: '_blank', rel: 'noopener noreferrer' }, '開啟 PDF')
  )
}

function Embed({ block }) {
  const source =
    block?.format?.display_source ||
    block?.properties?.source?.[0]?.[0]
  if (!source || String(source).startsWith('attachment:')) return null

  return React.createElement(
    'figure',
    { className: 'notion-asset-wrapper notion-asset-wrapper-embed' },
    React.createElement('iframe', {
      className: 'notion-asset-object-fit',
      src: source,
      title: block?.properties?.title?.[0]?.[0] || 'Notion embed',
      frameBorder: '0',
      loading: 'lazy',
      allowFullScreen: true,
      style: { minHeight: 420, width: '100%' }
    })
  )
}

function renderEntry(entry) {
  const dark = document.documentElement.dataset.theme === 'dark'
  entry.root.render(
    React.createElement(
      'div',
      { className: 'coding-course-notion-renderer' },
      React.createElement(NotionRenderer, {
        recordMap: entry.recordMap,
        fullPage: false,
        darkMode: dark,
        mapPageUrl,
        mapImageUrl,
        components: {
          Code,
          Equation,
          Link,
          Pdf,
          Embed
        }
      })
    )
  )
}

function render(container, recordMap) {
  if (!container || !recordMap) return false
  let entry = mounts.get(container)
  if (!entry) {
    container.replaceChildren()
    entry = { root: createRoot(container), recordMap }
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
  try { entry.root.unmount() } catch {}
  mounts.delete(container)
}

function unmountWithin(parent) {
  for (const container of [...mounts.keys()]) {
    if (container === parent || parent?.contains(container)) unmount(container)
  }
}

new MutationObserver(() => {
  for (const entry of mounts.values()) renderEntry(entry)
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
})

window.NotionXBridge = { render, unmount, unmountWithin }
