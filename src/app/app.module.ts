
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RippleModule } from '@kui/ripple';
import { CoreModule } from '@kui/core';
import { ButtonModule } from '@kui/button';
import { QuickGridModule } from '@kui/quick-grid';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoButtonComponent } from './x-button/demo-button.component';
import { DemoQuickGridComponent } from './x-quick-grid/demo-quick-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoButtonComponent,
    DemoQuickGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CoreModule.forRoot({ debug: false }),
    RippleModule,
    ButtonModule,
    QuickGridModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
