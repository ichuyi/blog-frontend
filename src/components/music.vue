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
          <el-row
            class="music-item"
            v-for="(music, index) in musicList[type]"
            :class="{ playing: playStatus.currentIndex === index }"
            :key="index"
          >
            <el-col :span="3" class="status">
              <i
                v-if="(playStatus.currentIndex === index) & playStatus.isPlay"
                class="el-icon-video-pause"
                @click="pause"/>
              <i v-else class="el-icon-video-play" @click="play(index)"
            /></el-col>
            <el-col class="title" :span="7">{{ music.name }}</el-col>
            <el-col class="artist" :span="4">{{
              music.artists[0].name
            }}</el-col>
            <el-col class="album" :span="6">{{ music.album.name }}</el-col>
            <el-col class="duration" :span="4">{{
              getDuration(music.duration)
            }}</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="lyric-out" ref="lyricOut">
          <div class="lyric-in" ref="lyricIn">
            <div v-for="(item,index) in lyrics" :key="index" :ref="'lyric'+index" :class="{currentLyric:currentLyric===index,lyric:currentLyric!==index}">
              {{item.lyric}}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="player">
      <audio ref="audio"/>
      <div class="process-out" ref="out" @click="clickOutBar($event)">
        <div ref="in" class="process-in"></div>
      </div>
      <el-row>
        <el-col :span="8">
          <div class="process-info">
            <el-row>
              <el-col :span="10">
                <el-image :src="musicList[type][playStatus.currentIndex].album.blurPicUrl" class="cover" fit="cover"/>
              </el-col>
              <el-col :span="10" :offset="1">
                <div class="artist-info">
                  <span>{{musicList[type][playStatus.currentIndex].name}}</span>
                  <span class="artist-name">{{musicList[type][playStatus.currentIndex].artists[0].name}}</span>
                </div>
                <div class="process-current">
                  {{currentProcess}} / {{totalProcess}}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="operate">
            <i class="ivu-icon ivu-icon-md-skip-backward" @click="backward"/>
            <i class="ivu-icon ivu-icon-md-play" @click="play(playStatus.currentIndex)" v-show="!playStatus.isPlay"/><i class="ivu-icon ivu-icon-md-pause" @click="pause" v-show="playStatus.isPlay"/>
            <i class="ivu-icon ivu-icon-md-skip-forward" @click="forward"/>
          </div>

        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {neteaseGet, neteasePost} from "../util/netease";
