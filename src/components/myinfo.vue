<template>
  <el-card id="myinfo">
    <el-row>
      <el-col :span="8" :offset="8">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="用户唯一id">
            <el-input v-model="input.id" disabled />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="input.username" />
          </el-form-item>
          <el-form-item label="用户描述">
            <el-input v-model="input.description" />
          </el-form-item>
          <el-form-item
            label="云音乐账号"
            placeholder="请输入网易云音乐手机账号"
          >
            <el-input
              v-model="input.netease_phone"
              placeholder="请输入网易云音乐密码"
            />
          </el-form-item>
          <el-form-item label="云音乐密码">
            <el-input
              v-model="input.netease_password"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "myinfo",
  data() {
    return {
      input: null
    };
  },
  computed: {
    ...mapState(["meta", "user"])
  },
  activated() {
    document.title = this.meta[this.$route.name];
  },
  beforeMount() {
    document.title = this.meta[this.$route.name];
    this.input = {
      id: this.user.id,
      username: this.user.username,
      description: this.user.description,
      netease_phone: this.user.netease_phone,
      netease_password: this.user.netease_password
    };
  }
};
</script>

<style scoped>
#myinfo {
  margin: 20px;
  min-height: 800px;
  padding-top: 20px;
}
</style>
