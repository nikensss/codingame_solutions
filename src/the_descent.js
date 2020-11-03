/**
 * The while loop represents the game.
 * Each iteration represents a turn of the game
 * where you are given inputs (the heights of the mountains)
 * and where you have to print an output (the index of the mountain to fire on)
 * The inputs you are given are automatically updated according to your last actions.
 **/

// game loop
while (inGame()) {
  const heights = [];
  for (let i = 0; i < 8; i++) {
    heights.push(parseInt(readline())); // represents the height of one mountain.
  }

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');
  const highest = Math.max.apply(Math, heights);
  console.log(heights.findIndex((h) => h === highest));
}

function inGame() {
  return Math.random() > 0.5;
}
