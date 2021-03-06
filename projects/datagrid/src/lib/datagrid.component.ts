import { FormGroup, ValidatorFn } from '@angular/forms';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-11-19 13:40:48
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Component, OnInit, Input, ViewEncapsulation, TemplateRef,
    ContentChildren, QueryList, Output, EventEmitter, Renderer2, OnDestroy, OnChanges,
    SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Injector, HostBinding,
    AfterContentInit, NgZone, ElementRef, ViewChild, AfterViewInit, ApplicationRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import ResizeObserver from 'resize-observer-polyfill';
import { of, Subscription, Observable } from 'rxjs';
import { DataColumn, CustomStyle, MoveDirection, ColumnGroup } from './types/data-column';
import { DatagridFacadeService } from './services/datagrid-facade.service';
import { DatagridColumnDirective } from './components/columns/datagrid-column.directive';
import { CellInfo, SelectedRow } from './services/state';
import { RestService, DATAGRID_REST_SERVICEE } from './services/rest.service';
import { DatagridService } from './services/datagrid.service';
import { GRID_EDITORS, CELL_SELECTED_CLS, GRID_VALIDATORS, SIZE_TYPE } from './types/constant';
import { DomHandler } from './services/domhandler';
import { Utils } from './utils/utils';
import { DataFormatService } from 'ng-xui/utils';
import { flatten } from 'lodash-es';
import { ScrollbarDirective } from './scrollbar/scrollbar.directive';

// styleUrls: [
//     './scss/index.scss'
// ],

