/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

//match outcomes (enum like object)
const MatchResult = {
  WIN: 1,
  TIE: 0,
  LOSE: -1
};

/**
 * A contest represent an entire competition of Rock, Paper, Scissors, Lizard,
 * Spock.
 *
 * It requires a set of players, a set bigger than 1. All players must be
 * instances of the Player class.
 *
 * The contest ends when there is only one player left.
 */
class Contest {
  constructor(players) {
    if (
      !Array.isArray(players) ||
      players.length <= 1 ||
      players.some((p) => !(p instanceof Player))
    ) {
      throw new Error('Invalid players. Must be an array with at least 2 elements!');
    }

    //Keep the original array of players
    this.players = players.slice();
    //Make a copy that will mutate to know who is still kicking ass
    this.contestants = this.players.slice();
  }

  get isFinished() {
    return this.contestants.length === 1;
  }

  get winner() {
    while (!this.isFinished) {
      this.playRound();
    }

    return this.contestants[0];
  }

  playRound() {
    const winners = [];

    for (let index = 0; index < this.contestants.length; index += 2) {
      const a = this.contestants[index];
      const b = this.contestants[index + 1];

      winners.push(new Match(a, b).winner);
    }

    this.contestants = winners;
  }
}

/**
 * A match needs two players to be played. Each player will hold a reference
 * to this match.
 *
 * The match will be played when '.play()' is called, or when the winner or the
 * loser are accessed.
 *
 * There are no ties in a match. There are only ties in fights between
 * characters, which are then resolved by the players.
 */
class Match {
  constructor(a, b) {
    if (!(a instanceof Player) || !(b instanceof Player)) {
      throw new TypeError('Instances of the Player class must be provided!');
    }

    this.a = a;
    this.b = b;
    this._winner = null;
    this._loser = null;

    this.a.matches.push(this);
    this.b.matches.push(this);
  }

  get winner() {
    if (this._winner === null) {
      this.play();
    }
    return this._winner;
  }

  get loser() {
    if (this._loser === null) {
      this.play();
    }

    return this._loser;
  }

  play() {
    if (this._winner !== null && this._loser !== null) {
      return;
    }

    const result = this.a.fight(this.b);

    if (result === MatchResult.WIN) {
      [this._winner, this._loser] = [this.a, this.b];
    } else {
      [this._winner, this._loser] = [this.b, this.a];
    }
  }
}

/**
 * A Player is a participant of a Rock, Paper, Scissors, Lizard, Spock contest.
 * It has a number and a Character.
 *
 * It can fight other players. The serialization algorithm prints the id of this
 * player in one line, the id's of the players that lost against him in a
 * different one.
 */
class Player {
  constructor(number, character) {
    this.number = number;
    this.character = character;
    this.matches = [];
  }

  fight(player) {
    if (!(player instanceof Player)) {
      throw new TypeError('Instances of Player can only fight other instances of Player!');
    }
    //make characters fight
    const result = this.character.fight(player.character);

    //if TIE, resolve with player number
    if (result === MatchResult.TIE) {
      return this.number < player.number ? MatchResult.WIN : MatchResult.LOSE;
    }

    //otherwise just return the result of the fight
    return result;
  }

  toString() {
    return `${this.number}\n${this.matches.map((m) => m.loser.number).join(' ')}`;
  }
}

/** The Character class represents one of the characters of a Rock, Paper,
 * Scissors, Lizard, Spock contest.
 *
 * It can fight other characters. The fight can tie.
 *
 * Get instances of this class through the CharacterFactory class.
 *
 */
class Character {
  constructor(id, name, winsOver) {
    this.id = id;
    this.name = name;
    //array of character ID's that this character wins over
    this.winsOver = winsOver;
  }

  fight(character) {
    if (!(character instanceof Character)) {
      throw new TypeError('Instances of Character can only fight other instances of Character!');
    }

    if (character.id === this.id) {
      return MatchResult.TIE;
    }

    if (this.winsOver.includes(character.id)) {
      return MatchResult.WIN;
    }
    return MatchResult.LOSE;
  }
}

/**
 * Returns concrete instances of Characters from the identifier of the Character.
 */
class CharacterFactory {
  constructor() {}

  static make(id) {
    //characters
    const ROCK = 'R';
    const PAPER = 'P';
    const SCISSORS = 'C';
    const LIZARD = 'L';
    const SPOCK = 'S';

    switch (id) {
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
    }
    throw new Error(`Unknown characterId: ${id}`);
  }
}

const N = parseInt(readline());
const players = [];
for (let i = 0; i < N; i++) {
  var inputs = readline().split(' ');
  const numPlayer = parseInt(inputs[0]);
  const character = CharacterFactory.make(inputs[1]);
  players.push(new Player(numPlayer, character));
}

const contest = new Contest(players);

console.log(contest.winner.toString());
