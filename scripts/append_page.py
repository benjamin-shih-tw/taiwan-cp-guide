#!/usr/bin/env python3
"""Append one page record to notion_batch.json array. Usage: append_page.py <id> <title> <textfile>"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BATCH = ROOT / "notion_batch.json"


def main() -> None:
    pid, title, text_path = sys.argv[1], sys.argv[2], sys.argv[3]
    text = Path(text_path).read_text(encoding="utf-8")
    item = {"id": pid, "title": title, "text": text}
    items = []
    if BATCH.exists():
        items = json.loads(BATCH.read_text(encoding="utf-8"))
    items.append(item)
    BATCH.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8")
    print(pid, "ok", len(items))


if __name__ == "__main__":
    main()
