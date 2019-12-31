<template>
  <div id="home">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-demo"
          mode="horizontal"
          router
        >
          <div class="profile">
            <el-avatar
              src="http://5b0988e595225.cdn.sohucs.com/images/20171210/362dcd1c009842ff99b33f5d51bbfb80.jpeg"
            />
            <span class="username">{{ user.username }}</span>
            <span @click="clear"
              ><a href="javascript:void(0)">
                退出
              </a></span
            >
          </div>
          <el-menu-item index="/blog">博客列表</el-menu-item>
          <el-menu-item index="/todo">待办列表</el-menu-item>
          <el-menu-item index="/editBlog">新建/编辑</el-menu-item>
          <el-menu-item index="/album">我的相册</el-menu-item>
        </el-menu>
        <keep-alive>
          <transition name="el-zoom-in-center">
            <router-view />
          </transition>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TodoList from "../components/todo";
import BlogList from "../components/blog-list";
import { mapState, mapMutations } from "vuex";
export default {
  name: "home",
  components: {
    TodoList,
    BlogList
  },
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    document.title = to.meta;
    next();
  },
  methods: {
    ...mapMutations(["clear"])
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style scoped>
#home {
  margin-top: 40px;
  min-height: 800px;
}
.profile {
  float: right;
  height: 40px;
  line-height: 40px;
}
.profile span {
  vertical-align: middle;
  margin: 0 10px;
}
.username {
  color: #c0c4cc;
}
a {
  color: #909399;
  text-decoration: none;
}
</style>
