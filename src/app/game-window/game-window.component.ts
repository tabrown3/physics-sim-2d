import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SpaceShip} from '../../common/space-ship.model';
import {ShipFactoryService} from '../ship-factory.service';
import {Vec2d} from '../../common/vec-2d.model';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.css']
})
export class GameWindowComponent implements OnInit, AfterViewInit {

  ship: SpaceShip;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(private shipFactoryService: ShipFactoryService) {

  }

  ngOnInit() {

    this.ship = this.shipFactoryService.create();

    const timeStepMilliseconds = 50;
    const timeStepSeconds = timeStepMilliseconds / 1000;

    setInterval(() => {

       this.ship.dynamicBody.step(timeStepSeconds);
    }, timeStepMilliseconds);
  }

  ngAfterViewInit() {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    setInterval(() => {

      this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);

      // this.context.save();
      this.context.fillStyle = 'red';
      this.context.strokeStyle = 'orange';

      for (const segment of this.ship.drawShip()) {
        this.context.save();
        this.context.translate(segment.x, segment.y);
        this.context.rotate(this.ship.dynamicBody.angle);
        this.context.fillRect(0, 0, 11, 11);
        this.context.fillStyle = 'black';
        this.context.fillRect(1, 1, 9, 9);
        this.context.restore();
      }

      for (const bob of this.ship.dynamicBody.forcesBeingAppliedArr) {

        const point = bob.pointFunc();
        const forceVec = bob.forceVecFunc();
        const gPoint = point.add(this.ship.dynamicBody.centerOfMass).add(this.ship.dynamicBody.position);
        const gForce = gPoint.subtract(forceVec);

        this.context.save();
        this.context.beginPath();
        this.context.moveTo(gPoint.x, gPoint.y);
        this.context.lineTo(gForce.x, gForce.y);
        this.context.stroke();
        this.context.restore();
      }

      // this.context.restore();

    }, 50);
  }
}
