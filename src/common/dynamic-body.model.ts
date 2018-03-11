import {Vec2d} from './vec-2d.model';
import {Subject} from 'rxjs/Subject';

// represents a body with physical properties that can be acted upon
export class DynamicBody {

  position: Vec2d; // [m], global
  velocity: Vec2d; // [m/s], translational, local
  mass: number; // [kg], uniformly distributed
  centerOfMass: Vec2d; // [m], local (offset from position (CoM + pos = global CoM pos)
  momentOfInertia: number; // [kg-m^2], assuming rectangle (arbitrary)
  angularVelocity: number; // [rad/s]
  forceApplications = new Subject<number>();

  _angle: number; // [rad], right is 0, increases clockwise
  _forward: Vec2d;
  _right: Vec2d;

  get angle() {

    return this._angle;
  }

  set angle(angle: number) {

    this._angle = angle;
    this._forward = Vec2d.fromAngle(angle);
    this._right = this._forward.cwPerp();
  }

  get forward() {

    return this._forward;
  }

  get right() {

    return this._right;
  }

  // apply force by local coords, local force in Newtons
  applyLocalForceAtLocalPoint = (pointLFunc: () => Vec2d, forceVecLFunc: () => Vec2d) => {

    // const forceVec = forceVecL.copy();
    // const point = pointL.copy();

    return this.applyForceAtPoint(
      () => pointLFunc().rotateByAngle(this.angle),
      () => forceVecLFunc().rotateByAngleWithOffset(this.angle, pointLFunc())
    );
  }

  applyForceAtPoint = (pointFunc: () => Vec2d, forceVecFunc: () => Vec2d) => {

    return this.forceApplications.subscribe(dt => {

      const forceDict = this.calculateForces(pointFunc(), forceVecFunc());

      const velocityDiffDict = this.calculateVelocities(forceDict.torque, forceDict.transForceVec, dt);
      this.modifyVelocities(velocityDiffDict.angularVelocityDiff, velocityDiffDict.velocityDiff);
    });
  }

  // this is essentially the "update" call made to actually add the forces to the body
  step = (dt: number) => {

    this.forceApplications.next(dt);
    const positionDiffDict = this.calculatePositions(dt);
    this.modifyPositions(positionDiffDict.angleDiff, positionDiffDict.positionDiff);
  }

  calculateForces = (radiusVec: Vec2d, forceVec: Vec2d) => {

    // torque = radius vector (perp-dot) force vector
    const torque = radiusVec.ccwPerp().dot(forceVec);

    // transForceVec = ((radiusVec dot forceVec)/norm(radiusVec)^2) * -radiusVec
    let transForceVec;

    if (radiusVec.x === 0 && radiusVec.y === 0) { // pointing straight at CoM; all force is translational
      transForceVec = forceVec;
    }
    else {
      transForceVec = radiusVec.scalarMult(radiusVec.dot(forceVec) / radiusVec.dot(radiusVec));
    }

    return {
      torque,
      transForceVec
    };
  }

  calculateVelocities = (torque: number, transForceVec: Vec2d, dt: number) => {

    const angularVelocityDiff = (torque / this.momentOfInertia) * dt;

    // multiplying force by dt gives "infinitesimal" portion of momentum
    //  which is then divided by mass to give "infinitesimal" portion of velocity
    const velocityDiff = transForceVec.scalarMult(dt / this.mass);
    //  which is then added up (on top of existing velocity) to give a sort of integration

    return {
      angularVelocityDiff,
      velocityDiff
    };
  }

  calculatePositions = (dt) => {

    const angleDiff = this.angularVelocity * dt;
    const positionDiff = this.velocity.scalarMult(dt);

    return {
      angleDiff,
      positionDiff
    };
  }

  modifyVelocities = (angularVelocityDiff: number, velocityDiff: Vec2d) => {

    this.angularVelocity += angularVelocityDiff;
    this.velocity = this.velocity.add(velocityDiff);
  }

  modifyPositions = (angleDiff: number, positionDiff: Vec2d) => {

    this.angle += angleDiff;
    this.position = this.position.add(positionDiff);
  }
}
