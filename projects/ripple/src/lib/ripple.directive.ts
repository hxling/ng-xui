import { XBaseComponent } from '@kui/core';
import {
    Directive,
    ElementRef,
    Injector,
    OnInit,
    Input,
    OnDestroy,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

@Directive({
    selector: '[x-ripple]',
})
export class XRippleDirective extends XBaseComponent implements OnInit, OnDestroy, OnChanges {

    @Input('x-ripple') enable = true;
    on = 'mousedown';

    opacity = 0.4;
    color = 'auto';

    duration = 0.7;
    rate = (pxPerSecond) => {
        return pxPerSecond;
    };

    easing = 'linear';
    private ripple = null;
    private eventHandle = null;

    constructor(
        private elRef: ElementRef,
        public inject: Injector,
    ) {
        super(inject);
    }

    ngOnInit() {
        this.bindEventHandle();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.enable && !changes.enable.isFirstChange()) {
            if (changes.enable.currentValue) {
                this.bindEventHandle();
            } else {
                this.unbindEventHandle();
            }
        }
    }

    ngOnDestroy(): void {
        this.unbindEventHandle();
    }

    private bindEventHandle() {
        if (this.enable) {
            this.eventHandle = this.bindEventListener();
        }
    }

    private unbindEventHandle() {
        if (this.eventHandle) {
            this.eventHandle();
        }
    }

    private _log(msg, args?: any) {
        this.logService.log(msg, args || '');
    }

    private bindEventListener() {
        return this.render.listen(this.elRef.nativeElement, this.on, (e) => {
            this.trigger(e);
        });
    }

    private trigger(e: MouseEvent) {
        const el = this.elRef.nativeElement;
        this.render.addClass(el, 'has-ripple');
        let rippleSize;
        // Create the ripple element
        if (!el.querySelector('.ripple')) {
            this.ripple = document.createElement('span');
            this.render.appendChild(el, this.ripple);
            this.render.addClass(this.ripple, 'ripple');

            rippleSize = el.getBoundingClientRect();
            // Set ripple size
            var size = Math.max(rippleSize.width, rippleSize.height);
            this.render.setStyle(this.ripple, 'width', `${size}px`);
            this.render.setStyle(this.ripple, 'height', `${size}px`);
            this._log('Set: Ripple size');

            // Give the user the ability to change the rate of the animation
            // based on element width
            if (this.rate && typeof this.rate == 'function') {
                // rate = pixels per second
                var rate = Math.round(rippleSize.width / this.duration);

                // new amount of pixels per second
                var filteredRate = this.rate(rate);

                // Determine the new duration for the animation
                var newDuration = rippleSize.width / filteredRate;

                // Set the new duration if it has not changed
                if (this.duration.toFixed(2) !== newDuration.toFixed(2)) {
                    this._log('Update: Ripple Duration', {
                        from: this.duration,
                        to: newDuration
                    });
                    this.duration = newDuration;
                }
            }

            // Set the color and opacity
            var color =
                this.color == 'auto' ? window.getComputedStyle(el).color : this.color;

            this.render.setStyle(
                this.ripple,
                'animationDuration',
                `${this.duration}s`
            );
            this.render.setStyle(this.ripple, 'animationTimingFunction', this.easing);
            this.render.setStyle(this.ripple, 'background', color);
            this.render.setStyle(this.ripple, 'opacity', this.opacity);

        } else {
            this._log('Set: Ripple Element');
            this.ripple = el.querySelector('.ripple');
            rippleSize = el.getBoundingClientRect();
        }

        // Kill animation
        this._log('Destroy: Ripple Animation');
        this.render.removeClass(this.ripple, 'ripple-animate');

        // Retrieve coordinates
        var x = e.pageX - rippleSize.left - rippleSize.width / 2;
        var y = e.pageY - rippleSize.top - rippleSize.height / 2;

        this.render.setStyle(this.ripple, 'top', `${y}px`);
        this.render.setStyle(this.ripple, 'left', `${x}px`);
        setTimeout(() => {
            this.render.addClass(this.ripple, 'ripple-animate');
        });
    }
}
