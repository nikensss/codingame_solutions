class Resistor {
  #id;

  #r;

  constructor(id, r) {
    this.#id = id;
    this.#r = r;
  }

  get id() {
    return this.#id;
  }

  get r() {
    return this.#r;
  }

  get inverse() {
    return 1 / this.#r;
  }

  /**
   * Returns a Resistor the represents the parallel of this Resistor with the
   * given Resistors.
   *
   * @param  {...Resistor} resistors The Resistors in parallel with this Resistor
   * @returns {Resistor}
   */
  parallel(...resistors) {
    if (resistors.length === 0) {
      return this;
    }

    resistors.push(this);
    const id = resistors.map((r) => r.id).join('||');
    const R = 1 / resistors.map((r) => r.inverse).reduce((t, r) => t + r);
    return new Resistor(id, R);
  }

  /**
   * Returns a Resistor the represents the series of this Resistor with the
   * given Resistors.
   *
   * @param  {...Resistor} resistors The Resistors in series with this Resistor
   * @returns {Resistor}
   */
  series(...resistors) {
    if (resistors.length === 0) {
      return this;
    }

    resistors.push(this);
    const id = resistors.map((r) => r.id).join('-');
    const R = resistors.map((r) => r.r).reduce((t, r) => t + r);
    return new Resistor(id, R);
  }

  toString() {
    return `R (${this.id}): ${this.r} Ohm`;
  }
}

class CircuitToken {
  #t;

  constructor(t) {
    this.#t = t;
  }

  get t() {
    return this.#t;
  }

  isInvalidToken(resistors) {
    return !this.isResistorId(resistors) && !this.isBlockStart() && !this.isBlockEnd();
  }

  isResistorId(resistors) {
    return resistors.some((r) => r.id === this.#t);
  }

  isBlockStart() {
    return this.isSeriesBlockStart() || this.isParallelBlockStart();
  }

  isBlockEnd() {
    return this.isSeriesBlockEnd() || this.isParallelBlockEnd();
  }

  isSeriesBlockStart() {
    return this.#t === '(';
  }

  isSeriesBlockEnd() {
    return this.#t === ')';
  }

  isParallelBlockStart() {
    return this.#t === '[';
  }

  isParallelBlockEnd() {
    return this.#t === ']';
  }
}
class Circuit {
  #resistors;

  #circuit;

  #r;

  constructor(circuit) {
    this.setCircuit(circuit);
    this.#resistors = [];
    this.#r = null;
  }

  setCircuit(circuit = '') {
    this.#circuit = circuit.split(' ').map((c) => new CircuitToken(c));
    this.#r = null;
  }

  addResistor(r) {
    if (!(r instanceof Resistor)) {
      throw new TypeError('Expected Resistor!');
    }
    this.#resistors.push(r);
  }

  /**
   * Returns the equivalent resistance of the circuit in Ohm with one decimal.
   *
   * @returns {number} The equivalent resistance of the circuit.
   */
  get r() {
    if (this.#r === null) {
      this.#r = this.processBlock(this.#circuit).r.toFixed(1);
    }

    return this.#r;
  }

  processBlock(circuit) {
    if (circuit[0].isSeriesBlockStart()) {
      return this.processSeries(circuit);
    } else if (circuit[0].isParallelBlockStart()) {
      return this.processParallel(circuit);
    }
    throw new Error(`Not a block start: ${circuit[0]}`);
  }

  processSeries(circuit) {
    const resistors = this.getBlockResistors(circuit);
    return resistors[0].series(...resistors.slice(1));
  }

  processParallel(circuit) {
    const resistors = this.getBlockResistors(circuit);
    return resistors[0].parallel(...resistors.slice(1));
  }

  /**
   * Given the input Token, a Resistor is returned with the same id.
   *
   * @param {CircuitToken} token The Token with the name of the desired Resistor.
   * @returns {Resistor} The desired Resistor if any match.
   */
  getResistor(token) {
    if (!this.#resistors.some((r) => r.id === token.t)) {
      throw new Error(`Unknown Resistor: ${token.t}`);
    }
    return this.#resistors.find((r) => r.id === token.t);
  }

  /**
   * Gets all the Resistors in this block. If there are inner blocks, these are
   * converted to their equivalent Resistor.
   *
   * @param {CircuitToken[]} circuit The Tokens representing the circuit
   * @returns {Resistor[]} The Resistors of the current block
   */
  getBlockResistors(circuit) {
    if (!circuit[0].isBlockStart()) {
      throw new Error(`Not a block start: ${circuit[0]}`);
    }
    circuit.shift();

    const resistors = [];
    let token = circuit[0];
    while (!token.isBlockEnd()) {
      if (token.isInvalidToken(this.#resistors)) {
        throw new Error(`Invalid token: ${token.t}`);
      }

      if (token.isBlockStart()) {
        resistors.push(this.processBlock(circuit));
      }

      if (token.isResistorId(this.#resistors)) {
        resistors.push(this.getResistor(token));
      }

      circuit.shift();
      token = circuit[0];
    }

    return resistors;
  }
}

const circuit = new Circuit();
const N = parseInt(readline());
for (let i = 0; i < N; i++) {
  const [name, R] = readline().split(' ');
  circuit.addResistor(new Resistor(name, parseFloat(R)));
}

circuit.setCircuit(readline());
console.log(circuit.r);
