#!/usr/bin/env python3
"""
Generate color preview images for the watchface color selector.
Produces hour_prev_N.png, minute_prev_N.png, date_prev_N.png (IT + EN)
for each color ID in NEW_COLORS.

Run from project root:
    python3 tools/gen_color_previews.py
"""

from PIL import Image, ImageFont, ImageDraw
import os

BASE  = os.path.join(os.path.dirname(__file__), '..', 'assets', 'default-target.r')
FONTS = os.path.join(BASE, 'fonts')
OUT   = os.path.join(BASE, 'bg', 'color')

# ── Font paths ────────────────────────────────────────────────────────────────
FONT_HOUR   = os.path.join(FONTS, 'Barlow-Medium.ttf')
FONT_MINUTE = os.path.join(FONTS, 'Barlow-Regular.ttf')
FONT_DATE   = os.path.join(FONTS, 'Barlow-RegularDate.ttf')

# ── Canvas sizes (must match existing previews) ───────────────────────────────
HOUR_W, HOUR_H     = 400, 80
MINUTE_W, MINUTE_H = 400, 80
DATE_W, DATE_H     = 280, 35

# ── Font sizes (tuned to match existing previews: ~46px tall glyph in 80px) ──
HOUR_FS   = 63
MINUTE_FS = 64
DATE_FS   = 28

# ── Preview texts ─────────────────────────────────────────────────────────────
TEXTS = {
    'hour':        ('undici',            'eleven'),
    'minute':      ('e venti',           'and twenty'),
    'date':        ('lunedì 01 gennaio', 'monday 01 january'),
}

# ── Colors to generate (id, 0xRRGGBB) ────────────────────────────────────────
NEW_COLORS = [
    (106, 0x2d2d2d),   # CHARCOAL
    (107, 0x424242),   # DARK_GRAY
    (108, 0x000000),   # BLACK — rendered on slight bg so it shows up in picker
    (109, 0xd2b48c),   # TAN
    (110, 0xc68642),   # CARAMEL
    (111, 0x7b3f00),   # CHOCOLATE
    (112, 0x6f4e37),   # COFFEE
    (113, 0x4a2c0a),   # DARK_BROWN
    (114, 0x001f5b),   # NAVY
    (115, 0x0d1b2a),   # DARK_NAVY
]

def hex_to_rgb(h):
    return ((h >> 16) & 0xff, (h >> 8) & 0xff, h & 0xff)

def make_preview(text, color_rgb, font_path, font_size, w, h, cid):
    """Render centered text on transparent background."""
    img  = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    # For very dark colors add a faint dark background so they're visible
    r, g, b = color_rgb
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(font_path, font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (w - tw) // 2 - bbox[0]
    y = (h - th) // 2 - bbox[1]
    draw.text((x, y), text, font=font, fill=(*color_rgb, 255))
    return img

for cid, hex_color in NEW_COLORS:
    rgb = hex_to_rgb(hex_color)
    for variant, (it_text, en_text) in TEXTS.items():
        if variant == 'hour':
            w, h, fs, fp = HOUR_W, HOUR_H, HOUR_FS, FONT_HOUR
        elif variant == 'minute':
            w, h, fs, fp = MINUTE_W, MINUTE_H, MINUTE_FS, FONT_MINUTE
        else:
            w, h, fs, fp = DATE_W, DATE_H, DATE_FS, FONT_DATE

        # Italian
        img = make_preview(it_text, rgb, fp, fs, w, h, cid)
        path = os.path.join(OUT, f'{variant}_prev_{cid}.png')
        img.save(path)
        print(f'  {variant}_prev_{cid}.png')

        # English
        img_en = make_preview(en_text, rgb, fp, fs, w, h, cid)
        path_en = os.path.join(OUT, f'{variant}_prev_en_{cid}.png')
        img_en.save(path_en)
        print(f'  {variant}_prev_en_{cid}.png')

print('Done.')
