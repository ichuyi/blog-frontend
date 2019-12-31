<template>
  <div id="app">
    <vue-canvas-nest :config="{ color: '255,0,0', count: 99, opacity: 1 }" />
    <router-view />
  </div>
</template>

<script>
import vueCanvasNest from "vue-canvas-nest";
export default {
  name: "App",
  components: { vueCanvasNest },
  mounted() {
    let _self = this;
    document.addEventListener("visibilitychange", function() {
      //浏览器切换事件
      if (document.visibilityState === "hidden") {
        //状态判断
        //normal_title=document.title;
        document.title = "主人去哪了～～～";
      } else {
        document.title = _self.$route.meta;
      }
    });
  },
  watch: {
    "$store.state.user": function() {
      if (this.$store.state.user === null) {
        this.$router.push({ path: "/login" });
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
