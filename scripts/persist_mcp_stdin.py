#!/usr/bin/env python3
"""Read notion-fetch JSON from stdin; write notion_raw + notion-cache."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "notion_raw"
CACHE = ROOT / "notion-cache"


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: persist_mcp_stdin.py <page-uuid>", file=sys.stderr)
        sys.exit(1)
    pid = sys.argv[1]
    data = json.load(sys.stdin)
    RAW.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    (RAW / f"{pid}.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(CACHE / f"{pid}.json")


if __name__ == "__main__":
    main()
