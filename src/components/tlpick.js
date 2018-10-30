/**
 *
 * timelinepick 一个时间轴滑块选择器
 * @author yelingfeng
 *
 */
import d3 from 'd3'
const QUARTER = 'quarter'
const HOUR = 'hour'
const DATE = 'date'
const FIVE = 'five'
const drawUtils = {
    bgLineColor :'#4e6881',
    // 下刻度线文字颜色
    bbTextColor : '#00a7f2',
    // 上分割线颜色
    lineTopScaleColor : '#00a7f2',
    // 下刻度线颜色
    lineBottomScaleColor : '#00a7f2',
    // 上分割线圆球颜色
    lineCycle:'#00fefe',
    // 滑块文本颜色
    spanRangeTextColor: '#00a7f2',
    /**
     * 创建上刻度线小球
     * @param p [x,y]
     */
    getTopLineCycle(p){
        var circle = new createjs.Shape();
        circle.graphics.setStrokeStyle(1).beginStroke(this.lineCycle).beginFill(this.lineCycle).drawCircle(0, 0, 2);
        circle.set({
            x:p[0],
            y:p[1]
        });
        TweenMax.from(circle, 0.5, {alpha: 0});
        return circle
    },
    /**
     * 创建线
     */
    _getLine(p1, p2, color){
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(2).beginStroke(color).moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).endStroke();
        return line;
    },
    /**
     * 创建上刻度线
     * @param  p1   [x1 ,y1] 开始点
     * @param p2 [x2 y2]  结束点
     */
    getTopLine(p1, p2){
        var line = this._getLine(p1, p2, this.lineTopScaleColor);
        TweenMax.from(line, 0.3, {scaleY: 0});
        return line;
    },
    //
    /**
     *  topLine 左文字
     *  @param name
     *  @param  p
     */
    getTopLineLeftText(name, p ){
        var text = this._getTLineText(name, p);
        text.textAlign = 'left';
        text.textBaseline = 'bottom';
        TweenMax.from(text, 0.3, {alpha: 0, x: '+=20'});
        return text;
    },
    /**
     *  topLine 右文字
     *  @param name
     * @param  p
     */
    getTopLineRightText(name, p){
        var text = this._getTLineText(name, p);
        text.textAlign = 'right';
        text.textBaseline = 'bottom';
        TweenMax.from(text, 0.3, {alpha: 0, x: '-=20'});
        return text;
    },
    /**
     * 获取下刻度线
     * @param  p1   [x1 ,y1] 开始点
     * @param  p2   [x2 y2]  结束点
     */
    getBottomLine(p1, p2){
        var line = this._getLine(p1, p2, this.lineTopScaleColor);
        TweenMax.from(line, 0.2, {scaleY: 0});
        return line;
    },
    /**
     * 获取线 下面文字
     * @param  p  [x ,y]
     */
    getBottomLineText(name, p){
        var text = this._getTLineText(name, p);
        text.textAlign = 'center';
        text.color = '#999';
        // 在滑块之外的刻度  透明 50%
        TweenMax.from(text, 0.3, {alpha: 0});
        return text;
    },
    /**
     * 创建text
     * @param t  String
     * @param p [x,y]
     */
    _getTLineText(t, p){
        var _text = new createjs.Text(t, 'bold 12px Microsoft YaHei');
        _text.set({
            x: p[0],
            y: p[1],
            color: '#fff'
        });
        return _text;
    },
    isFirstQuarterOfHour(date){
        return date.getMinutes() < 15;
    },
    // 一小时里第一个5分钟刻度
    isFisrtFiveOfHour(date){
        return date.getMinutes() < 5;
    },
    isFirstHourOfDay(date){
        return date.getHours() === 0;
    },
    isFirstDayOfMonth(date) {
        return date.format('MM') !== date.add('day', -1).format('MM');
    },
    /**
     * 检查是否为关键刻度 目的去突出线条
     * @param beginTime 时间
     * @param type 刻度类型
     */
    isNeedProminentLine(beginTime, type){
        let flag = false;
        if(FIVE === type &&  drawUtils.isFisrtFiveOfHour(beginTime) )flag = true;
        if(QUARTER ===type && drawUtils.isFirstQuarterOfHour(beginTime) )flag = true;
        return flag;
    }
}


