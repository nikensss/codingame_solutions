const EARTH_RADIUS_KM = 6371;

const degToRad = (deg) => (parseFloat(deg.replace(',', '.')) / 180) * Math.PI;

class Defibrillator {
  constructor(line) {
    const components = line.split(';');
    this.id = components.shift();
    this.name = components.shift();
    this.address = components.shift();
    this.phoneNumber = components.shift();
    this.longitude = degToRad(components.shift());
    this.latitude = degToRad(components.shift());
  }
}

class User {
  constructor(longitude, latitude) {
    this.longitude = degToRad(longitude);
    this.latitude = degToRad(latitude);
  }

  distanceTo(defibrillator) {
    const x =
      Math.abs(this.longitude - defibrillator.longitude) *
      Math.cos((this.latitude + defibrillator.latitude) / 2);
    const y = Math.abs(this.latitude - defibrillator.latitude);

    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * EARTH_RADIUS_KM;
  }
}

const LON = readline();
const LAT = readline();
const user = new User(LON, LAT);
const N = parseInt(readline());

const defibrillators = [];

for (let i = 0; i < N; i++) {
  const defibrillator = readline();
  defibrillators.push(new Defibrillator(defibrillator));
}

let shortestDistance = Number.MAX_VALUE;
let closestDefibrillator = null;
for (const defibrillator of defibrillators) {
  const dist = user.distanceTo(defibrillator);
  if (dist < shortestDistance) {
    shortestDistance = dist;
    closestDefibrillator = defibrillator;
  }
}

console.log(closestDefibrillator.name);
