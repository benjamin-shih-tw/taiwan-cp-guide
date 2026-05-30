#!/usr/bin/env python3
"""Write compact {title,text} JSON cache files from notion-fetch MCP responses."""
import json
import sys
from pathlib import Path

CACHE_DIR = Path(__file__).resolve().parent / "notion-cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

PAGE_IDS = [
    "2f392ab7-6d40-80d7-a19a-f426c0398dce",
    "2e392ab7-6d40-80f5-9f95-d0827281ae23",
    "2f092ab7-6d40-8081-a00f-e22eef47cad3",
    "2e392ab7-6d40-80e3-95f4-f494a3e8f880",
    "2e392ab7-6d40-804a-8528-e27899e46dc3",
    "2e392ab7-6d40-8002-8b6f-fbb7dc2b29ed",
    "2e392ab7-6d40-803e-83b7-ec46acf28ffb",
    "2e392ab7-6d40-806c-873a-c58c7f3d77a3",
    "33092ab7-6d40-808c-9a81-d540a6d662a1",
    "33092ab7-6d40-8008-a0a7-c08a54a35c52",
    "36e92ab7-6d40-806b-bf5a-f50e80105a2b",
    "36e92ab7-6d40-8069-8f55-dbe8082655d6",
    "2e392ab7-6d40-8076-acd9-d02a39ee64f3",
    "2e392ab7-6d40-8019-a704-c34f01b2ab1c",
    "2e392ab7-6d40-80a8-94fe-d635920f9c3c",
    "2e392ab7-6d40-801c-8e05-e50e3ef06c86",
    "33092ab7-6d40-80ee-9d38-f7836636d5fa",
    "33092ab7-6d40-8043-b128-e639a17c2484",
    "33092ab7-6d40-80b5-be7b-eaa7cd896ef1",
    "33092ab7-6d40-804a-8dda-e8a9c6090a1f",
    "33092ab7-6d40-8080-86f8-e08bc241b356",
    "33092ab7-6d40-806a-80b9-c4a4d2d3fec0",
    "33092ab7-6d40-8075-bf02-c0aecbacaf15",
    "33092ab7-6d40-80e7-9bad-f5a1f860fc8c",
    "33092ab7-6d40-809c-9543-d94c24efa37a",
    "33092ab7-6d40-8019-9eaa-fc456a0f2fb7",
    "33092ab7-6d40-8052-ab69-d57ace25461e",
    "33092ab7-6d40-802f-813e-d4ca344b6864",
    "33092ab7-6d40-803f-9b93-ca26e064c1bf",
    "33092ab7-6d40-802e-8b3f-e81a23b44576",
    "33092ab7-6d40-8067-a9b3-c3459edb680a",
    "33092ab7-6d40-80e3-96c2-d21276ba88db",
]


def save_page(page_id: str, payload: dict) -> None:
    out = {"title": payload.get("title", ""), "text": payload.get("text", "")}
    path = CACHE_DIR / f"{page_id}.json"
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: _write_notion_cache.py <raw-fetch.json> [more ...]", file=sys.stderr)
        sys.exit(1)

    saved = []
    failures = []

    for arg in sys.argv[1:]:
        path = Path(arg)
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            failures.append((str(path), str(e)))
            continue

        page_id = path.stem
        if page_id not in PAGE_IDS:
            failures.append((page_id, "unknown page id"))
            continue

        try:
            save_page(page_id, data)
            saved.append(page_id)
        except Exception as e:
            failures.append((page_id, str(e)))

    print(json.dumps({"saved": len(saved), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
