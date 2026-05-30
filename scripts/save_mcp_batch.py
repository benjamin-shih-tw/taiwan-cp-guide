#!/usr/bin/env python3
"""Persist MCP notion-fetch responses: uuid -> response dict in JSON file."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PERSIST = ROOT / "persist_mcp_stdin.py"


def persist_one(pid: str, data: dict) -> None:
    tmp = Path(f"/tmp/notion_mcp_{pid}.json")
    tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    subprocess.run(
        ["python3", str(PERSIST), pid],
        stdin=open(tmp, encoding="utf-8"),
        check=True,
    )


def main() -> None:
    batch_path = Path(sys.argv[1])
    batch = json.loads(batch_path.read_text(encoding="utf-8"))
    for pid, data in batch.items():
        persist_one(pid, data)
        print(pid, "ok")


if __name__ == "__main__":
    main()
