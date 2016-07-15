import timelinepick from "./components/vue-timelinepick.vue"


function install (_Vue) {
  _Vue.component("timelinepick", timelinepick)
}


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install 
}