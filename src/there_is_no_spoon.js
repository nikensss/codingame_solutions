/**
 * Don't let the machines win. You are humanity's last hope...
 **/
const NODE = '0';
const NOT_FOUND = ' -1 -1';

const width = parseInt(readline()); // the number of cells on the X axis
const height = parseInt(readline()); // the number of cells on the Y axis

const rows = [];
for (let i = 0; i < height; i++) {
  rows.push(readline().split('')); // width characters, each either 0 or .
}

if (rows.some((r) => r.length !== width)) {
  throw new Error('Unexpected row length!');
}
// Write an action using console.log()
// To debug: console.error('Debug messages...');
// Three coordinates: a node, its right neighbor, its bottom neighbor
for (let row = 0; row < rows.length; row += 1) {
  for (let column = 0; column < rows[row].length; column += 1) {
    if (!isNode(rows[row][column])) continue;

    let output =
      `${column} ${row} ` +
      horizontalNeighbourCoordinates(rows, row, column) +
      verticalNeighbourCoordinates(rows, row, column);

    console.log(output);
  }
}

function isNode(character) {
  return character === NODE;
}

function horizontalNeighbourCoordinates(rows, row, column) {
  const neighbour = rows[row].slice(column + 1).findIndex((n) => n === NODE);

  if (neighbour === -1) return NOT_FOUND;

  return ' ' + (neighbour + column + 1) + ' ' + row;
}

function verticalNeighbourCoordinates(rows, row, column) {
  for (let yPosition = row + 1; yPosition < rows.length; yPosition += 1) {
    if (rows[yPosition][column] === NODE) {
      return ' ' + column + ' ' + yPosition;
    }
  }
  return NOT_FOUND;
}
