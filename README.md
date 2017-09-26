
<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="/vue.png" width="200" height="200">
  </a>
</p>

# Vue-Timelinepick

 时间范围选择插件 取当前时间之前一段时间范围  按刻，小时，天分类

[demo地址](https://yelingfeng.github.io/vue-timelinepick/)

![](/pp.gif)

## dependencies
> * jquery <=2.x
> * d3 < 4.x
> * createjs
> * tweenMax

## Examples

引入依赖文件
``` js

import timelinepick from "vue-timelinepick"
import "vue-timelinepick/dist/vue-timelinepick.css"

Vue.use(timelinepick)

```

vue组件中直接使用
``` js
<timelinepick :option="op" :width="width" :height="height" :handler="changeAction"></timelinepick>

data() {
      return {
          "width": 1200,
          "height":110,
          "op" : {
              "threshold": new Date(),
              "number": 97,
              "spanMinNumber": 10,
              "isFixedDrag" : true,
              "spanIndex": {start: 70, end: 97},
              "type": "quarter",
              "dateFormat" : 'yyyy-MM-dd mm:hh:ss'
          }
      }
  },
methods:{
    changeAction(e){
        this.startTime = e.startTime;
        this.endTime = e.endTime;
    }
}
```
## props
| 属性        | 说明         | 
| -------------: |:-------------|
| width       | 宽   |
| height      | 高      |  
| option      | 配置项  |  
### options
| 属性        | 说明         | 
| -------------: |:-------------|
| threshold      | 起点时间（默认当前） new Date()   |
| number         |  总刻度   97  |  
| isFixedDrag    |   是否禁止拖拽 false |  
| spanIndex    |   起始滑块范围   {start: 70, end: 97}| 
| type    |   刻度类型  "quarter" | 
| dateFormat | 格式 'yyyy-MM-dd mm:hh:ss'|
