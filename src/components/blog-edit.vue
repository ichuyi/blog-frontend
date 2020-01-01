<template>
  <div id="blog-edit">
    <mavonEditor
      class="edit"
      v-model="content"
      @save="show = true"
      @imgAdd="uploadImage"
      ref="editor"
    />
    <div class="save" v-show="show">
      <el-row>
        <el-col :span="12" :offset="6">
          <el-card class="form-card">
            <i class="el-icon-close" @click="show = false" />
            <el-row>
              <el-col :span="8" :offset="8">
                <el-form size="medium" class="form">
                  <el-form-item class="input">
                    <el-input
                      v-model="title"
                      placeholder="请输入标题"
                      size="small"
                      class="input"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-select
                      v-model="checkedLabel"
                      multiple
                      placeholder="请选择标签"
                      class="input"
                      size="mini"
                    >
                      <el-option
                        v-for="(item, index) in labels"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <a href="javascript:void(0)"
                    ><span @click="openLabel">新建标签</span></a
                  >
                  <el-form-item>
                    <el-button
                      class="button"
                      @click="save"
                      size="mini"
                      type="primary"
                      >提交</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import http from "../util/http";
import { mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  name: "blog-edit",
  components: { mavonEditor },
  data() {
    return {
      labels: [],
      checkedLabel: [],
      title: "",
      content: "",
      show: false
    };
  },
  computed: {
    ...mapState(["user", "meta"])
  },
  methods: {
    save() {
      let _self = this;
      if (_self.content.trim() === "" || _self.title.trim() === "") {
        _self.$message({
          message: "标题和内容不能为空",
          type: "error",
          showClose: true,
          center: true,
          offset: 200
        });
        return;
      }
      http
        .fetchPost("/post/add", {
          title: _self.title.trim(),
          content: _self.content,
          labels: _self.checkedLabel
        })
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$message({
              message: res.data.message,
              type: "error",
              showClose: true,
              center: true,
              offset: 200
            });
          } else {
            _self.content = "";
            _self.title = "";
            _self.checkedLabel = [];
            _self.show = false;
            _self.$message({
              message: "保存成功",
              type: "success",
              showClose: true,
              center: true,
              offset: 200
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    openLabel() {
      let _self = this;
      _self.checkedLabel.splice(_self.checkedLabel.length - 1, 1);
      _self
        .$prompt("请输入标签", "新增标签", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "标签名不能为空"
        })
        .then(({ value }) => {
          http
            .fetchPost("/label/add", { name: value })
            .then(function(res) {
              if (res.data.code !== 0) {
                _self.$message({
                  message: res.data.message,
                  type: "error",
                  showClose: true,
                  center: true,
                  offset: 200
                });
              } else {
                _self.labels.push(res.data.result);
                _self.$message({
                  message: "添加成功",
                  type: "success",
                  showClose: true,
                  center: true,
                  offset: 200
                });
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {});
      console.log(this.checkedLabel);
    },
    uploadImage(pos, file) {
      // 第一步.将图片上传到服务器.
      let form = new FormData();
      let _self = this;
      form.append("files", file);
      http
        .fetchPost("/file/upload", form)
        .then(function(res) {
          if (res.data.code === 0) {
            _self.$refs.editor.$img2Url(
              pos,
              "/api/file/get?id=" + res.data.result[0].id
            );
          } else {
            _self.$message({
              message: "上传失败",
              type: "error",
              showClose: true,
              center: true,
              offset: 200
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  activated() {
    document.title = this.meta[this.$route.path];
  },
  mounted() {
    let _self = this;
    document.title = this.meta[this.$route.path];
    http
      .fetchPost("/label/list")
      .then(function(res) {
        if (res.data.code !== 0) {
          _self.$message({
            message: "获取标签失败",
            type: "error",
            showClose: true,
            center: true,
            offset: 200
          });
        } else {
          _self.labels = res.data.result;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
};
</script>

<style scoped>
#blog-edit {
  position: relative;
}
.edit {
  margin: 20px;
  min-height: 800px;
}
.save {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background-color: rgba(0,0,0,0.8);*/
  z-index: 1600;
}
.form-card {
  margin-top: 100px;
  text-align: right;
  height: 600px;
  /*background-color: transparent;*/
}
.form-card i {
  font-size: 30px;
  cursor: pointer;
}
.form {
  margin-top: 100px;
}
.button {
  width: 100%;
}
.new-label {
  float: right;
}
a {
  color: #409eff;
  text-decoration: none;
  font-size: 10px;
}
.input {
  width: 100%;
}
</style>
