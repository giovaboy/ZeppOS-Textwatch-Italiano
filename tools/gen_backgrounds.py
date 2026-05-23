#!/usr/bin/env python3
"""
Regenerate watchface background images.
- 480x480 RGBA PNG
- Circular mask with anti-aliased edge (transparent corners)
- Smooth gradients computed in linear light, saved in sRGB
"""

import numpy as np
from PIL import Image
import os

SIZE   = 480
CX, CY = SIZE // 2, SIZE // 2
OUT    = os.path.join(os.path.dirname(__file__), '..', 'assets', 'default-target.r', 'bg')

# ── Helpers ───────────────────────────────────────────────────────────────────

def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def linear_to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1.0 / 2.4) - 0.055)

def circular_mask(size=SIZE, soft=1.5):
    """Anti-aliased circle alpha [0..1]."""
    y, x = np.ogrid[:size, :size]
    dist = np.sqrt((x - CX) ** 2 + (y - CY) ** 2)
    return np.clip((size / 2 - dist) / soft, 0.0, 1.0)

def radial(cx=CX, cy=CY, sigma=160, size=SIZE):
    """Gaussian radial blob, peak=1 at (cx,cy)."""
    y, x = np.mgrid[:size, :size]
    return np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2.0 * sigma ** 2))

def linear_grad(angle_deg=0, size=SIZE):
    """Linear gradient 0→1 in the given direction."""
    y, x = np.mgrid[:size, :size]
    a = np.radians(angle_deg)
    g = x * np.cos(a) + y * np.sin(a)
    g = (g - g.min()) / (g.max() - g.min())
    return g

def blend(c0, c1, t):
    """Linear interpolation between two RGB tuples [0..1], t is (H,W) array."""
    t3 = t[:, :, np.newaxis]
    return np.clip(np.array(c0) * (1 - t3) + np.array(c1) * t3, 0, 1)

def save(name, rgb_linear, mask):
    """Gamma-correct → uint8 → save RGBA PNG."""
    rgb_srgb = linear_to_srgb(rgb_linear)
    r = (rgb_srgb[:, :, 0] * 255).astype(np.uint8)
    g = (rgb_srgb[:, :, 1] * 255).astype(np.uint8)
    b = (rgb_srgb[:, :, 2] * 255).astype(np.uint8)
    a = (mask * 255).astype(np.uint8)
    img = Image.fromarray(np.stack([r, g, b, a], axis=-1), 'RGBA')
    path = os.path.join(OUT, name)
    img.save(path, optimize=False)
    print(f'  {name}')

mask = circular_mask()

# ── BG_black ──────────────────────────────────────────────────────────────────
# Pure black, circular
rgb = np.zeros((SIZE, SIZE, 3))
save('BG_black.png', rgb, mask)

# ── BG_grey ───────────────────────────────────────────────────────────────────
# Mid-dark grey, flat, circular
base = srgb_to_linear(np.full((SIZE, SIZE, 3), 0.235))
save('BG_grey.png', base, mask)

def hex_to_linear(r, g, b):
    """sRGB 0-255 → linear [0..1] array for blending math."""
    return srgb_to_linear(np.array([r / 255.0, g / 255.0, b / 255.0]))

# ── BG_cosmo ──────────────────────────────────────────────────────────────────
# Very dark near-black base, subtle purple radial glow at centre
dark   = hex_to_linear(  5,  0,  8)   # #050008  near-black indigo
bright = hex_to_linear( 28,  0, 68)   # #1c0044  deep purple highlight

blob  = radial(CX, CY, sigma=180)
blob2 = radial(CX, CY, sigma=70) * 0.5   # tighter inner hotspot
t = np.clip(blob * 0.9 + blob2, 0, 1)
rgb = blend(dark, bright, t)
save('BG_cosmo.png', rgb, mask)

# ── BG_abisso ─────────────────────────────────────────────────────────────────
# Deep-sea blue, diffuse glow from top-centre
dark   = hex_to_linear(  2,  8, 18)   # #020812  deep navy
bright = hex_to_linear( 10, 50, 90)   # #0a325a  ocean blue highlight

