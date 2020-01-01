import vuexAlong from "vuex-along";
import Vue from "vue";
import Vuex from "vuex";
import showdown from "showdown";
const converter = new showdown.Converter();
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: null,
    blog: null,
    meta: {
      "/blog": "--我的博客",
      "/todo": "--我的待办",
      "/editBlog": "--编辑/新建博客",
      "/album": "-我的相册",
      "/login": "欢迎登录",
      "/blogDetail": "--"
    }
  },
  getters: {
    getContentHtml(state) {
      return converter.makeHtml(state.blog.content);
    }
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    clearAll(state) {
      state.user = null;
      state.blog = null;
      state.meta = null;
    },
    setBlog(state, blog) {
      state.blog = blog;
    },
    clearBlog(state) {
      state.blog = null;
    },
    initMeta(state, name) {
      state.meta = {
        "/blog": name + "--我的博客",
        "/todo": name + "--我的待办",
        "/editBlog": name + "--编辑/新建博客",
        "/album": name + "-我的相册",
        "/login": "欢迎登录",
        "/blogDetail": "--"
      };
    },
    setMeta(state, data) {
      state.meta[data.name] = data.value;
    }
  },
  plugins: [vuexAlong()]
});
export default store;
