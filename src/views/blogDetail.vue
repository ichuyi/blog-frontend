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
          <div v-html="contentHtml" class="content" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import showdown from "showdown";
import http from "../util/http";
const converter = new showdown.Converter();
export default {
  name: "blogDetail",
  data() {
    return {
      blog: {
        title: ""
      }
    };
  },
  methods: {
    getType(index) {
      let a = ["success", "primary", "error", "warning", "info"];
      return a[index % 5];
    }
  },
  activated() {
    document.title = this.meta[this.$route.name];
  },
  mounted() {
    let _self = this;
    document.title = _self.meta[_self.$route.name];
    let id = _self.$route.query.id;
    http
      .fetchGet("/post/get", { id: id })
      .then(function(result) {
        if (result.data.code !== 0) {
          _self.$message({
            message: result.data.message,
            type: "error",
            showClose: true,
            center: true,
            offset: 200
          });
        } else {
          _self.blog = result.data.result;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  computed: {
    ...mapState(["meta"]),
    contentHtml() {
      return converter.makeHtml(this.blog.content);
    }
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
