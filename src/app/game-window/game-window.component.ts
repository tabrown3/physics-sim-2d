import {Component, OnInit} from '@angular/core';
import {DynamicBody} from '../../common/dynamic-body.model';
import {Vec2d} from '../../common/vec-2d.model';
import {ShipControlService} from '../ship-control.service';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.css']
})
export class GameWindowComponent implements OnInit {

  dynamicBody = new DynamicBody();

  // @HostListener('document:mousedown', ['$event']) mouseDown(ev: MouseEvent) {
  // }
  //
  // @HostListener('document:mouseup', ['$event']) mouseUp(ev: MouseEvent) {
  // }

  private _thrustVec = new Vec2d(0, 0);

  constructor(private shipControlService: ShipControlService) {

    this.dynamicBody.position = new Vec2d(0, 0);
    this.dynamicBody.velocity = new Vec2d(0, 0);
    this.dynamicBody.angle = 0;
    this.dynamicBody.angularVelocity = 0;
    this.dynamicBody.mass = 100;
    this.dynamicBody.centerOfMass = new Vec2d(50, 50);
    this.dynamicBody.momentOfInertia = (1 / 12) * this.dynamicBody.mass * 144; // (1/12) * mass[kg] * (h^2 + w^2)[m^2]
  }

  ngOnInit() {

    const aftPort = this.dynamicBody.applyLocalForceAtLocalPoint(() => new Vec2d(-1, -1), () => this._thrustVec);

    const aftStarboard = this.dynamicBody.applyLocalForceAtLocalPoint(() => new Vec2d(-1, 1), () => this._thrustVec);

    // setTimeout(() => {
    //
    //   aftPort.unsubscribe();
    //   aftStarboard.unsubscribe();
    // }, 3000);

    const timeStepMilliseconds = 50;
    const timeStepSeconds = timeStepMilliseconds / 1000;

    setInterval(() => {

      this.dynamicBody.step(timeStepSeconds);
    }, timeStepMilliseconds);

    this.shipControlService.onThrustChange.subscribe(thrustVal => {

      this._thrustVec = new Vec2d(thrustVal, 0);
    });
  }

}
