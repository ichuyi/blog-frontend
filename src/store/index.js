import vuexAlong from "vuex-along";
import Vue from "vue";
import Vuex from "vuex";
import showdown from "showdown";
import netease from "../util/netease";
const converter = new showdown.Converter();
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: {},
    meta: {},
    musicList: {},
    playStatus: {}
  },
  mutations: {
    clearAll(state) {
      state.user=null;
      state.meta=null;
      state.musicList=null;
      state.playStatus=null;
    },
    initState(state,user){
      state.user=user;
      state.meta = {
        "blog": user.username + "--我的博客",
        "todo": user.username + "--我的待办",
        "editBlog": user.username + "--编辑/新建博客",
        "album": user.username + "-我的相册",
        "signIn": "欢迎登录",
        "blogDetail": "--",
        "music": user.username+"我的云音乐"
      };
      state.musicList={
        recommendSongs:[]
      };
      state.playStatus={
        isPlay: false,
        currentIndex: 0
      };
    },
    setMeta(state, data) {
      state.meta[data.name] = data.value;
    },
    setMusicList(state, data) {
      state.musicList[data.name] = data.value;
    },
    setPlayStatus(state, data) {
      state.playStatus[data.name] = data.value;
    }
  },
  actions: {
    initMusicList({ commit }) {
      netease
        .neteasePost("/login/cellphone", {
          phone: 15801736263,
          password: "6464wang/"
        })
        .then(function(result) {
          if (result.data.code === 200) {
            netease
              .neteasePost("/recommend/songs?timestamp=" + new Date().getTime())
              .then(function(res) {
                commit("setMusicList", {
                  name: "recommendSongs",
                  value: res.data.recommend
                });
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
  },
  plugins: [vuexAlong()]
});
export default store;
