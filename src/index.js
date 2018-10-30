import tlpick from './components/tlpick.js'


function install(_Vue) {
    _Vue.component('tlpick', tlpick)
}


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install
}
