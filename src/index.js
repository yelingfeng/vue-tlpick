import timelinepick from './components/tlpick.js'


function install(_Vue) {
    _Vue.component('timelinepick', timelinepick)
}


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install
}
