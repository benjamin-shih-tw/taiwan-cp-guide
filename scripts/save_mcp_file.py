#!/usr/bin/env python3
"""Load MCP JSON from file; write /tmp/notion_mcp_{uuid}.json; run persist_mcp_stdin."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PERSIST = ROOT / "persist_mcp_stdin.py"
INGEST = ROOT / "mcp_ingest"


def main() -> None:
    if len(sys.argv) != 3:
        print("Usage: save_mcp_file.py <page-uuid> <mcp-json-path>", file=sys.stderr)
        sys.exit(1)
    pid, src = sys.argv[1], Path(sys.argv[2])
    data = json.loads(src.read_text(encoding="utf-8"))
    INGEST.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(data, ensure_ascii=False)
    (INGEST / f"{pid}.json").write_text(raw, encoding="utf-8")
    tmp = Path(f"/tmp/notion_mcp_{pid}.json")
    tmp.write_text(raw, encoding="utf-8")
    subprocess.run(
        ["python3", str(PERSIST), pid],
        stdin=open(tmp, encoding="utf-8"),
        check=True,
    )
    print(tmp)


if __name__ == "__main__":
    main()
