import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'x-demo-button',
    templateUrl: './demo-button.component.html',
})
export class DemoButtonComponent implements OnInit {

    btnRounded = false;
    btnOutline = false;
    btnSize = '';
    chkDisabled = false;
    chkripple = true;
  
    showType = 0;

    constructor() { }

    ngOnInit(): void { }
}
