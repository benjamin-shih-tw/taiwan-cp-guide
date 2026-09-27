import fs from 'node:fs'
import path from 'node:path'
import { NotionAPI } from 'notion-client'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'data', 'notion-recordmaps')
const STATUS = path.join(ROOT, 'data', 'notion-render-status.json')

function parseCourses() {
  const result = []
  for (let i = 1; i <= 5; i++) {
    const file = path.join(ROOT, 'data', `notion_courses_part${i}.js`)
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    const match = text.match(/push\(\.\.\.([\s\S]*?)\);\s*$/)
    if (!match) continue
    result.push(...JSON.parse(match[1]))
  }
  return result
}

function parseLadders() {
  const file = path.join(ROOT, 'data', 'notion_ladders.js')
  if (!fs.existsSync(file)) return []
  const text = fs.readFileSync(file, 'utf8')
  const match = text.match(/window\.NOTION_LADDERS\s*=\s*([\s\S]*?);\s*$/)
  return match ? JSON.parse(match[1]) : []
}

function normalizeRecordMap(recordMap) {
  const blocks = recordMap?.block
  if (!blocks) return recordMap

  for (const [id, original] of Object.entries(blocks)) {
    let entry = original

    if (entry?.value?.value?.id) {
      entry = { value: entry.value.value }
      blocks[id] = entry
    }

    const block = entry?.value
    if (!block) continue

    delete block.crdt_data
    delete block.crdt_format_version

    const lang = block?.properties?.language?.[0]?.[0]
    if (block.type === 'code' && lang) {
      if (lang === 'C++') block.properties.language[0][0] = 'cpp'
      if (lang === 'C#') block.properties.language[0][0] = 'csharp'
      if (lang === 'Assembly') block.properties.language[0][0] = 'asm6502'
    }

    const source = block?.properties?.source?.[0]?.[0]
    if (
      ['file', 'pdf', 'video', 'audio'].includes(block.type) &&
      typeof source === 'string' &&
      (
        source.startsWith('attachment:') ||
        source.includes('secure.notion-static.com') ||
        source.includes('prod-files-secure') ||
        source.includes('amazonaws.com')
      )
    ) {
      block.properties.source[0][0] =
        `https://www.notion.so/signed/${encodeURIComponent(source)}?table=block&id=${block.id}`
    }
  }
  return recordMap
}

const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://app.notion.com/api/v3',
  authToken: process.env.NOTION_TOKEN_V2 || undefined,
  activeUser: process.env.NOTION_ACTIVE_USER || undefined,
  userTimeZone: 'Asia/Taipei'
})

const pages = [...parseCourses(), ...parseLadders()]
const ids = [...new Set(pages.map(x => String(x.id || '').replace(/-/g, '')).filter(Boolean))]

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

let fetched = 0
let failed = 0
const failures = []

async function fetchOne(id) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const recordMap = normalizeRecordMap(await notion.getPage(id))
      if (!recordMap?.block || !Object.keys(recordMap.block).length) {
        throw new Error('empty recordMap')
      }
      fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(recordMap))
      fetched++
      return
    } catch (error) {
      lastError = error
      await new Promise(resolve => setTimeout(resolve, 450 * attempt))
    }
  }
  failed++
  failures.push({ id, error: String(lastError?.message || lastError || 'unknown') })
  console.warn('[Notion sync] failed:', id, lastError?.message || lastError)
}

async function runPool(items, size = 3) {
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      await fetchOne(items[index])
      await new Promise(resolve => setTimeout(resolve, 120))
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker))
}

await runPool(ids)

const status = {
  generatedAt: new Date().toISOString(),
  total: ids.length,
  fetched,
  failed,
  failures
}
fs.writeFileSync(STATUS, JSON.stringify(status, null, 2))
console.log('[Notion sync]', status)

if (fetched === 0) {
  console.warn('[Notion sync] no recordMaps fetched; website will use Markdown fallback')
}
