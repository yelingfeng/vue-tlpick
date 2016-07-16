
<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="/vue.png" width="200" height="200">
  </a>
</p>

# vue-timelinepick

> 一个vue时间滑块选择插件


![](/view.png)


## Examples

``` js

import Timelinepick from "./../dist/vue-timelinepick.min"
import "./../dist/vue-timelinepick.css"

Vue.use(Timelinepick)

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

