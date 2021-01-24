Number.prototype.mod = function (b) {
  return ((this % b) + b) % b;
};

class CaesarShift {
  constructor(shifting) {
    this.shifting = shifting;
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

  shift(character) {
    const charCode =
      (character.codePointAt(0) + this.shifting - CaesarShift.A_ORDINAL).mod(
        CaesarShift.SHIFTING_MODULO
      ) + CaesarShift.A_ORDINAL;
    return String.fromCharCode(charCode);
  }

  unshift(character) {
    const charCode =
      (character.codePointAt(0) - this.shifting - CaesarShift.A_ORDINAL).mod(
        CaesarShift.SHIFTING_MODULO
      ) + CaesarShift.A_ORDINAL;
    return String.fromCharCode(charCode);
  }

  encode(message) {
    const originalShift = this.shifting;
    let result = '';
    for (const letter of message) {
      result += this.shift(letter);
      this.shifting += 1;
    }
    this.shifting = originalShift;
    return result;
  }

  decode(message) {
    const originalShifting = this.shifting;
    let result = '';
    for (const letter of message) {
      result += this.unshift(letter);
      this.shifting += 1;
    }
    this.shifting = originalShifting;
    return result;
  }
}

class Rotor {
  constructor(substitution) {
    this.substitution = substitution;
  }

  getOffsetFor(character) {
    return character.codePointAt(0) - 'A'.codePointAt(0);
  }

  encode(message) {
    let result = '';
    for (const letter of message) {
      result += this.substitution[this.getOffsetFor(letter)];
    }
    return result;
  }

  decode(message) {
    let result = '';
    for (const letter of message) {
      const charCode = this.substitution.indexOf(letter) + 'A'.codePointAt(0);
      result += String.fromCharCode(charCode);
    }
    return result;
  }
}

class Enigma {
  constructor(caesar, rotors) {
    this.caesar = caesar;
    this.rotors = rotors;
  }

  encode(message) {
    let result = this.caesar.encode(message);
    for (const rotor of this.rotors) {
      result = rotor.encode(result);
    }
    return result;
  }

  decode(message) {
    let result = message;
    this.rotors.reverse();
    for (const rotor of this.rotors) {
      result = rotor.decode(result);
    }
    this.rotors.reverse();
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
const rotors = [];
for (let i = 0; i < 3; i++) {
  rotors.push(new Rotor(readline()));
}
const message = readline();
const enigma = new Enigma(caesar, rotors);
console.error(`Doing ${operation} on ${message}`);
console.log(enigma.do(operation, message));
