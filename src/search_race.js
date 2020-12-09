class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Checkpoint extends Point {
  constructor(x, y) {
    super(x, y);
  }
}

const checkpointsCount = parseInt(readline()); // Count of checkpoints to read
const checkpoints = [];
for (let i = 0; i < checkpointsCount; i++) {
  const inputs = readline().split(' ');
  const checkpointX = parseInt(inputs[0]); // Position X
  const checkpointY = parseInt(inputs[1]); // Position Y
  checkpoints.push(new Checkpoint(checkpointX, checkpointY));
}

//to avoid linting error
const isInGame = () => true;
// game loop
while (isInGame()) {
  const inputs = readline().split(' ');
  const checkpointIndex = parseInt(inputs[0]); // Index of the checkpoint to lookup in the checkpoints input, initially 0
  const x = parseInt(inputs[1]); // Position X
  const y = parseInt(inputs[2]); // Position Y
  //const vx = parseInt(inputs[3]); // horizontal speed. Positive is right
  //const vy = parseInt(inputs[4]); // vertical speed. Positive is downwards
  const angle = 360 - parseInt(inputs[5]) === 360 ? 0 : 360 - parseInt(inputs[5]); // facing angle of this car
  const car = new Point(x, y);
  const target = checkpoints[checkpointIndex];
  // Write an action using console.log()
  // To debug: console.error('Debug messages...');
  const angleToTarget = getAngle(car, target);
  const distance = dist(car, target);
  const thrustAndModulation = calculateThrust(angle, angleToTarget, distance);
  console.error({
    angle,
    angleToTarget,
    angleDiff: Math.abs(angle - angleToTarget),
    distance,
    checkPointsRatio: distance / 600,
    ...thrustAndModulation
  });

  console.log(
    `${target.x} ${target.y} ${thrustAndModulation.thrust} ${thrustAndModulation.thrust}`
  ); // X Y THRUST MESSAGE
}

function calculateThrust(carAngle, angleToTarget, distance) {
  const maxThrust = 195;
  const angleDiff = Math.abs(carAngle - angleToTarget);
  const checkpointWidth = 600;
  let thrust = maxThrust;

  const slow = 60;

  const angleModulation = Math.pow(1 - angleDiff / 360, 2);

  const distanceModulation = Math.pow(distance / (10 * checkpointWidth), 2);
  const cappedDistanceModulation = Math.min(1, Math.max(0, distanceModulation));
  //reduce speed to closer you get to the target but increase the more aligned
  const modulation = cappedDistanceModulation * angleModulation;
  thrust = maxThrust * modulation;

  //if speed is lower than 45, adjust according to angle
  if (thrust < slow) {
    //unless the car is pretty much aligned with the goal
    thrust = slow;
  }

  return {
    thrust: thrust.toFixed(0),
    modulation
  };
}

function dist(a, b) {
  const xDist = a.x - b.x;
  const yDist = a.y - b.y;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function getAngle(car, target) {
  const distance = dist(car, target);
  const rawAngle = (Math.asin(Math.abs(car.y - target.y) / distance) * 360) / (2 * Math.PI);
  if (car.x > target.x) {
    if (car.y > target.y) {
      return 90 + rawAngle; //2nd quadrant
    } else {
      return 180 + rawAngle; //3rd quadrant
    }
  } else {
    if (car.y >= target.y) {
      return rawAngle; //1st quadrant
    } else {
      return 270 + rawAngle; //4th quadrant
    }
  }
}
