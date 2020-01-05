import vuexAlong from "vuex-along";
import Vue from "vue";
import Vuex from "vuex";
import netease from "../util/netease";
import music from "../components/music";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: {},
    meta: {
      signIn: "欢迎登录"
    },
    music: {}
  },
  mutations: {
    clearAll(state) {
      state.user = null;
      state.meta = null;
      state.music = null;
    },
    initState(state, user) {
      state.user = user;
      state.meta = {
        blog: user.username + "--我的博客",
        todo: user.username + "--我的待办",
        editBlog: user.username + "--编辑/新建博客",
        album: user.username + "-我的相册",
        signIn: "欢迎登录",
        blogDetail: "--",
        music: user.username + "--我的云音乐",
        myinfo: user.username + "--个人中心"
      };
      state.music = {
        audio: new Audio(),
        musicList: {
          recommendSongs: []
        },
        login: false,
        type: "recommendSongs",
        playStatus: {
          isPlay: false,
          currentIndex: 0,
          duration: 0,
          currentTime: 0
        }
      };
      state.music.audio.addEventListener("playing", function() {
        state.music.playStatus.isPlay = true;
      });
      state.music.audio.addEventListener("pause", function() {
        state.music.playStatus.isPlay = false;
      });
      state.music.audio.addEventListener("ended", function() {
        state.music.playStatus.isPlay = false;
        state.music.audio.src =
          "https://music.163.com/song/media/outer/url?id=" +
          state.music.musicList[state.music.type][
            (state.music.playStatus.currentIndex + 1) %
              state.music.musicList[state.music.type].length
          ].id +
          ".mp3";
        state.music.audio.load();
        state.music.playStatus.duration = state.music.audio.duration;
        state.music.playStatus.isPlay = true;
        state.music.playStatus.currentIndex =
          (state.music.playStatus.currentIndex + 1) %
          state.music.musicList[state.music.type].length;
        state.music.audio.play().catch(function(err) {
          console.log(err);
        });
      });
      state.music.audio.addEventListener("loadedmetadata", function() {
        state.music.playStatus.duration = state.music.audio.duration;
      });
      state.music.audio.addEventListener("timeupdate", function() {
        state.music.playStatus.currentTime = state.music.audio.currentTime;
      });
    },
    setMeta(state, data) {
      state.meta[data.name] = data.value;
    },
    setMusicList(state, list) {
      state.music.musicList[state.music.type] = list;
    },
    setNeteaseLogin(state) {
      state.music.login = true;
    }
  },
  actions: {
    init({ state, commit }, user) {
      commit("initState", user);
      if (user.netease_phone !== "") {
        netease
          .neteasePost("/login/cellphone", {
            phone: user.netease_phone,
            password: user.netease_password
          })
          .then(function(result) {
            if (result.data.code === 200) {
              netease
                .neteasePost(
                  "/recommend/songs?timestamp=" + new Date().getTime()
                )
                .then(function(res) {
                  commit("setMusicList", res.data.recommend);
                  commit("setNeteaseLogin");
                })
                .catch(function(err) {
                  console.log(err);
                });
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  },
  plugins: [vuexAlong()]
});
export default store;
