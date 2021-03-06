/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-22 09:17:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import {
    NgZone, Inject, Optional, ElementRef, Directive,
    OnInit, DoCheck, OnChanges, OnDestroy, Input, Output, EventEmitter,
    SimpleChanges, KeyValueDiffer, KeyValueDiffers, PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import PerfectScrollbar from 'perfect-scrollbar';

import ResizeObserver from 'resize-observer-polyfill';

import { Subject, fromEvent, Observable, interval } from 'rxjs';
import { auditTime, takeUntil, debounceTime, throttle } from 'rxjs/operators';

import { Geometry, Position } from './scrollbar.interfaces';

import {
    SCROLLBAR_CONFIG, ScrollbarConfig, ScrollbarConfigInterface,
    ScrollbarEvent, ScrollbarEvents
} from './scrollbar.interfaces';


// tslint:disable-next-line:no-conflicting-lifecycle
@Directive({
    selector: '[scrollbar]',
    exportAs: 'ngxScrollbar'
})
export class ScrollbarDirective implements OnInit, OnDestroy, DoCheck, OnChanges {
    @Input() disabled = false;
    @Input('scrollbar') config?: ScrollbarConfigInterface;
    @Output() psScrollY: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollX: EventEmitter<any> = new EventEmitter<any>();

    @Output() psScrollUp: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollDown: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollLeft: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollRight: EventEmitter<any> = new EventEmitter<any>();

    @Output() psYReachEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() psYReachStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() psXReachEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() psXReachStart: EventEmitter<any> = new EventEmitter<any>();


    instance: PerfectScrollbar | null = null;

    private ro: ResizeObserver | null = null;

    private timeout: number | null = null;
    private animation: number | null = null;

    private configDiff: KeyValueDiffer<string, any> | null = null;

    private readonly ngDestroy: Subject<void> = new Subject();

    constructor(private zone: NgZone, private differs: KeyValueDiffers,
                public elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: any,
                @Optional() @Inject(SCROLLBAR_CONFIG) private defaults: ScrollbarConfigInterface) {}

    ngOnInit() {
        if (!this.disabled && isPlatformBrowser(this.platformId)) {
            const config = new ScrollbarConfig(this.defaults);

            config.assign(this.config); // Custom configuration

            this.zone.runOutsideAngular(() => {
                this.instance = new PerfectScrollbar(this.elementRef.nativeElement, config);
            });

            if (!this.configDiff) {
                this.configDiff = this.differs.find(this.config || {}).create();

                this.configDiff.diff(this.config || {});
            }

            this.zone.runOutsideAngular(() => {
                this.ro = new ResizeObserver(() => {
                    this.update();
                });

                if (this.elementRef.nativeElement.children[0]) {
                    this.ro.observe(this.elementRef.nativeElement.children[0]);
                }

                this.ro.observe(this.elementRef.nativeElement);
            });

            this.zone.runOutsideAngular(() => {
                ScrollbarEvents.forEach((eventName: ScrollbarEvent) => {
                    const eventType = eventName.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);

                    if (eventName.indexOf('X') > -1 || eventName.indexOf('Left') > -1 || eventName.indexOf('Right') > -1) {
                        fromEvent<Event>(this.elementRef.nativeElement, eventType).subscribe((event: Event) => {
                            this[eventName].emit(event);
                        });
                    } else {
                        fromEvent<Event>(this.elementRef.nativeElement, eventType).pipe(
                            debounceTime(20),
                            // throttle(ev => interval(10)),
                            // auditTime(20),  // auditTime 静默指定的时间，在此时间内忽略所有发出的值，时间过后，发出最新的值
                            // takeUntil(this.ngDestroy)
                        )
                        .subscribe((event: Event) => {
                            this[eventName].emit(event);
                        });
                    }
                });
            });
        }
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.complete();

            if (this.ro) {
                this.ro.disconnect();
            }

            if (this.timeout && typeof window !== 'undefined') {
                window.clearTimeout(this.timeout);
            }

            this.zone.runOutsideAngular(() => {
                if (this.instance) {
                    this.instance.destroy();
                }
            });

            this.instance = null;
        }
    }

    ngDoCheck() {
        if (!this.disabled && this.configDiff && isPlatformBrowser(this.platformId)) {
            const changes = this.configDiff.diff(this.config || {});

            if (changes) {
                this.ngOnDestroy();

                this.ngOnInit();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['disabled'] && !changes.disabled.isFirstChange() && isPlatformBrowser(this.platformId)) {
            if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === true) {
                    this.ngOnDestroy();
                } else if (changes['disabled'].currentValue === false) {
                    this.ngOnInit();
                }
            }
        }
    }

    public ps(): PerfectScrollbar | null {
        return this.instance;
    }

    public update(): void {
        if (typeof window !== 'undefined') {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }

            this.timeout = window.setTimeout(() => {
                if (!this.disabled && this.configDiff) {
                    try {
                        this.zone.runOutsideAngular(() => {
                            if (this.instance) {
                                this.instance.update();
                            }
                        });
                    } catch (error) {
                        // Update can be finished after destroy so catch errors
                    }
                }
            }, 0);
        }
    }

    public geometry(prefix: string = 'scroll'): Geometry {
        return new Geometry(
            this.elementRef.nativeElement[prefix + 'Left'],
            this.elementRef.nativeElement[prefix + 'Top'],
            this.elementRef.nativeElement[prefix + 'Width'],
            this.elementRef.nativeElement[prefix + 'Height']
        );
    }

    public position(absolute: boolean = false): Position {
        if (!absolute && this.instance) {
            return new Position(
                this.instance.reach.x || 0,
                this.instance.reach.y || 0
            );
        } else {
            return new Position(
                this.elementRef.nativeElement.scrollLeft,
                this.elementRef.nativeElement.scrollTop
            );
        }
    }

    public scrollable(direction: string = 'any'): boolean {
        const element = this.elementRef.nativeElement;

        if (direction === 'any') {
            return element.classList.contains('ps--active-x') ||
                element.classList.contains('ps--active-y');
        } else if (direction === 'both') {
            return element.classList.contains('ps--active-x') &&
                element.classList.contains('ps--active-y');
        } else {
            return element.classList.contains('ps--active-' + direction);
        }
    }

    public scrollTo(x: number, y?: number, speed?: number): void {
        if (!this.disabled) {
            if (y == null && speed == null) {
                this.animateScrolling('scrollTop', x, speed);
            } else {
                if (x != null) {
                    this.animateScrolling('scrollLeft', x, speed);
                }

                if (y != null) {
                    this.animateScrolling('scrollTop', y, speed);
                }
            }
        }
    }

    public scrollToX(x: number, speed?: number): void {
        this.animateScrolling('scrollLeft', x, speed);
    }

    public scrollToY(y: number, speed?: number): void {
        this.animateScrolling('scrollTop', y, speed);
    }

    public scrollToTop(offset?: number, speed?: number): void {
        this.animateScrolling('scrollTop', (offset || 0), speed);
    }

    public scrollToLeft(offset?: number, speed?: number): void {
        this.animateScrolling('scrollLeft', (offset || 0), speed);
    }

    public scrollToRight(offset?: number, speed?: number): void {
        const left = this.elementRef.nativeElement.scrollWidth -
            this.elementRef.nativeElement.clientWidth;

        this.animateScrolling('scrollLeft', left - (offset || 0), speed);
    }

    public scrollToBottom(offset?: number, speed?: number): void {
        const top = this.elementRef.nativeElement.scrollHeight -
            this.elementRef.nativeElement.clientHeight;

        this.animateScrolling('scrollTop', top - (offset || 0), speed);
    }

    public scrollToElement(qs: string, offset?: number, speed?: number): void {
        const element = this.elementRef.nativeElement.querySelector(qs);

        if (element) {
            const elementPos = element.getBoundingClientRect();

            const scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();

            if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
                const currentPos = this.elementRef.nativeElement['scrollLeft'];

                const position = elementPos.left - scrollerPos.left + currentPos;

                this.animateScrolling('scrollLeft', position + (offset || 0), speed);
            }

            if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
                const currentPos = this.elementRef.nativeElement['scrollTop'];

                const position = elementPos.top - scrollerPos.top + currentPos;

                this.animateScrolling('scrollTop', position + (offset || 0), speed);
            }
        }
    }

    private animateScrolling(target: string, value: number, speed?: number): void {
        if (this.animation) {
            window.cancelAnimationFrame(this.animation);

            this.animation = null;
        }

        if (!speed || typeof window === 'undefined') {
            this.elementRef.nativeElement[target] = value;
        } else if (value !== this.elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;

            let oldTimestamp = performance.now();
            let oldValue = this.elementRef.nativeElement[target];

            const cosParameter = (oldValue - value) / 2;

            const step = (newTimestamp: number) => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));

                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

                // Only continue animation if scroll position has not changed
                if (this.elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    } else {
                        this.elementRef.nativeElement[target] = newValue;

                        // On a zoomed out page the resulting offset may differ
                        oldValue = this.elementRef.nativeElement[target];

                        oldTimestamp = newTimestamp;

                        this.animation = window.requestAnimationFrame(step);
                    }
                }
            };

            window.requestAnimationFrame(step);
        }
    }
}