Date.prototype.add = function(interval, value) {
    var d = new Date(this.getTime());
    if (!interval || value === 0)
        return d;

    switch (interval.toLowerCase()) {
        case 'milli' :
            d.setMilliseconds(d.getMilliseconds() + value);
            break;
        case 'second' :
            d.setSeconds(d.getSeconds() + value);
            break;
        case 'minute' :
            d.setMinutes(d.getMinutes() + value);
            break;
        case 'hour' :
            d.setHours(d.getHours() + value);
            break;
        case 'day' :
            d.setDate(d.getDate() + value);
            break;
        case 'month' :
            var new_year = d.getYear();
            var new_month = d.getMonth() + 1 + value;
            if(d.getMonth()>12) {
                new_month -=12;
                new_year++;
            }
            var new_date = new Date(new_year, new_month, 1);
            var lastDayOfPrevMonth =
                (new Date(new_date.getTime()-1000*60*60*24)).getDate();
            if(d.getDate() > lastDayOfPrevMonth){
                d.setDate(lastDayOfPrevMonth);
            }
            var month = d.getMonth() + value;
            d.setMonth(month);
            break;
        case 'year' :
            d.setFullYear(d.getFullYear() + value);
            break;
    }
    return d;
};
Date.prototype.format = function(pattern) {
    var fullyear = this.getFullYear(), minyear = fullyear.toString()
            .substring(2), month = this.getMonth() + 1, day = this.getDate(), hour = this
            .getHours(), minute = this.getMinutes(), second = this.getSeconds(), ms = this
            .getMilliseconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    if (ms < 10) {
        ms = '00' + ms;
    } else if (ms < 100) {
        ms = '0' + ms;
    }
    if (!pattern) {
        pattern = 'yyyy-MM-dd hh:mm:ss';
    }
    return pattern.replace('yyyy', fullyear).replace('yy', minyear).replace(
        'MM', month).replace('dd', day).replace('hh', hour).replace('mm',
        minute).replace('ss', second).replace('SSS', ms);
};
const config = {
    // 滑块颜色
    'spanColor': '#a2993e',
    // 滑块按钮颜色
    'buttonColor' : '#ff8251',
    // 箭头颜色
    'arrowColor': '#00b1fe',
    // 起点时间
    'threshold': new Date(),
    // 整个刻度
    'number': 97,
    // 最小滑块大小
    'spanMinNumber': 8,
    // 最大滑块大小
    'spanMaxNumber': 97,
    // 刻 触发滑块大小
    'quarterSpanNumber': 8,
    // 刻 触发滑块大小
    'hourSpanNumber': 8,
    // 刻 触发滑块大小
    'dateSpanNumber': 8,
    // 是否禁止拖拽
    'isFixedDrag' : true,
    // 是否自由拖动
    'isFreeDrag' : true,
    // 滑块初始位置
    'spanIndex': {start: 70, end: 90},
    // 时间类型
    'type': 'quarter',
    // 时间格式
    'dateFormat' : 'yyyy-MM-dd mm:hh:ss',

    'callback': function(){}
}
export default class TimelinePick {
    constructor(opts) {
        this.options = Object.assign({}, config, opts);
        this.create();
        this.drawCore();
        this.drawArrow();
        this.drawSlider();
        this.start();
    }
    init() {
        this.box = $(this.options.el);
        this.box.empty();
        this.canvas = $('<canvas></canvas>');
        this.canvasDom = this.canvas.get(0);
        this.canvas.appendTo(this.box).attr({'width':this.box.width(), 'height':this.box.height()});
        this.stage = new createjs.Stage(this.canvasDom);
        this.stage.enableMouseOver(10);
        this.stage.xp = this.canvasDom.width;
        this.stage.yp = this.canvasDom.height;
    }

    create() {
        this.stageBg = 0;
        this.stageSpan= 0;
        this.leftArrow= 0;
        this.rightArrow= 0;
        this.tempTimer = 0;
        this.tempInterval= 0;
        this.init();
        if (!this.nowTime) {
            this.nowTime = this.options.threshold;
        }
        this.paddingX = 30 ;
        this.xScale = d3.scale.linear().domain([0, this.options.number]).range([0, this.stage.xp - this.paddingX * 2]);
        this.spanDis = this.xScale(1) - this.xScale(0);
        this.spanColor = this.options.spanColor;
        this.buttonColor = this.options.buttonColor;
        this.arrowColor = this.options.arrowColor;
    }

