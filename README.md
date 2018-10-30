# Vue-tlpick
> 更新最新`vue-cli`和`vue` 最新版

基于creatjs开发的 时间范围内的选择时间轴， 取当前时间之前一段时间范围  按刻，小时，天分类。

>  依赖`d3` ,`TweenMax`

[demo地址](https://yelingfeng.github.io/vue-timelinepick/)

## 下载安装

```js

  npm install vue-tlpick  

```


## 插件使用


引入依赖文件
``` js
import "vue-tlpick/src/createjs"
import "vue-tlpick/src/TweenMax"
import "vue-tlpick/lib/vue-tlpick.css"
import tlpick from "vue-tlpick"
Vue.use(tlpick)

```

vue组件中直接使用
``` js
<tlpick :option="op" :width="width" :height="height" :change="changeAction"></tlpick>

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
|  change |事件  |
### options
| 属性        | 说明         |
| -------------: |:-------------|
| threshold      | 起点时间（默认当前） new Date()   |
| number         |  总刻度   97  |  
| isFixedDrag    |   是否禁止拖拽 false |  
| spanIndex    |   起始滑块范围   {start: 70, end: 97}|
| type    |   刻度类型  "quarter" |
| dateFormat | 格式 'yyyy-MM-dd mm:hh:ss'|





## 二次开发
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
