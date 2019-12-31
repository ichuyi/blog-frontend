<template>
  <el-card id="blog-card" :body-style="{ padding: '0px' }" class="blog-card">
    <div class="content" v-html="content"></div>
    <div class="header">
      <span class="title">{{ blog.title }}</span>
      <div class="info">
        <i class="el-icon-reading icon" />
        <span class="time">{{ blog.create_time }}</span>
        <el-tag
          :type="tagStyle()"
          size="mini"
          class="label"
          v-if="blog.label.length > 0"
          >{{ blog.label[0].name }}</el-tag
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import showdown from "showdown";
const converter = new showdown.Converter();
export default {
  name: "blog-card",
  props: {
    blog: {
      type: Object,
      required: true
    }
  },
  computed: {
    content() {
      return converter.makeHtml(this.blog.content);
    }
  },
  methods: {
    tagStyle() {
      let types = ["primary", "success", "info", "warning", "danger"];
      return types[Math.floor(Math.random() * types.length)];
    }
  }
};
</script>

<style scoped>
.blog-card {
  width: 300px;
  height: 340px;
}

.content {
  overflow: hidden;
  height: 200px;
  padding: 20px;
  color: white;
  background-color: grey;
}

.header {
  position: relative;
  height: 60px;
  text-align: left;
  padding: 10px;
}

.title {
  display: block;
  font-size: 20px;
  margin-bottom: 10px;
}

.time {
  margin-left: 0;
  margin-right: 5px;
}

.label {
  margin: 0 30px;
  width: 50px;
  text-align: center;
}

.icon {
  color: #409eff;
  font-size: 20px;
  float: right;
}

.info {
  height: 20px;
}
</style>
