import {DynamicBody} from './dynamic-body.model';
import {Vec2d} from './vec-2d.model';
import {DynamicLimb} from './dynamic-limb.model';

export class ShipSegment {

  dynamicLimb = new DynamicLimb();
  width = 11;
  height = 11;
  shape = 'square';

  constructor(position: Vec2d, angle: number) {

    this.dynamicLimb.position = position; // relative to ship position
    this.dynamicLimb.angle = angle;
    this.dynamicLimb.mass = 100;
    this.dynamicLimb.centerOfMass = new Vec2d(5, 5); // module is 11 x 11
    this.dynamicLimb.momentOfInertia = (1 / 12) * this.dynamicLimb.mass * 144; // (1/12) * mass[kg] * (h^2 + w^2)[m^2]
  }
}
