from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parent
SOURCE = Path("/Users/cris/Downloads/cris2.jpg")
VISION_MASK = ROOT / "out/person-mask.png"
OUT_DIR = ROOT / "out"
FINAL = OUT_DIR / "cris-silueta-canva.png"


def keep_main_person(mask: Image.Image) -> Image.Image:
    """Keep the connected person only; preserve genuine gaps between limbs."""
    binary = mask.point(lambda p: 255 if p >= 12 else 0, mode="L")
    binary = binary.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    a = np.asarray(binary, dtype=np.uint8)
    h, w = a.shape
    connected = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    seed_y, seed_x = 1100, 1020
    if a[seed_y, seed_x] == 0:
        raise RuntimeError("Person-mask seed is not foreground")
    connected[seed_y, seed_x] = True
    q.append((seed_y, seed_x))

    while q:
        y, x = q.popleft()
        if y > 0 and a[y - 1, x] != 0 and not connected[y - 1, x]:
            connected[y - 1, x] = True
            q.append((y - 1, x))
        if y + 1 < h and a[y + 1, x] != 0 and not connected[y + 1, x]:
            connected[y + 1, x] = True
            q.append((y + 1, x))
        if x > 0 and a[y, x - 1] != 0 and not connected[y, x - 1]:
            connected[y, x - 1] = True
            q.append((y, x - 1))
        if x + 1 < w and a[y, x + 1] != 0 and not connected[y, x + 1]:
            connected[y, x + 1] = True
            q.append((y, x + 1))

    main = np.where(connected, 255, 0).astype(np.uint8)
    return Image.fromarray(main, "L").filter(ImageFilter.GaussianBlur(0.65))


def make_shirt_mask(size: tuple[int, int]) -> Image.Image:
    """Hand-traced fabric mask; accessories and skin are explicit exclusions."""
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)

    # Outer fabric perimeter: collar/shoulders, sleeves, torso, and tucked hem.
    d.polygon(
        [
            (550, 987), (690, 770), (880, 650), (951, 670),
            (1122, 674), (1305, 735), (1410, 1049), (1262, 1076),
            (1257, 1418), (1200, 1428), (730, 1428), (710, 1074),
        ],
        fill=255,
    )

    # Neck/skin opening.
    d.polygon(
        [(917, 683), (1141, 690), (1127, 731), (1090, 758),
         (1030, 773), (971, 756), (932, 729)],
        fill=0,
    )
    d.rectangle((890, 300, 1170, 712), fill=0)

    # Preserve the chain and a narrow safety margin around every link.
    d.line(
        [(917, 684), (927, 748), (948, 813), (981, 862),
         (1022, 886), (1062, 876), (1095, 841), (1118, 790), (1138, 690)],
        fill=0,
        width=18,
        joint="curve",
    )

    # Never recolor the belt or buckle at the tucked hem.
    d.polygon(
        [(720, 1421), (820, 1428), (940, 1438), (1040, 1443),
         (1160, 1436), (1268, 1413), (1290, 1495), (650, 1495)],
        fill=0,
    )
    return m.filter(ImageFilter.GaussianBlur(0.8))


