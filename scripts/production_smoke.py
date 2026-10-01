#!/usr/bin/env python3
import glob
import json
import re
import time
import urllib.error
import urllib.request

CATALOG = "https://benjaminshih.vercel.app/api/coding-course/catalog"
PAGE = "https://benjaminshih.vercel.app/api/coding-course/page/33092ab76d4080199eaafc456a0f2fb7"
PLACEHOLDER_ID = "3e892ab76d40812aa397cb8b7dc9cb85"
SEGMENT_ID = "33092ab76d4080199eaafc456a0f2fb7"
SEGMENT_CHILD_ID = "3c492ab76d40800ba2f5dd6bfd0026c1"
SEGMENT_CHILD_PAGE = f"https://benjaminshih.vercel.app/api/coding-course/page/{SEGMENT_CHILD_ID}"

REQUIRED_NOTION_TITLES = {
    "00-15 Testing, Debugging & Stress Testing",
    "03-07 Ternary Search",
    "05-03 Greedy with Priority Queue",
    "06-10 Directed Minimum Spanning Tree",
    "06-11 Maximum Flow & Min Cut",
    "06-12 Bipartite Matching",
    "08-08 Edit Distance & LCS",
    "08-09 DP Reconstruction & Lexicographic Answers",
    "08-10 Monotonic Queue Optimization",
    "08-11 Convex Hull Trick Optimization",
    "12-04 KMP & Prefix Function",
    "12-05 Z Algorithm",
    "12-06 Trie",
}

def get_json(url, attempts=4, timeout=30):
    last = None
    for attempt in range(1, attempts + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "taiwan-cp-guide-production-smoke/1.0",
                    "Accept": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as response:
                if response.status != 200:
                    raise RuntimeError(f"{url} returned HTTP {response.status}")
                return json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            last = exc
            if attempt < attempts:
                time.sleep(2 * attempt)
    raise RuntimeError(f"Failed after {attempts} attempts: {url}: {last}")

catalog = None
domains = []
items = []
lectures = []
ladders = []

# Notion is the source of truth. Give the live catalog a short grace period
# to observe freshly-created/edited Notion pages before failing deployment.
for attempt in range(1, 7):
    catalog = get_json(CATALOG)
    domains = catalog.get("domains") or []
    items = catalog.get("items") or []
    lectures = [item for item in items if item.get("type") == "lecture"]
    ladders = [
        item for item in items
        if item.get("type") == "assignment"
        and re.match(r"^Problem Ladder\s*[—-]", str(item.get("title") or ""), re.I)
    ]
    live_titles = {str(item.get("title") or "").strip() for item in lectures}
    missing_required = sorted(REQUIRED_NOTION_TITLES - live_titles)
    if not missing_required and len(ladders) >= 75:
        break
    if attempt < 6:
        time.sleep(10)

assert len(domains) == 13, f"expected 13 active domains, got {len(domains)}: {domains}"
assert all("APCS" not in name for name in domains), f"archived APCS domain leaked: {domains}"
assert len(lectures) >= 80, f"expected >=80 lectures from Notion, got {len(lectures)}"
assert len(ladders) >= 75, f"expected >=75 Problem Ladders from Notion, got {len(ladders)}"

lecture_titles = [str(item.get("title") or "").strip() for item in lectures]
ladder_titles = [str(item.get("title") or "").strip() for item in ladders]
assert len(lecture_titles) == len(set(lecture_titles)), "duplicate lecture titles in live Notion catalog"
assert len(ladder_titles) == len(set(ladder_titles)), "duplicate Problem Ladder titles in live Notion catalog"
assert not (REQUIRED_NOTION_TITLES - set(lecture_titles)), (
    "new Notion curriculum pages missing from live catalog: "
    + ", ".join(sorted(REQUIRED_NOTION_TITLES - set(lecture_titles)))
)
assert not any(title.startswith("HB ") for title in lecture_titles), "legacy HB course leaked into live catalog"
assert not any(("附錄" in title or "appendix" in title.lower()) for title in lecture_titles), "appendix course leaked into live catalog"

static_by_id = {}
for path in sorted(glob.glob("data/notion_courses_part*.js")):
    raw = open(path, "r", encoding="utf-8").read()
    marker = "window.NOTION_COURSES.push(..."
    start = raw.find(marker)
    if start < 0:
        continue
    payload = raw[start + len(marker):].strip()
    if payload.endswith(");"):
        payload = payload[:-2]
    for item in json.loads(payload):
        static_by_id[str(item.get("id", "")).replace("-", "")] = item

by_id = {str(item.get("id", "")).replace("-", ""): item for item in items}
live_lecture_ids = {
    str(item.get("id", "")).replace("-", "")
    for item in lectures
}
static_ids = set(static_by_id)
missing_live = sorted(static_ids - live_lecture_ids)
extra_live = sorted(live_lecture_ids - static_ids)
if missing_live or extra_live:
    print(json.dumps({
        "catalog_snapshot_diff": True,
        "missing_live": [
            {"id": page_id, "title": static_by_id.get(page_id, {}).get("title")}
            for page_id in missing_live
        ],
        "notion_only": extra_live,
    }, ensure_ascii=False))

# Static files are only the emergency/offline snapshot now. Every snapshot page
# must still exist in Notion, but Notion is allowed to contain newer pages.
assert not missing_live, f"live catalog is missing {len(missing_live)} static snapshot lectures"
assert len(lectures) >= len(static_ids), f"live Notion catalog unexpectedly smaller than static snapshot: {len(lectures)} vs {len(static_ids)}"

segment = by_id.get(SEGMENT_ID)
placeholder = by_id.get(PLACEHOLDER_ID)
assert segment, "Segment Tree is missing from live catalog"
assert segment.get("hasContent") is True, f"Segment Tree live catalog says no content: {segment}"
assert placeholder, "Simulation placeholder is missing from live catalog"
assert placeholder.get("hasContent") is False, f"placeholder unexpectedly has content: {placeholder}"

page = get_json(PAGE)
block_map = page.get("blockMap") or {}
blocks = block_map.get("block") or {}
assert page.get("id") == SEGMENT_ID, f"wrong page id: {page.get('id')}"
assert page.get("hasContent") is True, "Segment Tree page API reports no content"
assert isinstance(blocks, dict) and len(blocks) >= 2, f"invalid Notion blockMap: {len(blocks)} blocks"

child_page = get_json(SEGMENT_CHILD_PAGE)
child_block_map = child_page.get("blockMap") or {}
child_blocks = child_block_map.get("block") or {}
assert child_page.get("id") == SEGMENT_CHILD_ID, f"wrong child page id: {child_page.get('id')}"
assert child_page.get("title") == "線段樹解法", f"wrong child page title: {child_page.get('title')}"
assert isinstance(child_blocks, dict) and len(child_blocks) > 0, "child page has no Notion blocks"

print(json.dumps({
    "status": "ok",
    "domains": len(domains),
    "lectures": len(lectures),
    "catalog_items": len(items),
    "problem_ladders": len(ladders),
    "notion_only_lectures": len(extra_live),
    "segment_tree_blocks": len(blocks),
    "segment_tree_child_blocks": len(child_blocks),
    "generatedAt": catalog.get("generatedAt"),
}, ensure_ascii=False))
