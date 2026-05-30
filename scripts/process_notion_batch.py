#!/usr/bin/env python3
import json
import sys
from pathlib import Path

CACHE = Path(__file__).resolve().parent / "notion-cache"
CACHE.mkdir(parents=True, exist_ok=True)

for item in json.load(open(sys.argv[1], encoding="utf-8")):
    pid = item["id"]
    out = {"title": item["title"], "text": item["text"]}
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
print(f"saved {len(json.load(open(sys.argv[1], encoding='utf-8')))} pages")
