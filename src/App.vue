<template>
  <div id="app">
    <vue-canvas-nest :config="{ color: '255,0,0', count: 99, opacity: 1 }" />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import vueCanvasNest from "vue-canvas-nest";
import { mapState } from "vuex";
export default {
  name: "App",
  components: { vueCanvasNest },
  mounted() {
    let _self = this;
    document.addEventListener("visibilitychange", function() {
      //浏览器切换事件
      if (document.visibilityState === "hidden") {
        document.title = "主人去哪了～～～";
      } else {
        document.title = _self.meta[_self.$route.name];
      }
    });
  },
  computed: {
    ...mapState(["meta","user"])
  },
  watch: {
    user: {
      handler() {
        if (this.user === null) {
          this.$router.push({ path: "/login" }).catch(function(err) {
            console.log(err);
          });
        }
      },
      immediate: true
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
