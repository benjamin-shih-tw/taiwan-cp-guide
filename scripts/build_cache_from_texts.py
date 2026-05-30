#!/usr/bin/env python3
"""Build notion-cache/*.json from titles.json + notion_texts/{uuid}.txt"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "notion-cache"
TEXTS = ROOT / "notion_texts"
TITLES = json.loads((ROOT / "titles.json").read_text(encoding="utf-8"))


def main() -> None:
    saved, failures = [], []
    CACHE.mkdir(parents=True, exist_ok=True)
    for uid, title in TITLES.items():
        tf = TEXTS / f"{uid}.txt"
        if not tf.exists():
            failures.append((uid, "missing text file"))
            continue
        try:
            data = {"title": title, "text": tf.read_text(encoding="utf-8")}
            (CACHE / f"{uid}.json").write_text(
                json.dumps(data, ensure_ascii=False, separators=(",", ":")),
                encoding="utf-8",
            )
            saved.append(uid)
        except Exception as e:
            failures.append((uid, str(e)))
    print(json.dumps({"saved": len(saved), "expected": len(TITLES), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
