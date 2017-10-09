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

describe('Prey', () => {
  let hunter, prey;
  beforeEach(() => {
    hunter = new Hunter(context, canvas);
    prey = new Prey(context, canvas, hunter);
  });

  describe('fleeHunter', () => {
    describe('when the hunter is in fleeRange', () => {
      beforeEach(() => {
        prey.x = 500;
        prey.y = 400;
        hunter.x = 420;
        hunter.y = 400;
        prey.fleeSpeed = 10;
        prey.turnTowardPoint = jest.fn();
        prey.move = jest.fn();
      });

      test('it sets the speed to fleeSpeed', () => {
        prey.fleeHunter();
        expect(prey.speed).toEqual(10);
      });

      test('it turns in the opposite direction from the hunter and moves', () => {
        prey.fleeHunter();
        expect(prey.turnTowardPoint).toHaveBeenCalledWith(580, 400);
        expect(prey.move).toHaveBeenCalled();
      });

      test('if the hunter is in swerve range it turns away from the hunter at a 45 degree angle', () => {
        hunter.x = 490;
        prey.turnTowardPoint = jest.fn();
        prey.fleeHunter();
        expect(prey.turnTowardPoint).toHaveBeenCalledWith(507.0710678118655, 392.9289321881345);
      });
    });

    describe('when the hunter is not in flee range', () => {
      beforeEach(() => {
        prey.x = 500;
        prey.y = 400;
        hunter.x = 320;
        hunter.y = 400;

        prey.calmSpeed = 5;
        prey.turnTowardPoint = jest.fn();
        prey.move = jest.fn();
      });

      test('it sets the speed to calmSpeed', () => {
        prey.fleeHunter();
        expect(prey.speed).toEqual(5);
      });

      test('it moves in a random direction', () => {
        Math.random = () => 1;
        prey.fleeHunter();
        expect(prey.turnTowardPoint).toHaveBeenCalledWith(499, 399);
        expect(prey.move).toHaveBeenCalled();
      });
    });
  });

  describe('die', () => {
    test('it sets dead to true', () => {
      prey.die();
      expect(prey.dead).toEqual(true);
    });

    test('it sets the color to #558855', () => {
      prey.die();
      expect(prey.color).toEqual('#558855');
    });
  });

  describe('update', () => {
    test('if it is alive it calls fleeHunter', () => {
      prey.fleeHunter = jest.fn();
      prey.update();
      expect(prey.fleeHunter).toHaveBeenCalled();
    });

    test('if it is dead it does not call fleeHunter', () => {
      prey.fleeHunter = jest.fn();
      prey.dead = true;
      prey.update();
      expect(prey.fleeHunter).not.toHaveBeenCalled();
    });
  });
});