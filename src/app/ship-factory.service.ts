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
    const shipSegment3 = new ShipSegment(new Vec2d(0, -11), 0);
    const shipSegment4 = new ShipSegment(new Vec2d(11, 0), 0);
    const shipSegment5 = new ShipSegment(new Vec2d(22, 0), 0);

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
      shipSegment2,
      shipSegment3,
      shipSegment4,
      shipSegment5
    ];

    const outShip = new SpaceShip(segments);

    const killShipFunc = outShip.dynamicBody.applyLocalForceAtLocalPoint(() => new Vec2d(0, 0), () => this._thrustVec);

    const killFunc = shipSegment3.dynamicLimb.applyLocalForceAtLocalPoint(() => new Vec2d(0, 5), () => this._portVec);

    const killFunc2 = shipSegment2.dynamicLimb.applyLocalForceAtLocalPoint(() => new Vec2d(0, -5), () => this._starboardVec);

    // setTimeout(() => {
    //
    //   killShipFunc();
    // }, 5000);

    return outShip;
  }
}
