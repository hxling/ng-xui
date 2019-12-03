import { OnInit, Directive, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { switchMap, map, takeUntil, subscribeOn } from 'rxjs/operators';

@Directive({
    selector: '[dnd]',
})

export class DndDirective implements OnInit {
    @Input() dragData: any;
    @Input() useProxy = true;
    /** 目标区域标识 */
    @Input() dropZoneCls = '.xui-droppable';
    @Input() dropOverCls = 'dropover';

    @Output() dragStart = new EventEmitter();
    @Output() dragging = new EventEmitter();
    @Output() dragStop = new EventEmitter();

    @Output() dragEnter = new EventEmitter();
    @Output() dragOver = new EventEmitter();
    @Output() dragLeave = new EventEmitter();
    @Output() dropped = new EventEmitter();

    proxy: any = null;
    private isDragEnter = false;

    constructor(public el: ElementRef, public render: Renderer2) { }

    ngOnInit() {
        this.bindMouseEvents();
    }

    private bindMouseEvents() {
        const box = this.el.nativeElement;
        const mousedown$ = fromEvent<MouseEvent>(box, 'mousedown');
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
        const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

        const drag$ = mousedown$.pipe(
            switchMap(
                (start) => {
                    const startLeft = box.offsetLeft;
                    const startTop = box.offsetTop;
                    const startX = start.clientX;
                    const startY = start.clientY;

                    if (this.useProxy) {
                        this.createProxyElement();
                    }
                    start['dragData'] = this.dragData;
                    this.dragStart.emit(start);
                    return mousemove$.pipe(
                        map(move => {
                            move.preventDefault();
                            // this.dropOver(move);
                            return {
                                target: move,
                                left: move.clientX - startX , // + startLeft
                                top: move.clientY - startY //+ startTop
                            };
                        }),
                        takeUntil(mouseup$));
                }));

        const position$ = drag$.pipe(
            subscribeOn(animationFrameScheduler)
        );

        position$.subscribe(pos => {
            const dragTarget = this.useProxy ? this.proxy : box;
            dragTarget.style.top = `${pos.top}px`;
            dragTarget.style.left = `${pos.left}px`;
            this.onDragMove(pos);
        });

        mouseup$.subscribe(e => {
            this.onMouseUp(e);
        });
    }

    private createProxyElement() {
        this.proxy = this.el.nativeElement.cloneNode(true);
        this.proxy.style.position = 'absolute';
        this.proxy.style.top = '0px';
        this.proxy.style.opacity = 0.5;
        this.proxy.style.left = '-1000px';
        this.el.nativeElement.parentElement.append(this.proxy);
    }

    private getDropPanels() {
        const dropableAreas  = document.querySelectorAll(this.dropZoneCls);

        dropableAreas['filter'] = [].filter;

        return dropableAreas;
    }

    private isInDroparea(event: MouseEvent, dropableArea) {
        const dropAreaRect = dropableArea.getBoundingClientRect();
        const dropAreaX = dropAreaRect.x;
        const dropAreaY = dropAreaRect.y;
        // const isin =  (event.pageY >= dropableArea.offsetTop && event.pageY <= dropableArea.offsetTop + dropableArea.offsetHeight) // in drop area from top
        // && (event.pageX >= dropableArea.offsetLeft && event.pageX <= dropableArea.offsetLeft + dropableArea.offsetWidth);
        const isin =  (event.pageY >= dropAreaY && event.pageY <= dropAreaY + dropableArea.offsetHeight) // in drop area from top
        && (event.pageX >= dropAreaX && event.pageX <= dropAreaX + dropableArea.offsetWidth);


        return isin;
    }

    private setDropOverCls(target, addClass = true) {
        if (addClass) {
            this.render.addClass(target, this.dropOverCls);
        } else {
            this.render.removeClass(target, this.dropOverCls);
        }
    }

    private removeProxyElement() {
        if (this.proxy) {
            this.proxy.remove();
        }
        this.proxy = null;
    }


    onMouseUp(e) {
        this.dragStop.emit();
        let dropItInDropArea = false;
        const dropPanels = this.getDropPanels();
        dropPanels.forEach(d => {
            if (this.isInDroparea(e, d)) {
                this.dropped.emit(e);
                this.setDropOverCls(d, false);
                dropItInDropArea = true;
                this.removeProxyElement();
            }
        });

        if (!dropItInDropArea) {
            // 移除proxy element
            this.removeProxyElement();
        }
    }

    onDragMove(e) {
        this.dragging.emit(e);

        const dropPanels = this.getDropPanels();
        dropPanels.forEach(d => {
            if (this.isInDroparea(e.target, d)) {
                if (!this.isDragEnter) {
                    this.isDragEnter = true;
                    this.dragEnter.emit(e);
                }

                this.setDropOverCls(d, true);

                this.dragOver.emit(e);
            } else {
                if (this.isDragEnter) {
                    this.isDragEnter = false;
                    this.dragLeave.emit(e);
                }
                this.setDropOverCls(d, false);
            }
        });

    }

}
