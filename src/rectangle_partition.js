/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

let inputs = readline().split(' ');
const w = parseInt(inputs[0]);
const h = parseInt(inputs[1]);
const countX = parseInt(inputs[2]);
const countY = parseInt(inputs[3]);
inputs = readline().split(' ');
const xSplitPoints = [];
for (let i = 0; i < countX; i++) {
  xSplitPoints.push(parseInt(inputs[i]));
}

inputs = readline().split(' ');
const ySplitPoints = [];
for (let i = 0; i < countY; i++) {
  ySplitPoints.push(parseInt(inputs[i]));
}
console.error({ w, h, countX, countY, xSplitPoints, ySplitPoints });

const xSideLengths = getLengths(xSplitPoints, w);
console.error('x side lengths: ' + xSideLengths);

const ySideLengths = getLengths(ySplitPoints, h);
console.error('y side lengths: ' + ySideLengths);

let squareCount = 0;
for (let yIndex = 0; yIndex < ySideLengths.length; yIndex += 1) {
  let yLength = ySideLengths[yIndex];
  for (let xIndex = 0; xIndex < xSideLengths.length; xIndex += 1) {
    let xLength = xSideLengths[xIndex];
    if (xLength === yLength) {
      console.error(yLength + ' x ' + xLength);
      squareCount += 1;
    }
  }
}

console.log(squareCount);

function getLengths(splitPoints, length) {
  const landmarks = [0, ...splitPoints, length];
  const lengths = [];
  for (let i = 0; i < landmarks.length; i += 1) {
    for (let j = i + 1; j < landmarks.length; j += 1) {
      lengths.push(Math.abs(landmarks[j] - landmarks[i]));
    }
  }
  return lengths;
}
