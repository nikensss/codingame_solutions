class Decoder {
  constructor() {
    this.codes = new Map();
  }

  set(code, letter) {
    this.codes.set(code, letter);
  }

  get(code) {
    if (!this.has(code)) {
      throw new Error('Unknown code');
    }
    return this.codes.get(code);
  }

  has(code) {
    return this.codes.has(code);
  }

  decode(code) {
    let result = '';
    let chunk = '';

    //loop through all the characters
    for (const char of code) {
      //accumulate them in 'chunk'
      chunk += char;
      //if 'chunk' can't be decoded, move on with the loop, which will cause
      //the characters to stack in 'chunk
      if (!this.has(chunk)) continue;
      //if 'chunk' can be decoded, append the result to 'result'
      result += this.get(chunk);
      //reset chunk to continue decoding
      chunk = '';
    }

    if (chunk.length > 0) {
      return `DECODE FAIL AT INDEX ${code.length - chunk.length}`;
    }
    return result;
  }
}
const encoder = new Decoder();
const n = parseInt(readline());
for (let i = 0; i < n; i++) {
  var inputs = readline().split(' ');
  const b = inputs[0];
  const c = parseInt(inputs[1]);
  encoder.set(b, String.fromCharCode(c));
}
const s = readline();

console.log(encoder.decode(s));
