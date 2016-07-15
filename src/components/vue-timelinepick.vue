<template>
    <div class="v-timeline" :style="wrapStyle">
        <div class="vtime-type">
            <img :id="item" v-for="item in items" :src=" item | imgHander"
                  @click = "typeClick(item,$event)"
                  @mouseover="typeMover(item,$event)"
                  @mouseout="typeMout(item,$event)" />
        </div>
        <div class="vtimeContainer" >
        </div>
    </div>
</template>
<script>
import Timelinepick from "./timelinepick"
export default {
    props:{
        option:{
            type:Object,
            require:true,
            default:function(){
              return {
              }
            }
        },
        width:{
            type:Number,
            required: false,
            default:800
        },
        height:{
            type :Number,
            required: false,
            default:100
        },
        handler:{
            required: false
        }
    },
    data(){
        return {
            activeType: "quarter",
            items:["quarter","hour","date"],
            wrapStyle:{
                width : this.width +"px",
                height : this.height +"px"
            }
        }
    },
    ready(){
         this.itemMagicHover(this.$el.querySelector("#"+this.activeType))
         this.option.el = this.$el.querySelector(".vtimeContainer");
         this.option.parent = this.option.el.parentNode ;
         this.option.callback = this.handler;
         this.wrapStyle.width =  this.width +"px" ;
         this.timelinepick = new Timelinepick(this.option)
    },
    methods :{
        typeClick(vtype,e){
            if(e.target.id == this.activeType )return
            this.itemMagicHover(e.target)
            this.itemMagicOver(this.$el.querySelector("#"+this.activeType))
            this.activeType = vtype;
            this.timelinepick.setType(vtype)
        },
        itemMagicHover(target){
            TweenMax.to(target, 0.2, {alpha : 1, scaleX : 1.5, scaleY : 1.5});
        },
        itemMagicOver(target){
            TweenMax.to(target, 0.2, {alpha : 0.5, scaleX : 1, scaleY : 1});
        },
        typeMover(vtype,e){
            this.itemMagicHover(e.target)
        },
        typeMout(vtype,e){
            if(e.target.id == this.activeType)return
            this.itemMagicOver(e.target)
        }
    },
    filters:{
        imgHander(item){
            var url = "src/images/"
            if(item == "quarter") {
                url += "15w"
            }else if(item == "hour") {
                url += "60w"
            }else {
                url += "24w"
            }
            url +=".png"
            return url;
        }
    }
}
</script>

<style scoped>
.v-timeline{
   }

.vtime-type{
    width: 100%;
    text-align: left;
}
.vtime-type img{
    margin-left: 25px;
    margin-top: 5px;
    width : 35px;
    height : 30px;
    cursor: pointer;
}
</style>