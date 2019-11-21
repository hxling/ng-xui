import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { switchMap, map, takeUntil, subscribeOn } from 'rxjs/operators';

@Component({
    selector: 'demo-draggable',
    templateUrl: 'demo-draggable.component.html'
})

export class DemoDraggableComponent implements OnInit {
    @ViewChild('drag', { static: true }) target: ElementRef;
    constructor() { }

    ngOnInit() {
        this.bindDragEvent();
    }

    bindDragEvent() {
        const box = this.target.nativeElement;
        const mousedown$ = fromEvent<MouseEvent>(box, 'mousedown');
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
        const mouseup$ = fromEvent<MouseEvent>(box, 'mouseup');

        const drag$ = mousedown$.pipe(
            switchMap(
                (start) => {
                    const startClientRect = (start.target as any).getBoundingClientRect();
                    const startLeft = startClientRect.left;
                    const startTop  = startClientRect.top;
                    const startX = start.clientX + window.scrollX;
                    const startY = start.clientY + window.scrollY;
                    return mousemove$.pipe(
                        map(move => {
                            move.preventDefault();
                            return {
                                left: move.clientX - start.offsetX,
                                top: move.clientY - start.offsetY
                            };
                        }),
                        takeUntil(mouseup$));
                }));

        const position$ = drag$.pipe(
            subscribeOn(animationFrameScheduler)
        );

        position$.subscribe(pos => {
            box.style.top = `${pos.top}px`;
            box.style.left = `${pos.left}px`;
        });

        mouseup$.subscribe(e => {
            alert('drop');
        });
    }
}
