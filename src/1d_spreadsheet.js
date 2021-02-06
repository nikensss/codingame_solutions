/**
 * The Cell class contains the info about the operation and the arguments to use.
 * It can ask the spreadsheet for the value of a cell in case that operand is a
 * reference to another cell.
 */
class Cell {
  #operation;
  #first;
  #second;
  #spreadsheet;
  #index;
  #mem;

  constructor(operation, first, second, spreadsheet, index) {
    this.#operation = operation;
    this.#first = first;
    this.#second = second;
    this.#spreadsheet = spreadsheet;
    this.#index = index;
    this.#mem = null;
  }

  /**
   * Returns the numeric value that corresponds to this cell.
   *
   * It is calculated one time, and further requests will return the value obtained
   * the first time (memoization).
   *
   * @returns {number} The numeric value of this cell.
   */
  get val() {
    if (this.#mem === null) {
      this.#mem = this._calculateValue();
    }
    return this.#mem;
  }

  /**
   * Calculates the value of this cell depending on the operation.
   *
   * @returns {number} The numeric value of this cell.
   * @throws If the operation is not known.
   */
  _calculateValue() {
    switch (this.#operation) {
      case 'VALUE':
        return this._value();
      case 'ADD':
        return this._add();
      case 'SUB':
        return this._sub();
      case 'MULT':
        return this._mult();
    }
    throw new Error('Unknown operation: ' + this.#operation);
  }

  /**
   * The 'VALUE' operation returns the value of the first argument in this cell.
   */
  _value() {
    return this.first;
  }

  /**
   * The 'ADD' operation 'does' an addition of two numbers.
   */
  _add() {
    return this._do((a, b) => a + b);
  }

  /**
   * The 'SUB' operation 'does' a subtraction of two numbers.
   */
  _sub() {
    return this._do((a, b) => a - b);
  }

  /**
   * The 'MULT' operation 'does' a multiplication of two numbers.
   */
  _mult() {
    return this._do((a, b) => a * b);
  }

  /**
   * Will perform the operation defined by the given 'operation' method with
   * the first and the second arguments passed to this cell.
   *
   * @param {function} operation A function defining the operation two perform.
   * @returns {number} The result of the operation of this cell.
   */
  _do(operation) {
    return operation(this.first, this.second);
  }

  /**
   * Represents the value of the first argument of this cell.
   */
  get first() {
    return this._valueOf(this.#first);
  }

  /**
   * Represents the value of the second argument of this cell.
   */
  get second() {
    return this._valueOf(this.#second);
  }

  /**
   * Returns the value of the given argument 'arg'. In case this argument represents
   * a reference, the value of the referred cell will be retrieved. Else, that string
   * will be parsed and the value returned.
   *
   * @param {string} arg The argument to get the value of.
   * @returns {number} The numeric value of the given argument.
   */
  _valueOf(arg) {
    return this._isReference(arg) ? this.#spreadsheet.get(arg.substr(1)) : parseFloat(arg);
  }

  /**
   * Indicates wether the string defining the given argument is a reference
   * value or not.
   * @param {string} arg The value of the argument.
   */
  _isReference(arg) {
    return arg[0] === '$';
  }

  toString() {
    return `${this.#index}: ${this.#operation} ${this.#first} ${this.#second}`;
  }
}

/**
 * The Spreadsheet class contains all the cells.
 */
class Spreadsheet {
  #cells;

  constructor() {
    this.#cells = [];
  }

  /**
   * Adds a new Cell to this Spreadsheet.
   *
   * @param {string} operation The 'operation' string. Can be any of 'VALUE',
   * 'ADD', 'SUB' or 'MULT'.
   * @param {string} arg1 The first argument to the operation represented by the new cell.
   * @param {string} arg2 The second argument to the operation represented by the new cell.
   */
  add(operation, arg1, arg2) {
    this.#cells.push(new Cell(operation, arg1, arg2, this, this.#cells.length));
  }

  /**
   * Returns the numeric value represented by the cell at position 'index' in this
   * spreadsheet.
   *
   * @param {string|number} index The index of the cell
   * @returns {number} The numeric value of the desired cell
   */
  get(index) {
    return this.#cells[index].val;
  }

  toString() {
    return this.#cells.map((c) => c.val).join('\n');
  }
}

const N = parseInt(readline());
const spreadsheet = new Spreadsheet();
for (let i = 0; i < N; i++) {
  var inputs = readline().split(' ');
  spreadsheet.add(...inputs);
}

console.log(spreadsheet.toString());
