import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DemoDraggableComponent } from './draggable/demo-draggable.component';
import { DemoCdkDragAndDropComponent } from './cdk-dnd/demo-cdk-dnd-basic.component';

const routes: Routes = [
    { path: 'draggable', component: DemoDraggableComponent },
    { path: 'cdk-dnd-basic', component: DemoCdkDragAndDropComponent }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class DemoDndRoutingModule { }
