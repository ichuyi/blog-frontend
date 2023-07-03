<template>
  <el-card id="music">
    <el-row>
      <el-col :span="12">
        <el-row class="header">
          <el-col class="title" :span="7" :offset="3">音乐标题</el-col>
          <el-col class="artist" :span="4">歌手</el-col>
          <el-col class="album" :span="6">专辑</el-col>
          <el-col class="duration" :span="4">时长</el-col>
        </el-row>
        <div class="music-list">
          <el-row class="music-item" v-for="(song, index) in music.musicList[music.type]"
            :class="{ playing: music.playStatus.currentIndex === index }" :key="index">
            <el-col :span="3" class="status">
              <i v-if="(music.playStatus.currentIndex === index) &
                music.playStatus.isPlay
                " class="el-icon-video-pause" @click="pause" />
              <i v-else class="el-icon-video-play" @click="play(index)" /></el-col>
            <el-col class="title" :span="7">{{ song.name }}</el-col>
            <el-col class="artist" :span="4">{{ song.ar[0].name }}</el-col>
            <el-col class="album" :span="6">{{ song.al.name }}</el-col>
            <el-col class="duration" :span="4">{{
              getDuration(song.dt)
            }}</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="lyric-out" ref="lyricOut">
          <div class="lyric-in" ref="lyricIn">
            <div v-for="(item, index) in lyrics" :key="index" :ref="'lyric' + index" :class="{
              currentLyric: currentLyric === index,
              lyric: currentLyric !== index
            }">
              {{ item.lyric }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="player">
      <div class="process-out" ref="out" @click="clickOutBar($event)">
        <div ref="in" class="process-in"></div>
      </div>
      <el-row>
        <el-col :span="8">
          <div class="process-info">
            <el-row>
              <el-col :span="8">
                <el-image :src="music.musicList[music.type][music.playStatus.currentIndex]
                  .al.picUrl
                  " class="cover" fit="cover" />
              </el-col>
              <el-col :span="10" :offset="1">
                <div class="artist-info">
                  <span>{{
                    music.musicList[music.type][music.playStatus.currentIndex]
                      .name
                  }}</span>
                  <span class="artist-name">{{
                    music.musicList[music.type][music.playStatus.currentIndex]
                      .ar[0].name
                  }}</span>
                </div>
                <div class="process-current">
                  {{ currentProcess }} / {{ totalProcess }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="operate">
            <i class="ivu-icon ivu-icon-md-skip-backward" @click="backward" />
            <i class="ivu-icon ivu-icon-md-play" @click="play(music.playStatus.currentIndex)"
              v-show="!music.playStatus.isPlay" /><i class="ivu-icon ivu-icon-md-pause" @click="pause"
              v-show="music.playStatus.isPlay" />
            <i class="ivu-icon ivu-icon-md-skip-forward" @click="forward" />
          </div>
        </el-col>
        <el-col :span="2">
          <div class="slider">
            <el-slider v-model="volume" @input="changeVolume" class="slider" />
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { neteaseGet } from "../util/netease";
export default {
  name: "netease",
  data() {
    return {
      lyrics: [],
      played: 0,
      volume: 100,
      music: this.$store.state.music,
      audio: new Audio(),
      currentLyric: 0,
      currentProcess: "00:00", //播放器显示当前时间
      totalProcess: "" //播放器显示总时间
    };
  },
  watch: {
    "playStatus.currentTime": {
      handler(val) {
        this.currentProcess = this.getDuration(val * 1000);
        let currentLyric = this.getCurrentLyric(val);
        this.currentLyric = currentLyric;
        let lyricHeight = 0;
        if (this.$refs.lyric0 !== undefined) {
          lyricHeight = this.$refs.lyric0[0].offsetHeight;
        }
        let totalLyric = this.$refs.lyricOut.offsetHeight / lyricHeight;
        this.$refs.lyricIn.style.top =
          (totalLyric / 2 - currentLyric) * lyricHeight + "px";
        this.played = (val / this.music.playStatus.duration) * 100;
        let length = this.getWidth(this.$refs.out);
        let width = (val / this.music.playStatus.duration) * length;
        this.$refs.in.style.width = width + "px";
      }
    },
    "playStatus.currentIndex": {
      handler(val) {
        let _self = this;
        _self.setMeta({
          name: "music",
          value:
            _self.user.username +
            "--" +
            _self.music.musicList[_self.music.type][
              _self.music.playStatus.currentIndex
            ].name
        });
        document.title = _self.meta[_self.$route.name];
        neteaseGet("/lyric", {
          id: _self.music.musicList[_self.music.type][val].id,
          timestamp: new Date().getTime()
        })
          .then(function (res) {
            if (res.data.nolyric !== undefined) {
              _self.lyrics.push({
                time: 0,
                lyric: "暂无歌词"
              });
              return;
            }
            let l = res.data.lrc.lyric;
            let lyric = l.split("\n");
            _self.lyrics = [];
            for (let l in lyric) {
              _self.lyrics.push(..._self.splitLyric(lyric[l]));
            }
            _self.lyrics.sort(function (a, b) {
              return a.time - b.time;
            });
            _self.currentLyric = 0;
          })
          .catch(function (err) {
            console.log(err);
            _self.lyrics = [];
          });
        _self.currentLyric = 0;
      },
      immediate: true
    },
    "playStatus.duration": {
      handler(val) {
        this.totalProcess = this.getDuration(val * 1000);
      },
      immediate: true
    }
  },
  mounted() {
    document.title = this.meta[this.$route.name];
    let _self = this;
    _self.music.playStatus.isPlay = false
    _self.music.playStatus.currentTime = 0
    _self.audio.addEventListener("playing", function () {
      _self.music.playStatus.isPlay = true;
    });
    _self.audio.addEventListener("pause", function () {
      _self.music.playStatus.isPlay = false;
    });
    _self.audio.addEventListener("ended", function () {
      _self.music.playStatus.isPlay = false;
      _self.audio.src =
        "https://music.163.com/song/media/outer/url?id=" +
        _self.music.musicList[_self.music.type][
          (_self.music.playStatus.currentIndex + 1) %
          _self.music.musicList[_self.music.type].length
        ].id +
        ".mp3";
      _self.audio.load();
      _self.music.playStatus.duration = _self.audio.duration;
      _self.music.playStatus.isPlay = true;
      _self.music.playStatus.currentIndex =
        (_self.music.playStatus.currentIndex + 1) %
        _self.music.musicList[_self.music.type].length;
      _self.audio.play().catch(function (err) {
        console.log(err);
      });
    });
    _self.audio.addEventListener("loadedmetadata", function () {
      _self.music.playStatus.duration = _self.audio.duration;
    });
    _self.audio.addEventListener("timeupdate", function () {
      _self.music.playStatus.currentTime = _self.audio.currentTime;
    });
  },
  methods: {
    changeVolume() {
      this.audio.volume = this.volume / 100;
    },
    splitLyric(l) {
      let s = l.split("]");
      let res = [];
      for (let i = 0; i < s.length - 1; i++) {
        let time = s[i].slice(1).split(":");
        let t1 = parseInt(time[0]);
        if (isNaN(t1)) {
          return { time: 0, lyric: l.split("]")[0].slice(1) };
        }
        let t2 = parseFloat(time[1]);
        let t = t1 * 60000 + t2 * 1000;
        res.push({ time: t, lyric: s[s.length - 1] });
      }
      return res;
    },
    getCurrentLyric(t) {
      let l = this.lyrics.length;
      if (l === 0) {
        return 0
      }
      if (t * 1000 < this.lyrics[0].time) {
        return 0;
      }
      for (let i = this.currentLyric; i < l - 1; i++) {
        if (
          this.lyrics[i].time < t * 1000 &&
          this.lyrics[i + 1].time >= t * 1000
        ) {
          return i;
        }
      }
      return l - 1;
    },
    play(index) {
      if (
        this.audio.src === "" ||
        this.audio.src == null ||
        this.playStatus.currentIndex !== index
      ) {
        this.music.playStatus.currentIndex = index;
        this.music.playStatus.isPlay = false;
        this.audio.src =
          "https://music.163.com/song/media/outer/url?id=" +
          this.music.musicList[this.music.type][index].id +
          ".mp3";
        this.audio.load();
        this.music.playStatus.isPlay = true;
      }
      this.audio.play();
    },
    pause() {
      this.audio.pause();
    },
    backward() {
      this.play(
        (this.music.playStatus.currentIndex -
          1 +
          this.music.musicList[this.music.type].length) %
        this.music.musicList[this.music.type].length
      );
    },
    forward() {
      this.play(
        (this.music.playStatus.currentIndex + 1) %
        this.music.musicList[this.music.type].length
      );
    },
    getDuration(t) {
      let m = Math.floor(t / 60000);
      let s = Math.round((t - m * 60000) / 1000);
      let M = "" + m;
      let S = "" + s;
      if (m < 10) {
        M = "0" + m;
      }
      if (s < 10) {
        S = "0" + s;
      }
      return M + ":" + S;
    },
    getLeft(el) {
      let left = 0;
      do {
        left = left + el.offsetLeft;
        el = el.offsetParent;
      } while (el !== null);
      return left;
    },
    getWidth(el) {
      return el.offsetWidth;
    },
    clickOutBar(event) {
      let distance = event.clientX - this.getLeft(this.$refs.out);
      this.audio.currentTime =
        (distance / this.getWidth(this.$refs.out)) * this.audio.duration;
    },
    ...mapMutations(["setMeta"])
  },
  beforeDestroy() {
    this.audio.pause();
  },
  computed: {
    ...mapState(["meta", "user"]),
    playStatus() {
      return this.music.playStatus;
    }
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
