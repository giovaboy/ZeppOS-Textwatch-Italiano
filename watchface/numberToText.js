export default class NumberToText {
  static map() {
    return {
      mezzanotte: 'mezzanotte',
      mezzogiorno: 'mezzogiorno',
      una: 'una',
      e: 'e ',
      quarto: 'e un quarto',
      45: 'e tre quarti',
      0: 'in punto',
      1: 'uno',
      2: 'due',
      3: 'tre',
      4: 'quattro',
      5: 'cinque',
      6: 'sei',
      7: 'sette',
      8: 'otto',
      9: 'nove',
      10: 'dieci',
      11: 'undici',
      12: 'dodici',
      13: 'tredici',
      14: 'quattordici',
      15: 'quindici',
      16: 'sedici',
      17: 'diciassette',
      18: 'diciotto',
      19: 'diciannove',
      20: 'venti',
      21: 'ventuno',
      22: 'ventidue',
      23: 'ventitre',
      24: 'ventiquattro',
      25: 'venticinque',
      28: 'ventotto',
      30: 'trenta',
      31: 'trentuno',
      38: 'trentotto',
      40: 'quaranta',
      41: 'quarantuno',
      48: 'quarantotto',
      50: 'cinquanta',
      51: 'cinquantuno',
      58: 'cinquantotto'
    };
  }

  static days() {
    return {
      1: 'lunedì',
      2: 'martedì',
      3: 'mercoledì',
      4: 'giovedì',
      5: 'venerdì',
      6: 'sabato',
      7: 'domenica'
    };
  }

  static months() {
    return {
      1: 'gennaio',
      2: 'febbraio',
      3: 'marzo',
      4: 'aprile',
      5: 'maggio',
      6: 'giugno',
      7: 'luglio',
      8: 'agosto',
      9: 'settembre',
      10: 'ottobre',
      11: 'novembre',
      12: 'dicembre'
    };
  }

  static minutesTo() {
    return {
      0: 'adesso',
      1: 'tra un minuto',
      15: 'tra un quarto d\'ora',
      45: 'tra tre quarti d\'ora',
      60: 'tra un\'ora'
    };
  }

  static getHours(input) {
    switch (input) {
      case 0:
        return this.map()['mezzanotte'];
      case 12:
        return this.map()['mezzogiorno'];
      case 1:
      case 13:
        return this.map()['una'];
      default:
        return this.map()[input];
    }
  }

  static getMinutes(input) {
    switch (input) {
      case 0:
      case 45:
        return this.map()[input];
      case 15:
        return this.map()['quarto'];
      default:
        let modulo = input % 10;
        if (input < 26 || modulo === 1 || modulo === 8) {
          return `${this.map()['e']}${this.map()[input]}`;
        } else {
          let decine = this.map()[Math.floor(input / 10) * 10];
          //if ( input > 30 ){
          //  return modulo ? `${this.map()['e']}${decine}${' '}${this.map()[modulo]}` : `${this.map()['e']}${decine}`;
          //} else {
          return modulo ? `${this.map()['e']}${decine}${this.map()[modulo]}` : `${this.map()['e']}${decine}`;
          //}
        }
    }
  }

  static getDayOfWeek(input) {
    return this.days()[input];
  }

  static getMonth(input) {
    return this.months()[input];
  }

  static getMinutesTo(input) {
    switch (input) {
      case 0:
      case 1:
      case 15:
      case 45:
      case 60:
        return this.minutesTo()[input];
      default:
        let modulo = input % 10;
        if (input < 26 || modulo === 1 || modulo === 8) {
          return `${'tra '}${this.map()[input]}${' minuti'}`;
        } else {
          let decine = this.map()[Math.floor(input / 10) * 10];
          return modulo ? `${'tra '}${decine}${this.map()[modulo]}${' minuti'}` : `${'tra '}${decine}${' minuti'}`;
        }
    }
  }

}