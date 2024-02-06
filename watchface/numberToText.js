export default class NumberToText {
  static map() {
    return {
      mezzanotte:  'mezzanotte',
      mezzogiorno: 'mezzogiorno',
      una: 'una',
      e: 'e ',
      quarto: 'e un quarto',
      45: 'e tre quarti',
      0:  'in punto',
      1:  'uno',
      2:  'due',
      3:  'tre',
      4:  'quattro',
      5:  'cinque',
      6:  'sei',
      7:  'sette',
      8:  'otto',
      9:  'nove',
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
      0: 'domenica',
      1: 'lunedì',
      2: 'martedì',
      3: 'mercoledì',
      4: 'giovedì',
      5: 'venerdì',
      6: 'sabato'
    };
  }

  static months() {
    return {
      0:  'gennaio',
      1:  'febbraio',
      2:  'marzo',
      3:  'aprile',
      4:  'maggio',
      5:  'giugno',
      6:  'luglio',
      7:  'agosto',
      8:  'settembre',
      9:  'ottobre',
      10: 'novembre',
      11: 'dicembre'
    };
  }

  static minutesTo() {
    return {
      0:  'adesso',
      1:  'tra un minuto',
      15: 'tra un quarto d\'ora',
      45: 'tra tre quarti d\'ora',
      60: 'tra un\'ora'
    };
  }

  static getHours(input) {
    switch (input){
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
    switch (input){
      case 0:
      case 45:
        return this.map()[input];
      case 15:
        return this.map()['quarto'];
      default:
        let modulo = input % 10;
        if (input < 26 || modulo === 1 || modulo === 8 ) {
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
    switch (input){
      case 0:
      case 1:
      case 15:
      case 45:
      case 60:
        return this.minutesTo()[input];
      default:
        let modulo = input % 10;
        if (input < 26 || modulo === 1 || modulo === 8 ) {
          return `${'tra '}${this.map()[input]}${' minuti'}`;
        } else {
          let decine = this.map()[Math.floor(input / 10) * 10];
          return modulo ? `${'tra '}${decine}${this.map()[modulo]}${' minuti'}` : `${'tra '}${decine}${' minuti'}`;
        }
    }
  }

}