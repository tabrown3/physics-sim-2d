import {DynamicBody} from './dynamic-body.model';
import {ShipSegment} from './ship-segment.model';
import {Vec2d} from './vec-2d.model';

export class SpaceShip {

  dynamicBody = new DynamicBody();

  constructor(public segments: ShipSegment[]) {

    const massValues = this.calculateMassValues(segments);
    this.dynamicBody.mass = massValues.totalMass;
    this.dynamicBody.centerOfMass = massValues.centerOfMass;
    this.dynamicBody.momentOfInertia = this.calculateMomentOfInertia(massValues.centerOfMass, segments);
    this.subscribeToForces(segments);

    this.dynamicBody.velocity = new Vec2d(0, 0);
    this.dynamicBody.angularVelocity = 0;

    // WHAT SHOULD THIS BE?!?!
    this.dynamicBody.position = new Vec2d(100, 100);
    this.dynamicBody.angle = 0;
  }

  private calculateMassValues = (segments: ShipSegment[]): { totalMass: number, centerOfMass: Vec2d } => {

    let totalMass = 0,
        totalX = 0,
        totalY = 0;

    for (const segment of segments) {

      const segMass = segment.dynamicLimb.mass;

      totalMass += segMass;
      totalX += (segment.dynamicLimb.position.x + segment.dynamicLimb.centerOfMass.x) * segMass;
      totalY += (segment.dynamicLimb.position.y + segment.dynamicLimb.centerOfMass.y) * segMass;
    }

    return {
      totalMass,
      centerOfMass: new Vec2d(totalX, totalY).scalarDiv(totalMass)
    };
  }

  private calculateMomentOfInertia = (centerOfMass: Vec2d, segments: ShipSegment[]) => {

    let momentOfInertia = 0;

    for (const segment of segments) {

      const radius = this.dynamicBody.centerOfMass.subtract(centerOfMass); // radius from segment CoM to ship CoM (the new axis)

      // MoI about CoM is sum of ((r^2 * m) + (original MoI)) for each point
      momentOfInertia += radius.dot(radius) * segment.dynamicLimb.mass + segment.dynamicLimb.momentOfInertia;
    }

    return momentOfInertia;
  }

  private subscribeToForces = (segments: ShipSegment[]) => {

    this.dynamicBody.forcesBeingAppliedByLimbs = function* () {

      for (const segment of segments) {

        for (const force of segment.dynamicLimb.forcesBeingAppliedArr) {

          yield {
            pointFunc: () => force.pointFunc(),
            forceVecFunc: () => force.forceVecFunc()
          };
        }
      }
    };
  }

  drawShip = () => {

    const segmentPositions = this.segments.map(
      u => u.dynamicLimb.position
        .rotateByAngleWithOffset(this.dynamicBody.angle, this.dynamicBody.centerOfMass)
        .add(this.dynamicBody.position)
    );

    return segmentPositions;
  }
}
