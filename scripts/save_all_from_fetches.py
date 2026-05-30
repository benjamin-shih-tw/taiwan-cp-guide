#!/usr/bin/env python3
"""Write all 32 notion-cache files from notion_raw/*.json (full notion-fetch payloads)."""
import json
from pathlib import Path

CACHE = Path(__file__).resolve().parent / "notion-cache"
RAW = Path(__file__).resolve().parent / "notion_raw"

IDS = [
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


def save(pid: str, data: dict) -> None:
    out = {"title": data.get("title", ""), "text": data.get("text", "")}
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / f"{pid}.json").write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )


def main() -> None:
    saved, failures = [], []
    for pid in IDS:
        raw_path = RAW / f"{pid}.json"
        if not raw_path.exists():
            failures.append((pid, "missing raw file"))
            continue
        try:
            save(pid, json.loads(raw_path.read_text(encoding="utf-8")))
            saved.append(pid)
        except Exception as e:
            failures.append((pid, str(e)))
    print(json.dumps({"saved": len(saved), "expected": len(IDS), "failures": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
