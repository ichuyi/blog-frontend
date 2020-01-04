<template>
  <el-card id="Todo">
    <div slot="header" class="title">todoList</div>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form class="form">
          <el-form-item size="medium">
            <el-input
              v-model="inputValue"
              size="medium"
              @change="save"
              placeholder="请输入待办"
              suffix-icon="el-icon-success"
            />
          </el-form-item>
        </el-form>
        <todo-item
          v-for="(todo, index) in todoList"
          :key="index"
          :todo="todo"
          @toggle="toggle(index)"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import http from "../util/http";
import todoItem from "./todoItem";

export default {
  name: "Todo",
  components: { todoItem },
  data() {
    return {
      todoList: [],
      inputValue: ""
    };
  },
  computed: {
    ...mapState(["user", "meta"])
  },
  mounted() {
    document.title = this.meta[this.$route.name];
    this.getList();
  },
  activated() {
    document.title = this.meta[this.$route.name];
  },
  methods: {
    toggle(index) {
      let _self = this;
      http
        .fetchPost("/todo/update", {
          finish: 1 - _self.todoList[index].finish,
          id: _self.todoList[index].id
        })
        .then(function(res) {
          if (res.data.code === 0) {
            _self.todoList[index].finish = 1 - _self.todoList[index].finish;
          } else {
            _self.$message({
              message: "操作",
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
    },
    getList() {
      let _self = this;
      http
        .fetchPost("/todo/list")
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$message({
              message: "获取待办失败",
              type: "error",
              showClose: true,
              center: true,
              offset: 200
            });
          } else {
            _self.todoList = res.data.result;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    save() {
      let _self = this;
      http
        .fetchPost("/todo/add", {
          content: _self.inputValue
        })
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$message({
              message: "添加待办失败",
              type: "error",
              showClose: true,
              center: true,
              offset: 200
            });
          } else {
            _self.todoList.push(res.data.result);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      this.inputValue = "";
    },
    deleteOne(row) {
      let _self = this;
      http
        .fetchPost("/todo/delete", { id: row.id })
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
            _self.getList();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Todo {
  min-height: 800px;
  margin: 20px;
}
.title {
  font-size: 20px;
}
i {
  color: #409eff;
  font-size: 20px;
}
.form {
  margin-top: 30px;
}
</style>
