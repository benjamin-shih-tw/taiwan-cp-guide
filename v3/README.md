# Coding Course v3 · branch preview

This is the **isolated v3 site** developed on `feature/coding-course-v3`. Visit `/v3/#/dashboard` from the branch's preview deployment. The old `/v2/` application remains available, and the root landing page still points to v2.

## What v3 actually implements

| Area | Implementation |
| --- | --- |
| Course → Chapter → Lesson | 13 original subject domains, grouped into 5-lesson navigation chapters; original lesson IDs and titles preserved |
| Reader | Direct rendering of the original Notion page's `blockMap`, using the existing v2 `NotionXBridge` |
| Source fallback | Cached Markdown from the original repository, where available, if the Notion API cannot be reached |
| Six-stage lesson shell | Background, uses, prerequisites, theory, implementation, conclusion; automatically links to matching original headings when present |
| Interactive mode | Shared source reader, one self-check stage at a time, notes, four-dimensional confidence ratings, completion indicators |
| Problems | Existing Roadmap problems and original Notion Problem Ladder links, searchable with difficulty and attempt filters |
| Knowledge map | The existing `ROADMAP_DATA` dependencies; unknown prerequisite edges are not invented |
| Tracking | Per-lesson reading and stage progress, theory/implementation/recognition/retention self-ratings, problem attempts, mistakes and notes |
| Review | Local spaced-repetition scheduling (1/3/7/14/30/60 day intervals), due list and explicit reasons for next-step recommendations |
| Backup | Import/export local study state as JSON |
| Accessibility | Keyboard-friendly navigation, responsive layouts, dark mode and reduced-motion support |

## Important distinction between existing content and v3 structure

**No tutorial text, code sample, equation, image, link, or original Notion record has been edited.**

The chapter grouping is a **navigation partition**, not an editorial revision or claim that the underlying lectures already follow that outline. Six learning stages are v3 UI scaffolding: when an original lecture already contains a relevant heading, the UI links to that heading. When it does not, the stage is explicitly shown as unmatched; the original lecture remains intact in its own reader panel. Self-check prompts are separate study controls, not additions to the source document.

The local `data/notion_courses_part*.js` snapshots cover some, but not every, original lecture. Live rendering requires access to the existing Notion API; when neither live content nor local Markdown is available, v3 provides an error and an original Notion link rather than inventing lesson content.

## Data sources (not modified)

- `data/notion_catalog_snapshot.js`
- `data/notion_courses_part1.js` through `part5.js`
- `data/notion_ladders.js`
- `data/roadmap.js`
- `data/notion_image_mirror.js`
- `v2/notion-renderer.js` and `v2/notion-renderer.css`
- Existing tutorials and problem assets remain unchanged in place

## Run locally

From the repository root, serve the entire static directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/v3/#/dashboard`. Do **not** open the HTML as `file://` if testing API and browser storage behavior.

## Regression verification

```bash
node --check v3/app.js
node --check v3/source.js
node --check v3/catalog.js
node --check v3/learning.js
node v3/test.cjs
```

Browser coverage is in `v3/browser-smoke.cjs` using Playwright Chromium. GitHub Actions runs it automatically through `.github/workflows/v3-verify.yml` using Ubuntu 24.04. The workflow also fails if any existing `v2/`, `data/`, `tutorials/`, `scripts/` or legacy site files differ from `main`.

## Versioning and release safety

- All v3 additions are committed on `feature/coding-course-v3`.
- The branch deploys to Vercel Preview through existing Git integration; no production deployment is requested.
- `main` is never automatically updated or merged.
- The completed work should be reviewed in a pull request before it is merged.
- The v3 entry point is `/v3/`, so legacy v2 routes remain available.

## Known boundaries

- Progress is browser-local, not cross-device and not tied to a login.
- Confidence values are self-reports; they are **not** automatic evaluation of algorithmic correctness.
- The source's fixed six-stage tagging is opportunistic; missing original section headings are not fabricated.
- Recommendations use documented prerequisite relationships plus saved reviews and self-ratings, not a remote AI grading service.
- Availability and accuracy of live Notion content depend on the existing upstream Notion API.

These boundaries are intentional protections against silently rewriting teaching content or inventing data not present in the original curriculum.
