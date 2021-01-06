/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
'use strict';

/**
 * A Node represents one digit of a telephone number. It has an array of nodes,
 * which represent connections.
 */
class Node {
  constructor(id) {
    this.id = id;
    this.parent = null;
    this.nodes = [];
  }
  /**
   * Adds the given node in the nodes array as a connection.
   * @param {Node} node The node to connect to
   */
  add(node) {
    this.nodes.push(node);
    node.parent = this;
  }

  /**
   * Gets the node from the nodes array of this node that has the provided id.
   * If such a node doesn't exist, it will be created an added automatically to
   * the nodes array.
   *
   * @param {number} id The id of the node to be retrieved
   */
  get(id) {
    let child = this.nodes.find((node) => node.id === id);
    if (!child) {
      child = new Node(id);
      this.add(child);
    }
    return child;
  }

  /**
   * The amount of nodes to be found (counting this node) when following all the
   * connections.
   *
   * @returns {number}
   */
  count() {
    let c = 1; //this node
    for (const node of this.nodes) {
      c += node.count(); //plus all the nodes under it
    }

    return c;
  }

  toString() {
    return `->Node ${this.id}`;
  }
}

class ContactManager {
  constructor() {
    //Create a ROOT node from which all nodes will descend from. This strategy
    //allows to use the same logic for all digits of a telephone number when
    //adding one and when counting how many nodes have been created.
    this.root = new Node('ROOT');
  }

  add(telephone) {
    let node = this.root.get(telephone[0]);

    for (let i = 1; i < telephone.length; i++) {
      let nextNode = node.get(telephone[i]);
      node = nextNode;
    }
  }

  count() {
    return this.root.count() - 1; //we need to subtract the root node, since it doesn't count for the total
  }
}

const N = parseInt(readline());
const contactManager = new ContactManager();
for (let i = 0; i < N; i++) {
  const telephone = readline();
  contactManager.add(telephone);
}

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

// The number of elements (referencing a number) stored in the structure.
console.log(contactManager.count());
