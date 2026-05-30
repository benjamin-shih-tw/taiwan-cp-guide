#!/usr/bin/env python3
"""Ingest notion-fetch JSON files from a directory into notion-cache."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "notion-cache"
INGEST = ROOT / "mcp_ingest"


def save(pid: str, data: dict) -> None:
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else INGEST
    saved, failures = [], []
    for f in sorted(src.glob("*.json")):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            pid = f.stem
            save(pid, data)
            saved.append(pid)
        except Exception as e:
            failures.append((f.name, str(e)))
    print(json.dumps({"saved": len(saved), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
