import { Component, OnInit, ViewChild, ElementRef, Renderer2, NgZone } from '@angular/core';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { switchMap, map, takeUntil, subscribeOn } from 'rxjs/operators';



export function getDirectChildElement( parentElement:Element, childElement:Element ):Element | null {

    let directChild:Node = childElement;
  
    while( directChild.parentNode !== parentElement ) {
  
      // reached root node without finding given parent
      if( !directChild.parentNode ) {
  
        return null;
      }
  
      directChild = directChild.parentNode;
    }
  
    return directChild as Element;
  }


@Component({
    selector: 'demo-draggable',
    templateUrl: 'demo-draggable.component.html',
    styles: [
        `
        .dropover {
            border: 1px solid red;
            background-color: #fecc26;
            opacity: 0.2;
        }
        `
    ]
})

export class DemoDraggableComponent implements OnInit {
    @ViewChild('drag', { static: true }) target: ElementRef;
    @ViewChild('drop', { static: true }) dropArea: ElementRef;

    proxy: any;
    dropEntered = false;
    constructor(private render: Renderer2, private el: ElementRef, private ngZone: NgZone) { }

    ngOnInit() {

        this.ngZone.runOutsideAngular(() => {
            this.el.nativeElement.querySelectorAll('li').forEach(n => {
                this.render.listen(n, 'mouseover', (e) => {
                    this.render.insertBefore(e.target.parentElement, e.target.cloneNode(true), getDirectChildElement(e.target.parent, e.target) );
                });
            });
        });
    }

    onDrop($event) {

    }

    bindDragEvent() {
        const box = this.target.nativeElement;

        // before drag
        const mousedown$ = fromEvent<MouseEvent>(box, 'mousedown');
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
        const mouseup$ = fromEvent(document, 'mouseup');

        const drag$ = mousedown$.pipe(
            switchMap(
                (start) => {
                    const startLeft = box.offsetLeft;
                    const startTop = box.offsetTop;
                    const startX = start.clientX;
                    const startY = start.clientY;
                    box.style.cursor = 'move';
                    start['dragData'] = '附加数据';
                    this.createProxyElement();
                    console.log('dragStart');
                    return mousemove$.pipe(
                        map(move => {
                            move.preventDefault();
                            this.dragMove(move);
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

            // box.style.top = `${pos.top}px`;
            // box.style.left = `${pos.left}px`;
            this.proxy.style.top = `${pos.top}px`;
            this.proxy.style.left = `${pos.left}px`;
        });

        mouseup$.subscribe(e => {
            this.onDragEnd(e);
        });
    }

    private createProxyElement() {
        this.proxy = this.target.nativeElement.cloneNode(true);
        this.proxy.style.position = 'absolute';
        this.proxy.style.top = '0px';
        this.proxy.style.opacity = 0.5;
        this.proxy.style.left = '-1000px';
        // this.proxy.style.cursor = 'move';
        this.target.nativeElement.parentElement.append(this.proxy);

    }

    private isInDroparea(event: MouseEvent) {
        const dropableArea = this.dropArea.nativeElement;
        const dropAreaRect = dropableArea.getBoundingClientRect();
        const dropAreaX = dropAreaRect.x;
        const dropAreaY = dropAreaRect.y;
        // const isin =  (event.pageY >= dropableArea.offsetTop && event.pageY <= dropableArea.offsetTop + dropableArea.offsetHeight) // in drop area from top
        // && (event.pageX >= dropableArea.offsetLeft && event.pageX <= dropableArea.offsetLeft + dropableArea.offsetWidth);
        const isin =  (event.pageY >= dropAreaY && event.pageY <= dropAreaY + dropableArea.offsetHeight) // in drop area from top
        && (event.pageX >= dropAreaX && event.pageX <= dropAreaX + dropableArea.offsetWidth);


        return isin;
    }

    // private generateDrag

    dragMove(event) {
        const isinDroparea = this.isInDroparea(event);
        console.log('dragging');
        if (isinDroparea) {
            if (!this.dropEntered) {
                // emit dropEnter
                console.log('dropEnter');
                this.dropEntered = true;
            }

            this.render.setStyle(this.dropArea.nativeElement, 'background', 'red');
            // emit dropOver
            console.log('dropOver');
        } else {
            if (this.dropEntered) {
                // emit dropLeave
                console.log('dropLeave');
                this.dropEntered = false;
            }

            this.render.setStyle(this.dropArea.nativeElement, 'background', 'white');
        }
    }

    onDragEnd(e) {
        console.log('dragEnd'); // 放下拖动物件前触发。

        console.log('droped'); // 放下拖动对象


        console.log('dragStop'); // 结束拖动


        const isIn = this.isInDroparea(e);
        if (isIn) {
            this.render.setStyle(this.dropArea.nativeElement, 'background', 'white');
            // this.dropArea.nativeElement.append(this.target.nativeElement);
            // emit output event
        }
        if (this.proxy) {
            (this.proxy as HTMLElement).remove();
        }
        this.target.nativeElement.style.cursor = '';
    }

}
