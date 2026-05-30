#!/usr/bin/env python3
"""Merge batch*_data ITEMS and write notion-cache via process_notion_batch."""
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "notion-cache"
CACHE.mkdir(parents=True, exist_ok=True)


def load_items(mod_name: str) -> list:
    path = ROOT / f"{mod_name}.py"
    if not path.exists():
        return []
    spec = importlib.util.spec_from_file_location(mod_name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return list(getattr(mod, "ITEMS", []))


def main() -> None:
    items = []
    for name in ("batch1_data", "batch2_data", "batch3_data", "batch4_data"):
        items.extend(load_items(name))

    # existing partial raw/cache
    titles = json.loads((ROOT / "titles.json").read_text(encoding="utf-8"))
    seen = {x["id"] for x in items}
    for uid, title in titles.items():
        if uid in seen:
            continue
        for base in (ROOT / "notion_raw", CACHE):
            f = base / f"{uid}.json"
            if f.exists():
                d = json.loads(f.read_text(encoding="utf-8"))
                items.append({"id": uid, "title": d.get("title", title), "text": d.get("text", "")})
                seen.add(uid)
                break

    failures = []
    saved = []
    for item in items:
        pid = item["id"]
        try:
            out = {"title": item["title"], "text": item["text"]}
            (CACHE / f"{pid}.json").write_text(
                json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
            )
            saved.append(pid)
        except Exception as e:
            failures.append((pid, str(e)))

    print(json.dumps({"saved": len(saved), "expected": len(titles), "failures": failures}, ensure_ascii=False))
    if len(saved) != len(titles):
        missing = sorted(set(titles) - set(saved))
        print("missing:", missing, file=sys.stderr)


if __name__ == "__main__":
    main()
