import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DemoDraggableComponent } from './draggable/demo-draggable.component';

const routes: Routes = [
    { path: 'draggable', component: DemoDraggableComponent }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class DemoDndRoutingModule { }
