import GameObject from '../../src/js/GameObject';

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

describe('GameObject', () => {
  let gameObject;
  beforeEach(() => {
    gameObject = new GameObject(context, canvas);
  });

  describe('Move', () => {
    test('moves the object in its current direction at its current speed', () => {
      gameObject.x = 50;
      gameObject.y = 50;
      gameObject.speed = 10;
      gameObject.direction = 0.5 * Math.PI;
      gameObject.move();
      expect(gameObject.x).toEqual(50);
      expect(gameObject.y).toEqual(60);
    });

    test('calls keepInBounds', () => {
      gameObject.keepInBounds = jest.fn();
      gameObject.move();
      expect(gameObject.keepInBounds).toHaveBeenCalled();
    });
  });

  describe('keepInBounds', () => {
    test('if the object has moved past the left of the map, it moves it to the right of the map', () => {
      gameObject.x = -11;
      gameObject.size = 10;
      gameObject.keepInBounds();
      expect(gameObject.x).toEqual(600);
    });

    test('if the object has moved past the right of the map, it moves it to the left of the map', () => {
      gameObject.x = 611;
      gameObject.size = 10;
      gameObject.keepInBounds();
      expect(gameObject.x).toEqual(0);
    });

    test('if the object has moved past the top of the map, it moves it to the bottom of the map', () => {
      gameObject.y = -11;
      gameObject.size = 10;
      gameObject.keepInBounds();
      expect(gameObject.y).toEqual(600);
    });

    test('if the object has moved past the bottom of the map, it moves it to the top of the map', () => {
      gameObject.y = 611;
      gameObject.size = 10;
      gameObject.keepInBounds();
      expect(gameObject.y).toEqual(0);
    });
  });

  describe('getXYDeltasFromObject', () => {
    test('if the shortest path between the objects does not wrap around the map, it returns the x, y deltas', () => {
      gameObject.x = 10;
      gameObject.y = 10;
      const { deltaX, deltaY } = gameObject.getXYDeltasFromObject({ x: 15, y: 17 });
      expect(deltaX).toEqual(5);
      expect(deltaY).toEqual(7);
    });

    test('if the shortest path between the objects wraps around the left of the map, it returns the x, y deltas of that path', () => {
      gameObject.x = 10;
      gameObject.y = 10;
      const { deltaX, deltaY } = gameObject.getXYDeltasFromObject({ x: 590, y: 17 });
      expect(deltaX).toEqual(-20);
      expect(deltaY).toEqual(7);
    });

    test('if the shortest path between the objects wraps around the right of the map, it returns the x, y deltas of that path', () => {
      gameObject.x = 590;
      gameObject.y = 10;
      const { deltaX, deltaY } = gameObject.getXYDeltasFromObject({ x: 10, y: 17 });
      expect(deltaX).toEqual(20);
      expect(deltaY).toEqual(7);
    });

    test('if the shortest path between the objects wraps around the top of the map, it returns the x, y deltas of that path', () => {
      gameObject.x = 10;
      gameObject.y = 10;
      const { deltaX, deltaY } = gameObject.getXYDeltasFromObject({ x: 15, y: 590 });
      expect(deltaX).toEqual(5);
      expect(deltaY).toEqual(-20);
    });

    test('if the shortest path between the objects wraps around the bottom of the map, it returns the x, y deltas of that path', () => {
      gameObject.x = 10;
      gameObject.y = 590;
      const { deltaX, deltaY } = gameObject.getXYDeltasFromObject({ x: 15, y: 10 });
      expect(deltaX).toEqual(5);
      expect(deltaY).toEqual(20);
    });
  });

  describe('getDistanceFromObject', () => {
    test('returns the distance between two objects', () => {
      gameObject.x = 50;
      gameObject.y = 50;
      expect(gameObject.getDistanceFromObject({ x: 53, y: 54 })).toEqual(5);
    });
  });

  describe('turnTowardPoint', () => {
    test('turns toward the given point', () => {
      gameObject.x = 50;
      gameObject.y = 50;
      gameObject.turnSpeed = 0.5 * Math.PI;
      gameObject.turnTowardPoint(50, 60);
      expect(gameObject.direction).toEqual(0.5 * Math.PI);
    });

    test('only turns as far as turn speed allows', () => {
      gameObject.x = 50;
      gameObject.y = 50;
      gameObject.turnSpeed = 0.5 * Math.PI;
      gameObject.turnTowardPoint(45, 60);
      expect(gameObject.direction).toEqual(0.5 * Math.PI);
    });
  });
});