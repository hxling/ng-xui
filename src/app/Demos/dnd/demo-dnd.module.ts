import { NgModule } from '@angular/core';
import { DemoDraggableComponent } from './draggable/demo-draggable.component';
import { DemoDndRoutingModule } from './demo-dnd.routing';


@NgModule({
    imports: [
        DemoDndRoutingModule
    ],
    exports: [],
    declarations: [
        DemoDraggableComponent
    ],
    providers: [],
})
export class DemoDnDModule { }
