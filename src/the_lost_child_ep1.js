/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
const START = 'C';
const FINISH = 'M';
const ROAD = '.';
const WALL = '#';
const BLOCK_DISTANCE = 10;

class Node {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.connections = [];
    this.visited = false;
  }

  get name() {
    return `${this.id} [${this.x}/${this.y}]`;
  }

  connect(node) {
    if (!node || this.isConnectedTo(node)) {
      return;
    }
    this.connections.push(node);
    node.connect(this);
  }

  isVisited() {
    return this.visited;
  }

  distanceTo(node) {
    const xDistance = Math.abs(this.x - node.x) * BLOCK_DISTANCE;
    const yDistance = Math.abs(this.y - node.y) * BLOCK_DISTANCE;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }

  isConnectedTo(node) {
    return this.connections.findIndex((n) => n.x === node.x && n.y === node.y) > -1;
  }

  isWall() {
    return this.id === WALL;
  }

  isRoad() {
    return this.id === ROAD;
  }

  isStart() {
    return this.id === START;
  }

  isFinish() {
    return this.id === FINISH;
  }

  toString() {
    return `** Node ${this.name}. Connections: ${this.connections.map((n) => n.name)}`;
  }
}

class Path {
  constructor(...nodes) {
    this.nodes = nodes;
    this.nodes.forEach((n) => (n.visited = true));
  }

  pave(node) {
    this.nodes.push(node);
  }

  end() {
    return this.nodes[this.nodes.length - 1];
  }

  length() {
    return `${(this.nodes.length - 1) * BLOCK_DISTANCE}km`;
  }

  toString() {
    return this.nodes.map((n) => n.name).join(' -> ');
  }
}

//first create an array of arrays, so that it is easier to connect them as necessary
const rows = [];

for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
  const line = readline().split('');
  const row = [];
  for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
    const character = line[columnIndex];
    row.push(new Node(character, columnIndex, rowIndex));
  }
  rows.push(row);
}
//connect in a square grid with no diagonals
connectNodes(rows);

//when looking for the shortest path, flatten the rows array so that the 'bfs'
//method only works with an array of nodes. The nodes themselves already know to
//what other nodes they are connected to
const shortestPath = bfs(rows.flat());

console.log(shortestPath.length());

/**
 * Connects the nodes in this array of arrays to create a square grid with no
 * diagonals.
 * @param {Node[][]} rows An array of arrays of nodes
 */
function connectNodes(rows) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const node = row[columnIndex];
      node.connect(row[columnIndex + 1]); //the one to the right
      node.connect(row[columnIndex - 1]); //the one to the left
      if (rows[rowIndex - 1]) {
        node.connect(rows[rowIndex - 1][columnIndex]); //the one on top
      }
      if (rows[rowIndex + 1]) {
        node.connect(rows[rowIndex + 1][columnIndex]); //the one to the bottom
      }
    }
  }
}

/**
 * Finds the shorted path from the start node to the finish node in the given
 * array of nodes.
 *
 * @param {Node[]} nodes An array of nodes
 * @returns {Path} path The shortest path
 */
function bfs(nodes) {
  const start = nodes.find((n) => n.isStart());
  const q = [];
  q.push(new Path(start));

  while (q.length > 0) {
    const path = q.shift();
    const node = path.end();

    if (node.isFinish()) return path;

    for (const connection of node.connections) {
      if (connection.isWall() || connection.isVisited()) {
        continue;
      }
      q.push(new Path(...path.nodes, connection));
    }
  }
}
