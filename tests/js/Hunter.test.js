import Hunter from '../../src/js/Hunter';
import Prey from '../../src/js/Prey';

const context = {
  beginPath: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  arc: jest.fn()
};

const canvas = {
  width: 600,
  height: 600
};

describe('Hunter', () => {
  let hunter, targets;
  beforeEach(() => {
    hunter = new Hunter(context, canvas);
    targets = [];
    targets.push(new Prey(context, canvas, hunter));
    targets.push(new Prey(context, canvas, hunter));
    targets.push(new Prey(context, canvas, hunter));
    hunter.targets = targets;
  });

  describe('findClosestTarget', () => {
    test('it sets the current target to the closest target', () => {
      targets[1].x = 50;
      targets[1].y = 50;
      hunter.x = 40;
      hunter.y = 40;
      hunter.findClosestTarget();
      expect(hunter.currentTarget).toEqual(targets[1]);
    });

    test('if there are no live targets it returns null', () => {
      targets.forEach(target => { target.dead = true });
      hunter.findClosestTarget();
      expect(hunter.currentTarget).toEqual(null);
    });
  });

  describe('chaseTarget', () => {
    test('it moves towards the target', () => {
      targets[1].x = 70;
      targets[1].y = 40;
      hunter.x = 40;
      hunter.y = 40;
      hunter.speed = 5;
      hunter.currentTarget = targets[1];
      hunter.chaseTarget();
      expect(hunter.x).toEqual(45);
      expect(hunter.y).toEqual(40);
    });

    test('if it reaches the target, the target dies', () => {
      targets[1].x = 45;
      targets[1].y = 40;
      hunter.x = 40;
      hunter.y = 40;
      hunter.speed = 5;
      hunter.currentTarget = targets[1];
      targets[1].die = jest.fn();
      hunter.chaseTarget();
      expect(targets[1].die).toHaveBeenCalled();
    });

    test('if there is no current target it does not move', () => {
      hunter.x = 40;
      hunter.y = 40;
      hunter.chaseTarget();
      expect(hunter.x).toEqual(40);
      expect(hunter.y).toEqual(40);
    });
  });

  describe('update', () => {
    test('it calls findClosestTarget', () => {
      hunter.findClosestTarget = jest.fn();
      hunter.update();
      expect(hunter.findClosestTarget).toHaveBeenCalled();
    });

    test('it calls chaseTarget', () => {
      hunter.chaseTarget = jest.fn();
      hunter.update();
      expect(hunter.chaseTarget).toHaveBeenCalled();
    });
  });
});