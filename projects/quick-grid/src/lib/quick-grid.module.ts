import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuickGridBodyComponent, QuickGridHeaderComponent } from './components';
import { QuickGridComponent } from './quick-grid.component';



@NgModule({
  declarations: [
    QuickGridHeaderComponent,
    QuickGridBodyComponent,
    QuickGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [QuickGridComponent]
})
export class QuickGridModule { }