export default {
  name: "netease",
  data() {
    return {
      type: "recommendSongs",
      audio: null,
      currentTime:0,
      duration:0,
      lyrics:[],
      currentLyric:0,
      currentProcess:"",  //播放器显示当前时间
      totalProcess:""  //播放器显示总时间
    };
  },
  watch: {
    playStatus: {
      handler(val) {
        if (val.isPlay) {
          this.setMeta({
            name: "music",
            value:
              this.user.username +
              "--" +
              this.musicList[this.type][val.currentIndex].name
          });
        } else {
          this.setMeta({
            name: "music",
            value: this.user.username + "--我的云音乐"
          });
        }
        document.title = this.meta[this.$route.name];
      },
      deep: true
    },
    currentTime(val){
      this.currentProcess=this.getDuration(val*1000);
      let length=this.getWidth(this.$refs.out);
      let width=val/this.audio.duration*length;
      this.$refs.in.style.width=width+"px";
      let currentLyric=this.getCurrentLyric(val);
      this.currentLyric=currentLyric;
      let lyricHeight=this.$refs.lyric0[0].offsetHeight;
      let totalLyric=this.$refs.lyricOut.offsetHeight/lyricHeight;
      this.$refs.lyricIn.style.top=(totalLyric/2-currentLyric)*lyricHeight+"px";
    }
  },
  mounted() {
    let _self = this;
    document.title = this.meta[this.$route.name];
    _self.audio = _self.$refs.audio;
    _self.setPlayStatus({name:"isPlay",value:!_self.audio.paused});
    _self.audio.addEventListener("playing", function() {
      _self.setPlayStatus({ name: "isPlay", value: true });
    });
    _self.audio.addEventListener("pause", function() {
      _self.setPlayStatus({ name: "isPlay", value: false });
    });
    _self.audio.addEventListener("ended", function() {
      _self.setPlayStatus({ name: "isPlay", value: false });
      _self.play(
        (_self.playStatus.currentIndex + 1) % _self.musicList[_self.type].length
      );
      _self.setPlayStatus({ name: "isPlay", value: true });
    });
    _self.audio.addEventListener("timeupdate",function () {
      _self.currentTime=_self.audio.currentTime;
    });
    _self.audio.addEventListener("canplay",function () {
      _self.duration=_self.audio.duration;
      _self.totalProcess=_self.getDuration(_self.duration*1000);
    });
    _self.audio.addEventListener("loadstart",function () {

    })
  },
  methods: {
    splitLyric(l){
      let s=l.split(']');
      let res=[];
      for(let i=0;i<s.length-1;i++) {
        let time = s[i].slice(1).split(":");
        let t1 = parseInt(time[0]);
        if (isNaN(t1)) {
          return {time: 0, lyric: l.split(']')[0].slice(1)}
        }
        let t2 = parseFloat(time[1]);
        let t = t1 * 60000 + t2 * 1000;
        res.push({time:t,lyric:s[s.length-1]})
      }
      return res;
    },
    getCurrentLyric(t){
      let l=this.lyrics.length;
      if(t*1000<this.lyrics[0].time){
        return 0;
      }
      for(let i=this.currentLyric;i<l-1;i++){
        if(this.lyrics[i].time<t*1000&&this.lyrics[i+1].time>=t*1000){
          return i;
        }
      }
      return l-1;
    },
    play(index) {
      if (this.playStatus.currentIndex !== index||this.audio.src==="") {
        this.audio.pause();
        this.setPlayStatus({
          name: "currentIndex",
          value: index
        });
        this.audio.src =
          "https://music.163.com/song/media/outer/url?id=" +
          this.musicList[this.type][this.playStatus.currentIndex].id +
          ".mp3";
        this.audio.load();
        let _self=this;
        neteaseGet("/lyric",{id:_self.musicList[_self.type][_self.playStatus.currentIndex].id,timestamp:new Date().getTime()}).then(
                function (res) {
                  if(res.data.nolyric!==undefined){
                    _self.lyrics.push({
                              time:0,
                              lyric:"暂无歌词"});
                    return
                  }
                  let l=res.data.lrc.lyric;
                  let lyric=l.split('\n');
                  _self.lyrics=[];
                  for(let l in lyric){
                    _self.lyrics.push(..._self.splitLyric(lyric[l]));
                  }
                  _self.lyrics.sort(function (a,b) {
                    return a.time-b.time
                  });
                }
        ).catch(function (err) {
          console.log(err);
          _self.lyrics=[];
        });
        _self.currentLyric=0;
      }
      this.audio.play();
    },
    pause() {
      this.audio.pause();
    },
    backward(){
      this.play((this.playStatus.currentIndex-1+this.musicList[this.type].length)%this.musicList[this.type].length);
    },
    forward(){
      this.play((this.playStatus.currentIndex+1)%this.musicList[this.type].length);
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
        S = "0" + m;
      }
      return M + ":" + S;
    },
    getLeft(el){
      let left=0;
      do{
        left=left+el.offsetLeft;
        el=el.offsetParent;
      }while (el!==null);
      return left;
    },
    clickOutBar(event){
      let distance=event.clientX-this.getLeft(this.$refs.out);
      this.audio.currentTime=distance/this.getWidth(this.$refs.out)*this.audio.duration;
    },
    getWidth(el){
      return el.offsetWidth;
    },
    ...mapMutations(["setMeta", "setPlayStatus"])
  },
  computed: {
    ...mapState(["musicList", "meta", "playStatus", "user"]),
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
.lyric-out{
  height: 650px;
  overflow: hidden;
  position: relative;
}
.lyric-in{
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
}
.music-item {
  margin-top: 10px;
  color: #c0c4cc;
  transition: all 0.5s;
}
.playing {
  color: darkred;
}
.music-item:hover {
  color: green;
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
.player{
  margin-top: 10px;
}
  .process-out{
    width: 100%;
    height: 2px;
    background-color: #fff;
    z-index: 1;
  }
  .process-in{
    height: 2px;
    width: 0;
    background-color: green;
    z-index: 2;
  }
  .operate{
    height: 90px;
  }
  .operate i{
    padding-top: 20px;
    color: green;
    font-size: 30px;
  }
  .cover{
    height: 100%;
    width: 100%;
  }
  .process-info{
    text-align: left;
    display: inline-block;
  }
  .artist-info{
    margin-top: 10px;
    margin-bottom: 10px;
    color: white;
  }
  .artist-name{
    color: #C0C4CC;
  }
  .currentLyric{
    color: green;
    font-size: 20px;
    padding: 10px;
  }
  .lyric{
    color: white;
    font-size: 16px;
    padding: 8px;
  }
</style>
