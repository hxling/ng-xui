export class DatagridColumnsHelper {
    /** 获取总列数 */
    private static getColumnTotal(firstCols) {
        return firstCols.reduce((c, col) => {
            return c += col.colspan || 1;
        }, 0);
    }

    // 查找未赋值项的索引
    private static findUndefinedItem(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == undefined) {
                return i;
            }
        }
        return -1;
    }

    private static getColumnFields(columns) {
        const aa = [];
        // 根据第一行计算总列数
        const colTotal = DatagridColumnsHelper.getColumnTotal(columns[0]);
        // 创建空数组
        for (let i = 0; i < columns.length; i++) {
            aa[i] = new Array(colTotal);
        }
        for (let i = 0; i < columns.length; i++) {
            columns[i].forEach(col => {
                let k = DatagridColumnsHelper.findUndefinedItem(aa[i]);
                if (k >= 0) {
                    const field = col.field || col.id || '';
                    for (let c = 0; c < (col.colspan || 1); c++) {
                        for (let r = 0; r < (col.rowspan || 1); r++) {
                            aa[i + r][k] = field;
                        }
                        k++;
                    }
                }
            });
        }
        return aa;
    }

    static getFields(columns) {
        const fields =  DatagridColumnsHelper.getColumnFields(columns);
        return fields.length ? fields[fields.length - 1] : fields;
    }
}