@Component({
    selector: 'xui-datagrid',
    templateUrl: './datagrid.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DatagridFacadeService,
        DatagridService
    ],
    exportAs: 'datagrid'
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {
    @Input() auther = `Lucas Huang - QQ:1055818239`;
    @Input() version = '0.0.1';

    @HostBinding('style.position') pos = 'relative';
    @HostBinding('class.xui-datagrid-full') hostCls = false;

    @Input() id = '';
    /** 自动高度 - 启用此属性后，就是一个普普通通的 table , 不能编辑，不能排序，不能分页，不能... 就是一凡胎 */
    @Input() autoHeight = false;
    /** 显示边框 */
    @Input() showBorder = true;
    @Input() borderType: 'both' | 'bottom' | 'right' = 'both';
    /** 启用斑马线  */
    @Input() striped = false;
    /** 宽度 */
    @Input() width = 800;
    /** 高度 */
    @Input() height = 400;
    /** 显示表头 */
    @Input() showHeader = true;
    /** 表头高度 */
    @Input() headerHeight = 45;
    /** 启用过滤行 */
    @Input() showFilter = false;
    /** 显示页脚 */
    @Input() showFooter = false;
    @Input() footerHeight = 0;
    @Input() footerDataFrom: 'server'|'client' = 'client';
    @Input() footerTemplate: TemplateRef<any>;
    /** 行高 */
    @Input() rowHeight = 40;

    /**
     * 设置grid 行高尺寸
     * sm: 小，md: 正常， lg: 大，xl: 超大
     */
    private _sizeType: 'sm'|'md'|'lg'|'xl' = 'md';
    get sizeType() {
        return this._sizeType;
    }
    @Input() set sizeType(val) {
        this._sizeType = val;
    }

    /** 填充容器 */
    private _fit = false;
    @Input() get fit() {
        return this._fit;
    }
    set fit(val: boolean) {
        this._fit = val;
        this.hostCls = val;
        // this.calculateGridSize(val);
    }
    /** 如果为真，则自动展开/收缩列的大小以适合网格宽度并防止水平滚动。 */
    private _fitColumns = false;
    @Input() get fitColumns() {
        return this._fitColumns;
    }
    set fitColumns(val: boolean) {
        this._fitColumns = val;
        this.setFitColumns(val);
    }

    @Input() disabled = false;

    /** 可拖动列设置列宽 */
    @Input() resizeColumn = true;
    /** 显示行号 */
    @Input() showLineNumber  = false;
    /** 行号宽度 */
    @Input() lineNumberWidth = 36;
    /** 鼠标滑过效果开关，默认开启 */
    @Input() rowHover = true;
    /** 允许编辑时，单击进入编辑状态; false为双击进入编辑 */
    @Input() clickToEdit = true;

    private _lockPagination = false;
    /** 锁定分页条，锁定后页码点击无效 */
    @Input() get lockPagination() {
        return this._lockPagination;
    }
    set lockPagination(val: boolean) {
        this._lockPagination = val;
        if (this.dgPager) {
            this.dgPager[val ? 'lock' : 'unlock']();
        }
    }
    /** 分页信息 */
    @Input() pagination = false;
    /** 每页记录数 */
    @Input() pageList = [10, 20, 30, 50, 100];
    /** 当前页码 */
    @Input() pageIndex = 1;
    /** 每页记录数 */
    @Input() pageSize = 20;
    /** 分页区高度 */
    @Input() pagerHeight = 40;
    /** 显示每页记录数 */
    @Input() showPageList = false;
    /** 总记录数 */
    private _total = 0;
    get total() {
        return this._total;
    }

    @Input() set total(val: number) {
        this._total = val;
        this.pagerOpts.totalItems = val;
        this.dfs.setTotal(val);
    }

    /** 启用多选 */
    @Input() multiSelect = false;
    /** 启用多选时，是否显示checkbox */
    @Input() showCheckbox = false;
    /** 显示全选checkbox */
    @Input() showAllCheckbox = false;
    /** 当启用多选时，点击行选中，只允许且只有一行被选中。 */
    @Input() onlySelectSelf = false;
    /** 启用多选且显示checkbox, 选中行同时钩选 */
    @Input() checkOnSelect = true;
    /** 启用多选且显示checkbox, 钩选后选中行 */
    @Input() selectOnCheck = true;

    /**
     * 单击行选中后，在次点击不会被取消选中状态;
     */
    @Input() keepSelect = false;

    /** 空数据时，显示的提示文本 */
    @Input() emptyMessage = '暂无数据';

    /** 主键字段 */
    @Input() idField = 'id';
    /** 请求数据源的URL */
    @Input() url: string;
    /** 数据源 */
    @Input() data: any[];
    /** 页脚数据 */
    private _footerData = [];
    @Input() get footerData() {
        return this._footerData;
    }
    set footerData(rows) {
        this._footerData = rows;
        if (this.showFooter && !this.footerTemplate) {
            this.footerHeight = rows.length * this.rowHeight;
        }
    }

    /** 验证不通过时可以结束编辑 */
    @Input() endEditByInvalid = true;

    /** 列集合 */
    @Input() columns: any;
    /** 数据折行，默认值：true,即在一行显示，不折行。 */
    @Input() nowrap = true;
    /** 虚拟加载 */
    @Input() virtualized = false;
    /** 是否启用异步加载数据 */
    @Input() virtualizedAsyncLoad = false;
    /** 行样式 */
    @Input() rowStyler: (rowData, rowIndex?: number) => {cls?: string, style?: any};
    /** 编辑方式： row(整行编辑)、cell(单元格编辑)；默认为 row */
    @Input() editMode: 'row'| 'cell' = 'row';
    /** 编辑状态 */
    @Input() editable = false;
    /** 编辑器高度 */
    @Input() editorHeight = 30;
    /** 启用远端排序 */
    @Input() remoteSort = true;
    /** 排序字段 */
    @Input() sortName: string;
    /** 排序方式 asc | desc */
    @Input() sortOrder: string;
    /** 允许多列排序 */
    @Input() multiSort: boolean;

    @Input() hoverRowCls = 'xui-datagrid-row-hover';

    /** 启用分组行 */
    @Input() groupRows = false;
    /** 头部显示分组字段列列，且列拖动到这儿进行行(hang)分组  */
    @Input() showRowGroupPanel = false;
    /** 启用行分组合计行 */
    @Input() groupFooter = false;
    /** 分组字段名称 */
    @Input() groupField = '';
    /** 分组格式化 */
    @Input() groupFormatter: (groupRow: any) => any;
    /** 分组行样式 */
    @Input() groupStyler: (groupRow: any) => any;
    /** 双击表头自适应内容宽度 */
    @Input() AutoColumnWidthUseDblclick = true;


    @Input() beforeEdit: (rowIndex: number, rowData: any, column?: DataColumn) => Observable<boolean>;
    @Output() beginEdit = new EventEmitter<{ editor?: any, rowIndex?: number, rowData: any, column?: DataColumn }>();
    @Input() afterEdit: (rowIndex: number, rowData: any, column?: DataColumn, editor?: any) => Observable<boolean>;
    @Output() endEdit = new EventEmitter<{rowIndex: number, rowData: any, column?: DataColumn}>();
    @Output() cancelEdited = new EventEmitter<string>();

    @Output() scrollY = new EventEmitter();

    @Output() pageSizeChanged = new EventEmitter();
    @Output() pageChanged = new EventEmitter();

    @Output() loadSuccess = new EventEmitter();


    @Input() beforeSelect: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeUnselect: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeCheck: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeUncheck: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeSortColumn: (field: string, order: string) => Observable<boolean>;

    @Output() selectChanged = new EventEmitter<SelectedRow>();
    @Output() unSelect = new EventEmitter<SelectedRow>();
    @Output() selectAll = new EventEmitter<SelectedRow[]>();
    @Output() unSelectAll = new EventEmitter();

    @Output() checked = new EventEmitter<SelectedRow>();
    @Output() unChecked = new EventEmitter<SelectedRow>();
    @Output() checkAll = new EventEmitter<SelectedRow[]>();
    @Output() unCheckAll = new EventEmitter<SelectedRow[]>();
    @Output() checkedChange = new EventEmitter<SelectedRow[]>();

    @Output() columnSorted = new EventEmitter<DataColumn>();

    @ContentChildren(DatagridColumnDirective) dgColumns?: QueryList<DatagridColumnDirective>;
    @ViewChild('dgPager', { static: false}) dgPager: any;
    @ViewChild('resizeProxy', { static: false}) resizeProxy: ElementRef;
    @ViewChild('resizeProxyBg', { static: false}) resizeProxyBg: ElementRef;
    @ViewChild('datagridContainer', { static: false}) dgContainer: ElementRef;
    /** 最长文本临时区域 */
    @ViewChild('longTextArea', {static: false}) longTextArea: ElementRef;
    colGroup: ColumnGroup;

    private _loading = false;
    get loading() {
        return this._loading;
    }
    set loading(val: boolean) {
        this._loading = val;
        this.cd.detectChanges();
    }

    get selections(): SelectedRow[] {
        return this.dfs.getSelections();
    }

    get checkeds() {
        return this.dfs.getCheckeds();
    }

    get selectedRow(): SelectedRow {
        return this.dfs.getCurrentRow();
    }

    ds = {
        index: 0,
        rows: [],
        top : 0,
        bottom : 0
    };

    pagerOpts: any = { };
    restService: RestService;
    editors: {[key: string]: any} = {};
    validators: {name: string, value: ValidatorFn}[] = [];

    currentCell: CellInfo;
    flatColumns: DataColumn[];
    footerWidth  = 0;

    clickDelay = 150;
    private resizeColumnInfo = {
        proxyLineEdge: 0,
        startWidth: 0,
        startX: 0,
        left: 0
    };

    private ro: ResizeObserver | null = null;
    subscriptions: Subscription[] = [];
    realHeaderHeight = 0;
    isSingleClick: boolean;

    docuemntCellClickEvents: any;
    documentCellClickHandler: any;
    documentCellKeydownEvents: any;
    documentCellKeydownHandler: any;

    // 行选中键盘事件
    documentRowKeydownHandler: any;
    // 行编辑快捷键
    documentRowEditKeydownHanlder: any;
    // document 单击时结束行编辑
    documentClickEndRowEditHandler: any;

    pending = false;
    public colFormatSer: DataFormatService;
    scrollInstance: ScrollbarDirective = null;
    constructor(public cd: ChangeDetectorRef,
                public el: ElementRef,
                private inject: Injector, private zone: NgZone,
                private dfs: DatagridFacadeService,
                private dgs: DatagridService,
                private app: ApplicationRef,
                protected domSanitizer: DomSanitizer, private render2: Renderer2) {

        this.restService = this.inject.get<RestService>(DATAGRID_REST_SERVICEE, null);
        this.colFormatSer = this.inject.get(DataFormatService);
        const dataSubscription = this.dfs.data$.subscribe( (dataSource: any) => {
            this.ds = {...dataSource};
            if (this.showFooter && this.footerDataFrom === 'client') {
                this.footerData = this.dfs.getFooterData(this.data);
            }
            // this.app.tick();
            this.cd.detectChanges();

            this.loadSuccess.emit(this.ds.rows);
        });
        this.subscriptions.push(dataSubscription);

        const columnGroupSubscription = this.dfs.columnGroup$.subscribe(cg => {
            if (cg) {
                this.colGroup = cg;
                this.footerWidth = cg.totalWidth;
                this.cd.detectChanges();
            }
        });
        this.subscriptions.push(columnGroupSubscription);

        this.initEditorAndValidator();

        const currentCellSubscription = this.dfs.currentCell$.subscribe( cell => {
            this.currentCell = cell;
            this.unbindMoveSelectRowEvent();
            this.bindDocumentEditListener();
        });

        this.dfs.selectRow$.subscribe( () => {
            if (!this.currentCell) {
                this.bindDocumentMoveSelectRowEvent();
            }
        });

        this.subscriptions.push(currentCellSubscription);

        this.pagerOpts = {
            id:  this.id ? this.id + '-pager' :  'farris-datagrid-pager_' + new Date().getTime(),
            itemsPerPage: this.pagination ? this.pageSize : this.total,
            currentPage: this.pageIndex,
            totalItems: this.total,
            pageList: this.pageList
        };
    }

    //#region Ng Event

    ngOnInit() {

        if (!this.idField) {
            throw new Error('The Datagrid\'s idField can\'t be Null. ');
        }

        this.checkColumnsType();

        this._flatColumns();
        if (this.showHeader) {
            this.realHeaderHeight = this.columns.length * this.headerHeight;
            if (this.showRowGroupPanel) {
                this.realHeaderHeight += this.headerHeight;
            }
        }
    }

    ngAfterViewInit(): void {
        this.setPagerHeight();
        this.initState();

        if (!this.data || !this.data.length) {
            this.fetchData(1, this.pageSize).subscribe( res => {
                if (!res) {
                    return;
                }
                this.total = res.total;

                if (res.footer) {
                    this.footerData = res.footer;
                }

                this.loadData(res.items);
            });
        } else {
            this.total = this.data.length;
            if (!this.pagination) {
                this.pagerOpts.itemsPerPage = this.total;
            }
        }

        this.initBeforeEvents();

        this.zone.runOutsideAngular(() => {
            this.ro = new ResizeObserver(() => {
                this.calculateGridSize(this.fit);
            });

            this.ro.observe(this.el.nativeElement.parentElement);
        });

        if (this.fit) {
            if (this.el.nativeElement.parentElement) {
                this.el.nativeElement.parentElement.style.position = 'relative';
            }
            this.calculateGridSize(true);
        }

        if (this.showFooter ) {
            if (this.footerTemplate) {
                this.footerHeight = this.el.nativeElement.querySelector('.f-datagrid-footer').offsetHeight;
            }
        }
    }

    ngAfterContentInit() {
        if (this.dgColumns && this.dgColumns.length) {
            this.columns = this.dgColumns.map(dgc => {
                return {...dgc};
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.dfs.loadData(changes.data.currentValue);
            this.dgs.dataSourceChanged();
        }

        if (changes.showCheckbox !== undefined && !changes.showCheckbox.isFirstChange()) {
            this.dfs.showCheckbox(changes.showCheckbox.currentValue);
        }

        if (changes.showLineNumber !== undefined && !changes.showLineNumber.isFirstChange()) {
            this.dfs.showLineNumber(changes.showLineNumber.currentValue);
        }

        if (changes.multiSelect !== undefined && !changes.multiSelect.isFirstChange()) {
            this.dfs.setMultiSelect(changes.multiSelect.currentValue);
        }

        if (changes.checkOnSelect !== undefined && !changes.checkOnSelect.isFirstChange()) {
            this.dfs.setCheckOnSelect(changes.checkOnSelect.currentValue);
        }

        if (changes.groupFooter !== undefined && !changes.groupFooter.isFirstChange()) {
            this.dfs.showGroupFooter(changes.groupFooter.currentValue);
        }

        if (changes.selectOnCheck !== undefined && !changes.selectOnCheck.isFirstChange()) {
            this.dfs.setSelectOnCheck(changes.selectOnCheck.currentValue);
        }

        if (changes.onlySelectSelf !== undefined && !changes.onlySelectSelf.isFirstChange()) {
            this.dfs.updateProperty('onlySelectSelf', changes.onlySelectSelf.currentValue);
        }

        if (changes.keepSelect !== undefined && !changes.keepSelect.isFirstChange()) {
            this.dfs.updateProperty('keepSelect', changes.keepSelect.currentValue);
        }

        if (changes.nowrap !== undefined && !changes.nowrap.isFirstChange()) {
            this.dfs.updateProperty('nowrap', changes.nowrap.currentValue);
        }

        if (changes.multiSort !== undefined && !changes.multiSort.isFirstChange()) {
            this.dfs.updateProperty('multiSort', changes.multiSort.currentValue);
        }

        if (changes.editable !== undefined && !changes.editable.isFirstChange()) {
            this.dfs.updateProperty('editable', changes.editable.currentValue);
            if (!changes.editable.currentValue) {
                this.endCellEdit();
            }
            this.isSingleClick = null;
            this.cd.detectChanges();
        }

        if (changes.showHeader !== undefined && !changes.showHeader.isFirstChange()) {
            this.dfs.updateProperty('showHeader', changes.showHeader.currentValue);
            this.headerHeightChange();
            this.cd.detectChanges();
        }

        if (changes.pageIndex !== undefined && !changes.pageIndex.isFirstChange()) {
            this.dfs.updateProperty('pageIndex', changes.pageIndex.currentValue);
            this.pagerOpts = Object.assign(this.pagerOpts, {
                currentPage: this.pageIndex
            });
        }

        if (changes.pageSize !== undefined && !changes.pageSize.isFirstChange()) {
            this.dfs.updateProperty('pageSize', changes.pageSize.currentValue);
            this.pagerOpts = Object.assign(this.pagerOpts, {
                itemsPerPage: this.pageSize
            });
        }

        if (changes.columns !== undefined && !changes.columns.isFirstChange()) {
           this.columnsChanged();
        }

        if (changes.sizeType !== undefined && !changes.sizeType.isFirstChange()) {
            this._sizeType = changes.sizeType.currentValue;
            this.rowHeight = SIZE_TYPE[this._sizeType];
            this.footerHeight = SIZE_TYPE[this._sizeType];
            this.dfs.updateProperty('rowHeight', this.rowHeight);
            this.refresh();
            this.dgs.onRowHeightChange(this.rowHeight);
        }

    }

    ngOnDestroy() {
        this.unsubscribes();

        if (this.ro) {
            this.ro.disconnect();
        }

        if (this.documentRowKeydownHandler) {
            this.documentRowKeydownHandler();
        }

        this.currentCell = null;
    }

    private _flatColumns() {
        this.flatColumns =  flatten<DataColumn>(this.columns).filter((col: DataColumn) => !col.colspan);
    }

    // 检查列集合: [] -> [[]]
    private checkColumnsType() {
        if (this.columns && this.columns.length) {
            if (!Array.isArray(this.columns[0])) {
                this.columns = [ this.columns ];
            }
        }
    }

    // 列集合变化
    private columnsChanged() {
        this._flatColumns();
        this.checkColumnsType();
        this.dfs.updateProperty('flatColumns', this.flatColumns);
        this.dfs.updateColumns(this.columns);
        this.headerHeightChange();
        this.refresh();
    }

    // 列头变化
    private headerHeightChange() {
        if (!this.showHeader) {
            this.realHeaderHeight = 0;
        } else {
            this.realHeaderHeight = this.columns.length * this.headerHeight;
        }

        this.dgs.showGridHeader.emit(this.realHeaderHeight);
    }

    //#endregion

    //#region Init
    /** 初始编辑器与验证器 */
    private initEditorAndValidator() {
        const Editors = this.inject.get<any[]>(GRID_EDITORS, []);
        if (Editors.length) {
            Editors.forEach(ed => {
                this.editors[ed.name] = ed.value;
            });
        }
        const _validators = this.inject.get<any[]>(GRID_VALIDATORS, []);
        if (_validators && _validators.length) {
            // _validators.forEach(vr => {
            //     this.validators[vr.name] = vr.value;
            // });
            this.validators = _validators;
        }

        // console.log('validators', this.validators);
    }

    private setPagerHeight() {
        if (!this.autoHeight) {
            if (!this.pagination) {
                this.pagerHeight = 0;
            } else {
                if (this.pagerHeight < this.dgPager.outerHeight) {
                    this.pagerHeight = this.dgPager.outerHeight;
                }
            }
        }
    }

    private initState() {
        this.data = this.data || [];
        this.dfs.initState({...this, fitColumns: this.fitColumns, fit: this.fit});
    }

    private setFitColumns(fitColumns = true) {
        if (this.columns) {
            this.dfs.fitColumns(fitColumns);
        }
    }

    private calculateGridSize(fit = true) {
        if (fit) {
            const parent = this.el.nativeElement.parentElement;
            const cmpRect = parent.getBoundingClientRect();

            const padding = this.getElementPadding(parent);
            const border = this.getElementBorderWidth(parent);

            this.width = cmpRect.width - border.left - border.right - padding.left - padding.right;
            this.height = cmpRect.height - border.top - border.bottom - padding.top - padding.bottom;
            this.cd.detectChanges();
            // this.rowHeight = this.el.nativeElement.querySelector('.xui-datagrid-body tr').offsetHeight;

            this.dfs.resize({width: this.width, height: this.height});
            // this.refresh();
        }
    }

    private initBeforeEvents() {
        if (!this.beforeSelect) {
            this.beforeSelect = () => of(true);
        }
        if (!this.beforeUnselect) {
            this.beforeUnselect = () => of(true);
        }

        if (!this.beforeCheck) {
            this.beforeCheck = () => of(true);
        }

        if (!this.beforeUncheck) {
            this.beforeUncheck = () => of(true);
        }

        if (!this.beforeSortColumn) {
            this.beforeSortColumn = () => of(true);
        }

        if (!this.beforeEdit) {
            this.beforeEdit = () => of(true);
        }

        if (!this.afterEdit) {
            this.afterEdit = () => of(true);
        }
    }

    trackByRows = (index: number, row: any) => {
        return row[this.idField]  || index;
    }

    //#endregion

    //#region 快捷键

    private unbindMoveSelectRowEvent() {
        if (this.documentRowKeydownHandler) {
            this.documentRowKeydownHandler();
            this.documentRowKeydownHandler = null;
        }
    }

    private bindDocumentMoveSelectRowEvent() {
        this.unbindMoveSelectRowEvent();
        this.unbindDocumentEditListener();
        this.documentRowKeydownHandler = this.render2.listen(document, 'keydown', (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 40:
                    this.selectNextRow();
                    break;
                case 38:
                    this.selectPrevRow();
                    break;
            }
        });
    }

    private bindDocumentEditListener() {
        this.unbindDocumentEditListener();
        if (!this.documentCellClickHandler) {
            this.documentCellClickHandler = (event) => {
                if (this.pending) {
                    return false;
                }
                if (this.currentCell) {
                    if (Utils.hasDialogOpen()) {
                        return;
                    }
                    DomHandler.removeClass(this.currentCell.cellElement, CELL_SELECTED_CLS);

                    if (this.currentCell.isEditing) {
                        // this.dfs.endEditCell();
                        this.currentCell.cellElement.closeEdit();
                    }
                    this.dfs.cancelSelectCell();
                    this.unbindDocumentEditListener();
                }
            };
            this.docuemntCellClickEvents = this.render2.listen(document, 'click', this.documentCellClickHandler);
        }

        if (!this.documentCellKeydownHandler) {
            this.documentCellKeydownHandler = (event) => {
                this.onKeyDownEvent(event);
            };

            this.documentCellKeydownEvents = this.render2.listen(document, 'keydown', this.documentCellKeydownHandler);
        }
    }

    private unbindDocumentEditListener() {
        if (this.documentCellClickHandler) {
            this.docuemntCellClickEvents();
            this.documentCellClickHandler = null;
        }

        if (this.documentCellKeydownHandler) {
            this.documentCellKeydownEvents();
            this.documentCellKeydownHandler = null;
        }
    }

    private onKeyDownEvent(e: any) {
        const keyCode = e.keyCode;
        if (this.currentCell && !this.currentCell.isEditing) {
            switch (keyCode) {
                case 13: // Enter
                    const fn = this.currentCell.cellElement['editCell'];
                    if (fn) {
                        fn.apply(this.currentCell.cellElement);
                    }
                    break;
                case 40: // ↓
                    this.selectNextCell('down', e);
                    break;
                case 38: // ↑
                    this.selectNextCell('up', e);
                    break;
                case 39: // →
                    this.selectNextCell('right', e);
                    break;
                case 37: // ←
                    this.selectNextCell('left', e);
                    break;
                case 9: // Tab
                    if (e.shiftKey) {
                        this.selectNextCell('left', e);
                    } else {
                        this.selectNextCell('right', e);
                    }
                    e.preventDefault();
                    break;
            }
        }
    }


    private unsubscribes() {
        this.subscriptions.forEach(ss => {
            if (ss) {
                ss.unsubscribe();
                ss = null;
            }
        });

        this.subscriptions = [];

        if (this.docuemntCellClickEvents) {
            this.docuemntCellClickEvents();
        }
    }

    //#endregion

    //#region Editing

    isRowEditing() {
        if (!this.selectedRow || this.selectedRow.index === -1) {
            return false;
        } else {
            return this.selectedRow.editors && this.selectedRow.editors.length;
        }
    }

    isCellEditing() {
        if (this.currentCell) {
            return this.currentCell.isEditing;
        }
        return false;
    }

    isEditing() {
        if (this.editMode === 'row') {
            return this.isRowEditing();
        } else {
            return this.isCellEditing();
        }
    }

    getEditors() {
        return this.selectedRow.editors;
    }

    editCell(rowId: any, field: string) {
        const rowIndex = this.dfs.findRowIndex(rowId);
        if (rowIndex > -1) {
            this.endCellEdit();
            const trId = 'row-' + rowIndex;
            const trDom = this.el.nativeElement.querySelector('#' + trId);
            if (trDom) {
                const tdDom = trDom.querySelector(`[field="${field}"]`);
                if (tdDom && tdDom['editCell']) {
                    tdDom.editCell();
                }
            }
        }
    }

    endCellEdit() {
        document.body.click();
    }

    editRow(rowId?: any) {
        if (!this.editable || this.editMode !== 'row') { return false; }

        if (rowId) {
            this.selectRow(rowId);
        }


        if (!this.selectedRow || this.selectedRow.index === -1) {
            console.warn('Please select a row.');
            return false;
        }

        const { index: rowIndex, data: rowData } = { ...this.selectedRow};

        const beforeEditEvent = this.beforeEdit(rowIndex, rowData);
        if (!beforeEditEvent || !beforeEditEvent.subscribe) {
            console.warn('please return an Observable Type.');
            return;
        }

        beforeEditEvent.subscribe( (flag: boolean) => {
            if (flag) {
                if (this.selectedRow.dr) {
                    const cells = this.selectedRow.dr.cells.toArray();
                    if (!cells || !cells.length) {
                        return;
                    }

                    cells.forEach(cell => {
                        if (cell.column.editor) {
                            cell.isEditing = true;
                        }
                    });
                    setTimeout(() => {
                        const editors = cells.map( cell => {
                            if (cell.cellEditor) {
                                return cell.cellEditor.componentRef;
                            }
                        }).filter(editor => editor);
                        this.selectedRow.editors = editors;

                        if (editors && editors.length) {
                            editors[0].instance.inputElement.focus();
                        }

                        // 绑定键盘事件
                        this.bindRowEditorKeydownEvent();

                        this.beginEdit.emit({ rowIndex, rowData});
                        this.cd.detectChanges();
                    });
                }
            }
        });

    }

    endRowEdit() {
        if (!this.isRowEditing()) {
            return { canEnd: true };
        }

        if (!this.selectedRow || this.selectedRow.index === -1) {
            console.warn('Please select a row.');
            return;
        }
        const { index: rowIndex, data: rowData, dr } = { ...this.selectedRow};
        // blur
        document.body.click();

        if (this.pending) {
            return { canEnd: false };
        }

        const rowForm = dr.form as FormGroup;
        rowForm.markAsTouched();
        if (rowForm.invalid && !this.endEditByInvalid) {
            return { canEnd: false };
        }


        const afterEditEvent = this.afterEdit(rowIndex, rowData);
        if (!afterEditEvent || !afterEditEvent.subscribe) {
            console.warn('please return an Observable Type.');
            return { canEnd: false };
        }

        afterEditEvent.subscribe( (flag: boolean) => {
            if (flag) {
                this.closeAllCellEditor();

                if (this.selectedRow.dr.form) {
                    this.selectedRow.dr.rowData = Object.assign(this.selectedRow.dr.rowData, this.selectedRow.dr.form.value);
                    this.dfs.updateRow(this.selectedRow.dr.rowData);
                    this.cd.detectChanges();
                }

                this.endEdit.emit({rowIndex, rowData});
            }
        });
    }

    cancelEdit(rowId: any) {

        if (!this.isEditing()) {
            return;
        }

        this.closeAllCellEditor();
        this.dfs.rejectChanges(rowId);

        this.cd.detectChanges();
        this.cancelEdited.emit();
    }

    private closeAllCellEditor() {
        const cells = this.selectedRow.dr.cells;
        cells.forEach(cell => cell.isEditing = false);
        if (this.currentCell) {
            this.currentCell.isEditing = false;
        }
        this.selectedRow.editors = null;

        // 取消键盘事件
        this.unbindRowEditorKeydownEvent();
    }

    private rowEditTabKeydwonEvent(e: any) {
        const keyCode = e.which || e.keyCode;

        if (keyCode === 9) {
            const td = e.target.closest('td');
            const tr = e.target.closest('tr');
            const nextTd = td.nextElementSibling;

            const hasNoEditor = (_td: any) => {
                return  !_td.querySelector('input') && !_td.querySelector('textarea') && !_td.querySelector('select');
            };

            const editNextRow = () => {
                const nextTr = tr.nextElementSibling;
                if (nextTr) {
                    nextTr.click();
                    const nextRowid = nextTr.getAttribute('id').replace('row-', '');
                    if (nextRowid) {
                        this.editRow(nextRowid);
                    }
                }
            };

            if (nextTd) {
                if (hasNoEditor(nextTd)) {
                    const tds = tr.querySelectorAll('td');
                    let tdIdx = -1;
                    tds.forEach((t, i) => {
                        if (t === nextTd) {
                            tdIdx = i;
                        }
                    });
                    let nextTrEdit = true;
                    while (tdIdx < tds.length) {
                        const _ntd = tds[tdIdx];
                        if (hasNoEditor(_ntd)) {
                            tdIdx++;
                        } else {
                            nextTrEdit = false;
                            break;
                        }
                    }

                    if (nextTrEdit) {
                        editNextRow();
                    }
                }
            } else {
                editNextRow();
            }
        }

        e.stopPropagation();
    }

    private bindRowEditorKeydownEvent() {
        if (!this.documentRowEditKeydownHanlder) {
            this.documentRowEditKeydownHanlder = this.render2.listen(document, 'keydown', this.rowEditTabKeydwonEvent.bind(this));
        }
        this.documentClickEndRowEditHandler = this.render2.listen(document, 'click', (e: Event) => {
            if (this.pending) {
                return false;
            }
            if (Utils.hasDialogOpen()) {
                return;
            }

            if (this.isRowEditing()) {

                // this.endRowEdit();
            }
        });
    }

    private unbindRowEditorKeydownEvent() {
        // 取消键盘事件
        if (this.documentRowEditKeydownHanlder) {
            this.documentRowEditKeydownHanlder();
            this.documentRowEditKeydownHanlder = null;
        }

        if (this.documentClickEndRowEditHandler) {
            this.documentClickEndRowEditHandler();
            this.documentClickEndRowEditHandler = null;
        }
    }

    //#endregion

    //#region Load Data

    loadData(data?: any) {
        this.closeLoading();
        data = data || [];
        if (this.pagination) {
            this.dfs.setPagination(this.pageIndex, this.pageSize, this.total);

            this.pagerOpts = Object.assign(this.pagerOpts, {
                itemsPerPage: this.pageSize,
                currentPage: this.pageIndex,
                totalItems: this.total
            });
            this.cd.detectChanges();
        }
        this.data = data;
        this.dfs.loadData(data);
        this.dgs.dataSourceChanged();
    }

    fetchData(pageIndex, pageSize) {
        if (this.restService) {
            this.showLoading();
            const params = { pageIndex, pageSize };
            if (this.sortName) {
                params['sortName'] = this.sortName;
            }
            if (this.sortOrder) {
                params['sortOrder'] = this.sortOrder;
            }

            return this.restService.getData(this.url, params);
        }
        return of(undefined);
    }

    refresh() {
        this.dfs.refresh();
    }


    reload(isSort = false) {
        this.fetchData(1, this.pageSize).subscribe(res => {
            if (res) {
                this.pageIndex = 1;
                this.total = res.total;
                this.loadData(res.items);

                if (isSort) {
                    this.columnSorted.emit();
                }
            }
        });
    }

    //#endregion

    //#region Pagination

    setPageIndex(pageIndex: number) {
        // console.log(this.dgPager.pagination);
        this.pageIndex = pageIndex;
        this.pagerOpts.currentPage = pageIndex;
        this.cd.detectChanges();
    }


    onPageChange(pageIndex: number) {
        if (this.lockPagination) {
            return;
        }
        this.pageIndex = pageIndex;
        this.pagerOpts.currentPage = pageIndex;

        this.fetchData(pageIndex, this.pageSize).subscribe(res => {
            if (res) {
                this.loadData(res.items);
            }
        });

        this.pageChanged.emit({pageIndex, pageSize: this.pageSize});
    }

    onPageSizeChange(pageSize: number) {
        if (this.lockPagination) {
            return;
        }
        this.pageSize = pageSize;
        this.pagerOpts.itemsPerPage = pageSize;

        this.fetchData(1, pageSize).subscribe(res => {
            if (res) {
                this.pageIndex = 1;
                this.loadData(res.items);
            }
        });

        this.pageSizeChanged.emit({pageSize, pageIndex: this.pageIndex});
    }

    //#endregion

    //#region Loading
    showLoading() {
        this.loading = true;
        this.cd.detectChanges();
    }

    closeLoading() {
        this.loading = false;
        this.cd.detectChanges();
    }
    //#endregion

    //#region Dom

    private replacePX2Empty(strNum: string) {
        if (strNum) {
            return Number.parseInt(strNum.replace('px', ''), 10);
        }
        return 0;
    }

    renderCustomStyle(cs: CustomStyle, dom: any) {
        if (!cs) {
            return;
        }
        if (cs.cls) {
            this.render2.addClass(dom, cs.cls);
        }

        if (cs.style) {
            const cssKeys = Object.keys(cs.style);
            cssKeys.forEach(k => {
                this.render2.setStyle(dom, k, cs.style[k]);
            });
        }
    }

    getBoundingClientRect(el: ElementRef) {
        return el.nativeElement.getBoundingClientRect();
    }

    getElementPadding(el: HTMLElement) {
        const style = getComputedStyle(el);
        return {
            top:  this.replacePX2Empty(style.paddingTop),
            left:  this.replacePX2Empty(style.paddingLeft),
            bottom:  this.replacePX2Empty(style.paddingBottom),
            right:  this.replacePX2Empty(style.paddingRight)
        };
    }

    getElementBorderWidth(el: HTMLElement) {
        const style = getComputedStyle(el);
        return {
            top: this.replacePX2Empty(style.borderTopWidth),
            bottom: this.replacePX2Empty(style.borderBottomWidth),
            right: this.replacePX2Empty(style.borderRightWidth),
            left: this.replacePX2Empty(style.borderLeftWidth)
        };
    }

    formatData(field: any, data: any, formatter: any) {
        const value = this.getFieldValue(field, data);
        return this.colFormatSer.format(value, data, formatter);
    }

    getFieldValue(field, rowData) {
        return Utils.getValue(field, rowData);
    }

    //#endregion

    //#region Select
    private canOperateCheckbox() {
        return this.multiSelect && this.showCheckbox;
    }
    private findNextCell(field: string, dir: MoveDirection) {
        let td = null;
        if (this.currentCell && this.currentCell.cellElement) {
            const cellIndex = this.dfs.getColumnIndex(field);
            const currCellEl = this.currentCell.cellElement;
            if (dir === 'up') {
                const prevTr = currCellEl.parentElement.previousElementSibling;
                if (prevTr) {
                    td = prevTr.children[cellIndex];
                }
            } else if (dir === 'down') {
                const nextTr = currCellEl.parentElement.nextElementSibling;
                if (nextTr) {
                    td = nextTr.children[cellIndex];
                }
            } else if (dir === 'left') {
                td = currCellEl.previousElementSibling;
            } else if (dir === 'right') {
                td = currCellEl.nextElementSibling;
            }
        }
        return td;
    }

    selectNextCell( dir: MoveDirection, event: Event) {
        const nextTd = this.findNextCell(this.currentCell.field, dir);
        if (nextTd) {
            if (this.clickToEdit) {
                nextTd['selectCell']();
            } else {
                nextTd['click'].apply(nextTd, [event]);
            }
            return nextTd;
        }
    }

    selectNextRow() {
        if (this.selectedRow) {
            const tr = this.selectedRow.dr.el.nativeElement;
            if (tr.nextElementSibling) {
                tr.nextElementSibling.click();
            }
        }
    }
    selectPrevRow() {
        if (this.selectedRow) {
            const tr = this.selectedRow.dr.el.nativeElement;
            if (tr.previousElementSibling) {
                tr.previousElementSibling.click();
            }
        }
    }

    selectRow(id: any) {
        if (id && (!this.selectedRow || this.selectedRow.id != id)) {
            this.dfs.selectRecord(id);
        }
    }

    unSelectRow(id: any) {
        if (id) {
            this.dfs.selectRecord(id, false);
        }
    }

    selectAllRows() {
        if (this.multiSelect) {
            this.dfs.selectAll();
        }
    }

    clearSelections() {
        this.dfs.clearSelections();
    }

    checkRow(id: any) {
        if (this.canOperateCheckbox()) {
            this.dfs.checkRecord(id);
        }
    }

    checkAllRows() {
        if (this.canOperateCheckbox()) {
            this.dfs.checkAll();
            this.dgs.checkAll.emit();
            this.checkAll.emit();
        }
    }

    unCheckRow(id: any) {
        if (this.canOperateCheckbox()) {
            this.dfs.checkRecord(id, false);
        }
    }

    clearCheckeds() {
        this.dfs.clearCheckeds();
        this.dgs.uncheckAll.emit();
    }

    clearAll() {
        this.clearCheckeds();
        this.clearSelections();
    }
    //#endregion

    //#region Resize Column

    private getResizeProxyPosLeft(e: MouseEvent) {
        const target = e.target as any;
        const dgRect = this.getBoundingClientRect(this.dgContainer);
        const td = target.parentElement;
        const tdLeft = td.getBoundingClientRect().left;
        const deltaEdge = td.offsetWidth - (e.pageX - tdLeft);
        this.resizeColumnInfo.proxyLineEdge = deltaEdge;
        this.resizeColumnInfo.startWidth = td.offsetWidth;
        this.resizeColumnInfo.startX = e.pageX;
        this.resizeColumnInfo.left = tdLeft - dgRect.left - 1 + deltaEdge;
        return e.pageX - dgRect.left - 2 + deltaEdge;
    }

    private toggleResizeProxy(show = true) {
        let display = 'block';
        if (!show) {
            display = 'none';
        }
        this.render2.setStyle(this.resizeProxyBg.nativeElement, 'display', display);
        this.render2.setStyle(this.resizeProxy.nativeElement, 'display', display);
    }

    onColumnResizeBegin(e: MouseEvent) {
        if (this.resizeProxy) {
            this.render2.setStyle(document.body, 'cursor', 'e-resize');
            const proxy = this.resizeProxy.nativeElement;
            const proxyPosLeft = this.getResizeProxyPosLeft(e);
            this.render2.setStyle(proxy, 'left', proxyPosLeft  + 'px');
            this.render2.setStyle(proxy, 'height', (this.height - this.pagerHeight) + 'px');
            this.toggleResizeProxy();
        }
    }
    onColumnResize(e: MouseEvent) {
        const proxy = this.resizeProxy.nativeElement;
        const dgRect = this.getBoundingClientRect(this.dgContainer);
        const proxyPosLeft = e.pageX - dgRect.left - 1 + this.resizeColumnInfo.proxyLineEdge;
        if (proxyPosLeft - this.resizeColumnInfo.left > 20 ) {
            this.render2.setStyle(proxy, 'left', proxyPosLeft + 'px');
        } else {
            this.render2.setStyle(proxy, 'left', ( this.resizeColumnInfo.left + 20) + 'px');
        }
        e.stopPropagation();
        e.preventDefault();
    }
    onColumnResizeEnd(e: MouseEvent, col: DataColumn) {
        this.render2.removeStyle(document.body, 'cursor');
        const proxy = this.resizeProxy.nativeElement;
        this.toggleResizeProxy(false);
        this.resizeColumnInfo.proxyLineEdge = 0;

        let newColWidth = this.resizeColumnInfo.startWidth + e.pageX - this.resizeColumnInfo.startX;

        if (newColWidth < 20) {
            newColWidth = 20;
        }
        col.width = newColWidth;
        this.dfs.resizeColumns();
        this.dgs.columnResized.emit();
    }

    /** 单元格内容自适应列宽 */
    sizeToContent(col: DataColumn, th: ElementRef) {
        if (!this.AutoColumnWidthUseDblclick) {
            return false;
        }
        let longestText = '';
        const items = this.data;
        for (let i = items.length - 1; i >= 0; i--) {
            const text = '' + Utils.getValue(col.field, items[i]);
            if (text.length > longestText.length) {
                longestText = text;
            }
        }

        this.longTextArea.nativeElement.innerHTML = longestText;

        const maxWidth = this.longTextArea.nativeElement.offsetWidth + 15;

        this.longTextArea.nativeElement.innerHTML = th.nativeElement.innerText;
        const thMinWidth = this.longTextArea.nativeElement.offsetWidth + 15;


        col.width = (maxWidth > thMinWidth ? maxWidth : thMinWidth);
        this.dfs.resizeColumns();
        this.dgs.columnResized.emit();
    }

    restituteColumnsSize() {
        this.dfs.resizeColumns(true);
        this.dgs.columnResized.emit();
    }

    //#endregion

    //#region Changes
    getChanges() {
        return this.dfs.getChanges();
    }

    acceptChanges() {
        this.dfs.acceptChanges();
    }

    rejectChanges() {
        this.dfs.rejectChanges();
    }
    //#endregion

    //#region CRUD

    appendRow(row: any) {
    }

    updateRow() {}

    refreshRow() {}

    deleteRow() {}

    validateRow() {}

    insertRow() {}

    //#endregion

    //#region Scrolling

    scrollToLeft() {
        if (this.scrollInstance) {
            this.scrollInstance.scrollToLeft(0, 200);
        }
    }

    scrollToRight() {
        if (this.scrollInstance) {
            this.scrollInstance.scrollToRight(0, 200);
        }
    }

    scrollToTop() {
        if (this.scrollInstance) {
            this.scrollInstance.scrollToTop(0, 100);
        }
    }

    scrollToBottom() {
        if (this.scrollInstance) {
            this.scrollInstance.scrollToBottom(0, 100);
        }
    }

    //#endregion
}