    start() {
        var me = this;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.addEventListener('tick', function(){
            me.stage.update();
        })
    }

    /**
     * 画时间轴上部刻度效果
     * @time  时间
     * @type 时间类型
     * @format  格式化
     * @scale 比例尺坐标
     */
    _createTopScale(time, type, format, scale ){
        var topScale = new createjs.Container();
        topScale.addChild(drawUtils.getTopLine([scale, 0], [scale, -23]));
        topScale.addChild(drawUtils.getTopLineCycle([scale, -24]));
        topScale.addChild(drawUtils.getTopLineLeftText(time.format(format), [scale + 5, -5]));
        let mText;
        if(type === DATE ){
            mText = time.add('month', -1)
        } else if(type === HOUR){
            mText = time.add('day', -1)
        } else if(type === QUARTER){
            mText = time.add('day', -1)
        } else {
            let n = 15;
            if(type === FIVE){
                n = 5;
            }
            mText = time.add('minute', n)
        }
        topScale.addChild(drawUtils.getTopLineRightText(mText.format(format), [scale - 5, -5]));
        return topScale;
    }

    /**
     * 画主轴
     * @private
     */
    _createCodeline(){
        var bgContainer = new createjs.Container();
        var bgBar = new createjs.Shape();
        bgBar.graphics.beginFill(drawUtils.bgLineColor).drawRoundRect(0, 0, this.stage.xp -this.paddingX * 2, 1, 5).endFill();
        bgContainer.addChild(bgBar);
        bgContainer.set({
            x: this.paddingX,
            y: this.stage.yp * 0.45
        })
        return bgContainer;
    }

