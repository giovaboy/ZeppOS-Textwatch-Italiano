// ─── Dati statici (creati una sola volta) ─────────────────────────────────────

const MAP = {
  mezzanotte: 'mezzanotte',
  mezzogiorno: 'mezzogiorno',
  una:    'una',
  e:      'e ',
  quarto: 'e un quarto',
  0:  'in punto',
  1:  'uno',    2:  'due',      3:  'tre',       4:  'quattro',
  5:  'cinque', 6:  'sei',      7:  'sette',      8:  'otto',
  9:  'nove',   10: 'dieci',    11: 'undici',     12: 'dodici',
  13: 'tredici',14: 'quattordici', 15: 'quindici', 16: 'sedici',
  17: 'diciassette', 18: 'diciotto', 19: 'diciannove',
  20: 'venti',  21: 'ventuno',  22: 'ventidue',   23: 'ventitre',
  24: 'ventiquattro', 25: 'venticinque',
  28: 'ventotto',
  30: 'trenta', 31: 'trentuno', 38: 'trentotto',
  40: 'quaranta', 41: 'quarantuno', 48: 'quarantotto',
  50: 'cinquanta', 51: 'cinquantuno', 58: 'cinquantotto',
  45: 'e tre quarti',
}

const DAYS = {
  1: 'lunedì',   2: 'martedì', 3: 'mercoledì', 4: 'giovedì',
  5: 'venerdì',  6: 'sabato',  7: 'domenica',
}

const MONTHS = {
  1: 'gennaio',  2: 'febbraio', 3: 'marzo',    4: 'aprile',
  5: 'maggio',   6: 'giugno',   7: 'luglio',   8: 'agosto',
  9: 'settembre',10: 'ottobre', 11: 'novembre',12: 'dicembre',
}

const MINUTES_TO = {
  0:  'adesso',
  1:  'tra un minuto',
  15: "tra un quarto d'ora",
  45: "tra tre quarti d'ora",
  60: "tra un'ora",
}

// ─── Helper interno ───────────────────────────────────────────────────────────

// Converte un numero (1-59) in parola italiana.
// Usa la forma esplicita dalla mappa per valori < 26 e per le elisioni
// fonetiche italiane (x1: "trentuno", x8: "ventotto", ecc.);
// compone decine + unità per tutti gli altri.
function _numToWords(n) {
  const mod = n % 10
  if (n < 26 || mod === 1 || mod === 8) return MAP[n]
  const decine = MAP[Math.floor(n / 10) * 10]
  return mod ? decine + MAP[mod] : decine
}

// ─── API pubblica ─────────────────────────────────────────────────────────────

export default class NumberToText {

  static getHours(h) {
    if (h === 0)        return MAP.mezzanotte
    if (h === 12)       return MAP.mezzogiorno
    if (h === 1 || h === 13) return MAP.una
    return MAP[h]
  }

  static getMinutes(m) {
    if (m === 0)  return MAP[0]
    if (m === 15) return MAP.quarto
    if (m === 45) return MAP[45]
    return MAP.e + _numToWords(m)
  }

  static getMinutesTo(m) {
    if (m in MINUTES_TO) return MINUTES_TO[m]
    return 'tra ' + _numToWords(m) + ' minuti'
  }

  static getDayOfWeek(d) { return DAYS[d]   }
  static getMonth(m)     { return MONTHS[m] }
}
