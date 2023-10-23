import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GoodsItemComponent } from './goods-item/goods-item.component';
import { CargoAgentComponent } from './cargo-agent/cargo-agent.component';

@NgModule({
  declarations: [
    AppComponent,
    GoodsItemComponent,
    CargoAgentComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
