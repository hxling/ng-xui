import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'x-button',
    template: `
    <button
      type="button"
      [ngClass]="cls"
      [x-ripple]="ripple"
      [disabled]="disabled"
      [class.btn-block]="fit"
    >
      <span *ngIf="icon"  [class.mr-1]="text" [class]="icon"></span>
      <span *ngIf="text" >{{ text }}</span>
      <ng-content></ng-content>
    </button>
  `,
    styles: [],
})
export class ButtonComponent implements OnInit, OnChanges {
    /** 按钮显示尺寸 */
    @Input() size: 'lg' | 'sm' | 'xs' | '' = '';
    /**
     * 按钮颜色：default primark secondary success info warning danger dark light
     */
    @Input() color = 'default';
    /** 空心按钮，默认为实心 */
    @Input() outline = false;
    /** 按钮文本 */
    @Input() text = 'Default';
    /** 图标 */
    @Input() icon = '';
    /** 圆角 */
    @Input() rounded = false;
    /** 波纹效果 */
    @Input() ripple = true;

    /** 禁用 */
    @Input() disabled = false;

    /** 填充容器宽度 */
    @Input() fit = false;

    cls = { btn: true };

    constructor() { }

    ngOnInit(): void {
        this.cls = this.buildCls();
    }

    ngOnChanges(changes: SimpleChanges) {

        const keys = ['rounded', 'outline', 'size', 'icon', 'text']

        Object.keys(changes).forEach(n => {
            if (keys.indexOf(n) > -1) {
                if (changes[n] && !changes[n].isFirstChange()) {
                    this.cls = this.buildCls();
                }
            }
        });
    }

    private buildCls() {
        const cls = {
            btn: true,
        };

        if (this.outline) {
            cls['btn-outline-' + this.color] = true;
        } else {
            cls['btn-' + this.color] = true;
        }

        if (this.size) {
            cls['btn-' + this.size] = true;
        }

        cls['btn-pills'] = this.rounded;

        if (this.icon && !this.text) {
            cls['btn-icon'] = true;

            if (this.rounded) {
                cls['btn-pills'] = false;
                cls['rounded-circle'] = true
            }

        }

        return { ...cls };
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
    }

    setText(txt: string) {
        this.text = txt;
    }
}
