import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GameWindowComponent } from './game-window/game-window.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    GameWindowComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
