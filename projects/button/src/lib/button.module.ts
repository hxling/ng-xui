import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RippleModule } from '@kui/ripple';
import { ButtonComponent } from './button.component';



@NgModule({
  declarations: [ButtonComponent],
  imports: [
    CommonModule,
    RippleModule
  ],
  exports: [ButtonComponent]
})
export class ButtonModule { }
