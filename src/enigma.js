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

class CaesarShift {
  constructor(shifting) {
    this.shifting = shifting;
    this.step = 1;
  }

  static get Z_ORDINAL() {
    return 'Z'.codePointAt(0);
  }

  static get A_ORDINAL() {
    return 'A'.codePointAt(0);
  }

  static get SHIFTING_MODULO() {
    return CaesarShift.Z_ORDINAL - CaesarShift.A_ORDINAL + 1;
  }

  getCharCodeFor(char) {
    return (
      (char.codePointAt(0) + this.shifting - CaesarShift.A_ORDINAL).mod(
        CaesarShift.SHIFTING_MODULO
      ) + CaesarShift.A_ORDINAL
    );
  }

  shift(character) {
    return String.fromCharCode(this.getCharCodeFor(character));
  }

  process(message) {
    const shifting = this.shifting;
    let result = '';
    for (const letter of message) {
      result += this.shift(letter);
      this.shifting += this.step;
    }
    this.shifting = shifting;
    return result;
  }

  forwards() {
    this.shifting = this.shifting.abs();
    this.step = 1;
  }

  encode(message) {
    this.forwards();
    return this.process(message);
  }

  backwards() {
    this.shifting = -this.shifting.abs();
    this.step = -1;
  }

  decode(message) {
    this.backwards();
    return this.process(message);
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

  encode(m) {
    return m.split('').reduce((t, c) => t + this.encodeLetter(c), '');
    // let result = '';
    // for (const letter of message) {
    //   result += this.encodeLetter(letter);
    // }
    // return result;
  }

  getCharCodeFor(character) {
    return this.substitution.indexOf(character) + 'A'.codePointAt(0);
  }

  decodeLetter(letter) {
    return String.fromCharCode(this.getCharCodeFor(letter));
  }

  decode(m) {
    return m.split('').reduce((t, c) => t + this.decodeLetter(c), '');
    // let result = '';
    // for (const letter of message) {
    //   result += this.decodeLetter(letter);
    // }
    // return result;
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
