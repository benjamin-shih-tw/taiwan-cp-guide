#!/usr/bin/env python3
"""Read MCP JSON from stdin; save to _mcp_inbox and /tmp; run persist."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INBOX = ROOT / "_mcp_inbox"
PERSIST = ROOT / "persist_mcp_stdin.py"


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: mcp_to_inbox.py <page-uuid>", file=sys.stderr)
        sys.exit(1)
    pid = sys.argv[1]
    data = json.load(sys.stdin)
    INBOX.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(data, ensure_ascii=False)
    (INBOX / f"{pid}.json").write_text(raw, encoding="utf-8")
    tmp = Path(f"/tmp/notion_mcp_{pid}.json")
    tmp.write_text(raw, encoding="utf-8")
    subprocess.run(
        ["python3", str(PERSIST), pid],
        stdin=open(tmp, encoding="utf-8"),
        check=True,
    )
    print(INBOX / f"{pid}.json")


if __name__ == "__main__":
    main()
