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
                    const startLeft = box.offsetLeft;
                    const startTop = box.offsetTop;
                    const startX = start.clientX;
                    const startY = start.clientY;
                    return mousemove$.pipe(
                        map(move => {
                            move.preventDefault();
                            return {
                                left: move.clientX - startX + startLeft,
                                top: move.clientY - startY + startTop
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
            console.log(e);
        });
    }

    getDropableAreas = (event) => {
        let dropableAreas = document.querySelectorAll('.dropArea'); //needs a fresh DOM version

        dropableAreas.filter = [].filter;
        return dropableAreas.filter((dropableArea) =>
            (event.pageY >= dropableArea.offsetTop && event.pageY <= dropableArea.offsetTop + dropableArea.offsetHeight) //in drop area from top
            && (event.pageX >= dropableArea.offsetLeft && event.pageX <= dropableArea.offsetLeft + dropableArea.offsetWidth)
        );
    }

    animateGoBack = (draggable) => {
        draggable.className += ' animateDraggableReturn';

        draggable.style.top = draggable.parentNode.offsetTop;
        draggable.style.left = draggable.parentNode.offsetLeft;
        setTimeout(() => {
            draggable.remove();
        }, 350);
    }

    generateDropedArea = (event, draggable, dropAreas) => {
        let newDropArea = document.createElement('div'),
            dropArea = dropAreas[dropAreas.length - 1]; //fully nested
        //dropArea = dropAreas[0];  //2 level nesting

        newDropArea.innerHTML = draggable.innerHTML
        newDropArea.className = 'droped dropArea';
        if (dropAreas.length > 1) {
            // dropArea = dropAreas[1] //2 level nesting
            newDropArea.className = 'droped sub dropArea';
        }

        dropArea.appendChild(newDropArea);
        draggable.remove();
    }

    dragElement = (draggable, event) => {
        draggable.style.boxShadow = "1px 2px 1px 0.5px #000"
        draggable.style.top = event.pageY - draggable.offsetHeight / 2;
        draggable.style.left = event.pageX - draggable.offsetWidth / 2;
    }

    generateNewDraggable = (event) => {
        let newElement,
            activeDraggables = document.querySelectorAll('.active') || []; //needs a fresh DOM version due to multiple click

        activeDraggables.forEach = [].forEach;

        activeDraggables.forEach(e => e.remove());
        newElement = event.target.cloneNode(true);
        event.target.className = 'draggable active'
        event.target.style.position = 'absolute';
        event.target.parentNode.appendChild(newElement);
    }

    handleDropabble = (event, draggable) => {
        let dropAreas = this.getDropableAreas(event);

        dropAreas.length >= 1 ?
            this.generateDropedArea(event, draggable, dropAreas) :
            this.animateGoBack(draggable);
    }

}
