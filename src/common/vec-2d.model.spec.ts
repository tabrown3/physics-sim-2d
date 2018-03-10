import {Vec2d} from './vec-2d.model';

describe('Vec2d class', () => {

  beforeEach(() => {
  });

  describe('fromAngle method', () => {

    it('should create a new vector from an input angle in radians', () => {

      // 0 radians; 0 degrees
      const vecFromAngle = Vec2d.fromAngle(0);
      expect(vecFromAngle.x).toBeCloseTo(1);
      expect(vecFromAngle.y).toBeCloseTo(0);

      // pi/2 radians; 90 degrees
      const vecFromAngle2 = Vec2d.fromAngle(Math.PI / 2);
      expect(vecFromAngle2.x).toBeCloseTo(0);
      expect(vecFromAngle2.y).toBeCloseTo(1);

      // 2*pi/3 radians; 120 degrees
      const vecFromAngle3 = Vec2d.fromAngle(2 * Math.PI / 3);
      expect(vecFromAngle3.x).toBeCloseTo(-1 / 2);
      expect(vecFromAngle3.y).toBeCloseTo(Math.sqrt(3) / 2);

      // 5*pi/4 radians; 225 degrees
      const vecFromAngle4 = Vec2d.fromAngle(5 * Math.PI / 4);
      expect(vecFromAngle4.x).toBeCloseTo(-Math.sqrt(2) / 2);
      expect(vecFromAngle4.y).toBeCloseTo(-Math.sqrt(2) / 2);
    });
  });

  describe('x and y set/get', () => {

    it('should allow x and y to be set and get', () => {

      const vec = new Vec2d(3, 3);
      expect(vec.x).toBe(3);
      expect(vec.y).toBe(3);

      vec.x = 4;
      vec.y = 4;
      expect(vec.x).toBe(4);
      expect(vec.y).toBe(4);
    });
  });

  describe('norm property', () => {

    it('should return magnitude of vector lazily', () => {

      const vec = new Vec2d(3, 4);
      expect((<any>vec).needNormUpdate).toBeTruthy();
      expect(vec.norm).toBeCloseTo(5);
      expect((<any>vec).needNormUpdate).toBeFalsy();

      vec.x = 1;
      vec.y = 1;
      expect((<any>vec).needNormUpdate).toBeTruthy();
      expect(vec.norm).toBeCloseTo(Math.sqrt(2));
      expect((<any>vec).needNormUpdate).toBeFalsy();
    });
  });

  describe('angle property', () => {

    it('should return angle of vector lazily', () => {

      const vec = new Vec2d(3, 3);
      expect((<any>vec).needAngleUpdate).toBeTruthy();
      expect(vec.angle).toBeCloseTo(Math.PI / 4);
      expect((<any>vec).needAngleUpdate).toBeFalsy();

      vec.x = -1;
      vec.y = 1;
      expect((<any>vec).needAngleUpdate).toBeTruthy();
      expect(vec.angle).toBeCloseTo(3 * Math.PI / 4);
      expect((<any>vec).needAngleUpdate).toBeFalsy();

      vec.x = -1;
      vec.y = -1;
      expect((<any>vec).needAngleUpdate).toBeTruthy();
      expect(vec.angle).toBeCloseTo(-3 * Math.PI / 4);
      expect((<any>vec).needAngleUpdate).toBeFalsy();

      vec.x = 1;
      vec.y = -1;
      expect((<any>vec).needAngleUpdate).toBeTruthy();
      expect(vec.angle).toBeCloseTo(-Math.PI / 4);
      expect((<any>vec).needAngleUpdate).toBeFalsy();
    });
  });

  describe('add method', () => {

    it('should add components of first to second and return new vector', () => {

      const vec = new Vec2d(3, 3);
      const summedVec = vec.add(new Vec2d(3, 3));
      expect(summedVec.x).toBe(6);
      expect(summedVec.y).toBe(6);
    });
  });

  describe('subtract method', () => {

    it('should subtract components of first from second and return new vector', () => {

      const vec = new Vec2d(3, 3);
      const summedVec = vec.subtract(new Vec2d(3, 3));
      expect(summedVec.x).toBe(0);
      expect(summedVec.y).toBe(0);
    });
  });

  describe('cwPerp method', () => {

    it('should return a vector perpendicular in the clockwise direction', () => {

      const vec = new Vec2d(2, 2);
      expect(vec.angle).toBeCloseTo(Math.PI / 4);
      const perpVec = vec.cwPerp();
      expect(perpVec.x).toBe(2);
      expect(perpVec.y).toBe(-2);
      expect(perpVec.angle).toBeCloseTo(-Math.PI / 4);
    });
  });

  describe('ccwPerp method', () => {

    it('should return a vector perpendicular in the clockwise direction', () => {

      const vec = new Vec2d(2, 2);
      expect(vec.angle).toBeCloseTo(Math.PI / 4);
      const perpVec = vec.ccwPerp();
      expect(perpVec.x).toBe(-2);
      expect(perpVec.y).toBe(2);
      expect(perpVec.angle).toBeCloseTo(3 * Math.PI / 4);
    });
  });
});
