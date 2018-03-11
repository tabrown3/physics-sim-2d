import { Component, OnInit } from '@angular/core';
import {ShipControlService} from '../ship-control.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  constructor(private shipControlService: ShipControlService) { }

  ngOnInit() {
  }

  sliderChange(thrustVal: number) {

    this.shipControlService.onThrustChange.next(thrustVal);
  }

}
