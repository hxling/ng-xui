import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
    selector: 'demo-cdk-dnd-basic',
    templateUrl: './demo-cdk-dnd-basic.component.html',
    styles: [
        `
        .example-box {
            width: 200px;
            height: 200px;
            border: solid 1px #ccc;
            color: rgba(0, 0, 0, 0.87);
            cursor: move;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: #fff;
            border-radius: 4px;
            position: relative;
            z-index: 1;
            transition: box-shadow 200ms cubic-bezier(0, 0, 0.2, 1);
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
                        0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        0 1px 5px 0 rgba(0, 0, 0, 0.12);
          }

          .example-box:active {
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                        0 8px 10px 1px rgba(0, 0, 0, 0.14),
                        0 3px 14px 2px rgba(0, 0, 0, 0.12);
          }
        `
    ]
})
export class DemoCdkDragAndDropComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }


    onDragStarted($event: CdkDragStart) {

    }
}
