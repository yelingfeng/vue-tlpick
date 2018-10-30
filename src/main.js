import Vue from 'vue';
import App from './App.vue';
import '@/components/tlpick.css'
import '@/lib/createjs'
import '@/lib/TweenMax'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'
Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
