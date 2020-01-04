<template>
  <div id="signIn">
    <el-row>
      <el-col :span="4" :offset="10">
        <el-card shadow="hover" class="card">
          <el-form size="small">
            <el-form-item class="item">
              <el-input v-model="username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item class="item">
              <el-input
                v-model="password"
                type="password"
                show-password
                placeholder="请输入密码"
              />
            </el-form-item>
            <el-form-item class="item">
              <el-button type="primary" class="button" @click="submit"
                >登录</el-button
              >
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
import { mapMutations, mapActions,mapState } from "vuex";
export default {
  name: "signIn",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
    document.title=this.meta[this.$route.name];
  },
  computed:{
    ...mapState([
            "meta"
    ])
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
        .then(function(res) {
          if (res.data.code !== 0) {
            _self.$alert(res.data.message, "登陆失败");
          } else {
            _self.initState(res.data.result);
            _self.initMusicList();
            _self.$router.push({ path: "/" });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    ...mapMutations(["initState"]),
    ...mapActions(["initMusicList"])
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
  margin-top: 20px;
}
.card {
  min-width: 200px;
}
</style>
