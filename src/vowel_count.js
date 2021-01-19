const readline = require('readline');
const itfc = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

itfc.on('line', (w) => console.log(vowelCount(w)));

function vowelCount(word) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let count = 0;
  for (const char of word) {
    count += vowels.includes(char) ? 1 : 0;
  }

  return count;
}
