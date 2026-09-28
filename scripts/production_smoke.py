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

catalog = get_json(CATALOG)
domains = catalog.get("domains") or []
items = catalog.get("items") or []
lectures = [item for item in items if item.get("type") == "lecture"]

assert len(domains) == 13, f"expected 13 active domains, got {len(domains)}: {domains}"
assert all("APCS" not in name for name in domains), f"archived APCS domain leaked: {domains}"
assert len(lectures) >= 60, f"expected >=60 lectures, got {len(lectures)}"

static_by_id = {}
for path in sorted(glob.glob("data/notion_courses_part*.js")):
    raw = open(path, "r", encoding="utf-8").read()
    match = re.search(r"push\\(\\.\\.\\.([\\s\\S]*?)\\);\\s*$", raw)
    if not match:
        continue
    for item in json.loads(match.group(1)):
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
        "catalog_mismatch": True,
        "missing_live": [
            {"id": page_id, "title": static_by_id.get(page_id, {}).get("title")}
            for page_id in missing_live
        ],
        "extra_live": extra_live,
    }, ensure_ascii=False))
assert not missing_live, f"live catalog is missing {len(missing_live)} static lectures"
assert not extra_live, f"live catalog has {len(extra_live)} unexpected lectures"
assert len(lectures) == len(static_ids), f"live/static lecture count mismatch: {len(lectures)} vs {len(static_ids)}"

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

print(json.dumps({
    "status": "ok",
    "domains": len(domains),
    "lectures": len(lectures),
    "catalog_items": len(items),
    "segment_tree_blocks": len(blocks),
    "generatedAt": catalog.get("generatedAt"),
}, ensure_ascii=False))
