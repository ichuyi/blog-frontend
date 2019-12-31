import vuexAlong from "vuex-along";

let state = {
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
};
export default state;
