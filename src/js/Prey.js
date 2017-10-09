import GameObject from './GameObject';

export default class Prey extends GameObject {
  constructor(context, canvas, hunter) {
    super(context, canvas);
    this.calmSpeed = 0.5;
    this.fleeSpeed = Math.round(Math.random() * 2 + 3);
    this.speed = 0;
    this.x = Math.round(Math.random() * (canvas.width - 20) + 10);
    this.y = Math.round(Math.random() * (canvas.height - 20) + 10);
    this.size = 5;
    this.color = '#00FF00';
    this.fleeRange = 100;
    this.swerveRange = 75;
    this.dead = false;
    this.turnSpeed = 0.5 * Math.PI;
    this.hunter = hunter;
  }

  fleeHunter () {
    const distance = this.getDistanceFromObject(this.hunter);
    let x, y;
    if (distance < this.fleeRange) {
      this.speed = this.fleeSpeed;
      const { deltaX, deltaY } = this.getXYDeltasFromObject(this.hunter);
      // prey will swerve when the hunter gets too close
      if (distance < this.swerveRange) {
        const angle = -0.25 * Math.PI;
        x = deltaX * Math.cos(angle) - deltaY * Math.sin(angle);
        y = deltaX * Math.sin(angle) + deltaY * Math.cos(angle);
      } else {
        x = deltaX;
        y = deltaY;
      }
    } else {
      this.speed = this.calmSpeed;
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
    }

    this.turnTowardPoint(this.x - x, this.y - y);
    this.move();
  }

  die() {
    this.dead = true;
    this.color = '#558855';
  }

  update() {
    if (!this.dead) this.fleeHunter();
  }
}