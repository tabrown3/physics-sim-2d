import {Forcable, PhysicalEntity} from '../typings';
import {Vec2d} from './vec-2d.model';
import {Subject} from 'rxjs/Subject';

export class DynamicLimb implements Forcable, PhysicalEntity {
  position: Vec2d;
  angle: number;
  mass: number;
  momentOfInertia: number;
  centerOfMass: Vec2d;

  forceApplications = new Subject<number>(); // apply a force toward this limb
  // for those interested in knowing what forces are being applied
  forcesBeingApplied = new Subject<{pointFunc: () => Vec2d, forceVecFunc: () => Vec2d}>();
  forcesBeingAppliedArr: {pointFunc: () => Vec2d, forceVecFunc: () => Vec2d}[] = [];

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

    this.forcesBeingAppliedArr.push(forceThing);

    this.forcesBeingApplied.next(forceThing);

    return null;
  }
}
