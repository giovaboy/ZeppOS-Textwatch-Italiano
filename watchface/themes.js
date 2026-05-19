// Colors are referenced by name via the COLOR constants from colorSelector.js.
// AOD colors are always 0xffffff and are hardcoded in index.js.
import { COLOR } from './colorSelector.js'

export const themes = [
  {
    id: 0, preview: 'bg/prev_biancoenero.png', path: 'bg/BG_black.png',
    name: 'Bianco e Nero',
    colors: { hour: COLOR.WHITE,       minute: COLOR.WHITE,       date: COLOR.WHITE,        health: COLOR.WHITE          },
  },
  {
    id: 1, preview: 'bg/prev_viola.png', path: 'bg/BG_black.png',
    name: 'Viola',
    colors: { hour: COLOR.PURPLE,      minute: COLOR.ORCHID,      date: COLOR.LIGHT_PINK,   health: COLOR.PLUM           },
  },
  {
    id: 2, preview: 'bg/prev_blueviola.png', path: 'bg/BG_black.png',
    name: 'Blu e Viola',
    colors: { hour: COLOR.VIVID_SKY,   minute: COLOR.CORNFLOWER,  date: COLOR.BLUE,         health: COLOR.INDIGO         },
  },
  {
    id: 3, preview: 'bg/prev_arancione.png', path: 'bg/BG_black.png',
    name: 'Arancione',
    colors: { hour: COLOR.DEEP_ORANGE, minute: COLOR.AMBER,       date: COLOR.LIGHT_AMBER,  health: COLOR.PEACH          },
  },
  {
    id: 4, preview: 'bg/prev_azzurrinoegiallino.png', path: 'bg/BG_black.png',
    name: 'Azzurrino e Giallino',
    colors: { hour: COLOR.MEDIUM_BLUE, minute: COLOR.GOLDEN_YELLOW, date: COLOR.LIME_YELLOW, health: COLOR.WHITE         },
  },
  {
    id: 5, preview: 'bg/prev_violaelime.png', path: 'bg/BG_black.png',
    name: 'Viola e Lime',
    colors: { hour: COLOR.PERIWINKLE,  minute: COLOR.YELLOW,      date: COLOR.LIME_YELLOW,  health: COLOR.WHITE          },
  },
  {
    id: 6, preview: 'bg/prev_rosa.png', path: 'bg/BG_black.png',
    name: 'Rosa',
    colors: { hour: COLOR.PINK,        minute: COLOR.HOT_PINK,    date: COLOR.PASTEL_PINK,  health: COLOR.BLUSH          },
  },
  {
    id: 7, preview: 'bg/prev_verdeeblu.png', path: 'bg/BG_black.png',
    name: 'Verde e Blu',
    colors: { hour: COLOR.MEADOW_GREEN, minute: COLOR.VIVID_SKY,  date: COLOR.CYAN,         health: COLOR.GREEN          },
  },
  {
    id: 8, preview: 'bg/prev_rossoeblu.png', path: 'bg/BG_black.png',
    name: 'Rosso e Blu',
    colors: { hour: COLOR.PURE_RED,    minute: COLOR.PURE_BLUE,   date: COLOR.ROYAL_BLUE,   health: COLOR.WHITE          },
  },
  {
    id: 9, preview: 'bg/prev_gialloeblu.png', path: 'bg/BG_black.png',
    name: 'Giallo e Blu',
    colors: { hour: COLOR.PURE_YELLOW, minute: COLOR.PURE_BLUE,   date: COLOR.LIGHT_SKY,    health: COLOR.WHITE          },
  },
  {
    id: 10, preview: 'bg/prev_coolest_scheme.png', path: 'bg/BG_cool_gradient.png',
    name: 'Coolest Scheme',
    colors: { hour: COLOR.AQUAMARINE,  minute: COLOR.TURQUOISE,   date: COLOR.ELECTRIC_CYAN, health: COLOR.NEON_SKY      },
  },
  {
    id: 11, preview: 'bg/prev_rosso.png', path: 'bg/BG_black.png',
    name: 'Rosso Intenso',
    colors: { hour: COLOR.PURE_RED,    minute: COLOR.TOMATO,      date: COLOR.ORANGE_RED,   health: COLOR.CORAL          },
  },
  {
    id: 12, preview: 'bg/prev_verde.png', path: 'bg/BG_black.png',
    name: 'Verde Smeraldo',
    colors: { hour: COLOR.EMERALD,     minute: COLOR.FOREST_GREEN, date: COLOR.SEA_GREEN,   health: COLOR.DARK_SEA_GREEN },
  },
  {
    id: 13, preview: 'bg/prev_giallo.png', path: 'bg/BG_black.png',
    name: 'Giallo Sole',
    colors: { hour: COLOR.YELLOW,      minute: COLOR.LIGHT_AMBER, date: COLOR.HONEY,        health: COLOR.PALE_YELLOW    },
  },
  {
    id: 14, preview: 'bg/prev_turchese.png', path: 'bg/BG_black.png',
    name: 'Turchese',
    colors: { hour: COLOR.SEA_GREEN,   minute: COLOR.DARK_SEA_GREEN, date: COLOR.LIGHT_TURQUOISE, health: COLOR.MEDIUM_TURQUOISE },
  },
  {
    id: 15, preview: 'bg/prev_magenta.png', path: 'bg/BG_black.png',
    name: 'Magenta',
    colors: { hour: COLOR.PINK,        minute: COLOR.HOT_PINK,    date: COLOR.MEDIUM_PINK,  health: COLOR.PALE_PINK      },
  },
  {
    id: 16, preview: 'bg/prev_rossoeblu2.png', path: 'bg/BG_black.png',
    name: 'Rosso e Blu',
    colors: { hour: COLOR.PURE_RED,    minute: COLOR.PURE_BLUE,   date: COLOR.DARK_RED,     health: COLOR.DODGER_BLUE    },
  },
  {
    id: 17, preview: 'bg/prev_verdementaearancione.png', path: 'bg/BG_black.png',
    name: 'Verde Menta e Arancione',
    colors: { hour: COLOR.MINT_GREEN,  minute: COLOR.VIVID_ORANGE, date: COLOR.SEA_TEAL,    health: COLOR.TOMATO         },
  },
  {
    id: 18, preview: 'bg/prev_fuchsiaeverdeacqua.png', path: 'bg/BG_black.png',
    name: 'Fuchsia e Verde Acqua',
    colors: { hour: COLOR.FUCHSIA,     minute: COLOR.PURE_CYAN,   date: COLOR.VIOLET,       health: COLOR.LIGHT_AQUAMARINE },
  },
  {
    id: 19, preview: 'bg/prev_rossoelime.png', path: 'bg/BG_black.png',
    name: 'Rosso e Lime',
    colors: { hour: COLOR.ORANGE_RED,  minute: COLOR.PURE_GREEN,  date: COLOR.CRIMSON,      health: COLOR.BRIGHT_GREEN   },
  },
  {
    id: 20, preview: 'bg/prev_arancioeviola.png', path: 'bg/BG_black.png',
    name: 'Arancione e Viola',
    colors: { hour: COLOR.VIVID_ORANGE, minute: COLOR.BLUE_VIOLET, date: COLOR.GOLD,        health: COLOR.MEDIUM_ORCHID  },
  },
  {
    id: 21, preview: 'bg/prev_alba.png', path: 'bg/BG_black.png',
    name: 'Alba',
    colors: { hour: COLOR.WARM_GOLD,   minute: COLOR.CORAL,       date: COLOR.GOLD,         health: COLOR.MOCCASIN       },
  },
  {
    id: 22, preview: 'bg/prev_oceano.png', path: 'bg/BG_black.png',
    name: 'Oceano',
    colors: { hour: COLOR.OCEAN_BLUE,  minute: COLOR.OCEAN_SKY,   date: COLOR.ICE_BLUE,     health: COLOR.PALE_SKY       },
  },
  {
    id: 23, preview: 'bg/prev_kyoto.png', path: 'bg/BG_black.png',
    name: 'Kyoto',
    colors: { hour: COLOR.DEEP_PINK,   minute: COLOR.DARK_AMBER,  date: COLOR.MEDIUM_PINK,  health: COLOR.CREAM          },
  },
  {
    id: 24, preview: 'bg/prev_tramonto.png', path: 'bg/BG_black.png',
    name: 'Tramonto',
    colors: { hour: COLOR.ORANGE_RED,  minute: COLOR.GOLD,        date: COLOR.SALMON,       health: COLOR.LIGHT_SALMON   },
  },
  {
    id: 25, preview: 'bg/prev_nordico.png', path: 'bg/BG_black.png',
    name: 'Nordico',
    colors: { hour: COLOR.ICE_GRAY,    minute: COLOR.BLUE_GRAY,   date: COLOR.SLATE,        health: COLOR.LIGHT_GRAY     },
  },
  {
    id: 26, preview: 'bg/prev_neonnotte.png', path: 'bg/BG_black.png',
    name: 'Neon Notte',
    colors: { hour: COLOR.NEON_GREEN,  minute: COLOR.NEON_PINK,   date: COLOR.NEON_SKY,     health: COLOR.PURE_YELLOW    },
  },
  {
    id: 27, preview: 'bg/prev_autunno.png', path: 'bg/BG_black.png',
    name: 'Autunno',
    colors: { hour: COLOR.RUST,        minute: COLOR.CINNABAR,    date: COLOR.AMBER_ORANGE, health: COLOR.PASTEL_ORANGE  },
  },
  {
    id: 28, preview: 'bg/prev_aurora.png', path: 'bg/BG_black.png',
    name: 'Aurora Boreale',
    colors: { hour: COLOR.NEON_TEAL,   minute: COLOR.LAVENDER,    date: COLOR.PASTEL_BLUE,  health: COLOR.MINT           },
  },
  {
    id: 29, preview: 'bg/prev_bordeaux.png', path: 'bg/BG_black.png',
    name: 'Bordeaux',
    colors: { hour: COLOR.RUBY,        minute: COLOR.BURGUNDY,    date: COLOR.LEMON,        health: COLOR.ANTIQUE_GOLD   },
  },
  {
    id: 30, preview: 'bg/prev_lavanda.png', path: 'bg/BG_black.png',
    name: 'Lavanda',
    colors: { hour: COLOR.AMETHYST,    minute: COLOR.LIGHT_LAVENDER, date: COLOR.PALE_LAVENDER, health: COLOR.LIGHT_AMETHYST },
  },
  {
    id: 31, preview: 'bg/prev_isola.png', path: 'bg/BG_black.png',
    name: 'Isola',
    colors: { hour: COLOR.SALMON,      minute: COLOR.BANANA,      date: COLOR.TROPICAL_BLUE, health: COLOR.TROPICAL_PINK },
  },
  {
    id: 32, preview: 'bg/prev_acciaio.png', path: 'bg/BG_black.png',
    name: 'Acciaio',
    colors: { hour: COLOR.SILVER,      minute: COLOR.CYAN,        date: COLOR.PALE_BLUE,    health: COLOR.PALE_CYAN      },
  },
]
