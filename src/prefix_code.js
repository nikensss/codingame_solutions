class Encoder {
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
    const arr = code.split('');
    let result = '';
    let chunk = '';
    while (arr.length > 0) {
      chunk += arr.shift();
      try {
        result += this.get(chunk);
        chunk = '';
      } catch (ex) {
        //do nothing
      }
    }

    if (chunk.length > 0) {
      return `DECODE FAIL AT INDEX ${code.length - chunk.length}`;
    }
    return result;
  }
}
const encoder = new Encoder();
const n = parseInt(readline());
for (let i = 0; i < n; i++) {
  var inputs = readline().split(' ');
  const b = inputs[0];
  const c = parseInt(inputs[1]);
  encoder.set(b, String.fromCharCode(c));
}
const s = readline();

console.log(encoder.decode(s));
