import GameObject from './GameObject';

export default class Hunter extends GameObject {
  constructor(context, canvas) {
    super(context, canvas);
    this.speed = Math.round(Math.random() * 2 + 6);
    this.turnSpeed = 0.025 * Math.PI;
    this.x = 20;
    this.y = 200;
    this.size = 8;
    this.color = '#FF0000';
    this.targets = [];
    this.currentTarget = null;
  }

  findClosestTarget () {
    const liveTargets = this.targets.filter(target => !target.dead);
    this.currentTarget = !liveTargets.length ? null
      : liveTargets.reduce((closestTarget, nextTarget) => {
        const currentDistance = this.getDistanceFromObject(closestTarget);
        const nextDistance = this.getDistanceFromObject(nextTarget);
        return currentDistance > nextDistance ? nextTarget : closestTarget;
      });
  }

  chaseTarget() {
    if (!this.currentTarget) return;

    const distance = this.getDistanceFromObject(this.currentTarget);
    if (distance - this.speed < (this.size) + (this.currentTarget.size)) {
      this.currentTarget.die();
    }

    const { deltaX, deltaY } = this.getXYDeltasFromObject(this.currentTarget);
    this.turnTowardPoint(this.x + deltaX, this.y + deltaY);
    this.move();
  }

  update() {
    this.findClosestTarget();
    this.chaseTarget();
  }
}