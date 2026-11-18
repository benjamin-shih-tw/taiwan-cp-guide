# Coding Course v3 — branch-only implementation guardrails

This branch is the isolated development line for Coding Course v3. The production `main` branch and the current `/v2/` deployment must remain unchanged.

## Non-negotiable constraints
- Never modify the text, code examples, equations, images, or external links in existing tutorials and Notion snapshots.
- Preserve `tutorials/`, `data/notion_*.js`, `scripts/notion-*`, and `v2/notion-images/` byte-for-byte.
- Keep existing URLs functional. New navigation should be additive or use redirects.
- Do not merge or deploy to production without explicit approval.
- Keep each feature in reviewable commits on `feature/coding-course-v3`.

## Existing stack (verified from repository)
- Static HTML, CSS and JavaScript with an existing `v2/` application.
- React is already used for the Notion renderer; esbuild bundles `v2/notion-renderer-entry.jsx`.
- Notion snapshots and local Markdown tutorials are present in the repository.
- Existing deployment automation: `.github/workflows/deploy.yml`.

## Planned implementation
1. Build an additive Course → Chapter → Lesson index over existing content.
2. Render the six teaching sections with no destructive transformation of the source text.
3. Provide reader and stepwise interactive views backed by the same source.
4. Add problem sets, prerequisite relationships, local progress and review tracking.
5. Add dashboards and explainable next-step recommendations.
6. Test mobile, tablet, desktop, links, source preservation, and preview deployment.

## Acceptance gate
Before merging, compare content-file Git blob SHAs against the base commit; all protected content must be unchanged. Run build and smoke tests, and inspect the preview in a real browser.
