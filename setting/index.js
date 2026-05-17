import { AppSettingsPage, View, Text, Button } from '@zos/settings'

// ── Palette colori (deve rispecchiare ZONE_PALETTE in colorZones.js) ──────────
const PALETTE = [
  { id:  0, name: 'Dal tema',  hex: '#555555' },
  { id:  1, name: 'Bianco',    hex: '#ffffff' },
  { id:  2, name: 'Rosso',     hex: '#ff3b3b' },
  { id:  3, name: 'Arancione', hex: '#ff8c00' },
  { id:  4, name: 'Giallo',    hex: '#ffeb3b' },
  { id:  5, name: 'Verde',     hex: '#8bc34a' },
  { id:  6, name: 'Ciano',     hex: '#00bcd4' },
  { id:  7, name: 'Azzurro',   hex: '#29b6f6' },
  { id:  8, name: 'Blu',       hex: '#3f51b5' },
  { id:  9, name: 'Viola',     hex: '#9c27b0' },
  { id: 10, name: 'Rosa',      hex: '#e91e63' },
  { id: 11, name: 'Oro',       hex: '#ffd700' },
  { id: 12, name: 'Lime',      hex: '#00e676' },
]

// Colori chiari che richiedono testo scuro per leggibilità
const DARK_TEXT_IDS = new Set([4, 5, 11, 12])

const ZONES = [
  { key: 'zone_hour',   label: '🕐 Ore'    },
  { key: 'zone_minute', label: '⏱ Minuti'  },
  { key: 'zone_date',   label: '📅 Data'   },
  { key: 'zone_health', label: '❤️ Salute' },
]

// ── Sezione colore per una zona ───────────────────────────────────────────────
function colorSection(storage, zone) {
  const sel = parseInt(storage.getItem(zone.key) || '0')

  return View({
    style: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #2a2a2a',
    }
  }, [
    Text({
      label: zone.label,
      style: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#ffffff',
        display: 'block',
        marginBottom: '10px',
      }
    }),
    View({
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
      }
    }, PALETTE.map(p =>
      Button({
        label: p.name,
        style: {
          backgroundColor: p.hex,
          color: DARK_TEXT_IDS.has(p.id) ? '#111111' : '#ffffff',
          border: sel === p.id ? '3px solid #ffffff' : '3px solid transparent',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: sel === p.id ? 'bold' : 'normal',
          opacity: sel === p.id ? '1' : '0.7',
          cursor: 'pointer',
        },
        onClick: () => { storage.setItem(zone.key, String(p.id)) }
      })
    ))
  ])
}

// ── Settings page ─────────────────────────────────────────────────────────────
export default new AppSettingsPage({
  build(props) {
    const { settingsStorage } = props

    return View({
      style: {
        padding: '16px',
        backgroundColor: '#111111',
        minHeight: '100%',
      }
    }, [
      Text({
        label: 'Colori personalizzati',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffffff',
          display: 'block',
          marginBottom: '4px',
        }
      }),
      Text({
        label: '"Dal tema" usa il colore del tema scelto sul quadrante.',
        style: {
          fontSize: '12px',
          color: '#888888',
          display: 'block',
          marginBottom: '24px',
        }
      }),
      ...ZONES.map(z => colorSection(settingsStorage, z))
    ])
  }
})
