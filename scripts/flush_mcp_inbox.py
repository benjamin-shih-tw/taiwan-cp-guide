#!/usr/bin/env python3
"""Write inbox JSON to /tmp and run persist_mcp_stdin for each."""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INBOX = ROOT / "_mcp_inbox"
PERSIST = ROOT / "persist_mcp_stdin.py"


def main() -> None:
    failures = []
    ok = 0
    for src in sorted(INBOX.glob("*.json")):
        pid = src.stem
        tmp = Path(f"/tmp/notion_mcp_{pid}.json")
        shutil.copy(src, tmp)
        try:
            subprocess.run(
                ["python3", str(PERSIST), pid],
                stdin=open(tmp, encoding="utf-8"),
                check=True,
                capture_output=True,
                text=True,
            )
            ok += 1
            print("ok", pid)
        except subprocess.CalledProcessError as e:
            failures.append((pid, e.stderr or str(e)))
            print("FAIL", pid, file=sys.stderr)
    print(f"saved={ok} failures={len(failures)}")
    for pid, err in failures:
        print(f"  {pid}: {err}", file=sys.stderr)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
