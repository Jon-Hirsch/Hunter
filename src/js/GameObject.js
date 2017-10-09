const twoPI = Math.PI * 2;
export default class GameObject {
  constructor(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.turnSpeed = 0;
    this.size = 0;
    this.color = '#000';
    // the angle the object is facing
    this.direction = 0;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.arc(this.x, this.y, this.size, 0, twoPI);
    this.context.fill();
    this.context.closePath();
  }

  move() {
    const dX = this.speed * Math.cos(this.direction);
    const dY = this.speed * Math.sin(this.direction);
    this.x += dX;
    this.y += dY;
    this.keepInBounds();
  }

  keepInBounds() {
    const right = this.x + this.size;
    const left = this.x - this.size;
    const top = this.y - this.size;
    const bottom = this.y + this.size;

    if (right < 0) {
      this.x = this.canvas.width;
    } else if (left > this.canvas.width) {
      this.x = 0;
    }

    if (bottom < 0) {
      this.y = this.canvas.height;
    } else if (top > this.canvas.height) {
      this.y = 0;
    }
  }

  getDistanceFromObject(obj) {
    const { deltaX, deltaY } = this.getXYDeltasFromObject(obj);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  getXYDeltasFromObject(obj) {
    let targetX = obj.x;
    let targetY = obj.y;

    // because the game treats the canvas like a sphere, the distance is calculated using the closest path.
    if (Math.abs(this.x - targetX) > this.canvas.width / 2) {
      targetX += this.x > targetX ? this.canvas.width : -1 * this.canvas.width;
    }

    if (Math.abs(this.y - targetY) > this.canvas.height / 2) {
      targetY += this.y > targetY ? this.canvas.height : -1 * this.canvas.height;
    }

    const deltaX = targetX - this.x;
    const deltaY = targetY - this.y;

    return { deltaX, deltaY };
  }

  turnTowardPoint(x, y) {
    const deltaX = x - this.x;
    const deltaY = y - this.y;
    const angle = Math.atan2(deltaY, deltaX);
    let difference = (this.direction - angle) % twoPI;

    // find the distance of the shorter turn direction
    if (Math.abs(difference) > Math.abs(this.direction - (angle - twoPI))) {
      difference = this.direction - (angle - twoPI);
    }

    if (Math.abs(difference) <= this.turnSpeed) {
      this.direction = angle;
    } else if (difference < 0) {
      this.direction += this.turnSpeed;
    } else {
      this.direction -= this.turnSpeed;
    }

    this.direction %= twoPI;
  }
}