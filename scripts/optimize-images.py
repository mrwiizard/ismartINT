#!/usr/bin/env python3
"""Shrink oversized photography for the web.

Drop full-resolution originals straight into the folder they belong in, run
this, and it will:

  1. write a web-sized WebP alongside them,
  2. move the original out of public/ into _originals/ so it is never served
     and never committed,
  3. print what it saved.

Originals are MOVED, not deleted — _originals/ is git-ignored, so they stay on
your machine and out of the repo. Delete that folder yourself once you are
happy.

    python3 scripts/optimize-images.py                     # default folders
    python3 scripts/optimize-images.py public/businesses   # one folder
    python3 scripts/optimize-images.py public/foo --width 1400 --quality 85
"""

from __future__ import annotations

import argparse
import os
import shutil
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install --user Pillow")

# These are camera-resolution files; Pillow's decompression guard is aimed at
# malicious input, not 45-megapixel stock photography.
Image.MAX_IMAGE_PIXELS = None

SOURCE_EXT = (".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp")
DEFAULT_DIRS = ["public/businesses", "public/business-cards"]
ORIGINALS = "_originals"


def slugify(name: str) -> str:
    """Filenames become alt text elsewhere in the site, so keep them readable."""
    stem = os.path.splitext(name)[0].lower()
    keep = [c if (c.isalnum() or c in "-_") else "-" for c in stem]
    slug = "".join(keep)
    while "--" in slug:
        slug = slug.replace("--", "-")
    slug = slug.strip("-")
    # Filenames become alt text elsewhere, so trim on a word boundary rather
    # than mid-word ("…thrift-sh" reads as a typo to a screen reader).
    if len(slug) > 60:
        slug = slug[:60].rsplit("-", 1)[0]
    return slug or "image"


def optimize(path: str, width: int, quality: int, originals_root: str) -> tuple[int, int] | None:
    before = os.path.getsize(path)
    folder, name = os.path.split(path)

    try:
        im = Image.open(path)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    except Exception as exc:  # unreadable / not really an image
        print(f"   !  skipped {name}: {exc}")
        return None

    src_size = im.size
    im.thumbnail((width, width), Image.LANCZOS)

    out = os.path.join(folder, slugify(name) + ".webp")
    # Never clobber something already optimized under the same slug.
    n = 2
    while os.path.exists(out) and os.path.abspath(out) != os.path.abspath(path):
        out = os.path.join(folder, f"{slugify(name)}-{n}.webp")
        n += 1

    im.save(out, "WEBP", quality=quality, method=6)
    after = os.path.getsize(out)

    # Park the original outside public/.
    dest_dir = os.path.join(originals_root, os.path.relpath(folder, "public"))
    os.makedirs(dest_dir, exist_ok=True)
    shutil.move(path, os.path.join(dest_dir, name))

    print(
        f"   {before // 1024 // 1024 if before > 1048576 else 0:>3}MB "
        f"{str(src_size):>14} -> {after // 1024:>4}KB {str(im.size):>12}  "
        f"{os.path.basename(out)[:46]}"
    )
    return before, after


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dirs", nargs="*", default=DEFAULT_DIRS,
                    help="folders to process (default: %(default)s)")
    ap.add_argument("--width", type=int, default=900,
                    help="longest edge in px (default: %(default)s — these render at 190–390px)")
    ap.add_argument("--quality", type=int, default=80, help="WebP quality (default: %(default)s)")
    args = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    originals_root = os.path.join(root, ORIGINALS)

    total_before = total_after = count = 0

    for d in args.dirs or DEFAULT_DIRS:
        if not os.path.isdir(d):
            print(f"-- {d}: not found, skipping")
            continue
        targets = sorted(f for f in os.listdir(d) if f.lower().endswith(SOURCE_EXT))
        if not targets:
            print(f"-- {d}: nothing to do")
            continue
        print(f"-- {d}  ({len(targets)} file(s))")
        for f in targets:
            result = optimize(os.path.join(d, f), args.width, args.quality, originals_root)
            if result:
                total_before += result[0]
                total_after += result[1]
                count += 1

    if count:
        print()
        print(f"{count} image(s):  {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.2f} MB "
              f"({100 - total_after / total_before * 100:.1f}% smaller)")
        print(f"originals moved to {ORIGINALS}/ (git-ignored)")
    else:
        print("\nnothing optimized")


if __name__ == "__main__":
    main()
