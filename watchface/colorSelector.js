// ── Custom type IDs for per-zone color selectors ──────────────────────────────
// ZeppOS reserves 0x186a0–UINT32_MAX for developer custom types.
const BASE = 0x186a0

export const COLOR_ENTRIES = [
  { id:  0, type: BASE +  0, color: null,     name: 'Dal tema'  },
  { id:  1, type: BASE +  1, color: 0xffffff, name: 'Bianco'    },
  { id:  2, type: BASE +  2, color: 0xff3b3b, name: 'Rosso'     },
  { id:  3, type: BASE +  3, color: 0xff8c00, name: 'Arancione' },
  { id:  4, type: BASE +  4, color: 0xffeb3b, name: 'Giallo'    },
  { id:  5, type: BASE +  5, color: 0x8bc34a, name: 'Verde'     },
  { id:  6, type: BASE +  6, color: 0x00bcd4, name: 'Ciano'     },
  { id:  7, type: BASE +  7, color: 0x29b6f6, name: 'Azzurro'   },
  { id:  8, type: BASE +  8, color: 0x3f51b5, name: 'Blu'       },
  { id:  9, type: BASE +  9, color: 0x9c27b0, name: 'Viola'     },
  { id: 10, type: BASE + 10, color: 0xe91e63, name: 'Rosa'      },
  { id: 11, type: BASE + 11, color: 0xffd700, name: 'Oro'       },
  { id: 12, type: BASE + 12, color: 0x00e676, name: 'Lime'      },
]

// optional_types array for WATCHFACE_EDIT_GROUP
export const colorOptionalArray = COLOR_ENTRIES.map(c => ({
  type:     c.type,
  preview:  'bg/color/prev_' + c.id + '.png',
  title_en: c.name,
  title_sc: c.name,
  title_tc: c.name,
}))

// Returns the hex color for a given type ID, or null (= use theme color)
export function getColorFromType(typeId) {
  const entry = COLOR_ENTRIES.find(c => c.type === typeId)
  return entry !== undefined ? entry.color : null
}

// edit_id values for the 4 color selector groups (must not clash with 101/110/111/112)
export const COLOR_EDIT_ID = {
  HOUR:   120,
  MINUTE: 121,
  DATE:   122,
}
