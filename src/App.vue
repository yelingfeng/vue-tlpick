<template>
    <div class="container" :style="boxStyle">
        <div class="row">
            <div class='col-md-6'>
                <h1>{{ msg }}</h1>
                <p>
                    开始时间 : <span class="s1" v-text="startTime"></span>
                </p>
                <p>
                     结束时间 : <span class='s1' v-text="endTime"></span>
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <timelinepick :option="op" :width="width" :height="height" :handler="changeAction"></timelinepick>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            "msg": 'Vue timelinepick',
            "width": 1200,
            "height":110,
            "startTime":"",
            "endTime":"",
            "op" : {
                "threshold": new Date(),
                "number": 97,
                "spanMinNumber": 10,
                "isFixedDrag" : true,
                "spanIndex": {start: 70, end: 97},
                "type": "quarter",
                "dateFormat" : 'yyyy-MM-dd mm:hh:ss'
            },
            boxStyle:{
                width : '1000px'
            }
        }
    },
    ready(){
        var ww =$(window).width()
        this.boxStyle.width = ww +"px"
    },
    methods:{
        changeAction(e){
            this.startTime = e.startTime;
            this.endTime = e.endTime;
        }
    }
    }
</script>

<style>
    body {
        font-family: Helvetica, sans-serif;
        background-color: #04255a ;
        overflow:hidden;
    }
    .container{
      margin: 10px auto;
    }
    h1{
        color:#fff;
        font-size: 24px;
    }
    p{
       color : #fff;
       font-size:14px;
       font-family:"微软雅黑"
    }
    .s1{
        font-size: 24px;
        color :#229ed0;
    }

</style>
