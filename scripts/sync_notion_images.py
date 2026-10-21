#!/usr/bin/env python3
"""Mirror images referenced by the static Notion lesson snapshots."""

import concurrent.futures
import glob
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = "https://benjaminshih.vercel.app/api/coding-course/page/"
DEST = ROOT / "v2/notion-images"
MAP = ROOT / "data/notion_image_mirror.js"
URL = re.compile(r"https://prod-files-secure\.s3\.[^\s)]+")
UUID = re.compile(r"/[0-9a-f-]{36}/([0-9a-f-]{36})/[^/]+$", re.I)


def read_items(path, marker):
    raw = path.read_text()
    return json.loads(raw.split(marker, 1)[1].strip().removesuffix(");").removesuffix(";"))


def static_pages():
    for name in glob.glob(str(ROOT / "data/notion_courses_part*.js")):
        yield from read_items(Path(name), "window.NOTION_COURSES.push(...")
    yield from read_items(ROOT / "data/notion_ladders.js", "window.NOTION_LADDERS =")


def request(url):
    encoded = urllib.parse.quote(url, safe=":/?&=%+#@,;!$'()*[]")
    req = urllib.request.Request(encoded, headers={"User-Agent": "taiwan-cp-guide-image-sync/1.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return response.read()
        except (TimeoutError, OSError):
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def page_images(page):
    old_ids = []
    for url in URL.findall(page.get("content") or ""):
        match = UUID.search(urllib.parse.urlsplit(url).path)
        if match:
            image_id = match.group(1).lower()
            if image_id not in old_ids:
                old_ids.append(image_id)
    if not old_ids:
        return {}

    try:
        payload = json.loads(request(API + page["id"]))
    except (TimeoutError, OSError, ValueError) as error:
        print(f"{page['id']}: could not refresh images: {error}", flush=True)
        return {}
    found = {}
    signed = list((payload.get("blockMap", {}).get("signed_urls") or {}).values())
    for url in signed:
        match = UUID.search(urllib.parse.urlsplit(url).path)
        if match and match.group(1).lower() in old_ids:
            found[match.group(1).lower()] = url
    missing = set(old_ids) - found.keys()
    if len(old_ids) == len(signed) == 1 and missing:
        found[old_ids[0]] = signed[0]
        missing.clear()
    if missing:
        print(f"{page['id']}: {len(missing)} images no longer in Notion", flush=True)
    return found


def save_image(item):
    image_id, url = item
    source_path = urllib.parse.urlsplit(url).path
    source_id = UUID.search(source_path)
    suffix = Path(source_path).suffix.lower()
    if suffix not in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}:
        suffix = ".bin"
    path = DEST / (image_id + suffix)
    if not path.exists() or (source_id and source_id.group(1).lower() != image_id):
        try:
            data = request(url)
        except (TimeoutError, OSError) as error:
            print(f"{image_id}: could not download image: {error}", flush=True)
            return None
        if not data:
            raise ValueError(f"Empty image: {image_id}")
        path.write_bytes(data)
    return image_id, "notion-images/" + path.name


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    images = {path.stem: "notion-images/" + path.name for path in DEST.iterdir() if path.is_file()}
    MAP.write_text("window.NOTION_IMAGE_MIRROR = " + json.dumps(images, sort_keys=True) + ";\n")
    pages = list(static_pages())
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(page_images, pages))
    urls = {image_id: url for result in results for image_id, url in result.items()}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        images.update(result for result in pool.map(save_image, urls.items()) if result)
    MAP.write_text("window.NOTION_IMAGE_MIRROR = " + json.dumps(images, sort_keys=True) + ";\n")
    print(f"Mirrored {len(images)} Notion images")


if __name__ == "__main__":
    main()
