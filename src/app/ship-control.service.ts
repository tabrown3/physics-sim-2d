import {Subject} from 'rxjs/Subject';

export class ShipControlService {
  onThrustChange = new Subject<number>();
  onStarboardThruster = new Subject<number>();
  onPortThruster = new Subject<number>();
}
