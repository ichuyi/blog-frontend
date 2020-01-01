<template>
  <el-card id="album">
    <add-image class="image-card" @insertImage="insertImage" />
    <ImageCard
      v-for="(image, index) in images"
      :image="image"
      :key="index"
      class="image-card"
      @deleteOne="deleteOne(index, image)"
      @preview="preview(image.id)"
    />
    <div class="preview" v-show="show" :class="{ show: show, hidden: !show }">
      <div class="close">
        <i class="el-icon-close" @click="show = false" />
      </div>
      <a :href="`/api/file/get?id=${previewId}`">
        <el-image
          :src="`/api/file/get?id=${previewId}`"
          fit="none"
          class="image"
        />
      </a>
    </div>
  </el-card>
</template>

<script>
import AddImage from "./album/addImage";
import ImageCard from "./album/imageCard";
import { mapState } from "vuex";
import http from "../util/http";

export default {
  name: "album",
  components: { AddImage, ImageCard },
  data() {
    return {
      images: [],
      show: false,
      previewId: 0
    };
  },
  activated() {
    document.title = this.meta[this.$route.path];
  },
  mounted() {
    let _self = this;
    document.title = this.meta[this.$route.path];
    http
      .fetchGet("/file/list")
      .then(function(res) {
        if (res.data.code !== 0) {
          _self.$message({
            message: "获取图片失败",
            type: "error",
            showClose: true,
            center: true,
            offset: 200
          });
        } else {
          _self.images = res.data.result;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  methods: {
    insertImage(image) {
      this.images.unshift(...image);
    },
    preview(id) {
      this.previewId = id;
      this.show = true;
    },
    deleteOne(index, image) {
      let _self = this;
      http
        .fetchGet("/file/delete", { id: image.id })
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$message({
              message: "删除失败",
              type: "error",
              showClose: true,
              center: true,
              offset: 200
            });
          } else {
            _self.$message({
              message: "删除成功",
              type: "success",
              showClose: true,
              center: true,
              offset: 200
            });
            _self.images.splice(index, 1);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapState(["user", "meta"])
  }
};
</script>

<style scoped>
#album {
  margin: 20px;
  min-height: 800px;
  position: relative;
}
.image-card {
  float: left;
  margin: 20px;
  box-sizing: border-box;
  transition: all 0.5s;
  -webkit-transition: all 0.5s; /* Safari */
}

.image-card:hover {
  cursor: pointer;
  transform: scale(1.2);
  -ms-transform: scale(1.2); /* IE 9 */
  -moz-transform: scale(1.2); /* Firefox */
  -webkit-transform: scale(1.2); /* Safari 和 Chrome */
  -o-transform: scale(1.2);
}
.preview {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.show {
  background-color: rgba(0, 0, 0, 0.5);
}
.hidden {
  background-color: transparent;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: 40px;
  z-index: 100;
}
.image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
