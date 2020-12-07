/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

//match outcomes
const TIE = 0;
const WIN = 1;
const LOSE = -1;

class Player {
  constructor(number, character) {
    this.number = number;
    this.character = character;
    this.wins = [];
  }

  fight(player) {
    //make characters fight
    const result = this.character.fight(player.character);

    //process character fight result
    if (result === WIN) {
      this.wins.push(player.number);
      return WIN;
    } else if (result === LOSE) {
      player.wins.push(this.number);
      return LOSE;
    }

    //resolve TIE by checking numbers
    if (this.number < player.number) {
      this.wins.push(player.number);
      return WIN;
    }

    player.wins.push(this.number);
    return LOSE;
  }

  toString() {
    return `${this.number}\n${this.wins.join(' ')}`;
  }
}

class Character {
  constructor(id, name, winsOver) {
    this.id = id;
    this.name = name;
    //array of character ID's that this character wins over
    this.winsOver = winsOver;
  }

  fight(character) {
    if (character.id === this.id) {
      return TIE; // ties
    }

    if (this.winsOver.includes(character.id)) {
      return WIN; // rock wins
    }
    return LOSE; // rock loses
  }
}

class CharacterFactory {
  constructor() {}

  static get(characterId) {
    //characters
    const ROCK = 'R';
    const PAPER = 'P';
    const SCISSORS = 'C';
    const LIZARD = 'L';
    const SPOCK = 'S';

    switch (characterId) {
      case ROCK:
        return new Character(ROCK, 'Rock', [LIZARD, SCISSORS]);
      case PAPER:
        return new Character(PAPER, 'Paper', [ROCK, SPOCK]);
      case SCISSORS:
        return new Character(SCISSORS, 'Scissors', [PAPER, LIZARD]);
      case LIZARD:
        return new Character(LIZARD, 'Lizard', [SPOCK, PAPER]);
      case SPOCK:
        return new Character(SPOCK, 'Lizard', [SCISSORS, ROCK]);
      default:
        throw new Error(`Unknown characterId: ${characterId}`);
    }
  }
}

const N = parseInt(readline());
const players = [];
for (let i = 0; i < N; i++) {
  var inputs = readline().split(' ');
  const numPlayer = parseInt(inputs[0]);
  const character = CharacterFactory.get(inputs[1]);
  players.push(new Player(numPlayer, character));
}

// Write an answer using console.log()
// To debug: console.error('Debug messages...');
function whoIsTheWinner(players) {
  const contestants = players.slice();
  for (let index = 0; contestants.length !== 1; index = (index + 1) % contestants.length) {
    const a = contestants[index];
    const b = contestants[index + 1];

    const matchResult = a.fight(b);
    if (matchResult === WIN) {
      contestants.splice(index + 1, 1);
    } else {
      contestants.splice(index, 1);
    }
  }

  return contestants[0];
}

console.log(whoIsTheWinner(players).toString());
