Object.defineProperties(Number.prototype, {
  mod: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function (b) {
      return ((this % b) + b) % b;
    }
  },
  abs: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function () {
      return Math.abs(this);
    }
  }
});

class LetterShifter {
  static get Z_ORDINAL() {
    return 'Z'.codePointAt(0);
  }

  static get A_ORDINAL() {
    return 'A'.codePointAt(0);
  }

  static get SHIFTING_MODULO() {
    return LetterShifter.Z_ORDINAL - LetterShifter.A_ORDINAL + 1;
  }

  static getCharCodeFor(letter, shifting) {
    return (
      (letter.codePointAt(0) + shifting - LetterShifter.A_ORDINAL).mod(
        LetterShifter.SHIFTING_MODULO
      ) + LetterShifter.A_ORDINAL
    );
  }

  static shift(letter, shifting) {
    return String.fromCharCode(LetterShifter.getCharCodeFor(letter, shifting));
  }
}
class CaesarShift {
  constructor(shifting) {
    this.shifting = shifting;
  }

  static get FORWARDS() {
    return 1;
  }

  static get BACKWARDS() {
    return -1;
  }

  process(message, shifting, step) {
    let result = '';
    for (const letter of message) {
      result += LetterShifter.shift(letter, shifting);
      shifting += step;
    }
    return result;
  }

  encode(message) {
    return this.process(message, this.shifting, CaesarShift.FORWARDS);
  }

  decode(message) {
    return this.process(message, -this.shifting, CaesarShift.BACKWARDS);
  }
}

class Rotor {
  constructor(substitution) {
    this.substitution = substitution;
  }

  getSubstitutionOffsetFor(character) {
    return character.codePointAt(0) - 'A'.codePointAt(0);
  }

  encodeLetter(letter) {
    return this.substitution[this.getSubstitutionOffsetFor(letter)];
  }

  encode(message) {
    // return m.split('').reduce((t, c) => t + this.encodeLetter(c), '');
    let result = '';
    for (const letter of message) {
      result += this.encodeLetter(letter);
    }
    return result;
  }

  getCharCodeFor(character) {
    return this.substitution.indexOf(character) + 'A'.codePointAt(0);
  }

  decodeLetter(letter) {
    return String.fromCharCode(this.getCharCodeFor(letter));
  }

  decode(message) {
    // return m.split('').reduce((t, c) => t + this.decodeLetter(c), '');
    let result = '';
    for (const letter of message) {
      result += this.decodeLetter(letter);
    }
    return result;
  }
}

class RotorSystem {
  constructor() {
    this.rotors = [];
  }

  addRotor(rotor) {
    this.rotors.push(rotor);
  }

  encode(message) {
    return this.rotors.reduce((t, c) => c.encode(t), message);
  }

  decode(message) {
    return this.rotors.reduceRight((t, c) => c.decode(t), message);
  }
}

class Enigma {
  constructor(caesar, rotorSystem) {
    this.caesar = caesar;
    this.rotorSystem = rotorSystem;
  }

  encode(message) {
    const result = this.caesar.encode(message);
    return this.rotorSystem.encode(result);
  }

  decode(message) {
    const result = this.rotorSystem.decode(message);
    return this.caesar.decode(result);
  }

  do(operation, message) {
    switch (operation) {
      case 'ENCODE':
        return this.encode(message);
      case 'DECODE':
        return this.decode(message);
      default:
        throw new Error(`Unknown operation: '${operation}'`);
    }
  }
}

const operation = readline();
const caesar = new CaesarShift(parseInt(readline()));
const rotorSystem = new RotorSystem();
for (let i = 0; i < 3; i++) {
  rotorSystem.addRotor(new Rotor(readline()));
}
const msg = readline();
const enigma = new Enigma(caesar, rotorSystem);
console.error(`Doing ${operation} on ${msg}`);
console.log(enigma.do(operation, msg));
