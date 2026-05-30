#!/usr/bin/env python3
"""Save notion-fetch results from JSONL (one JSON object per line with id, title, text)."""
import json
import sys
from pathlib import Path

CACHE_DIR = Path(__file__).resolve().parent / "notion-cache"
JSONL = Path(__file__).resolve().parent / "_notion_fetch_batch.jsonl"


def save_page(page_id: str, data: dict) -> Path:
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / f"{page_id}.json"
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return path


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else JSONL
    if not src.exists():
        print(f"Missing input: {src}", file=sys.stderr)
        sys.exit(1)
    saved = []
    failures = []
    for line in src.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            row = json.loads(line)
            page_id = row["id"]
            data = {"title": row.get("title", ""), "text": row.get("text", "")}
            save_page(page_id, data)
            saved.append(page_id)
        except Exception as e:
            failures.append((row.get("id", "?"), str(e)))
    print(f"saved={len(saved)} failures={len(failures)}")
    for pid, err in failures:
        print(f"FAIL {pid}: {err}", file=sys.stderr)


if __name__ == "__main__":
    main()
