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
    this.#circuit = circuit.split(' ');
    this.#r = null;
  }

  addResistor(r) {
    if (!(r instanceof Resistor)) {
      throw new TypeError('Expected Resistor!');
    }
    this.#resistors.push(r);
  }

  get r() {
    if (this.#r === null) {
      this.#r = this.processBlock(this.#circuit).r.toFixed(1);
    }

    return this.#r;
  }

  processBlock(circuit) {
    if (this.isSeriesBlockStart(circuit[0])) {
      return this.processSeries(circuit);
    } else if (this.isParallelBlockStart(circuit[0])) {
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

  getResistor(id) {
    return this.#resistors.find((r) => r.id === id);
  }

  getBlockResistors(circuit) {
    if (!this.isBlockStart(circuit[0])) {
      throw new Error(`Not a block start: ${circuit[0]}`);
    }
    circuit.shift();

    const resistors = [];
    while (circuit.length > 0) {
      if (this.isBlockEnd(circuit[0])) break;

      if (this.isBlockStart(circuit[0])) {
        resistors.push(this.processBlock(circuit));
      }

      if (this.isResistorId(circuit[0])) {
        resistors.push(this.getResistor(circuit[0]));
      }

      circuit.shift();
    }
    return resistors;
  }

  isResistorId(id) {
    return this.#resistors.some((r) => r.id === id);
  }

  isBlockStart(c) {
    return this.isSeriesBlockStart(c) || this.isParallelBlockStart(c);
  }

  isBlockEnd(c) {
    return this.isSeriesBlockEnd(c) || this.isParallelBlockEnd(c);
  }

  isSeriesBlockStart(c) {
    return c === '(';
  }

  isSeriesBlockEnd(c) {
    return c === ')';
  }

  isParallelBlockStart(c) {
    return c === '[';
  }

  isParallelBlockEnd(c) {
    return c === ']';
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
