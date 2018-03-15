import {Component, OnInit} from '@angular/core';
import {ShipControlService} from './ship-control.service';
import {ShipFactoryService} from './ship-factory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ShipControlService, ShipFactoryService]
})
export class AppComponent implements OnInit {

  // @HostListener('document:mousedown', ['$event']) mouseDown(ev: MouseEvent) {
  // }
  //
  // @HostListener('document:mouseup', ['$event']) mouseUp(ev: MouseEvent) {
  // }

  ngOnInit() {
  }
}
