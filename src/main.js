// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from "vuex"
import vuexAlong from "vuex-along"
Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(Vuex)
const store=new Vuex.Store(
    {
        state:{
        },
        mutations:{
            set(state,data){
                state.user=data
            },
            clear(state){
                state.user=null
            }
        },
        plugins:[vuexAlong()]
    }
)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})
