#!/usr/bin/env python3
"""Persist all 32 lecture pages via persist_mcp_stdin from MCP JSON sources."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PERSIST = ROOT / "persist_mcp_stdin.py"
INGEST = ROOT / "mcp_ingest"

UUIDS = [
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


def load_mcp(pid: str) -> dict | None:
    candidates = [
        Path(f"/tmp/notion_mcp_{pid}.json"),
        INGEST / f"{pid}.json",
        ROOT / "notion_raw" / f"{pid}.json",
    ]
    for path in candidates:
        if path.exists():
            data = json.loads(path.read_text(encoding="utf-8"))
            if "title" in data and "text" in data:
                if "metadata" not in data:
                    data = {
                        "metadata": {"type": "page"},
                        "title": data["title"],
                        "text": data["text"],
                    }
                return data
    cache_path = ROOT / "notion-cache" / f"{pid}.json"
    if cache_path.exists():
        data = json.loads(cache_path.read_text(encoding="utf-8"))
        return {
            "metadata": {"type": "page"},
            "title": data.get("title", ""),
            "text": data.get("text", ""),
        }
    return None


def persist_one(pid: str, data: dict) -> None:
    tmp = Path(f"/tmp/notion_mcp_{pid}.json")
    tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    subprocess.run(
        ["python3", str(PERSIST), pid],
        stdin=open(tmp, encoding="utf-8"),
        check=True,
        capture_output=True,
        text=True,
    )


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] == "--write-jsonl":
        # python3 persist_all_32.py --write-jsonl < mcp_pages.jsonl
        # each line: full notion-fetch object; optional "id" field
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            pid = row.pop("id", None) or row.pop("page_id", None)
            if not pid:
                raise ValueError("jsonl line missing id")
            INGEST.mkdir(parents=True, exist_ok=True)
            (INGEST / f"{pid}.json").write_text(
                json.dumps(row, ensure_ascii=False), encoding="utf-8"
            )
        return

    failures: list[tuple[str, str]] = []
    saved = 0
    for pid in UUIDS:
        try:
            data = load_mcp(pid)
            if data is None:
                failures.append((pid, "no MCP JSON source found"))
                continue
            persist_one(pid, data)
            saved += 1
        except subprocess.CalledProcessError as e:
            failures.append((pid, e.stderr or str(e)))
        except Exception as e:
            failures.append((pid, str(e)))

    cache_count = len(list((ROOT / "notion-cache").glob("*.json")))
    print(
        json.dumps(
            {
                "saved": saved,
                "expected": len(UUIDS),
                "cache_count": cache_count,
                "failures": failures,
            },
            ensure_ascii=False,
        )
    if failures:
        sys.exit(1)


if __name__ == "__main__":
    main()
