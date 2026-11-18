# Coding Course v3

Branch preview: `feature/coding-course-v3`, entry point `/v3/#/dashboard`.

The UI uses the original v2 black-and-white palette, typography, fine borders and compact navigation. The 13 subject domains contain 21 navigation chapters and 81 lessons. Lessons show the complete original source with its heading table of contents, reading completion and review controls. The former six-stage shell, self-rating panels and reader/interactive switch have been removed. Existing saved learning data remains compatible with backup import/export.

The prerequisite page is deliberately blank. Old roadmap deep links also lead to that blank page, and inherited prerequisite relationships do not gate lessons or recommendations. The existing roadmap dataset is still used internally as a problem source.

The problem library starts with the same 13 subject units as the course library. Each unit groups indexed problems into 基礎、 中階、 進階、 挑戰、 延伸 and 未標示難度. Unknown difficulties remain unrated. Explicit original ladder section labels determine ladder difficulty; Advanced and Extension are separate categories. Duplicate problem URLs retain their stable IDs and all known subject/lesson associations. Search, difficulty and status filters remain in the URL after editing an attempt. AC/WA, error reasons and notes are saved locally, including notes on AC and trying states. Original full problem-ladder links remain available in each unit.

The source reader starts its API request and renderer download concurrently, caches live payloads, bounds network waiting and ignores results from abandoned routes. Markdown fallback loads its parser and math renderer when needed instead of showing raw Markdown whenever the live API fails. Original source datasets and v2 files are unchanged.

## Validation

```sh
node --check v3/app.js
node --check v3/catalog.js
node --check v3/source.js
node --check v3/learning.js
node v3/test.cjs
node v3/browser-smoke.cjs
```

The dependency-free checks cover actual catalog integrity, empty prerequisites, subject classification, difficulty groups, persistent attempts/notes, reviews, backups, parallel source loading, payload caching, formatted fallback and stale-route cancellation. The Playwright smoke test covers lesson navigation, removed panels, unit/difficulty navigation, attempt editing, reviews, the blank roadmap, backup export and phone layouts. GitHub Actions runs both suites and verifies existing content remains unchanged.

Serve the complete repository with a static HTTP server for local preview. The existing Git integration deploys this branch to Vercel Preview. Production `main` remains separate and is not automatically merged. Browser state is local to the current browser; some lessons require the live Notion API because only 35 original Markdown snapshots are present.
