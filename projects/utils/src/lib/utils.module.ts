import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateTimeHelperService } from './datetime/datetime-helper.service';
import { NumberHelperService } from './number/numer-helper.service';
import { DataFormatService } from './formatter/data-format.service';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: []
})
export class NgXuiUtilsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgXuiUtilsModule,
      providers: [
        DateTimeHelperService,
        NumberHelperService,
        DataFormatService
      ]
    }
  }
}
