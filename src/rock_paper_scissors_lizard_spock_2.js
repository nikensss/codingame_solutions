/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const N = parseInt(readline());
const nbOfBatch = N / 2 - 1;
console.error('Number of players: \t' + N);
var inputs = [];

//old JS
// function Player(id, character) {
//   this.id = id;
//   this.character = character;
//   this.wins = []
// }

// Player.prototype.fight = function (anotherPlayer) {
//   const result = this.character.fight(anotherPlayer.character);
//   return result;
// };

// Player.prototype.toString = function(){
//   let s = this.id + '\n';
//   s += this.wins.join(' ');
//   return s;
// }

const WIN = 1;
const TIE = 0;
const LOSE = -1;

class Player {
  constructor(id, character) {
    this.id = id;
    this.character = character;
    this.wins = [];
  }

  fight(anotherPlayer) {
    const result = this.character.fight(anotherPlayer.character);
    if (result === WIN) {
      this.wins.push(anotherPlayer.id);
    }

    if (result === LOSE) {
      anotherPlayer.wins.push(this.id);
    }

    if (result === TIE) {
      //resolve tie situation
    }
    return result;
  }

  toString() {
    let s = this.id + '\n';
    s += this.wins.join(' ');
    return s;
  }
}

const players = [];
const player = {};

for (let i = 0; i < N; i++) {
  inputs.push(readline().split(' '));
  const id = parseInt(inputs[i][0]);
  const character = inputs[i][1];
  players.push(new Player(id, character));
}

console.error('signPlayerTab: \t' + players.map((p) => p.character));
console.error('numPlayerTab: \t' + players.map((p) => p.id) + '\n');

for (let batchNb = 0; batchNb < nbOfBatch; batchNb++) {
  let result = [];

  for (let i = 0; i < player.sign.length; i += 2) {
    result.push(winner(player.sign[i], player.sign[i + 1], i, player.id)); // table of winner
  }

  /*
    Now, I want to keep in player only the data where the value in player.id are in result array
    and initialize player with its new values
    something like : 
    player = Object.values(player).filter(person => result.includes(person.id));
    */

  // Not working : player2.id = undefined
  let player2 = Object.values(player).filter((person) => result.includes(person.id));

  // Not working either : player2.id = undefined
  // let player2 = Object.keys(player).reduce(function(r, e) {
  //   if (result.includes(player[e])) {
  //       r[e] = player[e]
  //   }
  //   return r;
  // }, {});

  console.error('>>> player2: \t\t' + player2.id);
}

function winner(a, b, run, currentBatch) {
  // console.error('match for: \t' + a + currentBatch.id[run] + " vs " + b + currentBatch.id[run+1]);
  if (a == b) {
    if (currentBatch[run] < currentBatch[run + 1]) {
      return currentBatch[run];
    } else {
      return currentBatch[run + 1];
    }
  } else if (
    (a == 'P' && (b == 'S' || b == 'R')) ||
    (a == 'C' && (b == 'P' || b == 'L')) ||
    (a == 'S' && (b == 'C' || b == 'R')) ||
    (a == 'L' && (b == 'P' || b == 'S')) ||
    (a == 'R' && (b == 'C' || b == 'L'))
  ) {
    return currentBatch[run];
  } else {
    return currentBatch[run + 1];
  }
}

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

console.log(whoIsTheWinner(players).toString());

/**
 * Runs the entire competition and returns the winner.
 *
 * @param {Player[]} players The players in the competition
 */
function whoIsTheWinner(players) {
  while (players.length > 1) {
    players = playRound(players);
  }
  return players[0];
}

function playRound(players) {
  const winners = [];
  for (let i = 0; i < players.length; i += 2) {
    const result = players[i].fight(players[i + 1]);
    if (result === WIN) {
      //players[i] won the fight
      winners.push(players[i]);
    } else {
      //players[i+1] won the fight
      winners.push(players[i + 1]);
    }
  }
  return winners;
}
