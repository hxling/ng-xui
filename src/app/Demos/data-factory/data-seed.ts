export class DataSeed {

    static users =  [
        'ZhangSan', 'LiSi', 'WangWu', 'ZhaoLiu',
        'XiongDa', 'HuiTailang', 'XiYangyang', 'XiaoHuihui',
        'ZhangXiaojing', 'TangSangzang', 'XunWukong', 'HuLuwa',
        'ShunLiu', 'XuSanduo', 'ZouBapi', 'Super mary',
        'ChouNiZadi', 'WoZainali', 'NiShishui', 'Super Haha Star'
    ];
    static userNames = [
        '张三八', '李四九', '王五七', '赵六六',
        '熊大大', '灰太狼', '喜洋洋', '小灰灰',
        '张小敬', '糖三脏', '熏悟空', '葫芦娃',
        '顺溜六', '许三多', '周八皮', '超级玛莉',
        '瞅你咋地', '我在哪', '你是谁', '超级笑星'
    ];

    static companies = [ 'IBM', 'Microsoft', 'Lenovo', 'HuaWei', 'XiaoMi', 'Inspur', 'ALiBaba', 'SAP', '用友', '金蝶', 'QQ', 'OPPO', 'Vivo'];

    static getXingBie() {
        return ['男', '女'][DataSeed.randomNum(0, 1)];
    }

    static getYear() {
        const minYear = 1959;
        const maxYear = 2019;
        const years = maxYear - minYear;

        return minYear + DataSeed.randomNum(0, years);
    }

    static getMonths() {
        const m = DataSeed.randomNum(1, 12);
        if (m < 10) {
            return ('' + m).padStart(2, '0');
        }

        return m;
    }

    static getDays() {
        const m = DataSeed.randomNum(1, 30);
        if (m < 10) {
            return ('' + m).padStart(2, '0');
        }
        return m;
    }

    static getFullDate() {
        return `${DataSeed.getYear()}-${DataSeed.getMonths()}-${DataSeed.getDays()}`;
    }

    static getCompany() {
        return DataSeed.companies[DataSeed.randomNum(0, 12)];
    }

    static getZhiWei() {
        // return ['司令', '军长', '师长', '旅长', '团长', '营长', '连长', '排长', '班长'][DataSeed.randomNum(0, 8)];
        const n = DataSeed.randomNum(1, 8);
        return '9'.repeat(9 - n);
    }

    static enumData() {
        return [
            {label: '司令', value: '999999999'},
            {label: '军长', value: '99999999'},
            {label: '师长', value: '9999999'},
            {label: '旅长', value: '999999'},
            {label: '团长', value: '99999'},
            {label: '营长', value: '9999'},
            {label: '连长', value: '999'},
            {label: '排长', value: '99'},
            {label: '班长', value: '9'}
        ];
    }

    static randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt('' + (Math.random() * minNum + 1), 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

            default:
                return 0;
        }
    }
}
