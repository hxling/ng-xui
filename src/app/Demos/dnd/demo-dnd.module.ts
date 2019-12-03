import { DndModule } from './../../../../projects/dnd/src/lib/dnd.module';
import { NgModule } from '@angular/core';
import { DemoDraggableComponent } from './draggable/demo-draggable.component';
import { DemoDndRoutingModule } from './demo-dnd.routing';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { DemoCdkDragAndDropComponent } from './cdk-dnd/demo-cdk-dnd-basic.component';

@NgModule({
    imports: [
        DemoDndRoutingModule,
        DragDropModule,
        DndModule
    ],
    exports: [],
    declarations: [
        DemoCdkDragAndDropComponent,
        DemoDraggableComponent
    ],
    providers: [],
})
export class DemoDnDModule { }
