/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

class Node {
  constructor(name) {
    this.name = name;
    this.connections = [];
    this.isExit = false;
  }

  connect(node) {
    if (!this.isConnectedTo(node)) {
      this.connections.push(node);
      node.connect(this);
    }
  }

  isConnectedTo(node) {
    return this.connections.find((n) => n.name === node.name);
  }

  toString() {
    return `** Node ${this.name}: ${this.connections.map((n) => n.name)}`;
  }
}

class Mesh {
  constructor() {
    this.nodes = [];
  }

  add(node) {
    const knownNode = this.find(node);
    if (knownNode instanceof Node) {
      return knownNode;
    }

    this.nodes.push(node);
    this.nodes.sort((a, b) => a.name - b.name);
    return node;
  }

  find(node) {
    return this.nodes.find((n) => n.name === node.name);
  }

  get size() {
    return this.nodes.length;
  }

  toString() {
    let s = `Mesh (${this.nodes.length} nodes available)\n`;
    s += `\t${this.nodes.map((n) => n.toString()).join('\n\t')}`;
    return s;
  }
}

class Path {
  constructor(...nodes) {
    this.nodes = nodes;
  }

  pave(node) {
    this.nodes.push(node);
  }

  end() {
    return this.nodes[this.nodes.length - 1];
  }

  severLastConnection() {
    console.log(this.nodes[this.nodes.length - 2].name + ' ' + this.end().name);
  }

  toString() {
    return this.nodes.map((n) => n.name).join(' -> ');
  }
}

const initValues = readline().split(' ');
const N = parseInt(initValues[0]); // the total number of nodes in the level, including the gateways
const L = parseInt(initValues[1]); // the number of links
const E = parseInt(initValues[2]); // the number of exit gateways

const mesh = new Mesh();
for (let i = 0; i < L; i++) {
  const link = readline().split(' ');
  const N1 = mesh.add(new Node(parseInt(link[0]))); // N1 and N2 defines a link between these nodes
  const N2 = mesh.add(new Node(parseInt(link[1])));
  N1.connect(N2);
}

if (mesh.size !== N) {
  throw new Error('Unexpected mesh size!');
}

for (let i = 0; i < E; i++) {
  const EI = parseInt(readline()); // the index of a gateway node
  mesh.find(new Node(EI)).isExit = true;
}

// game loop
while (isInGame()) {
  const SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn

  const shortestPath = bfs(mesh, new Node(SI));
  shortestPath.severLastConnection();
}

function isInGame() {
  return true;
}

function bfs(mesh, root) {
  const q = [];
  q.push(new Path(mesh.find(root)));

  while (q.length > 0) {
    const path = q.shift();

    const node = path.end();

    if (node.isExit) return path;

    for (const connection of node.connections) {
      q.push(new Path(...path.nodes, connection));
    }
  }
}
