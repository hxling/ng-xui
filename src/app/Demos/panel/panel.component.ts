import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'demo-panel',
    templateUrl: './panel.component.html'
})
export class DemoPanelComponent implements OnInit {
    @Input() title = 'Example';
    @Input() note = '';
    constructor() { }

    ngOnInit(): void { }
}
