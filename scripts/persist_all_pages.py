#!/usr/bin/env python3
"""Persist MCP notion-fetch responses from a JSON map file."""
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
    path = Path(sys.argv[1])
    batch = json.loads(path.read_text(encoding="utf-8"))
    failures = []
    for pid, data in batch.items():
        try:
            persist_one(pid, data)
            print("ok", pid)
        except Exception as e:
            failures.append((pid, str(e)))
            print("FAIL", pid, e, file=sys.stderr)
    print(f"saved={len(batch) - len(failures)} failures={len(failures)}")
    for pid, err in failures:
        print(f"  {pid}: {err}", file=sys.stderr)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
