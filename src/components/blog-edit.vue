<template>
  <div id="blog-edit">
    <mavonEditor
      class="edit"
      v-model="content"
      @save="show = true"
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
import http from "../http";
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
    ...mapState(["user"])
  },
  methods: {
    save() {
      let _self = this;
      debugger;
      if (_self.content.trim() === "" || _self.title.trim() === "") {
        _self.$alert("内容和标题不能为空", "提交失败");
        return;
      }
      http
        .fetchPost("/post/add", {
          title: _self.title.trim(),
          content: _self.content,
          user_id: _self.user.id,
          labels: _self.checkedLabel
        })
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$alert(res.data.message, "保存失败");
          } else {
            _self.content = "";
            _self.title = "";
            _self.checkedLabel = [];
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
            .fetchPost("/label/add", { name: value, user_id: _self.user.id })
            .then(function(res) {
              if (res.data.code !== 0) {
                _self.$alert(res.data.message, "保存失败");
              } else {
                _self.labels.push(res.data.result);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {});
      console.log(this.checkedLabel);
    }
  },
  beforeRouteEnter(to, from, next) {
    document.title = "嵩豪酱--" + to.meta;
    next();
  },
  mounted() {
    let _self = this;
    http
      .fetchPost("/label/list", { user_id: _self.user.id })
      .then(function(res) {
        if (res.data.code !== 0) {
          _self.$alert(res.data.message, "获取标签失败");
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