def recolor_shirt(rgb: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Map fabric luminance onto petroleum green while retaining texture/shading."""
    src = rgb.astype(np.float32)
    luma = 0.2126 * src[..., 0] + 0.7152 * src[..., 1] + 0.0722 * src[..., 2]
    selected = mask > 0.5
    # Robust baseline excludes tiny feathered edges and very bright specular pixels.
    baseline_pixels = luma[(mask > 0.95) & (luma < 125)]
    baseline = float(np.median(baseline_pixels))

    target = np.array([0.0, 75.0, 79.0], dtype=np.float32)  # #004B4F
    scale = np.clip((luma / max(baseline, 1.0)) ** 0.88, 0.28, 2.20)
    teal = np.clip(target[None, None, :] * scale[..., None], 0, 255)

    # A small neutral-luminance component prevents crushed texture in deep shadows.
    neutral = luma[..., None] * np.array([0.06, 0.10, 0.10], dtype=np.float32)
    teal = np.clip(teal + neutral, 0, 255)

    alpha = mask[..., None]
    out = src * (1.0 - alpha) + teal * alpha
    return np.clip(np.round(out), 0, 255).astype(np.uint8)


def composite_effects(subject: Image.Image, alpha: Image.Image) -> tuple[Image.Image, tuple[int, int, int, int]]:
    bbox = alpha.point(lambda p: 255 if p > 8 else 0).getbbox()
    if bbox is None:
        raise RuntimeError("Empty subject mask")

    margin = 150
    left, top, right, bottom = bbox
    crop_box = (left, top, right, bottom)
    body = subject.crop(crop_box)
    body_alpha = alpha.crop(crop_box)

    canvas_size = (body.width + 2 * margin, body.height + 2 * margin)
    base_mask = Image.new("L", canvas_size, 0)
    base_mask.paste(body_alpha, (margin, margin))

    # Compact navy/petroleum outer illumination.
    glow_mask = base_mask.filter(ImageFilter.MaxFilter(19)).filter(ImageFilter.GaussianBlur(17))
    glow_arr = np.asarray(glow_mask, dtype=np.int16)
    body_arr = np.asarray(base_mask, dtype=np.int16)
    glow_only = np.clip((glow_arr - body_arr) * 0.42, 0, 78).astype(np.uint8)
    glow = Image.new("RGBA", canvas_size, (0, 72, 96, 0))
    glow.putalpha(Image.fromarray(glow_only, "L"))

    # Thin champagne/copper outline, strictly outside the subject.
    expanded = base_mask.filter(ImageFilter.MaxFilter(11))
    stroke_only = np.clip(
        np.asarray(expanded, dtype=np.int16) - body_arr,
        0,
        255,
    ).astype(np.uint8)
    stroke = Image.new("RGBA", canvas_size, (215, 163, 106, 0))
    stroke.putalpha(Image.fromarray(stroke_only, "L"))

    placed = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    placed.paste(body, (margin, margin), body)

    result = Image.alpha_composite(glow, stroke)
    result = Image.alpha_composite(result, placed)
    return result, bbox


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    vision = Image.open(VISION_MASK).convert("L")
    if vision.size != source.size:
        vision = vision.resize(source.size, Image.Resampling.LANCZOS)

    person_alpha = keep_main_person(vision)
    shirt_mask_img = make_shirt_mask(source.size)
    rgb = np.asarray(source)
    shirt_mask_u8 = np.asarray(shirt_mask_img).copy()
    # Belt loops protrude slightly into the shirt. Preserve their bright original pixels
    # without leaving rectangular patches of unrecolored fabric around them.
    bright = np.max(rgb, axis=2) > 120
    loop_zone = np.zeros(bright.shape, dtype=bool)
    loop_zone[1388:1442, 814:860] = True
    loop_zone[1388:1442, 1120:1170] = True
    shirt_mask_u8[bright & loop_zone] = 0
    shirt_mask_img = Image.fromarray(shirt_mask_u8, "L")
    shirt_mask = shirt_mask_u8.astype(np.float32) / 255.0
    edited_rgb = recolor_shirt(rgb, shirt_mask)

    # Pixel-invariance audit before compositing: nothing outside the polo may change.
    outside = np.asarray(shirt_mask_img) == 0
    changed_outside = np.any(edited_rgb[outside] != rgb[outside], axis=1)
    if np.any(changed_outside):
        raise RuntimeError("Invariant failed: pixels outside shirt changed")

    subject = Image.fromarray(edited_rgb, "RGB").convert("RGBA")
    subject.putalpha(person_alpha)
    result, bbox = composite_effects(subject, person_alpha)

    result.save(FINAL, format="PNG", optimize=True)
    person_alpha.save(OUT_DIR / "person-alpha-refined.png")
    shirt_mask_img.save(OUT_DIR / "shirt-mask.png")

    # QA preview only; not a deliverable asset.
    preview_bg = Image.new("RGBA", result.size, (5, 12, 22, 255))
    preview = Image.alpha_composite(preview_bg, result).convert("RGB")
    preview.thumbnail((900, 1400), Image.Resampling.LANCZOS)
    preview.save(OUT_DIR / "qa-preview.jpg", quality=92)

    alpha_np = np.asarray(result.getchannel("A"))
    face_box = (900, 350, 1160, 670)
    face_src = rgb[face_box[1]:face_box[3], face_box[0]:face_box[2]]
    face_edited = edited_rgb[face_box[1]:face_box[3], face_box[0]:face_box[2]]
    face_diff = int(np.abs(face_src.astype(np.int16) - face_edited.astype(np.int16)).max())

    print(f"final={FINAL}")
    print(f"source_size={source.size} output_size={result.size} source_bbox={bbox}")
    print(f"alpha_min={int(alpha_np.min())} alpha_max={int(alpha_np.max())} transparent_corners="
          f"{[int(alpha_np[0,0]), int(alpha_np[0,-1]), int(alpha_np[-1,0]), int(alpha_np[-1,-1])]}")
    print(f"face_rgb_max_abs_diff={face_diff}")
    shirt_pixels = edited_rgb[np.asarray(shirt_mask_img) > 250]
    print(f"shirt_median_rgb={tuple(int(v) for v in np.median(shirt_pixels, axis=0))}")
    print(f"shirt_reference_color=#004B4F")


if __name__ == "__main__":
    main()