blob  = radial(CX, CY - 120, sigma=210)
blob2 = radial(CX, CY -  70, sigma=80) * 0.45
t = np.clip(blob * 0.85 + blob2, 0, 1)
rgb = blend(dark, bright, t)
save('BG_abisso.png', rgb, mask)

# ── BG_aurora ─────────────────────────────────────────────────────────────────
# Dark navy → deep teal diagonal sweep (top-right bright, bottom-left dark)
dark   = hex_to_linear(  2,  7, 14)   # #02070e  dark blue-black
bright = hex_to_linear( 10, 58, 52)   # #0a3a34  deep teal

diag = linear_grad(angle_deg=-45)     # 0 = bottom-left, 1 = top-right
# Off-centre radial softens the diagonal to prevent any linear banding
blob = radial(CX + 60, CY - 70, sigma=230) * 0.45
t = np.clip(diag * 0.80 + blob, 0, 1)
# Vignette towards circular edge for depth
t = t * (0.55 + 0.45 * radial(CX + 40, CY - 50, sigma=280))
t = np.clip(t, 0, 1)
rgb = blend(dark, bright, t)
save('BG_aurora.png', rgb, mask)

# ── BG_braci ──────────────────────────────────────────────────────────────────
# Near-black warm base, subtle ember/amber glow at lower-centre
dark   = hex_to_linear(  6,  2,  0)   # #060200  near-black warm
amber  = hex_to_linear( 62, 18,  0)   # #3e1200  deep amber
ember  = hex_to_linear( 88, 32,  4)   # #582004  bright ember core

blob  = radial(CX + 20, CY + 130, sigma=200)       # large soft bloom
blob2 = radial(CX + 10, CY + 150, sigma=80) * 0.55  # tighter hotspot

t_amber = np.clip(blob  * 0.85, 0, 1)
t_ember = np.clip(blob2 * 0.80, 0, 1)

rgb = blend(dark,  amber, t_amber)
rgb = blend(rgb,   ember, t_ember)
save('BG_braci.png', rgb, mask)

# ── BG_bianco ─────────────────────────────────────────────────────────────────
# Pure white, circular
rgb = np.ones((SIZE, SIZE, 3))
save('BG_bianco.png', rgb, mask)

# ── BG_nebbia ─────────────────────────────────────────────────────────────────
# Neutral light gray, flat, circular
base = srgb_to_linear(np.full((SIZE, SIZE, 3), 0.87))
save('BG_nebbia.png', base, mask)

# ── BG_latte ──────────────────────────────────────────────────────────────────
# Warm off-white, soft warm glow at centre
dark   = hex_to_linear(245, 238, 225)   # #f5eeе1  warm off-white edge
bright = hex_to_linear(255, 252, 245)   # #fffcf5  near-white warm centre

blob = radial(CX, CY, sigma=200)
t = np.clip(blob * 0.6, 0, 1)
rgb = blend(dark, bright, t)
save('BG_latte.png', rgb, mask)

# ── BG_alba ───────────────────────────────────────────────────────────────────
# Warm light with soft peach/amber glow from top-centre fading to cream
dark   = hex_to_linear(240, 220, 195)   # #f0dcc3  warm cream edge
bright = hex_to_linear(255, 235, 200)   # #ffebb8  soft peach centre-top

blob  = radial(CX, CY - 80, sigma=220)
blob2 = radial(CX, CY - 50, sigma=90) * 0.35
t = np.clip(blob * 0.75 + blob2, 0, 1)
rgb = blend(dark, bright, t)
save('BG_alba.png', rgb, mask)

# ── BG_acqua ──────────────────────────────────────────────────────────────────
# Very light blue, soft radial glow at centre
dark   = hex_to_linear(200, 228, 240)   # #c8e4f0  light blue edge
bright = hex_to_linear(230, 245, 252)   # #e6f5fc  almost-white blue centre

blob  = radial(CX, CY, sigma=190)
blob2 = radial(CX, CY, sigma=80) * 0.3
t = np.clip(blob * 0.7 + blob2, 0, 1)
rgb = blend(dark, bright, t)
save('BG_acqua.png', rgb, mask)

print('Done.')
