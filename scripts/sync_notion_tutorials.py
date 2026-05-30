#!/usr/bin/env python3
"""Apply Notion lecture cache to tutorials/*.md files."""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE_DIR = Path(__file__).resolve().parent / "notion-cache"
MAP_FILE = Path(__file__).resolve().parent / "notion-lecture-map.json"
TUTORIALS_DIR = ROOT / "tutorials"
ROADMAP_FILE = ROOT / "data" / "roadmap.js"


def load_topic_titles() -> dict[str, str]:
    text = ROADMAP_FILE.read_text(encoding="utf-8")
    titles: dict[str, str] = {}
    blocks = re.split(r'\{\s*"id":', text)
    for block in blocks[1:]:
        id_m = re.match(r'\s*"([^"]+)"', block)
        title_m = re.search(r'"title":\s*"((?:\\.|[^"\\])*)"', block)
        if id_m and title_m:
            tid = id_m.group(1)
            title = json.loads(f'"{title_m.group(1)}"')
            if not re.match(r"^(zj-|tioj-|cf-|cses-)", tid):
                titles[tid] = title
    return titles


def extract_content_block(raw: str) -> str:
    m = re.search(r"<content>\n(.*)\n</content>", raw, re.DOTALL)
    return m.group(1).strip() if m else raw


def extract_title(raw: str) -> str:
    m = re.search(r'"title":"([^"]+)"', raw)
    if m:
        return m.group(1).replace("\\|", "|")
    m2 = re.search(r"<page[^>]*title=\"([^\"]+)\"", raw)
    return m2.group(1) if m2 else "Lecture"


def notion_to_markdown(src: str) -> str:
    s = src
    s = re.sub(r"<empty-block\s*/>", "", s)
    s = re.sub(r"\t", "", s)

    def callout_repl(m: re.Match) -> str:
        body = m.group(1).strip()
        body = re.sub(r"^>\s*", "", body, flags=re.MULTILINE)
        return "\n".join(f"> {line}" if line else ">" for line in body.splitlines()) + "\n"

    s = re.sub(
        r"<callout[^>]*>\s*\n?(.*?)\n?</callout>",
        callout_repl,
        s,
        flags=re.DOTALL,
    )

    def details_repl(m: re.Match) -> str:
        summary = m.group(1).strip()
        body = m.group(2).strip()
        return f"\n<details>\n<summary>{summary}</summary>\n\n{body}\n\n</details>\n"

    s = re.sub(
        r"<details>\s*<summary>(.*?)</summary>\s*(.*?)\s*</details>",
        details_repl,
        s,
        flags=re.DOTALL,
    )

    s = re.sub(r"<span[^>]*>(.*?)</span>", r"\1", s, flags=re.DOTALL)
    s = re.sub(r"\{color=\"[^\"]+\"\}", "", s)
    s = re.sub(r"\{toggle=\"[^\"]+\"\}", "", s)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"\\{1,2}\|", "|", s)
    s = re.sub(
        r"\[([^\]]+)\]\((https?://[^)\s]+)(?:\?[^)]*)?\)",
        r"[\1](\2)",
        s,
    )
    s = re.sub(
        r"\[([^\]]+)\]\(/[0-9a-f-]+[^)]*\)",
        r"\1",
        s,
    )
    s = re.sub(r"`\$([^$`]+)\$`", r"$\1$", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def main() -> int:
    mapping = json.loads(MAP_FILE.read_text(encoding="utf-8"))
    topic_titles = load_topic_titles()
    by_slug: dict[str, list[tuple[str, str]]] = defaultdict(list)

    for page_id, slug in mapping.items():
        cache_file = CACHE_DIR / f"{page_id}.json"
        if not cache_file.exists():
            print(f"skip (no cache): {page_id} -> {slug}", file=sys.stderr)
            continue
        payload = json.loads(cache_file.read_text(encoding="utf-8"))
        text = payload.get("text", "")
        lecture_title = extract_title(text)
        content = notion_to_markdown(extract_content_block(text))
        by_slug[slug].append((lecture_title, content))

    updated = 0
    for slug, sections in by_slug.items():
        title = topic_titles.get(slug, slug)
        parts = [f"# {title}", "", "> 本講義內容同步自 Notion「coding course」。", ""]
        for lecture_title, body in sections:
            parts.append(f"## {lecture_title}")
            parts.append("")
            parts.append(body)
            parts.append("")
        out = "\n".join(parts).rstrip() + "\n"
        path = TUTORIALS_DIR / f"{slug}.md"
        path.write_text(out, encoding="utf-8")
        print(f"updated {path.name} ({len(sections)} lecture(s))")
        updated += 1

    print(f"\nDone: {updated} tutorial file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
