import { LogService } from './services/log.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LOG_PROVIDER, OPEN_DEBUG_MODE } from './x-tokens';
import { XBaseComponent } from './base-component/base-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    XBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    XBaseComponent
  ]
})
export class CoreModule {
  static forRoot(opts?: any): ModuleWithProviders<CoreModule>{
    return {
      ngModule: CoreModule,
      providers: [
        { provide: OPEN_DEBUG_MODE, useValue: opts? !!opts.debug : false },
        { provide: LOG_PROVIDER, useClass: opts && opts.logger ? opts.logger : LogService}
      ]
    };
  }
}
