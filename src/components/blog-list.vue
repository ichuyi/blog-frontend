<template>
  <el-card
    id="blog-list"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="transparent"
  >
    <blog-add class="blog-card" @addPost="jumpToEdit" />
    <blog-card
      v-for="(blog, index) in blogList"
      :key="index"
      :blog="blog"
      class="blog-card"
    />
  </el-card>
</template>

<script>
import blogCard from "./blogList/blog-card";
import blogAdd from "./blogList/blog-add";
import { mapState, mapMutations } from "vuex";
import http from "../util/http";

export default {
  name: "blog-list",
  components: {
    blogCard,
    blogAdd
  },
  data() {
    return {
      loading: true,
      blogList: []
    };
  },
  computed: {
    ...mapState(["user", "meta"])
  },
  methods: {
    jumpToEdit() {
      this.$router.push({ path: "/editBlog" });
    }
  },
  activated() {
    document.title = this.meta[this.$route.name];
  },
  mounted() {
    let _self = this;
    document.title = this.meta[this.$route.name];
    http
      .fetchPost("/post/list")
      .then(function(res) {
        if (res.data.code !== 0) {
          _self.$message({
            message: "获取博客失败",
            type: "error",
            showClose: true,
            center: true,
            offset: 200
          });
        } else {
          _self.blogList = res.data.result;
        }
      })
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        _self.loading = false;
      });
  }
};
</script>

<style scoped>
#blog-list {
  margin: 20px;
  min-height: 800px;
}

.blog-card {
  float: left;
  transition: transform 0.1s;
  margin: 20px;
}

.blog-card:hover {
  cursor: pointer;
  transform: translate(0, -10px);
}
</style>
