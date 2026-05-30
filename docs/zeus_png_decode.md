# Decodifica PNG ottimizzate dal compilatore Zeus (formato SOMH)

Il compilatore Zeus di ZeppOS non produce PNG standard: converte le immagini in un formato
proprietario paletted chiamato **SOMH**. Questi file hanno estensione `.png` ma non sono
leggibili da browser, visualizzatori di immagini o PIL/Pillow con il loader PNG standard.

---

## Struttura del file SOMH

```
Offset  Dim.  Descrizione
──────  ────  ───────────────────────────────────────────
0x00     2    Magic: 2e 01
0x02     2    Versione/flags: 01 00
0x04     4    Padding/flags: 00 00 01 20
0x08     4    Zeros
0x0C     2    Larghezza (little-endian uint16)
0x0E     2    Altezza  (little-endian uint16)
0x10     1    Bit per canale: 08
0x11     1    Canali/formato: 20 (RGBA)
0x12     4    Tag "SOMH" (53 4f 4d 48)
0x16     2    Altezza ripetuta
0x18     8    Zeros
────────────── fine header (32 byte) ──────────────────
0x20   N×4   Palette RGBA (N = (filesize - 32 - w×h) / 4)
0x20+N×4  w×h  Pixel indexati (1 byte = indice palette)
```

Il numero di voci nella palette non è fisso: varia per ogni immagine.
Formula: `palette_entries = (filesize - 32 - width * height) / 4`

---

## Script Python di decodifica

```python
import struct
import numpy as np
from PIL import Image

def decode_somh(path: str) -> Image.Image:
    with open(path, 'rb') as f:
        data = f.read()

    w = struct.unpack_from('<H', data, 12)[0]
    h = struct.unpack_from('<H', data, 14)[0]

    palette_entries = (len(data) - 32 - w * h) // 4
    palette_offset  = 32
    pixel_offset    = 32 + palette_entries * 4

    # legge palette RGBA
    palette = []
    for i in range(palette_entries):
        r, g, b, a = data[palette_offset + i*4 : palette_offset + i*4 + 4]
        palette.append((r, g, b, a))

    # decodifica pixel indexati
    indices = np.frombuffer(
        data[pixel_offset : pixel_offset + w * h],
        dtype=np.uint8
    ).reshape(h, w)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    for i, (r, g, b, a) in enumerate(palette):
        rgba[indices == i] = [r, g, b, a]

    return Image.fromarray(rgba, 'RGBA')


# Esempio: estrai icona e ridimensiona a 32×32
img = decode_somh('readiness.png')
img.resize((32, 32), Image.LANCZOS).save('xicon/readiness.png')

# Esempio: estrai preview e ridimensiona a 84×84
img = decode_somh('READINESS.png')
img.resize((84, 84), Image.LANCZOS).save('preview/biocharge.png')
```

---

## Come ottenere file SOMH da una watchface esistente

I file SOMH si trovano nella cartella `assets/` dei pacchetti `.zab` (archivi ZIP).

```bash
# estrai il pacchetto watchface
unzip watchface.zab -d watchface_extracted/

# i PNG nella cartella assets/ sono SOMH
ls watchface_extracted/assets/**/*.png
```

---

## Identificare il formato

```python
with open('file.png', 'rb') as f:
    magic = f.read(2)

if magic == b'\x89P':           # 89 50
    print('PNG standard')
elif magic == b'\x2e\x01':      # 2e 01
    print('SOMH (Zeus compiler)')
```

---

## Note

- Il formato è **read-only** in questo contesto: Zeus lo produce ma non esiste un encoder
  pubblico per tornare da PNG → SOMH. Le immagini da usare nel progetto vanno fornite
  come PNG standard; Zeus le converte automaticamente durante `zeus build`.
- La palette contiene tipicamente valori con `R == G == B` (scala di grigi) per le icone
  monocromatiche, e colori misti per icone colorate.
- `channels = 0x20` (32) indica sempre RGBA a 4 canali.
- Testato su file prodotti da Zeus per ZeppOS 3.0 — versioni future potrebbero variare.
