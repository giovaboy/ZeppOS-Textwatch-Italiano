// ─── Language detection (at load time) ────────────────────────────────────────
// hmSetting.getLanguage() returns a numeric code: 10 = Italian, 2 = English (default)
const _it = (() => { try { return hmSetting.getLanguage() === 10 } catch (_) { return false } })()

// ─── Italian data ─────────────────────────────────────────────────────────────

const IT_MAP = {
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

const IT_DAYS = {
  1: 'lunedì',   2: 'martedì', 3: 'mercoledì', 4: 'giovedì',
  5: 'venerdì',  6: 'sabato',  7: 'domenica',
}

const IT_MONTHS = {
  1: 'gennaio',  2: 'febbraio', 3: 'marzo',    4: 'aprile',
  5: 'maggio',   6: 'giugno',   7: 'luglio',   8: 'agosto',
  9: 'settembre',10: 'ottobre', 11: 'novembre',12: 'dicembre',
}

const IT_MINUTES_TO = {
  0:  'adesso',
  1:  'tra un minuto',
  15: "tra un quarto d'ora",
  45: "tra tre quarti d'ora",
  60: "tra un'ora",
}

// Converte un numero (1-59) in parola italiana.
// Usa la forma esplicita dalla mappa per valori < 26 e per le elisioni
// fonetiche italiane (x1: "trentuno", x8: "ventotto", ecc.);
// compone decine + unità per tutti gli altri.
function _itNumToWords(n) {
  const mod = n % 10
  if (n < 26 || mod === 1 || mod === 8) return IT_MAP[n]
  const decine = IT_MAP[Math.floor(n / 10) * 10]
  return mod ? decine + IT_MAP[mod] : decine
}

// ─── English data ─────────────────────────────────────────────────────────────

const EN_ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
]
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty']

const EN_DAYS = {
  1: 'monday',   2: 'tuesday',  3: 'wednesday', 4: 'thursday',
  5: 'friday',   6: 'saturday', 7: 'sunday',
}

const EN_MONTHS = {
  1: 'january',  2: 'february', 3: 'march',     4: 'april',
  5: 'may',      6: 'june',     7: 'july',       8: 'august',
  9: 'september',10: 'october', 11: 'november', 12: 'december',
}

const EN_MINUTES_TO = {
  0:  'now',
  1:  'in a minute',
  15: 'in a quarter hour',
  45: 'in three quarters',
  60: 'in an hour',
}

function _enNumToWords(n) {
  if (n < 20) return EN_ONES[n]
  const tens = EN_TENS[Math.floor(n / 10)]
  const ones = EN_ONES[n % 10]
  return ones ? tens + '-' + ones : tens
}

// ─── API pubblica ─────────────────────────────────────────────────────────────

export default class NumberToText {

  static getHours(h) {
    if (_it) {
      if (h === 0)             return IT_MAP.mezzanotte
      if (h === 12)            return IT_MAP.mezzogiorno
      if (h === 1 || h === 13) return IT_MAP.una
      return IT_MAP[h]
    } else {
      if (h === 0)  return 'midnight'
      if (h === 12) return 'noon'
      return _enNumToWords(h > 12 ? h - 12 : h)
    }
  }

  static getMinutes(m) {
    if (_it) {
      if (m === 0)  return IT_MAP[0]
      if (m === 15) return IT_MAP.quarto
      if (m === 45) return IT_MAP[45]
      return IT_MAP.e + _itNumToWords(m)
    } else {
      if (m === 0)  return "o'clock"
      if (m === 15) return 'fifteen'
      if (m === 30) return 'thirty'
      if (m === 45) return 'forty-five'
      return _enNumToWords(m)
    }
  }

  static getMinutesTo(m) {
    if (_it) {
      if (m in IT_MINUTES_TO) return IT_MINUTES_TO[m]
      return 'tra ' + _itNumToWords(m) + ' minuti'
    } else {
      if (m in EN_MINUTES_TO) return EN_MINUTES_TO[m]
      return 'in ' + _enNumToWords(m) + ' minutes'
    }
  }

  static getDayOfWeek(d) { return _it ? IT_DAYS[d]   : EN_DAYS[d]   }
  static getMonth(m)     { return _it ? IT_MONTHS[m] : EN_MONTHS[m] }

  // Formato data completo: "lunedì 19 maggio" (it) oppure "monday, may 19" (en)
  static getDate(dayOfWeek, date, month) {
    return _it
      ? `${IT_DAYS[dayOfWeek]} ${date} ${IT_MONTHS[month]}`
      : `${EN_DAYS[dayOfWeek]}, ${EN_MONTHS[month]} ${date}`
  }
}
