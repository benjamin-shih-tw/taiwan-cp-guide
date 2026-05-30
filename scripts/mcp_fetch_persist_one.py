#!/usr/bin/env python3
"""Fetch one Notion page via MCP (stdin JSON) or file; write /tmp + persist."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SAVE = ROOT / "save_mcp_file.py"


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: mcp_fetch_persist_one.py <uuid> [mcp-json-file]", file=sys.stderr)
        sys.exit(1)
    pid = sys.argv[1]
    if len(sys.argv) >= 3:
        src = Path(sys.argv[2])
        data = json.loads(src.read_text(encoding="utf-8"))
    else:
        data = json.load(sys.stdin)
    subprocess.run(["python3", str(SAVE), pid, "-"], check=True)  # noqa: wrong


if __name__ == "__main__":
    main()
