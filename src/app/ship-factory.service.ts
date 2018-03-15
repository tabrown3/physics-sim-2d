import {SpaceShip} from '../common/space-ship.model';
import {ShipSegment} from '../common/ship-segment.model';
import {Vec2d} from '../common/vec-2d.model';
import {ShipControlService} from './ship-control.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ShipFactoryService {

  private _thrustVec = new Vec2d(0, 0);
  private _portVec = new Vec2d(0, 0);
  private _starboardVec = new Vec2d(0, 0);

  constructor(private shipControlService: ShipControlService) {

  }

  create = () => {

    const shipSegment = new ShipSegment(new Vec2d(0, 0), 0);
    const shipSegment2 = new ShipSegment(new Vec2d(0, 11), 0);

    this.shipControlService.onThrustChange.subscribe(thrustVal => {

      this._thrustVec = new Vec2d(thrustVal, 0);
    });

    this.shipControlService.onPortThruster.subscribe(thrustVal => {

      this._portVec = new Vec2d(thrustVal, 0);
    });

    this.shipControlService.onStarboardThruster.subscribe(thrustVal => {

      this._starboardVec = new Vec2d(thrustVal, 0);
    });

    const segments = [
      shipSegment,
      shipSegment2
    ];

    const outShip = new SpaceShip(segments);

    outShip.dynamicBody.applyLocalForceAtLocalPoint(() => new Vec2d(0, 0), () => this._thrustVec);

    shipSegment.dynamicLimb.applyLocalForceAtLocalPoint(() => new Vec2d(0, 0), () => this._portVec);

    shipSegment2.dynamicLimb.applyLocalForceAtLocalPoint(() => new Vec2d(0, 0), () => this._starboardVec);

    return outShip;
  }
}
