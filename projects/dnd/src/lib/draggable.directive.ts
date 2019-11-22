import { OnInit, Directive, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { switchMap, map, takeUntil, subscribeOn } from 'rxjs/operators';

@Directive({
    selector: '[xui-draggable]',
})

export class DraggableDirective implements OnInit {
    @Input() dragData: any;
    @Input() useProxy = true;
    @Input() dropZone: ElementRef;

    @Input() beforeDrag: () => any;
    @Output() dragStart = new EventEmitter();
    @Output() dragging = new EventEmitter();
    @Input() dragEnd: () => any;
    @Output() dragStop = new EventEmitter();

    proxy: any = null;
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

                    return mousemove$.pipe(
                        map(move => {
                            move.preventDefault();
                            // this.dropOver(move);
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
            const dragTarget = this.useProxy ? this.proxy : box;
            dragTarget.style.top = `${pos.top}px`;
            dragTarget.style.left = `${pos.left}px`;
        });

        mouseup$.subscribe(e => {
            this.onDroped(e);
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

    private onDroped(event: MouseEvent) {

    }
}