    /**
     * 画主轴 包括上中下
     */
    drawCore() {
        let type = this.options.type;
        const me = this;
        // 背景线颜色
        if (me.stageBg) {
            me.stageBg.removeAllChildren();
        } else {
            me.stageBg = new createjs.Container();
            me.stage.addChild(me.stageBg);
        }

        var upContainer = new createjs.Container();
        var downContainer = new createjs.Container();
        var beginTime, formatCode;
        if(QUARTER  === type) {
            beginTime = me.nowTime.add('minute', 15 * (- me.options.number + 1));
            formatCode = 'MM月dd日';
        } else if(FIVE === type) {
            beginTime = me.nowTime.add('minute', 5 * (- me.options.number + 1));
            formatCode = 'MM月dd日';
        } else if(HOUR === type) {
            beginTime = me.nowTime.add('hour', -me.options.number + 1);
            formatCode = 'MM月dd日';
        } else {
            beginTime = me.nowTime.add('day', -me.options.number + 1);
            formatCode = 'yy年MM月';
        }
        // 画top
        let topScale;
        for (let i = 0; i < me.options.number; i++) {
            topScale = new createjs.Container();
            if(QUARTER  === type ) {
                if (drawUtils.isFirstHourOfDay(beginTime) && drawUtils.isFirstQuarterOfHour(beginTime)) {
                    topScale = me._createTopScale(beginTime, type, formatCode, me.xScale(i));
                }
                beginTime = beginTime.add('minute', 15);
            } else if(FIVE === type){
                if(drawUtils.isFirstHourOfDay(beginTime) && drawUtils.isFisrtFiveOfHour(beginTime)){
                    topScale = me._createTopScale(beginTime, type, formatCode, me.xScale(i));
                }
                beginTime = beginTime.add('minute', 5);
            } else if(HOUR === type) {
                if (drawUtils.isFirstHourOfDay(beginTime)) {
                    topScale = me._createTopScale(beginTime, type, formatCode, me.xScale(i));
                }
                beginTime = beginTime.add('hour', 1);
            }else {
                if(drawUtils.isFirstDayOfMonth(beginTime)) {
                    topScale = me._createTopScale(beginTime, type, formatCode, me.xScale(i));
                }
                beginTime = beginTime.add('day', 1);
            }
            topScale.set({
                x: me.paddingX + me.spanDis / 2,
                y: me.stage.yp * 0.45
            })
            upContainer.addChild(topScale);
        }

        // 画down
        var bottomScale;
        if(QUARTER  === type ) {
            beginTime = me.nowTime.add('minute',  15 * (- me.options.number + 1));
        } else if(FIVE === type) {
            beginTime = me.nowTime.add('minute',  5 * (- me.options.number + 1));
        } else if(HOUR === type) {
            beginTime = me.nowTime.add('hour', -me.options.number + 1);
        } else{
            beginTime = me.nowTime.add('day', -me.options.number + 1);
        }
        for(let i = 0 ;i<me.options.number ;i++){
            bottomScale = new createjs.Container();

            let textPointY = 12;
            let linePointY = 5;
            if (drawUtils.isNeedProminentLine(beginTime, type)){
                linePointY = 8;
            }
            let line =  drawUtils.getBottomLine([me.xScale(i), 0], [me.xScale(i), linePointY]);
            if (i < me.options.spanIndex.start || i >= me.options.spanIndex.end) {
                line.alpha = 0.5;
            }
            bottomScale.addChild(line);
            if(QUARTER === type ){
                if (drawUtils.isFirstQuarterOfHour(beginTime)) {
                    let text = drawUtils.getBottomLineText(beginTime.format('hh'), [me.xScale(i), textPointY]);
                    if ( i < me.options.spanIndex.start || i >= me.options.spanIndex.end ) {
                        text.alpha = 0.5;
                    }else{
                        text.color = drawUtils.spanRangeTextColor;
                    }
                    bottomScale.addChild(text);
                }
                beginTime = beginTime.add('minute', 15 );
            } else if(FIVE === type){
                if (drawUtils.isFisrtFiveOfHour(beginTime)) {
                    let text = drawUtils.getBottomLineText(beginTime.format('hh'), [me.xScale(i), textPointY]);
                    if ( i < me.options.spanIndex.start || i >= me.options.spanIndex.end ) {
                        text.alpha = 0.5;
                    }else{
                        text.color = drawUtils.spanRangeTextColor;
                    }
                    bottomScale.addChild(text);
                }
                beginTime = beginTime.add('minute', 5);
            } else if(HOUR === type){
                if (i % 2 === 0) {
                    let text = drawUtils.getBottomLineText(beginTime.format('hh'), [me.xScale(i), textPointY]);
                    if (i < me.options.spanIndex.start || i >= me.options.spanIndex.end) {
                        text.alpha = 0.5;
                    }else{
                        text.color = drawUtils.spanRangeTextColor;
                    }
                    bottomScale.addChild(text);
                }
                beginTime = beginTime.add('hour', 1);
            }else {
                if (i % 2 === 0) {
                    let text = drawUtils.getBottomLineText(beginTime.format('dd'), [me.xScale(i), textPointY] );
                    bottomScale.addChild(text);
                    if (i < me.options.spanIndex.start || i >= me.options.spanIndex.end) {
                        text.alpha = 0.5;
                    }else{
                        text.color = drawUtils.spanRangeTextColor;
                    }
                }
                beginTime = beginTime.add('day', 1);
            }
            downContainer.addChild(bottomScale)
        }
        downContainer.set({
            x: 30 + me.spanDis / 2,
            y: me.stage.yp * 0.46
        });
        me.stageBg.addChild(upContainer);
        me.stageBg.addChild(me._createCodeline());
        me.stageBg.addChild(downContainer);
    }

    /**
     * 检查向右是否到最大值了
     */
    checkingBound() {
        return this.nowTime.getTime() >= this.options.threshold.getTime()
    }

    /**
     * 根据箭头方向 执行操作
     * @param vector ["left" ,"right"]
     *
     */
    _arrowAction(vector) {
        var left = vector === 'left' ;
        if (this.options.type === QUARTER || this.options.type === FIVE) {
            let n = FIVE === this.options.type ? 5 : 15 ;
            if(left){
                this.nowTime = this.nowTime.add('minute', -n);
            }else{
                if(!this.checkingBound())this.nowTime = this.nowTime.add('minute', n)
            }
        } else if (this.options.type === HOUR) {
            if(left) {
                this.nowTime = this.nowTime.add('hour', -1);
            }else {
                if(!this.checkingBound()) this.nowTime = this.nowTime.add('hour', 1);
            }
        } else if (this.options.type === DATE) {
            if(left) {
                this.nowTime = this.nowTime.add('day', -1);
            }else {
                if(!this.checkingBound()) this.nowTime = this.nowTime.add('day', 1);
            }
        }
        this.drawCore();
    }


