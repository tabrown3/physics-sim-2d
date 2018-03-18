import {Forcable, ForceApplication, PhysicalEntity} from '../typings';
import {Vec2d} from './vec-2d.model';

export class DynamicLimb implements Forcable, PhysicalEntity {
  position: Vec2d; // relative to body position and orientation, so (1, 1) would be one down its 'right' vector and one down its 'forward'
  angle: number;
  mass: number;
  momentOfInertia: number;
  centerOfMass: Vec2d;

  _forcesBeingAppliedArr: ForceApplication[] = [];

  get forcesBeingAppliedArr(): IterableIterator<{pointFunc: () => Vec2d, forceVecFunc: () => Vec2d}> {

    return (function* () {

      yield* this._forcesBeingAppliedArr;
    }).apply(this);
  }

  applyLocalForceAtLocalPoint = (pointLFunc: () => Vec2d, forceVecLFunc: () => Vec2d) => {

    return this.applyForceAtPoint(
      () => pointLFunc().rotateByAngle(this.angle),
      () => forceVecLFunc().rotateByAngleWithOffset(this.angle, pointLFunc())
    );
  }

  // applyForceAtPoint essentially forwards the force info to listeners
  private applyForceAtPoint = (pointFunc: () => Vec2d, forceVecFunc: () => Vec2d) => {

    const forceThing = {
      // force is applied relative to CoM but we really want it relative to ship, which pos is relative to
      //  and because CoM is relative to pos already, we just add in CoM and pos
      pointFunc: () => pointFunc().add(this.centerOfMass).add(this.position),
      forceVecFunc: () => forceVecFunc()
    };

    this._forcesBeingAppliedArr.push(forceThing);

    return () => {
      this._forcesBeingAppliedArr.splice(this._forcesBeingAppliedArr.indexOf(forceThing), 1);
    };
  }
}
