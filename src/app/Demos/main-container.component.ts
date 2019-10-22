import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'main-container',
    templateUrl: './main-container.component.html'
})
export class MainContainerComponent implements OnInit {

    @Input() subtitle = '';
    @Input() note = '';

    constructor() { }

    ngOnInit(): void { }
}