    /**
     * 创建滑块
     */
    _createSlider(spanWidth, spanHeight){
        var me = this;
        var slider = new createjs.Shape();
        slider.alpha = 0.75;

        slider.drawColor = me.options.spanColor;
        slider.graphics.beginFill(slider.drawColor)
            .drawRect(0, 0, spanWidth, spanHeight)
            .endFill();

        slider.cursor = 'pointer';
        slider.on('mouseover', function() {
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(0, 0, spanWidth, spanHeight).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
        });
        slider.on('mouseout', function(e) {
            if (this.mousedownFlag) {
                return;
            }
            this.graphics.clear();
            this.graphics.beginFill(this.drawColor).drawRect(0, 0, spanWidth, spanHeight).endFill();
            this.shadow = new createjs.Shadow(this.drawColor, 0, 0, 5);
            clearInterval(me.tempTimer);
            clearTimeout(me.tempInterval);
        })
        slider.on('mousedown', function(e) {
            this.mousedownFlag = true;
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(0, 0,  spanWidth, spanHeight).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
            this.mouseOffsetX = e.stageX - this.parent.x;
        })
        slider.on('pressmove', function(e) {
            var indexLeft = (e.stageX - this.mouseOffsetX - 30 - me.spanDis / 2) / me.spanDis;
            var indexRight = indexLeft + me.options.spanIndex.end - me.options.spanIndex.start;
            if(this.parent){
                if (indexLeft < 0) {
                    this.parent.x = me.xScale(0) + 30 + me.spanDis / 2;
                } else if (indexRight > me.options.number) {
                    this.parent.x = me.xScale(me.options.number - me.options.spanIndex.end + me.options.spanIndex.start) + 30 + me.spanDis / 2
                } else {
                    this.parent.set({
                        x: e.stageX - this.mouseOffsetX
                    })
                }
            }
        })
        slider.on('pressup', function(e) {
            //计算应该在的位置
            var positionIndex = (this.parent.x - 30 - me.spanDis / 2) / me.spanDis;
            var newIndex = (positionIndex * 10 % 10 || 0) < 5 ? positionIndex || 0 : (positionIndex || 0) + 1;
            me.options.spanIndex.end = me.options.spanIndex.end - me.options.spanIndex.start + newIndex;
            me.options.spanIndex.start = newIndex;
            //计算好位置, 重绘
            me.refreshCaculate()
        })

        return slider;

    }

    /**
     * 创建滑块左右按钮
     */
    _createSliderBtn(size){
        var me = this;
        var button = new createjs.Shape();
        button.drawColor = me.buttonColor;
        button.graphics.beginFill(me.buttonColor).drawRect(5, 5, size[0], size[1]).endFill();
        button.shadow = new createjs.Shadow(me.buttonColor, 0, 0, 5);
        button.cursor = 'pointer';

        return button;
    }

