class Corridor {
  constructor(a, b) {
    if (a.equals(b)) {
      throw new Error('No loops allowed in Corridors!');
    }
    this.a = a;
    this.b = b;
  }

  connects(a, b) {
    return this.has(a) && this.has(b);
  }

  has(cell) {
    return this.a.equals(cell) || this.b.equals(cell);
  }

  getOther(cell) {
    return this.a.equals(cell) ? this.b : this.a;
  }

  toString() {
    return `Corridor: ${this.a.id} <-> ${this.b.id}`;
  }

  equals(corridor) {
    return this.a.equals(corridor.getOther(this.b)) && this.b.equals(corridor.getOther(this.a));
  }
}

class Cell {
  constructor(id) {
    this.id = id;
    this.corridors = [];
    this.emergencyExit = true;
  }

  addCorridor(corridor) {
    this.corridors.push(corridor);
  }

  getConnectionCount() {
    return this.corridors.length;
  }

  getAdjacentCells() {
    return this.corridors.map((c) => c.getOther(this));
  }

  isConnectedTo(cell) {
    return this.corridors.some((c) => c.connects(this, cell));
  }
  equals(cell) {
    return this.id === cell.id;
  }

  toString() {
    return `Cell ${this.id}: ${this.corridors.map((c) => c.getOther(this).id).join(', ')}`;
  }
}

class BattleTower {
  constructor() {
    this.cells = [];
    this.corridors = [];
  }

  has(cellId) {
    return this.cells.some((c) => c.id === cellId);
  }

  add(cellId) {
    if (this.has(cellId)) {
      return;
    }
    this.cells.push(new Cell(cellId));
  }

  get(cellId) {
    return this.cells.find((c) => c.id === cellId);
  }

  connect(aId, bId) {
    this.add(aId);
    this.add(bId);
    const a = this.get(aId);
    const b = this.get(bId);

    if (a.isConnectedTo(b)) {
      return;
    }

    const c = new Corridor(a, b);
    this.corridors.push(c);
    a.addCorridor(c);
    b.addCorridor(c);
  }

  complyWithFireSafetyRules() {
    if (this.cells.length === 1) return 1;

    // console.error(this.cells.map((c) => c.getConnectionCount()));
    //this.cells.sort((a, b) => b.getConnectionCount() - a.getConnectionCount());
    const visited = [];
    let count = 0;
    for (const cell of this.cells) {
      visited[cell.id] = false;
    }

    for (const corridor of this.corridors) {
      if (visited[corridor.a.id] === false && visited[corridor.b.id] === false) {
        visited[corridor.a.id] = true;
        visited[corridor.b.id] = true;
        count += 1;
      }
    }

    return count;
  }
}

const N = parseInt(readline());
const battleTower = new BattleTower();

for (let i = 0; i < N; i++) {
  const [id, , ...connectedCellsIds] = readline().split(' ');
  battleTower.add(id);

  for (const connectedCellId of connectedCellsIds) {
    battleTower.add(connectedCellId);
    battleTower.connect(id, connectedCellId);
  }
}

// battleTower.complyWithFireSafetyRules();
console.log(battleTower.complyWithFireSafetyRules());
// console.log(battleTower.getEmergencyExitsCount());
