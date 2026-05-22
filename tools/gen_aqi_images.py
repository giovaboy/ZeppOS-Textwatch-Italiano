#!/usr/bin/env python3
"""
Generate AQI widget images:
  - assets/.../aqi/aqi0.png   : background arc (dim, all segments)
  - assets/.../aqi/1..6.png   : level images, rainbow fill left→right
  - assets/.../xicon/aqi.png  : 32x32 icon
"""

import numpy as np
from PIL import Image, ImageDraw
import os, math

BASE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'default-target.r')
AQI_DIR = os.path.join(BASE, 'aqi')
os.makedirs(AQI_DIR, exist_ok=True)

# ── Arc geometry (matches UVI style, 84×84) ───────────────────────────────────
SIZE   = 84
CX, CY = 42, 46          # centre slightly below middle (opening at bottom)
RADIUS = 34
THICK  = 7               # stroke thickness
N_SEGS = 12              # total segments along the arc
GAP    = 6               # degrees gap between segments

# Arc spans from START_ANG to END_ANG (degrees, 0=right, CCW)
START_ANG = 220   # lower-left  (clockwise from lower-left to lower-right)
END_ANG   = 320   # lower-right
ARC_SPAN  = 360 - (END_ANG - START_ANG)   # = 260 degrees of arc

# AQI level colours (6 bands: Good→Moderate→Sensitive→Unhealthy→Very→Hazardous)
LEVEL_COLORS = [
    (0x00, 0xe4, 0x00),   # 1 – Good          green
    (0xff, 0xff, 0x00),   # 2 – Moderate       yellow
    (0xff, 0x7e, 0x00),   # 3 – Sensitive      orange
    (0xff, 0x00, 0x00),   # 4 – Unhealthy      red
    (0x8f, 0x3f, 0x97),   # 5 – Very Unhealthy purple
    (0x7e, 0x00, 0x23),   # 6 – Hazardous      maroon
]
DIM_COLOR = (0x55, 0x55, 0x55, 120)   # unlit segment colour

def seg_color_for_index(seg_i, n_segs):
    """Gradient colour for segment seg_i (0-based) across LEVEL_COLORS."""
    t = seg_i / (n_segs - 1)          # 0..1
    idx = t * (len(LEVEL_COLORS) - 1)
    lo  = int(idx)
    hi  = min(lo + 1, len(LEVEL_COLORS) - 1)
    f   = idx - lo
    c0, c1 = LEVEL_COLORS[lo], LEVEL_COLORS[hi]
    return tuple(int(c0[i] + f * (c1[i] - c0[i])) for i in range(3))

def draw_segment(draw, seg_i, n_segs, color, alpha=255):
    """Draw one arc segment as a thick arc slice."""
    # Angle of this segment's centre (degrees, PIL convention: 0=right, CW)
    # We go CW from START_ANG, distributing N_SEGS segments with gaps
    slot_deg = (ARC_SPAN - N_SEGS * GAP) / N_SEGS      # degrees per segment body
    start_offset = seg_i * (slot_deg + GAP)
    # PIL angles: 0=3 o'clock, increases CW
    # Our arc starts at START_ANG going counter-clockwise (mathematically)
    # Map: PIL_start = START_ANG + start_offset, PIL_end = + slot_deg
    a0 = START_ANG + start_offset
    a1 = a0 + slot_deg

    r, g, b = color
    # Draw as a series of dots along the arc centre line
    n_dots = max(2, int(slot_deg * RADIUS * math.pi / 180 / 2))
    for k in range(n_dots + 1):
        ang = math.radians(a0 + (a1 - a0) * k / n_dots)
        # PIL angles go CW; math angles go CCW — adjust
        px = CX + RADIUS * math.cos(ang)
        py = CY + RADIUS * math.sin(ang)
        h = THICK // 2
        draw.ellipse([px - h, py - h, px + h, py + h], fill=(r, g, b, alpha))

def make_image(lit_segs):
    """lit_segs: number of segments lit from the left (0 = background only)."""
    img  = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for i in range(N_SEGS):
        if i < lit_segs:
            col = seg_color_for_index(i, N_SEGS)
            draw_segment(draw, i, N_SEGS, col, alpha=230)
        else:
            draw_segment(draw, i, N_SEGS, (0x44, 0x44, 0x44), alpha=100)
    return img

# Background (all dim)
bg = make_image(0)
bg.save(os.path.join(AQI_DIR, 'aqi0.png'))
print('  aqi/aqi0.png')

# 6 level images — lit segments grow in blocks of 2
segs_per_level = N_SEGS // len(LEVEL_COLORS)   # = 2
for lvl in range(1, 7):
    img = make_image(lvl * segs_per_level)
    img.save(os.path.join(AQI_DIR, f'{lvl}.png'))
    print(f'  aqi/{lvl}.png')

# ── xicon/aqi.png  32×32 ──────────────────────────────────────────────────────
# Small version of the rainbow arc (no numbers)
ICON = 32
ICX, ICY = 16, 18
IRAD, ITHICK = 12, 4
icon = Image.new('RGBA', (ICON, ICON), (0, 0, 0, 0))
idraw = ImageDraw.Draw(icon)

n = N_SEGS
slot_deg = (ARC_SPAN - n * GAP) / n
for i in range(n):
    a0 = START_ANG + i * (slot_deg + GAP)
    a1 = a0 + slot_deg
    col = seg_color_for_index(i, n)
    n_dots = max(2, int((a1 - a0) * IRAD * math.pi / 180 / 1.5))
    for k in range(n_dots + 1):
        ang = math.radians(a0 + (a1 - a0) * k / n_dots)
        px = ICX + IRAD * math.cos(ang)
        py = ICY + IRAD * math.sin(ang)
        h  = ITHICK // 2
        idraw.ellipse([px - h, py - h, px + h, py + h], fill=(*col, 220))

icon.save(os.path.join(BASE, 'xicon', 'aqi.png'))
print('  xicon/aqi.png')
print('Done.')
