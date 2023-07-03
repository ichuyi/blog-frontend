<template>
  <el-card id="music_login">
    <el-row> 请扫码登录</el-row>
    <el-row> <img :src="data" /></el-row>

  </el-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import netease from "../util/netease";
import { neteasePost } from "../util/netease";
export default {
  name: "music_login",
  data() {
    return {
      key: "",
      data: ""
    };
  },
  mounted() {
    let title = this.meta[this.$route.name]
    document.title = title;
  },
  created() {
    let _self = this
    _self.genQr()
  },
  methods: {
    initMusicList() {
      let _self = this;
      netease
        .neteasePost(
          "/recommend/songs?timestamp=" + new Date().getTime()
        )
        .then(function (res) {
          if (res.data.code !== 200) {
            _self.$alert(res.data.message, "获取歌单失败");
            return
          }
          console.log(res)
          _self.setMusicList(res.data.data.dailySongs);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    genQr() {
      let _self = this;
      netease.neteaseGet("/login/qr/key?timestamp=" + new Date().getTime()).then(function (res) {
        if (res.data.code !== 200) {
          _self.$alert(res.data.message, "生成二维码失败");
          return
        }
        _self.key = res.data.data.unikey
        if (_self.key !== "") {
          netease.neteaseGet("/login/qr/create?timestamp=" + new Date().getTime(), {
            key: _self.key,
            qrimg: true
          }).then(function (res) {
            if (res.data.code !== 200) {
              _self.$alert(res.data.message, "生成二维码失败");
              return
            }
            _self.data = res.data.data.qrimg
            _self.check()
          })
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    check() {
      let _self = this;
      neteasePost("/login/qr/check?noCookie=true&timestamp=" + new Date().getTime(), {
        key: _self.key
      }).then(function (res) {
        if (res.data.code === 800) {
          _self.genQr();
        } else if (res.data.code === 803) {
          localStorage.setItem("cookie", res.data.cookie)
          _self.musicLogin();
          _self.initMusicList()
          _self.$router.push({ path: "/home/music" });
        } else {
          setTimeout(function () {
            _self.check()
          }, 2000)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    ...mapActions(["musicLogin"]),
    ...mapMutations(["setMusicList"])
  },
  beforeDestroy() {
  },
  computed: {
    ...mapState(["meta", "user"]),
  }
};
</script>

<style scoped>
#music {
  margin: 20px;
  height: 800px;
  background-color: rgba(0, 0, 0, 0.4);
}

.music-list {
  position: relative;
  text-align: left;
  height: 650px;
  overflow: auto;
  padding-bottom: 30px;
  font-family: Helvetica, serif;
}

.lyric-out {
  height: 650px;
  overflow: hidden;
  position: relative;
}

.lyric-in {
  position: absolute;
  width: 100%;
  transition: all 0.5s;
  text-align: center;
}

.header {
  position: sticky;
  top: 10px;
  text-align: left;
  color: white;
  font-family: "Microsoft YaHei", serif;
  font-size: 25px;
}

.music-item {
  margin-top: 10px;
  font-size: 20px;
  color: #c0c4cc;
  transition: all 0.5s;
}

.playing {
  color: green;
}

.music-item:hover {
  color: white;
  transform: scale(1.1, 1.1);
}

.status {
  text-align: center;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.duration {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player {
  margin-top: 10px;
  height: 100px;
}

.process-out {
  width: 100%;
  height: 4px;
  background-color: #fff;
  z-index: 1;
  border-radius: 1px;
}

.process-in {
  height: 4px;
  width: 0;
  background-color: green;
  z-index: 2;
  border-radius: 2px;
  /*border-right: 4px solid;*/
}

.operate {
  height: 90px;
}

.operate i {
  padding-top: 20px;
  color: green;
  font-size: 30px;
}

.cover {
  width: 100%;
  height: 100%;
}

.process-info {
  text-align: left;
  display: inline-block;
}

.artist-info {
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
}

.artist-name {
  color: #c0c4cc;
}

.currentLyric {
  color: green;
  font-size: 25px;
  padding: 10px;
}

.lyric {
  color: white;
  font-size: 20px;
  padding: 8px;
}

.slider {
  height: 100%;
  padding: 0;
}
</style>
