"""Generate mobile-only WebP variants for lazy-loaded case-study images.

Desktop keeps the original ``img`` source. Browsers up to 700 px receive the
smaller file through a ``picture`` source, while the original remains the
fallback. Requires ffmpeg on PATH.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    ROOT / "index.html",
    ROOT / "projetos/dengue/index.html",
    ROOT / "projetos/churn/index.html",
    ROOT / "projetos/imdb/index.html",
    ROOT / "projetos/home-credit/index.html",
)
MIN_SOURCE_BYTES = 100 * 1024
MIN_SAVING_RATIO = 0.15
MOBILE_WIDTH = 1200

IMG_RE = re.compile(
    r"(?P<indent>^[ \t]*)(?P<tag><img\b(?=[^>]*\bloading=\"lazy\")[^>]*>)",
    re.IGNORECASE | re.MULTILINE,
)
SRC_RE = re.compile(r'\bsrc="(?P<src>[^"]+)"', re.IGNORECASE)


def generate_variant(source: Path, target: Path) -> bool:
    if source.stat().st_size < MIN_SOURCE_BYTES:
        return False

    target.unlink(missing_ok=True)
    subprocess.run(
        (
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-vf",
            rf"scale=min({MOBILE_WIDTH}\,iw):-2",
            "-frames:v",
            "1",
            "-c:v",
            "libwebp",
            "-quality",
            "84",
            "-compression_level",
            "6",
            str(target),
        ),
        check=True,
    )

    saving_ratio = 1 - target.stat().st_size / source.stat().st_size
    if saving_ratio < MIN_SAVING_RATIO:
        target.unlink(missing_ok=True)
        return False
    return True


def process_page(page: Path, generated: set[Path]) -> tuple[int, int, int]:
    html = page.read_text(encoding="utf-8")
    newline = "\r\n" if "\r\n" in html else "\n"
    original_bytes = 0
    mobile_bytes = 0
    wrapped = 0

    def replace(match: re.Match[str]) -> str:
        nonlocal original_bytes, mobile_bytes, wrapped
        prefix = html[: match.start()]
        if prefix.rfind('<picture class="mobile-picture">') > prefix.rfind("</picture>"):
            return match.group(0)

        indent = match.group("indent")
        tag = match.group("tag")
        src_match = SRC_RE.search(tag)
        if not src_match:
            return match.group(0)

        src = src_match.group("src")
        if src.lower().endswith("-mobile.webp"):
            return match.group(0)
        source = (page.parent / src).resolve()
        if source.suffix.lower() not in {".png", ".jpg", ".jpeg"} or not source.is_file():
            return match.group(0)

        target = source.with_name(f"{source.stem}-mobile.webp")
        if target not in generated:
            if not generate_variant(source, target):
                return match.group(0)
            generated.add(target)
        elif not target.exists():
            return match.group(0)

        mobile_src = str(Path(src).with_name(f"{Path(src).stem}-mobile.webp")).replace("\\", "/")
        indented_tag = f"{indent}  {tag.replace(newline, newline + '  ')}"
        original_bytes += source.stat().st_size
        mobile_bytes += target.stat().st_size
        wrapped += 1
        return newline.join(
            (
                f'{indent}<picture class="mobile-picture">',
                f'{indent}  <source media="(max-width: 700px)" srcset="{mobile_src}" type="image/webp">',
                indented_tag,
                f"{indent}</picture>",
            )
        )

    updated = IMG_RE.sub(replace, html)
    if updated != html:
        page.write_text(updated, encoding="utf-8", newline="")
    return wrapped, original_bytes, mobile_bytes


def main() -> None:
    generated: set[Path] = set()
    total_wrapped = 0
    total_original = 0
    total_mobile = 0
    for page in PAGES:
        wrapped, original_bytes, mobile_bytes = process_page(page, generated)
        total_wrapped += wrapped
        total_original += original_bytes
        total_mobile += mobile_bytes
        print(
            f"{page.relative_to(ROOT)}: {wrapped} variants, "
            f"{original_bytes / 1024 / 1024:.1f} MB -> {mobile_bytes / 1024 / 1024:.1f} MB"
        )

    print(
        f"Total: {total_wrapped} image uses, {len(generated)} files, "
        f"{total_original / 1024 / 1024:.1f} MB -> {total_mobile / 1024 / 1024:.1f} MB"
    )


if __name__ == "__main__":
    main()
