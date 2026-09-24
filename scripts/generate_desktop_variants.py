"""Generate desktop-sized WebP variants for the images of the portfolio pages.

Most images come from Wix exports several thousand pixels wide and are shown
at a few hundred CSS pixels. This script creates a WebP with twice the widest
width the image is displayed at on desktop (sharp on 2x screens), capped at
the original width, and points the page to it:

* images inside ``picture.mobile-picture`` get a ``<source>`` after the
  mobile one, so desktop picks the new file and phones keep their variant;
* other lazy images are wrapped in the same ``picture`` (``display: contents``,
  no layout box);
* hero images (``fetchpriority="high"``) have ``src`` and the matching
  ``<link rel="preload">`` replaced, because their CSS targets ``> img``.

The original file stays as the ``img`` fallback, and the mobile zoom dialog
keeps opening it at full resolution.

Displayed widths come from ``scripts/image-display-widths.json``, produced by
``scripts/measure_image_widths.js``. Run that first whenever layout or images
change. Requires Pillow with WebP support.
"""

from __future__ import annotations

import io
import json
import math
import re
from pathlib import Path
from urllib.parse import quote, unquote

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
WIDTHS_FILE = ROOT / "scripts/image-display-widths.json"
PAGES = (
    "index.html",
    "projetos/dengue/index.html",
    "projetos/churn/index.html",
    "projetos/imdb/index.html",
    "projetos/home-credit/index.html",
)
PIXEL_DENSITY = 2
LOSSY_QUALITY = 90
LOSSLESS_TOLERANCE = 1.10
MIN_SAVING_RATIO = 0.25
MIN_SAVING_BYTES = 15 * 1024
RASTER_SUFFIXES = {".png", ".jpg", ".jpeg"}

IMG_RE = re.compile(r"(?P<indent>^[ \t]*)(?P<tag><img\b[^>]*>)", re.IGNORECASE | re.MULTILINE)
SRC_RE = re.compile(r'\bsrc="(?P<src>[^"]+)"', re.IGNORECASE)
URL_SAFE = "/:@-._~!$&'()*+,;=%"


def encode_webp(image: Image.Image) -> bytes:
    """Lossy WebP, unless lossless is almost as small (keeps charts exact)."""
    options = {"method": 6}
    if icc := image.info.get("icc_profile"):
        options["icc_profile"] = icc

    lossy = io.BytesIO()
    image.save(lossy, "WEBP", quality=LOSSY_QUALITY, **options)
    lossless = io.BytesIO()
    image.save(lossless, "WEBP", lossless=True, quality=100, **options)

    if lossless.tell() <= lossy.tell() * LOSSLESS_TOLERANCE:
        return lossless.getvalue()
    return lossy.getvalue()


def build_variant(source: Path, shown_width: int) -> Path | None:
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        icc = original.info.get("icc_profile")
        natural_width, natural_height = image.size
        target_width = min(natural_width, math.ceil(shown_width * PIXEL_DENSITY / 10) * 10)
        target = source.with_name(f"{source.stem}-{target_width}w.webp")
        if target.exists():
            return target

        has_alpha = image.mode in {"RGBA", "LA"} or (image.mode == "P" and "transparency" in image.info)
        image = image.convert("RGBA" if has_alpha else "RGB")
        if target_width < natural_width:
            target_height = round(natural_height * target_width / natural_width)
            image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        if icc:
            image.info["icc_profile"] = icc
        data = encode_webp(image)

    saving = source.stat().st_size - len(data)
    if saving < MIN_SAVING_BYTES or saving < source.stat().st_size * MIN_SAVING_RATIO:
        return None
    target.write_bytes(data)
    return target


def variant_url(src: str, variant: Path) -> str:
    # srcset separa URL e descritor por espaço: a pasta também precisa ir codificada.
    folder = quote(src.split("?", 1)[0].rsplit("/", 1)[0], safe=URL_SAFE)
    return f"{folder}/{quote(variant.name, safe=URL_SAFE)}"


def process_page(page: str, widths: dict[str, int]) -> tuple[int, int, int]:
    page_path = ROOT / page
    html = page_path.read_text(encoding="utf-8")
    newline = "\r\n" if "\r\n" in html else "\n"
    before = after = changed = 0
    preload_swaps: list[tuple[str, str]] = []

    def replace(match: re.Match[str]) -> str:
        nonlocal before, after, changed
        indent, tag = match.group("indent"), match.group("tag")
        src_match = SRC_RE.search(tag)
        if not src_match:
            return match.group(0)
        src = src_match.group("src")
        source = (page_path.parent / unquote(src.split("?", 1)[0])).resolve()
        shown = widths.get(src)
        if source.suffix.lower() not in RASTER_SUFFIXES or not source.is_file() or not shown:
            return match.group(0)

        variant = build_variant(source, shown)
        if variant is None:
            return match.group(0)
        url = variant_url(src, variant)
        prefix = html[: match.start()]
        inside_picture = prefix.rfind("<picture") > prefix.rfind("</picture>")
        if inside_picture and url in prefix[prefix.rfind("<picture"):]:
            return match.group(0)  # já processada em uma execução anterior

        before += source.stat().st_size
        after += variant.stat().st_size
        changed += 1

        if 'fetchpriority="high"' in tag and not inside_picture:
            preload_swaps.append((src, url))
            return indent + tag.replace(f'src="{src}"', f'src="{url}"', 1)

        source_tag = f'<source srcset="{url}" type="image/webp">'
        if inside_picture:
            return f"{indent}{source_tag}{newline}{indent}{tag}"

        indented_tag = f"{indent}  {tag.replace(newline, newline + '  ')}"
        return newline.join(
            (
                f'{indent}<picture class="mobile-picture">',
                f"{indent}  {source_tag}",
                indented_tag,
                f"{indent}</picture>",
            )
        )

    updated = IMG_RE.sub(replace, html)
    for old, new in preload_swaps:
        updated = re.sub(
            rf'(<link rel="preload" href="){re.escape(old)}(" as="image" type=")image/(?:png|jpeg)(")',
            rf"\g<1>{new}\g<2>image/webp\g<3>",
            updated,
        )
    if updated != html:
        page_path.write_text(updated, encoding="utf-8", newline="")
    return changed, before, after


def main() -> None:
    all_widths = json.loads(WIDTHS_FILE.read_text(encoding="utf-8"))
    total_changed = total_before = total_after = 0
    for page in PAGES:
        changed, before, after = process_page(page, all_widths.get(page, {}))
        total_changed += changed
        total_before += before
        total_after += after
        print(f"{page}: {changed} images, {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB")
    print(f"Total: {total_changed} images, {total_before / 1048576:.1f} MB -> {total_after / 1048576:.1f} MB")


if __name__ == "__main__":
    main()
