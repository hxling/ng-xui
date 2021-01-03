import { ILogService } from './../services/ILog.service';
import { Injector, NgZone, OnInit, Renderer2, Directive } from '@angular/core';
import { LOG_PROVIDER } from '../x-tokens';

@Directive({
    selector: 'x-base-component',
})
export class XBaseComponent implements OnInit {
    render: Renderer2;
    ngZone: NgZone;
    logService: ILogService;
    constructor(public inject: Injector){
        this.render = this.inject.get(Renderer2);
        this.ngZone = this.inject.get(NgZone);
        this.logService = this.inject.get(LOG_PROVIDER);
    }

    ngOnInit(): void { }
}
