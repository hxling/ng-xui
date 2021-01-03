import { ILogService } from './ILog.service';
import { Inject, Injectable } from '@angular/core';
import { OPEN_DEBUG_MODE } from '../x-tokens';

@Injectable({
    providedIn: 'root'
})
export class LogService implements ILogService {
    constructor(@Inject(OPEN_DEBUG_MODE) private debug: boolean ) {

    }

    log() {
        if(this.debug && console && console.log) {
            console.log.apply(console, arguments);
        }
    }
}