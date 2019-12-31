import vuexAlong from "vuex-along";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {},
  mutations: {
    set(state, data) {
      state.user = data;
    },
    clear(state) {
      state.user = null;
    }
  },
  plugins: [vuexAlong()]
});
export default store;
