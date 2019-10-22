import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    appState = {
        showNav: true
    };

    private toggleNav = new Subject();
    public toggleNav$ = this.toggleNav.asObservable();

    onToggleNav() {
        this.appState = { showNav: !this.appState.showNav };
        this.toggleNav.next(this.appState);
    }

}
