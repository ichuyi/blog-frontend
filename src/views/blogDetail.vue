<template>
  <div id="blog-detail">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-card class="blog">
          <div slot="header" class="header">
            <div class="title">{{ blog.title }}</div>
            <el-row>
              <el-col :span="10" :offset="1" class="tag">
                <el-tag
                  v-for="(label, index) in blog.label"
                  :key="index"
                  class="tag-item"
                  :type="getType(index)"
                  >{{ label.name }}</el-tag
                >
              </el-col>
              <el-col :span="10" :offset="13" class="update-time">
                <span>最后更新于 {{ blog.update_time }}</span>
              </el-col>
            </el-row>
          </div>
          <div v-html="getContentHtml" class="content" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import showdown from "showdown";
const converter = new showdown.Converter();
export default {
  name: "blogDetail",
  methods: {
    getType(index) {
      let a = ["success", "primary", "error", "warning", "info"];
      return a[index % 5];
    }
  },
  activated() {
    document.title = this.meta[this.$route.path];
  },
  mounted() {
    document.title = this.meta[this.$route.path];
  },
  computed: {
    ...mapGetters(["getContentHtml"]),
    ...mapState(["blog", "meta"])
  }
};
</script>

<style scoped>
#blog-detail {
  margin-top: 40px;
  min-height: 800px;
}
.blog {
  min-height: 800px;
}
.header {
  min-height: 60px;
}
.title {
  font-size: 30px;
  margin-top: 10px;
  color: #303133;
  font-weight: bold;
}
.tag {
  text-align: left;
}
.tag-item {
  display: inline-block;
  font-size: 20px;
  margin-left: 10px;
  margin-top: 20px;
  line-height: 1;
  height: 20px;
  width: 50px;
}
.update-time {
  text-align: right;
  color: #909399;
}
.content {
  overflow: auto;
  font-size: 14px;
}
</style>
