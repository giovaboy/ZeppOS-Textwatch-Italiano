// ── Palette di colori disponibili per ogni zona personalizzabile ──────────────
// id 0 = "usa tema" (color: null → nessun override, usa il valore del tema)
export const ZONE_PALETTE = [
  { id:  0, color: null     },  // usa tema
  { id:  1, color: 0xffffff },  // bianco
  { id:  2, color: 0xff3b3b },  // rosso
  { id:  3, color: 0xff8c00 },  // arancione
  { id:  4, color: 0xffeb3b },  // giallo
  { id:  5, color: 0x8bc34a },  // verde
  { id:  6, color: 0x00bcd4 },  // ciano
  { id:  7, color: 0x29b6f6 },  // azzurro
  { id:  8, color: 0x3f51b5 },  // blu
  { id:  9, color: 0x9c27b0 },  // viola
  { id: 10, color: 0xe91e63 },  // rosa
  { id: 11, color: 0xffd700 },  // oro
  { id: 12, color: 0x00e676 },  // verde lime
]

// ── Helper per costruire il bg_config di un WATCHFACE_EDIT_BG di zona ─────────
// zone:   'hour' | 'minute' | 'date' | 'health'
// bgPath: path sfondo del tema corrente (viene preservato per ogni opzione)
export function buildZoneConfig(zone, bgPath) {
  return ZONE_PALETTE.map((_, i) => ({
    id:      i,
    preview: 'bg/zone_' + zone + '_' + String(i).padStart(2, '0') + '.png',
    path:    bgPath,
  }))
}
