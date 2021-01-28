function toBitString(string) {
  return [...string].map((c) => c.charCodeAt(0).toString(2).padStart(7, '0')).join('');
}

function blockToChuckNorrisNotation(block) {
  const sequenceStart = block[0] === '0' ? '00' : '0';
  return sequenceStart + ' ' + '0'.repeat(block.length);
}

function toChuckNorrisNotation(bitString) {
  return bitString
    .match(/(1+|0+)/g) //match will return an array for each sequence of 0's and 1's
    .map(blockToChuckNorrisNotation) //we map each block to their Chuck Norris notation
    .join(' '); //we concatenate each Chuck Norris notation block with spaces
}

const MESSAGE = readline();

console.log(toChuckNorrisNotation(toBitString(MESSAGE)));
