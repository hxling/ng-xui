import { AppService } from './../../app.service';
import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'page-header',
    templateUrl: './page-header.component.html'
})
export class PageHeaderComponent implements OnInit {
    constructor(public appService: AppService, private render: Renderer2) { }

    ngOnInit(): void { }

    toggleNav() {
        this.appService.onToggleNav();
        if (!this.appService.appState.showNav) {
            this.render.addClass(document.body, 'nav-function-hidden');
        } else {
            this.render.removeClass(document.body, 'nav-function-hidden');
        }
    }
}
