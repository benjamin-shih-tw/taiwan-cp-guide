#!/usr/bin/env python3
"""Save one notion-fetch MCP response as compact cache JSON."""
import json
import sys
from pathlib import Path

CACHE_DIR = Path(__file__).resolve().parent / "notion-cache"


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: save_notion_page.py <page-uuid>", file=sys.stderr)
        sys.exit(1)
    page_id = sys.argv[1]
    data = json.load(sys.stdin)
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / f"{page_id}.json"
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(path)


if __name__ == "__main__":
    main()
