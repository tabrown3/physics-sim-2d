export class Vec2d {

  private _x: number;
  private _y: number;
  private _norm: number;
  private _angle: number;

  private needNormUpdate = true;
  private needAngleUpdate = true;

  static fromAngle(inAngle: number) {

    return new Vec2d(Math.cos(inAngle), Math.sin(inAngle));
  }

  private needSavedValueUpdate() {
    this.needNormUpdate = true;
    this.needAngleUpdate = true;
  }

  constructor(x: number, y: number) {

    this.x = x;
    this.y = y;
  }

  get x() {
    return this._x;
  }

  set x(x: number) {

    if (x !== this._x) {
      this._x = x;
      this.needSavedValueUpdate();
    }
  }

  get y() {
    return this._y;
  }

  set y(y: number) {

    if (y !== this._y) {
      this._y = y;
      this.needSavedValueUpdate();
    }
  }

  get norm() {

    if (this.needNormUpdate) {
      this._norm = Math.sqrt(this._x * this._x + this._y * this._y);
      this.needNormUpdate = false;
    }

    return this._norm;
  }

  get angle() {

    if (this.needAngleUpdate) {
      this._angle = Math.atan2(this.y, this.x);
      this.needAngleUpdate = false;
    }

    return this._angle;
  }

  add = (inVec: Vec2d) => {

    return new Vec2d(this.x + inVec.x, this.y + inVec.y);
  }

  subtract = (inVec: Vec2d) => {

    return new Vec2d(this.x - inVec.x, this.y - inVec.y);
  }

  // clockwise perpendicular vector
  cwPerp = () => {

    return new Vec2d(this.y, -this.x);
  }

  // counter-clockwise perpendicular vector
  ccwPerp = () => {

    return new Vec2d(-this.y, this.x);
  }

  toGlobal = (refVec: Vec2d) => {

    return this.add(refVec);
  }

  toLocal = (refVec: Vec2d) => {

    return refVec.subtract(this);
  }

  dot = (inVec) => {

    return this.x * inVec.x + this.y * inVec.y;
  }

  normalize = () => {

    if (this.norm === 1) {
      return this.copy();
    }
    else {
      return this.scalarDiv(this.norm);
    }
  }

  copy = () => {

    return new Vec2d(this.x, this.y);
  }

  scalarMult = (inScalar: number) => {

    return new Vec2d(this.x * inScalar, this.y * inScalar);
  }

  scalarDiv = (inScalar: number) => {

    return new Vec2d(this.x / inScalar, this.y / inScalar);
  }

  // rotates vector about origin
  rotateByAngle = (angle: number) => {

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    return new Vec2d(this.x * cosAngle + this.y * sinAngle, -this.x * sinAngle + this.y * cosAngle);
  }

  // rotates angle about origin at an offset
  rotateByAngleWithOffset = (angle: number, offsetVec: Vec2d) => {

    return this.subtract(offsetVec).rotateByAngle(angle).add(offsetVec);
  }
}
