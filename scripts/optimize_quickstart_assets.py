#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import shutil
import unicodedata
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote

from PIL import Image


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_HTML = ROOT_DIR / "static" / "quickstart-site" / "index.html"
DEFAULT_IMAGE_ROOT = ROOT_DIR / "static" / "quickstart-site" / "image"
PNG_REF_RE = re.compile(r"image/png/[^\"]+?\.png")
ATTR_REF_RE = {
    "src": re.compile(r'src="([^"]+)"'),
    "data-src": re.compile(r'data-src="([^"]+)"'),
    "href": re.compile(r'href="([^"]+)"'),
    "content": re.compile(r'content="([^"]+)"'),
    "srcset": re.compile(r'srcset="([^"]+)"'),
}
BROKEN_REF_ALIASES = {
    "image/png/Добавление лицензий?.png": "image/png/Добавление лицензий.png",
    "image/png/Добавление лицензий?.webp": "image/png/Добавление лицензий.webp",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize SmartPlayer quickstart media.")
    parser.add_argument("--html", type=Path, default=DEFAULT_HTML, help="Path to quickstart HTML file")
    parser.add_argument("--image-root", type=Path, default=DEFAULT_IMAGE_ROOT, help="Root directory for quickstart images")
    parser.add_argument(
        "--quality",
        type=int,
        default=90,
        help="WebP quality for lossy conversion of PNG screenshots",
    )
    return parser.parse_args()


def normalize_ref(value: str) -> str:
    value = unquote(value)
    if "image/" not in value:
        return value
    value = value[value.find("image/") :]
    value = BROKEN_REF_ALIASES.get(value, value)
    return unicodedata.normalize("NFC", value)


def resolve_existing_path(root_dir: Path, ref: str) -> Path:
    relative = Path(BROKEN_REF_ALIASES.get(ref, ref))
    candidate = root_dir / relative
    if candidate.exists():
        return candidate

    if not candidate.parent.exists():
        raise FileNotFoundError(f"Directory not found for {ref}")

    for sibling in candidate.parent.iterdir():
        if unicodedata.normalize("NFC", sibling.name) == unicodedata.normalize("NFC", candidate.name):
            return sibling
        if unicodedata.normalize("NFD", sibling.name) == unicodedata.normalize("NFD", candidate.name):
            return sibling

    raise FileNotFoundError(f"Referenced file not found: {ref}")


def exact_target_path(root_dir: Path, ref: str, new_suffix: str) -> Path:
    relative = Path(ref)
    return root_dir / relative.with_suffix(new_suffix)


def extract_refs_by_attr(html: str, attr: str) -> list[str]:
    refs: list[str] = []
    for value in ATTR_REF_RE[attr].findall(html):
        if attr == "srcset":
            for entry in value.split(","):
                candidate = entry.strip().split()[0]
                normalized = normalize_ref(candidate)
                if normalized.startswith("image/"):
                    refs.append(normalized)
        else:
            normalized = normalize_ref(value)
            if normalized.startswith("image/"):
                refs.append(normalized)
    return refs


def replace_attr_value(html: str, attr: str, old: str, new: str) -> str:
    pattern = re.compile(rf'({attr}="){re.escape(old)}(")')
    return pattern.sub(rf"\1{new}\2", html)


def replace_aliases_in_html(html: str) -> str:
    updated = html
    for attr in ATTR_REF_RE:
        for old_ref, new_ref in BROKEN_REF_ALIASES.items():
            updated = replace_attr_value(updated, attr, old_ref, new_ref)
    return updated


def convert_png_to_webp(source_path: Path, target_path: Path, quality: int) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(BytesIO(source_path.read_bytes())) as image:
        image.save(target_path, "WEBP", quality=quality, method=6)


def ensure_asset_for_ref(root_dir: Path, ref: str, quality: int) -> bool:
    target_path = root_dir / ref
    if target_path.exists():
        return False

    if target_path.suffix.lower() == ".webp":
        source_candidates = [ref, str(Path(ref).with_suffix(".png"))]
    else:
        source_candidates = [ref]

    source_path: Path | None = None
    for candidate_ref in source_candidates:
        try:
            source_path = resolve_existing_path(root_dir, candidate_ref)
            break
        except FileNotFoundError:
            continue

    if source_path is None:
        raise FileNotFoundError(f"Unable to materialize asset for {ref}")

    target_path.parent.mkdir(parents=True, exist_ok=True)
    if source_path.suffix.lower() == ".png" and target_path.suffix.lower() == ".webp":
        convert_png_to_webp(source_path, target_path, quality)
    else:
        shutil.copy2(source_path, target_path)

    return True


def collect_used_refs(html: str) -> set[str]:
    refs: set[str] = set()
    for attr in ATTR_REF_RE:
        refs.update(extract_refs_by_attr(html, attr))
    return refs


def cleanup_unused_assets(image_root: Path, used_refs: set[str]) -> list[Path]:
    normalized_used_refs = {unicodedata.normalize("NFC", ref) for ref in used_refs}
    removed: list[Path] = []
    for path in sorted(image_root.rglob("*")):
        if not path.is_file():
            continue
        relative = unicodedata.normalize("NFC", path.relative_to(image_root.parent).as_posix())
        if relative not in normalized_used_refs:
            path.unlink()
            removed.append(path)

    for path in sorted(image_root.rglob("*"), reverse=True):
        if path.is_dir() and not any(path.iterdir()):
            path.rmdir()

    return removed


def main() -> None:
    args = parse_args()
    html_path = args.html.expanduser().resolve()
    image_root = args.image_root.expanduser().resolve()

    html = replace_aliases_in_html(html_path.read_text(encoding="utf-8"))

    display_png_refs = sorted(
        {
            ref
            for attr in ("src", "data-src")
            for ref in extract_refs_by_attr(html, attr)
            if ref.endswith(".png")
        }
    )

    converted = 0
    for png_ref in display_png_refs:
        webp_ref = str(Path(png_ref).with_suffix(".webp")).replace("\\", "/")
        source_path = resolve_existing_path(html_path.parent, png_ref)
        target_path = exact_target_path(html_path.parent, webp_ref, ".webp")

        if not target_path.exists():
            convert_png_to_webp(source_path, target_path, args.quality)
            converted += 1

        for attr in ("src", "data-src"):
            updated = replace_attr_value(html, attr, png_ref, webp_ref)
            if updated != html:
                html = updated

    html_path.write_text(html, encoding="utf-8")

    used_refs = collect_used_refs(html)
    materialized = 0
    for ref in sorted(used_refs):
        if ref.startswith("image/"):
            materialized += int(ensure_asset_for_ref(html_path.parent, ref, args.quality))
    removed = cleanup_unused_assets(image_root, used_refs)

    print(f"Processed {len(display_png_refs)} display PNG refs")
    print(f"Created {converted} WebP files")
    print(f"Materialized {materialized} referenced assets")
    print(f"Removed {len(removed)} unused assets")


if __name__ == "__main__":
    main()
