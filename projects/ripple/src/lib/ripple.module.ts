import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@kui/core';
import { XRippleDirective } from './ripple.directive';

@NgModule({
  declarations: [XRippleDirective],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [XRippleDirective]
})
export class RippleModule { }
