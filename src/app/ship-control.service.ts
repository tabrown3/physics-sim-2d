import {Subject} from 'rxjs/Subject';

export class ShipControlService {
  onThrustChange = new Subject<number>();
}
