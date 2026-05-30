#!/usr/bin/env python3
"""Write notion-cache from embedded page list (id, title, text)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "notion-cache"
TITLES = json.loads((ROOT / "titles.json").read_text(encoding="utf-8"))

# Populated at runtime via --jsonl argument
PAGES: list[dict] = []


def save_page(pid: str, title: str, text: str) -> None:
    out = {"title": title, "text": text}
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )


def load_jsonl(path: Path) -> None:
    global PAGES
    PAGES = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        data = json.loads(line)
        if "metadata" in data:
            pid = data.get("page_id") or data.get("id")
            if not pid:
                raise ValueError("line missing id")
            PAGES.append({"id": pid, "title": data["title"], "text": data["text"]})
        else:
            PAGES.append(data)


def main() -> None:
    import sys

    if len(sys.argv) > 1:
        load_jsonl(Path(sys.argv[1]))
    saved, failures = [], []
    for item in PAGES:
        pid = item["id"]
        title = item.get("title") or TITLES.get(pid, "")
        text = item.get("text", "")
        try:
            save_page(pid, title, text)
            saved.append(pid)
        except Exception as e:
            failures.append((pid, str(e)))
    print(json.dumps({"saved": len(saved), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
