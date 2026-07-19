from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter


ROOT = Path("/Users/cris/Code/cristianllanos.com")
SOURCE = Path("/Users/cris/Downloads/xio.jpg")
GENERATED = ROOT / "tmp/imagegen/xio-extension-alpha.png"
OUT_DIR = ROOT / "tmp/imagegen"


def original_cutout() -> Image.Image:
    """Create an alpha matte while preserving every original RGB value."""
    source = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(source, dtype=np.float32)
    height, width, _ = rgb.shape

    # The studio backdrop is a smooth blue-gray gradient. Estimate it for every
    # row from the unobstructed left and right edges, then matte by color distance.
    left = np.median(rgb[:, :40], axis=1)
    right = np.median(rgb[:, -40:], axis=1)
    x = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :, None]
    backdrop = left[:, None, :] * (1.0 - x) + right[:, None, :] * x
    distance = np.sqrt(np.sum((rgb - backdrop) ** 2, axis=2))

    t0, t1 = 8.0, 32.0
    alpha = np.clip((distance - t0) / (t1 - t0), 0.0, 1.0)
    alpha = alpha * alpha * (3.0 - 2.0 * alpha)  # smoothstep
    alpha = np.rint(alpha * 255.0).astype(np.uint8)
    alpha[alpha < 5] = 0

    rgba = np.dstack((np.asarray(source), alpha))
    result = Image.fromarray(rgba, "RGBA")
    result.save(OUT_DIR / "xio-original-cutout.png")
    return result


def lower_body_only(generated: Image.Image) -> Image.Image:
    """Retain only the newly generated area below the original photograph."""
    rgba = np.asarray(generated.convert("RGBA"), dtype=np.uint8).copy()
    alpha = rgba[:, :, 3]
    alpha[:875, :] = 0

    # Match the generated trousers to the exact width of the original crop at
    # the join, then gradually release the mask to the generated silhouette.
    for y in range(875, 1031):
        progress = max(0.0, min(1.0, (y - 895) / (1030 - 895)))
        left = round(314 + (296 - 314) * progress)
        right = round(546 + (555 - 546) * progress)
        alpha[y, :left] = 0
        alpha[y, right + 1 :] = 0

    rgba[:, :, 3] = alpha
    return Image.fromarray(rgba, "RGBA")


def match_join(lower: Image.Image, original: Image.Image) -> Image.Image:
    """Continue source texture below the crop and fade it into the extension."""
    lower_array = np.asarray(lower.convert("RGBA"), dtype=np.float32).copy()
    original_array = np.asarray(original.convert("RGBA"), dtype=np.float32)
    seam_y = 895
    offset_x = 130
    source_left, source_right = 184, 416
    target_left = source_left + offset_x
    target_right = source_right + offset_x

    # Mirror a short strip of source trousers below the crop. This creates exact
    # color/texture continuity at the first missing row without modifying any
    # visible source pixel; the mirrored strip fades fully into the extension.
    for y in range(seam_y, seam_y + 121):
        distance = y - seam_y
        source_y = original_array.shape[0] - 1 - distance
        source_rgb = original_array[source_y, source_left : source_right + 1, :3]
        weight = 0.5 * (1.0 + np.cos(np.pi * distance / 120.0))
        generated_rgb = lower_array[y, target_left : target_right + 1, :3]
        lower_array[y, target_left : target_right + 1, :3] = (
            source_rgb * weight + generated_rgb * (1.0 - weight)
        )

    return Image.fromarray(np.rint(lower_array).astype(np.uint8), "RGBA")


def add_finish(subject: Image.Image, padding: int = 140) -> Image.Image:
    alpha = subject.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError("The composited subject has no visible pixels")

    subject = subject.crop(bbox)
    canvas = Image.new(
        "RGBA",
        (subject.width + padding * 2, subject.height + padding * 2),
        (0, 0, 0, 0),
    )
    canvas.alpha_composite(subject, (padding, padding))
    alpha = canvas.getchannel("A")

    gold_dilate = alpha.filter(ImageFilter.MaxFilter(5))
    gold_ring = ImageChops.subtract(gold_dilate, alpha)
    gold_ring = gold_ring.point(lambda value: round(value * 0.88))

    blue_dilate = alpha.filter(ImageFilter.MaxFilter(11))
    blue_soft = blue_dilate.filter(ImageFilter.GaussianBlur(2.0))
    blue_ring = ImageChops.subtract(blue_soft, gold_dilate)
    blue_ring = blue_ring.point(lambda value: round(value * 0.16))

    blue = Image.new("RGBA", canvas.size, (4, 71, 108, 0))
    blue.putalpha(blue_ring)
    gold = Image.new("RGBA", canvas.size, (215, 163, 106, 0))
    gold.putalpha(gold_ring)

    finished = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    finished.alpha_composite(blue)
    finished.alpha_composite(gold)
    finished.alpha_composite(canvas)
    return finished


def main() -> None:
    original = original_cutout()
    generated = lower_body_only(Image.open(GENERATED))
    generated = match_join(generated, original)

    composite = generated.copy()
    composite.alpha_composite(original, (130, 42))

    # Preserve a native-resolution master, then provide a 2x Canva export.
    finished = add_finish(composite)
    native_path = OUT_DIR / "xio-silueta-canva-native.png"
    finished.save(native_path, optimize=True)

    high_res = finished.resize(
        (finished.width * 2, finished.height * 2),
        Image.Resampling.LANCZOS,
    )
    high_res_path = OUT_DIR / "xio-silueta-canva.png"
    high_res.save(high_res_path, optimize=True)

    # Checkerboard QA preview (not a deliverable).
    tile = 32
    yy, xx = np.indices((high_res.height, high_res.width))
    checker = ((xx // tile + yy // tile) % 2).astype(np.uint8)
    bg = np.where(checker[:, :, None] == 0, 46, 82).astype(np.uint8)
    bg = np.repeat(bg, 3, axis=2)
    preview = Image.fromarray(bg, "RGB").convert("RGBA")
    preview.alpha_composite(high_res)
    preview.convert("RGB").save(OUT_DIR / "xio-silueta-checkerboard.jpg", quality=92)

    print(f"native={native_path} size={finished.size}")
    print(f"high_res={high_res_path} size={high_res.size}")
    print(f"bbox={high_res.getchannel('A').getbbox()}")
    print(f"corner_alpha={[high_res.getpixel(p)[3] for p in [(0, 0), (high_res.width-1, 0), (0, high_res.height-1), (high_res.width-1, high_res.height-1)]]}")


if __name__ == "__main__":
    main()
