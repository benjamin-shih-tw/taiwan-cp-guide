#!/usr/bin/env python3
"""Save notion-cache from JSONL: each line {"id","title","text"} or full notion-fetch object."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "notion-cache"


def save(pid: str, data: dict) -> None:
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "notion_pages.jsonl"
    saved, failures = [], []
    for i, line in enumerate(src.read_text(encoding="utf-8").splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
            pid = data.get("id") or data.get("page_id")
            if not pid and "metadata" in data:
                # full notion-fetch line needs id in wrapper
                raise ValueError("missing id")
            if "metadata" in data and "title" in data:
                save(pid or data.get("url", "").split("/")[-1], data)
            else:
                save(pid, data)
            saved.append(pid)
        except Exception as e:
            failures.append((i, str(e)))
    print(json.dumps({"saved": len(saved), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
