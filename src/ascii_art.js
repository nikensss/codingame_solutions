class Alphabet {
  constructor(letterWidth, letterHeight, alphabet) {
    if (letterHeight !== alphabet.length) {
      throw new Error('Letter height and alphabet length do not match!');
    }
    this.width = letterWidth;
    this.height = letterHeight;
    //an array of strings
    this.alphabet = alphabet;
  }

  build(string) {
    let result = '';
    for (const row of this.alphabet) {
      for (const char of string) {
        result += row.substring(
          this.getCharacterOffset(char),
          this.getCharacterOffset(char) + this.width
        );
      }
      result += '\n';
    }
    return result;
  }

  getCharacterOffset(character) {
    if (this.isAlphabetical(character)) {
      return (character.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)) * this.width;
    } else {
      return this.getCharacterOffset('Z') + this.width;
    }
  }

  isAlphabetical(character) {
    return /[a-z]/i.test(character);
  }
}

const letterWidth = parseInt(readline());
const letterHeight = parseInt(readline());
const textToCompose = readline();

const rows = [];
for (let i = 0; i < letterHeight; i++) {
  const ROW = readline();
  rows.push(ROW);
}

const alphabet = new Alphabet(letterWidth, letterHeight, rows);

// Write an answer using console.log()
// To debug: console.error('Debug messages...');
console.error('Building ' + textToCompose);
console.log(alphabet.build(textToCompose));
