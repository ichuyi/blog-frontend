<template>
    <div id="signIn">
        <el-row>
            <el-col :span="4" :offset="10">
                <el-card shadow="hover">
                <el-form size="small">
                    <el-form-item class="item">
                        <el-input v-model="username" placeholder="请输入账号"/>
                    </el-form-item>
                    <el-form-item class="item">
                        <el-input v-model="password" type="password" show-password placeholder="请输入密码"/>
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
    import http from "../http"
    export default {
        name: "signIn",
        data(){
            return {
                username: "",
                password:""
            }
        },
        methods:{
            submit(){
                let _self=this;
                http.fetchPost("/user/in",{username:_self.username,password:_self.password}).then(function (res) {
                    if(res.data.code!==0){
                        _self.$alert(res.data.message,"登陆失败")
                    }else{
                        _self.$store.commit("set",{username:res.data.result.username,id:res.data.result.id})
                        _self.$router.push({path:"/"})
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
    #signIn{
        padding: 20% 0;
    }
.button{
    width: 100%;
}
    .item{
        margin-top: 20px;
    }
</style>