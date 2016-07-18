import Component from "vue-class-component"
import Timelinepick from "./timelinepick"
// 模板
const template = `
  <div class="v-timeline" :style="wrapStyle">
      <div class="vtime-type">
          <div :id="item" v-for="item in items"
                @click = "typeClick(item,$event)"
                @mouseover="typeMover(item,$event)"
                @mouseout="typeMout(item,$event)"></div>
      </div>
      <div class="vtimeContainer" >
      </div>
  </div>
   `;
// 属性
const props = {
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
};


@Component({
   props :props,
   template :template,
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
})
export default class VueTimelinepick {
  data(){
      return {
          activeType: "quarter",
          items:["quarter","hour","date"],
          wrapStyle:{
              width : this.width +"px",
              height : this.height +"px"
          }
      }
  }
  ready(){
       this.itemMagicHover(this.$el.querySelector("#"+this.activeType))
       this.option.el = this.$el.querySelector(".vtimeContainer");
       this.option.parent = this.option.el.parentNode ;
       this.option.callback = this.handler;
       this.wrapStyle.width =  this.width +"px" ;
       this.timelinepick = new Timelinepick(this.option)
  }
  typeClick(vtype,e){
      if(e.target.id == this.activeType )return
      this.itemMagicHover(e.target)
      this.itemMagicOver(this.$el.querySelector("#"+this.activeType))
      this.activeType = vtype;
      this.timelinepick.setType(vtype);
      this.handler(this.timelinepick.caculateTimeSpan())
  }
  itemMagicHover(target){
      TweenMax.to(target, 0.2, {alpha : 1, scaleX : 1.5, scaleY : 1.5});
  }
  itemMagicOver(target){
      TweenMax.to(target, 0.2, {alpha : 0.5, scaleX : 1, scaleY : 1});
  }
  typeMover(vtype,e){
      this.itemMagicHover(e.target)
  }
  typeMout(vtype,e){
      if(e.target.id == this.activeType)return
      this.itemMagicOver(e.target)
  }
}
