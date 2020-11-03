/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

function toBitString(string) {
  return string
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(7, '0'))
    .join('');
}

function toChuckNorrisNotation(bitString) {
  let result = '';
  const ZERO = '0';
  const ONE = '1';
  const bits = bitString.split('');
  let groups = [];
  let current = '';
  for (const bit of bits) {
    if (current[0] === bit) {
      current += bit;
    } else {
      groups.push(current);
      current = bit;
    }
  }
  groups.push(current);
  groups = groups.filter((g) => g.length > 0);

  for (const group of groups) {
    if (group[0] === ONE) {
      result += ' 0 ';
    } else if (group[0] === ZERO) {
      result += ' 00 ';
    } else {
      throw new Error('Not 1 or 0: ' + group[0]);
    }
    result += '0'.repeat(group.length);
  }

  return result.trim();
}

const MESSAGE = readline();

// Write an answer using console.log()
// To debug: console.error('Debug messages...');
console.error(MESSAGE);
console.log(toChuckNorrisNotation(toBitString(MESSAGE)));
