<template>
  <div id="signIn">
    <el-row>
      <el-col :span="6" :offset="9">
        <el-card shadow="hover" class="card">
          <div class="head">欢迎登录！</div>
          <el-form size="small">
            <el-form-item class="item">
              <el-input v-model="username" placeholder="请输入账号" prefix-icon="el-icon-user-solid" />
            </el-form-item>
            <el-form-item class="item">
              <el-input v-model="password" type="password" show-password placeholder="请输入密码" prefix-icon="el-icon-key" />
            </el-form-item>
            <el-form-item class="item">
              <el-button type="primary" class="button" @click="submit">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import http from "../util/http";
import encrypt from "../util/encrypt";
import { mapActions, mapState } from "vuex";
export default {
  name: "signIn",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
    document.title = "欢迎登录";
  },
  activated() {
    document.title = "欢迎登录";
  },
  computed: {
    ...mapState(["meta"])
  },
  methods: {
    submit() {
      let _self = this;
      let encryptPassword = encrypt.encryptPassword(_self.password);
      http
        .fetchPost("/user/in", {
          username: _self.username,
          password: encryptPassword
        })
        .then(function (res) {
          if (res.data.code !== 0) {
            _self.$alert(res.data.message, "登陆失败");
          } else {
            _self.init(res.data.result);
            _self.$router.push({ path: "/" });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    ...mapActions(["init"])
  }
};
</script>

<style scoped>
#signIn {
  padding: 20% 0;
}

.button {
  width: 100%;
}

.item {
  margin-top: 40px;
}

.card {
  min-width: 200px;
}

.head {
  font-size: 16px;
  text-align: left;
}
</style>
