import { Subscription } from 'rxjs';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-31 16:25:20
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges,
    ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges,
    OnDestroy, Injector, Inject, forwardRef, AfterViewInit} from '@angular/core';
import { Utils } from '../../utils/utils';
import { filter } from 'rxjs/operators';
import { DataColumn } from '../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridRowDirective } from './datagrid-row.directive';
import { CellInfo } from '../../services/state';
import { GridCellEditorDirective } from '../editors/cell-editor.directive';
import { DataFormatService } from 'ng-xui/utils';

@Component({
    selector: 'grid-body-cell',
    templateUrl: './datagrid-cell.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class DatagridCellComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() width: number;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;
    @Input() lastColumn = false;

    private _isEditing = false;
    @Input() get isEditing() {
        return this._isEditing;
    }
    set isEditing(v) {
        this._isEditing = v;
        if (!this.cd['destroyed']) {
            this.cd.detectChanges();
        }
    }

    @Input() isSelected = false;

    @ViewChild('cellContainer', {static: false}) cellContainer: ElementRef;
    @ViewChild(GridCellEditorDirective, {static: false}) cellEditor: GridCellEditorDirective;

    @Output() cellClick = new EventEmitter();
    @Output() cellDblClick = new EventEmitter();

    cellContext: any = {};
    get value() {
        if (this.rowData && this.column && this.column.field) {
            return Utils.getValue(this.column.field, this.rowData);
        }
        return '';
    }

    get formControl() {
        if (this.cellEditor) {
            return this.cellEditor.componentRef.instance.formControl;
        }
        return null;
    }

    cellStyler: any = {};

    private dfs: DatagridFacadeService;
    private cellSubscription: Subscription;
    public dg: DatagridComponent;
    canEdit = () => this.dg.editable && this.dg.editMode === 'cell' && this.column.editor;
    constructor(
        @Inject(forwardRef(() => DatagridRowDirective)) public dr: DatagridRowDirective,
        private el: ElementRef, public cd: ChangeDetectorRef, private injector: Injector,
        public colFormatSer: DataFormatService
    ) {
        this.dfs = this.injector.get(DatagridFacadeService);
        this.dg = this.injector.get(DatagridComponent);
    }

    ngOnInit(): void {
        this.cellContext = {
            field: this.column.field,
            rowIndex: this.rowIndex,
            rowData: this.rowData
        };

        // this.updateValue();

        this.cellSubscription = this.dfs.currentCell$.pipe(
            filter((cell: CellInfo) => {
                return cell && this.column.editor && cell.rowIndex === this.rowIndex && cell.field === this.column.field;
            })
        ).subscribe((cell: CellInfo) => {
            if (cell && this.column.editor) {
                this.isEditing = cell.isEditing;
                cell.cellRef = this;

                if (!this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
            }
        });

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.rowData && !changes.rowData.isFirstChange()) {
            this.cellContext = {
                field: this.column.field,
                rowIndex: this.rowIndex,
                rowData: this.rowData
            };
            // console.log(changes.rowData);
        }
    }

    ngAfterViewInit(): void {
        this.buildCustomCellStyle();
    }

    ngOnDestroy() {
        if (this.cellSubscription) {
            this.cellSubscription.unsubscribe();
            this.cellSubscription = null;
        }
    }

    private buildCustomCellStyle() {
        if (this.column.styler) {
            const cs = this.column.styler(this.rowData[this.column.field], this.rowData, this.rowIndex);
            if (cs && Object.keys(cs).length) {
                const td = this.el.nativeElement.parentNode;
                this.dg.renderCustomStyle(cs, td);
            }
        }
    }

    updateValue(val?: any) {
        if (this.dr.form) {
            // this.rowData = Object.assign(this.rowData, this.dr.form.value);
            Utils.setValue(this.column.field, val, this.rowData);
            this.cd.detectChanges();
        }
    }
}
