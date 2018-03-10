import {Component, OnInit} from '@angular/core';
import {DynamicBody} from '../common/dynamic-body.model';
import {Vec2d} from '../common/vec-2d.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  dynamicBody = new DynamicBody();

  constructor() {

    this.dynamicBody.position = new Vec2d(0, 0);
    this.dynamicBody.velocity = new Vec2d(0, 0);
    this.dynamicBody.angle = 0;
    this.dynamicBody.angularVelocity = 0;
    this.dynamicBody.mass = 100;
    this.dynamicBody.centerOfMass = new Vec2d(0, 0);
    this.dynamicBody.momentOfInertia = (1 / 12) * this.dynamicBody.mass * 144; // (1/12) * mass[kg] * (h^2 + w^2)[m^2]
  }

  ngOnInit() {

    const sub = this.dynamicBody.applyLocalForceAtLocalPoint(new Vec2d(1, 1), new Vec2d(0, 500));

    const timeStepMilliseconds = 50;
    const timeStepSeconds = timeStepMilliseconds / 1000;

    setInterval(() => {

      this.dynamicBody.step(timeStepSeconds);
    }, timeStepMilliseconds);
  }
}