    /***
     * 画滑块
     */
    drawSlider(){
        var me = this;
        if (me.stageSpan) {
            me.stageSpan.removeAllChildren();
        } else {
            me.stageSpan = new createjs.Container();
        }
        var size = [7, 20];
        var spanHeight = me.stage.yp * 0.1;
        var spanWidth = me.spanDis * (me.options.spanIndex.end - me.options.spanIndex.start - 1);
        //先画一个区域
        var slider = me._createSlider(spanWidth, spanHeight);
        me.stageSpan.timeSpan = slider;
        me.stageSpan.addChild(slider);

        var leftButton = me._createSliderBtn(size);
        var rightButton = me._createSliderBtn(size);

        me.stageSpan.leftButton = leftButton;
        me.stageSpan.rightButton = rightButton;
        me.stageSpan.addChild(leftButton);
        me.stageSpan.addChild(rightButton);

        let btnLeft = me.spanDis/ 2 ;
        if (me.stage.xp <= 900) {
            btnLeft = Math.round(btnLeft) + 2.5
        }

        if(me.options.number <= 30){
            btnLeft = 4.5;
        }

        leftButton.set({
            regX: btnLeft,
            regY: 8
        })
        rightButton.set({
            regX: btnLeft,
            regY: 8,
            x: me.xScale(me.options.spanIndex.end - me.options.spanIndex.start - 1)
        })


        leftButton.on('mouseover', function(e) {
            if(me.isFixedDrag())return ;
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(5, 5,  size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
        });

        leftButton.on('mouseout', function(e) {
            if (this.mousedownFlag) {
                return;
            }
            if(me.isFixedDrag())return ;
            this.graphics.clear();
            this.graphics.beginFill(this.drawColor).drawRect(5, 5, size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(this.drawColor, 0, 0, 5);
            clearInterval(me.tempTimer);
            clearTimeout(me.tempInterval);
        });

        leftButton.on('mousedown', function(e) {
            if(me.isFixedDrag())return ;
            this.deltaStart = e.stageX;
            this.mousedownFlag = true;
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(5, 5, size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
            this.mouseOffsetX = e.stageX - this.parent.x;
        })
        var initWidth = rightButton.x;
        leftButton.on('pressmove', function(e) {
            if(me.isFixedDrag())return ;
            //计算临界情况
            if (e.stageX < 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMaxNumber - 1)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMaxNumber - 1)
            } else if (e.stageX < 30 + me.spanDis / 2) {
                e.stageX = 30 + me.spanDis / 2;
            } else if (me.isFreeDrag()) {
                if (e.stageX > 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - 3)) {
                    e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - 3);
                }
            } else if (!me.isFreeDrag() && e.stageX > 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMinNumber - 1)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMinNumber - 1);
            }
            // } else if (e.stageX > 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMinNumber - 1)) {
            //     e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.end - me.options.spanMinNumber - 1);
            // }
            this.deltaSpan = e.stageX - this.deltaStart;
            var span = this.parent.timeSpan;
            var width = initWidth - this.deltaSpan;
            span.graphics.clear();
            rightButton.x = width;
            span.graphics.beginFill(span.drawColor).drawRect(0, 0, width, spanHeight).endFill();
            span.shadow = new createjs.Shadow(span.drawColor, 0, 0, 5);
            this.parent.set({
                x: e.stageX - this.mouseOffsetX
            })
        })
        leftButton.on('pressup', function(e) {
            if(me.isFixedDrag())return ;
            initWidth = rightButton.x;
            var positionIndex = (this.parent.x - 30 - me.spanDis / 2) / me.spanDis;
            var newIndex = (positionIndex * 10 % 10 || 0) < 5 ? positionIndex || 0 : (positionIndex || 0) + 1;
            me.options.spanIndex.start = newIndex ;
            //计算好位置, 重绘
            me.refreshCaculate();
        })

        rightButton.on('mouseover', function(e) {
            if(me.isFixedDrag())return ;
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(5, 5, size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
        })

        rightButton.on('mouseout', function(e) {
            if (this.mousedownFlag) {
                return;
            }
            if(me.isFixedDrag())return ;
            this.graphics.clear();
            this.graphics.beginFill(this.drawColor).drawRect(5, 5, size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(this.drawColor, 0, 0, 5);
            clearInterval(me.tempTimer);
            clearTimeout(me.tempInterval);
        })

        rightButton.on('mousedown', function(e) {
            if(me.isFixedDrag())return ;

            this.deltaStart = e.stageX;
            this.mousedownFlag = true;
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).drawRect(5, 5, size[0], size[1]).endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 5);
            this.mouseOffsetX = e.stageX - this.parent.x;
        })
        var initWidth = rightButton.x;
        rightButton.on('pressmove', function(e) {

            if(me.isFixedDrag())return ;
            //计算临界情况
            // if (e.stageX < 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMinNumber)) {
            //     e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMinNumber);
            if (me.isFreeDrag() && e.stageX < 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + 2)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + 2);
            } else if (!me.isFreeDrag() && e.stageX < 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMinNumber)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMinNumber);
            } else if (e.stageX > 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMaxNumber - 1)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.spanIndex.start + me.options.spanMaxNumber - 1)
            } else if (e.stageX > 30 + me.spanDis / 2 + me.xScale(me.options.number - 1)) {
                e.stageX = 30 + me.spanDis / 2 + me.xScale(me.options.number - 1);
            }
            this.deltaSpan = -e.stageX + this.deltaStart;
            var span = this.parent.timeSpan;
            var width = initWidth - this.deltaSpan;
            span.graphics.clear();
            this.x = width;
            span.graphics.beginFill(span.drawColor).drawRect(0, 0, width, spanHeight).endFill();
            span.shadow = new createjs.Shadow(span.drawColor, 0, 0, 5);

        })
        rightButton.on('pressup', function(e) {
            if(me.isFixedDrag())return ;
            initWidth = rightButton.x;
            var positionIndex = (this.parent.x - 30 - me.spanDis / 2 + this.x) / me.spanDis;
            var newIndex = (positionIndex * 10 % 10 || 0) < 5 ? positionIndex || 0 : (positionIndex || 0) + 1;
            me.options.spanIndex.end = newIndex + 1;
            //计算好位置, 重绘
            me.refreshCaculate();
        })

        var min = me.options.spanIndex.end - me.options.spanIndex.start - 1;
        if(min === 1){
            this.hideSpanButton()
        }

        me.stageSpan.set({
            x: me.xScale(me.options.spanIndex.start) + 30 + me.spanDis / 2,
            y: me.stage.yp * 0.4
        })
        me.stage.addChild(me.stageSpan);
    }
    /**
     * 画箭头
     * @String vector 方向
     * @Array p1 [x,y]
     * @Array p2 [x2,y2]
     * @Array p3 [x3,y3]
     * @return shape
     */
    _createArrow(vector, p1, p2, p3 ){
        var me = this;
        var arrow = new createjs.Shape();
        var color = me.arrowColor;
        arrow.drawColor = color;
        arrow.graphics.beginFill(color).moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).lineTo(p3[0], p3[1]).closePath().endFill();
        arrow.shadow = new createjs.Shadow(color, 0, 0, 2);
        arrow.cursor = 'pointer';
        arrow.on('mouseover', function() {
            this.graphics.clear();
            var hoverColor = d3.rgb(this.drawColor).brighter();
            this.graphics.beginFill(hoverColor).moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).lineTo(p3[0], p3[1]).closePath().endFill();
            this.shadow = new createjs.Shadow(hoverColor, 0, 0, 2);
        });
        arrow.on('mouseout', function() {
            this.graphics.clear();
            this.graphics.beginFill(this.drawColor).moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).lineTo(p3[0], p3[1]).closePath().endFill();
            this.shadow = new createjs.Shadow(this.drawColor, 0, 0, 2);
            clearInterval(me.tempTimer);
            clearTimeout(me.tempInterval);
        });
        arrow.on('mousedown', function(e) {
            clearInterval(me.tempTimer);
            clearTimeout(me.tempInterval);
            me._arrowAction(vector)
            me.tempTimer = setTimeout(function() {
                me.tempInterval = setInterval(function() {
                    me._arrowAction(vector);
                }, 50);
            }, 500)
            $(me.options.parent).one('mouseup', function(e) {
                me.clearStopCaculate();
                e.preventDefault();
            });
        })

        arrow.set({
            x: vector === 'left'? 15: me.stage.xp - 25,
            y: me.stage.yp * 0.37
        })
        return arrow;
    }
    // 画左右箭头
    drawArrow(){
        var leftPath = [[this.paddingX / 2, 0], [this.paddingX /2, this.stage.yp * 0.15], [0, this.stage.yp * 0.075]]
        var rightPath = [[0, 0], [0, this.stage.yp * 0.15], [this.paddingX / 2, this.stage.yp * 0.075]]
        this.leftArrow = this._createArrow('left', ...leftPath);
        this.rightArrow = this._createArrow('right', ...rightPath);
        this.stage.addChild(this.leftArrow);
        this.stage.addChild(this.rightArrow);
    }

    isFixedDrag(){
        return this.options.isFixedDrag === '0';
    }

    isFreeDrag(){
        return this.options.isFreeDrag === '1'
    }

    destory(){

    }

    hideSpanButton() {
        this.stageSpan.leftButton.alpha = 0;
        this.stageSpan.rightButton.alpha = 0;
    }
    setType(type) {
        if(type=== FIVE){
            type = QUARTER
        }
        this.options.type = type;
        if (type === QUARTER) {
            this.options.spanIndex.start = this.options.spanIndex.end - this.options.quarterSpanNumber + 1
            if (this.options.quarterSpanNumber === 1) {
                this.options.spanMinNumber = 1
                this.options.spanIndex.start = this.options.spanIndex.end - 2
            }
        } else if (type === HOUR) {
            this.options.spanIndex.start = this.options.spanIndex.end - this.options.hourSpanNumber + 1
            if (this.options.hourSpanNumber === 1) {
                this.options.spanMinNumber = 1
                this.options.spanIndex.start = this.options.spanIndex.end - 2
            }
        } else if (type === DATE) {
            this.options.spanIndex.start = this.options.spanIndex.end - this.options.dateSpanNumber + 1
            if (this.options.dateSpanNumber === 1) {
                this.options.spanMinNumber = 1
                this.options.spanIndex.start = this.options.spanIndex.end - 2
            }
        }
        //重绘
        this.drawCore();
        this.drawSlider();
    }
    getOptions() {
        return this.options;
    }
    // 刷新
    refresh(){
        this.nowTime = new Date();
        this.setType(this.options.type);
    }
    clearStopCaculate(){
        clearInterval(this.tempTimer);
        clearTimeout(this.tempInterval);
        this.options.callback(this.caculateTimeSpan());
    }
    refreshCaculate(){
        this.drawCore();
        this.drawSlider();
        this.options.callback(this.caculateTimeSpan());
    }
    caculateTimeSpan(){
        const me = this;
        let timeType = me.options.type === 'date' ? 'date' : me.options.type;
        let dateFormat = me.options.dateFormat ;
        // 刻
        if (me.options.type === QUARTER) {
            let baseTime = me.nowTime.add('minute', 15 * (1 - me.options.number));
            let startTime = baseTime.add('minute', 15 * me.options.spanIndex.start);
            let endTime = baseTime.add('minute', 15 * (me.options.spanIndex.end - 1));
            let ts = startTime.getMinutes() / 15 || 0;
            let te = endTime.getMinutes() / 15 || 0;
            return {
                startTime: startTime.format('yyyy-MM-dd hh:') + (ts * 15 < 10 ? '0' + ts * 15 : ts * 15) + ':00',
                endTime: endTime.format('yyyy-MM-dd hh:') + (te * 15 < 10 ? '0' + te * 15 : te * 15) + ':00',
                timeType: timeType
            };
        }
        // 5分钟
        else if (me.options.type === FIVE){
            let baseTime = me.nowTime.add('minute', 5 * (1 - me.options.number));
            let startTime = baseTime.add('minute', 5 * me.options.spanIndex.start);
            let endTime = baseTime.add('minute', 5 * (me.options.spanIndex.end - 1));
            let ts = startTime.getMinutes() / 5 || 0;
            let te = endTime.getMinutes() / 5 || 0;
            return {
                startTime: startTime.format('yyyy-MM-dd hh:') + (ts * 5 < 10 ? '0' + ts * 5 : ts * 5) + ':00',
                endTime: endTime.format('yyyy-MM-dd hh:') + (te * 5 < 10 ? '0' + te * 5 : te * 5) + ':00',
                timeType: timeType
            };
        }
        // 小时
        else if (me.options.type === HOUR) {
            let baseTime = me.nowTime.add('hour', 1 - me.options.number);
            let startTime = baseTime.add('hour', me.options.spanIndex.start);
            let endTime = baseTime.add('hour', me.options.spanIndex.end - 1);
            return {
                startTime: startTime.format('yyyy-MM-dd hh:00:00'),
                endTime: endTime.format('yyyy-MM-dd hh:00:00'),
                timeType: timeType
            };
        }
        // 天
        else if (me.options.type === DATE) {
            let baseTime = me.nowTime.add('day', 1 - me.options.number);
            let startTime = baseTime.add('day', me.options.spanIndex.start);
            let endTime = baseTime.add('day', me.options.spanIndex.end - 1);
            var _format = dateFormat !== 'yyyy-MM-dd hh:mm:ss' ? dateFormat : 'yyyy-MM-dd 00:00:00';
            return {
                startTime: startTime.format(_format),
                endTime: endTime.format(_format),
                timeType: timeType
            };
        }
    }
}
