import {Vec2d} from './vec-2d.model';
import {Subject} from 'rxjs/Subject';
import {Forcable, ForceApplication, MovableEntity} from '../typings';

// represents a body with physical properties that can be acted upon
export class DynamicBody implements Forcable, MovableEntity {

  position: Vec2d; // [m], global
  velocity: Vec2d; // [m/s], translational, local
  mass: number; // [kg], uniformly distributed
  centerOfMass: Vec2d; // [m], local (offset from position (CoM + pos = global CoM pos)
  momentOfInertia: number; // [kg-m^2], assuming rectangle (arbitrary)
  angularVelocity: number; // [rad/s]

  private _forcesBeingAppliedArr: {pointFunc: () => Vec2d, forceVecFunc: () => Vec2d}[] = [];

  forcesBeingAppliedByLimbs: () => IterableIterator<ForceApplication>;

  // returns iterator that's a composite of forces applied directly to body and forces applied to limbs (and subsequently to body)
  get forcesBeingAppliedArr(): IterableIterator<ForceApplication> {

    return (function*() {

      // iterate over forces applied by limbs, transform them to be relative to body,
      //  then treat them as if they were being applied to the body (part of dynamicBody.forcesBeingAppliedArr)
      for (const force of this.forcesBeingAppliedByLimbs()) {

        yield this.transformRelativeToBody(force);
      }

      yield* this._forcesBeingAppliedArr;
    }).apply(this);
  }

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

  // takes limb force applications and transforms them to be applied directly to body
  private transformRelativeToBody(force: ForceApplication) {
    // limb point is relative to body position, but needs to be relative to CoM and rotated
    return {
      pointFunc: () => force.pointFunc().subtract(this.centerOfMass).rotateByAngle(this.angle),
      forceVecFunc: () => force.forceVecFunc().rotateByAngle(this.angle)
    };
  }

  // apply force by local coords, local force in Newtons
  applyLocalForceAtLocalPoint = (pointLFunc: () => Vec2d, forceVecLFunc: () => Vec2d) => {

    return this.applyForceAtPoint(
      () => pointLFunc().rotateByAngle(this.angle),
      () => forceVecLFunc().rotateByAngle(this.angle)
    );
  }

  applyForceAtPoint = (pointFunc: () => Vec2d, forceVecFunc: () => Vec2d) => {

    const forceThing = { pointFunc, forceVecFunc};

    this._forcesBeingAppliedArr.push(forceThing);

    return () => {
      this._forcesBeingAppliedArr.splice(this._forcesBeingAppliedArr.indexOf(forceThing), 1);
    };
  }

  // this is essentially the "update" call made to actually affect the body by the forces
  step = (dt: number) => {

    // iterate over all forces being applied
    for (const force of this.forcesBeingAppliedArr) {

      // calculate torque and translational force
      const forceDict = this.calculateForces(force.pointFunc(), force.forceVecFunc());
      // use torque and translational to calculate change in velocities
      const velocityDiffDict = this.calculateVelocities(forceDict.torque, forceDict.transForceVec, dt);
      // apply change in velocities to velocities
      this.modifyVelocities(velocityDiffDict.angularVelocityDiff, velocityDiffDict.velocityDiff);
    }

    const positionDiffDict = this.calculatePositions(dt);
    this.modifyPositions(positionDiffDict.angleDiff, positionDiffDict.positionDiff);
  }

  calculateForces = (radiusVec: Vec2d, forceVec: Vec2d) => {

    // torque = radius vector (perp-dot) force vector
    const torque = radiusVec.ccwPerp().dot(forceVec);

    // transForceVec = ((radiusVec dot forceVec)/norm(radiusVec)^2) * -radiusVec
    let transForceVec: Vec2d;

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
