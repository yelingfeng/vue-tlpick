import Vue from 'vue'
import App from './App.vue'
import Timelinepick from "./../dist/vue-timelinepick.min"
import "./../dist/vue-timelinepick.css"
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap/dist/js/bootstrap.min"

Vue.use(Timelinepick)

new Vue({
  el: 'body',
  components: { App }
})
