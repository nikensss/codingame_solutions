class AlphabetRow {
  constructor(row, letterWidth) {
    this.row = row;
    this.letterWidth = letterWidth;
  }

  getCharactersFor(letter) {
    return this.row.substring(
      this.getCharacterOffset(letter),
      this.getCharacterOffset(letter) + this.letterWidth
    );
  }

  getCharacterOffset(character) {
    if (this.isAlphabetical(character)) {
      return (character.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)) * this.letterWidth;
    }
    return this.getCharacterOffset('Z') + this.letterWidth;
  }

  isAlphabetical(character) {
    return /[a-z]/i.test(character);
  }
}
class Alphabet {
  constructor(alphabet) {
    this.alphabet = alphabet;
  }

  build(string) {
    let result = '';
    for (const row of this.alphabet) {
      for (const letter of string) {
        result += row.getCharactersFor(letter);
      }
      result += '\n';
    }
    return result;
  }
}

const letterWidth = parseInt(readline());
const letterHeight = parseInt(readline());
const textToCompose = readline();

const rows = [];
for (let i = 0; i < letterHeight; i++) {
  const ROW = readline();
  rows.push(new AlphabetRow(ROW, letterWidth));
}

const alphabet = new Alphabet(rows);

console.log(alphabet.build(textToCompose));
