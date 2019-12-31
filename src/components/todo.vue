<template>
    <el-card id="Todo">
        <div slot="header" class="title">todoList</div>
        <el-row>
            <el-col :span="12" :offset="6">
                <el-form class="form">
                    <el-form-item size="medium">
                        <el-input v-model="inputValue" size="medium" @change="save" placeholder="请输入待办"
                                  suffix-icon="el-icon-success"/>
                    </el-form-item>
                </el-form>
                <todo-item v-for="(todo,index) in todoList" :key="index" :todo="todo" @toggle="toggle(index)"/>
            </el-col>
        </el-row>
    </el-card>

</template>

<script>
    import {mapState} from "vuex"
    import http from "../http"
    import todoItem from "./todoItem";

    export default {
        name: 'Todo',
        components: {todoItem},
        data() {
            return {
                todoList: [],
                inputValue: "",
            }
        },
        computed: {
            ...mapState([
                'user'
            ])
        },
        mounted() {
            this.getList()
        },
        beforeRouteEnter(to,from,next){
            document.title="嵩豪酱--"+to.meta
            next()
        },
        methods: {
            toggle(index) {
                this.todoList[index].finish = 1 - this.todoList[index].finish
            },
            getList() {
                let _self = this;
                http.fetchPost("/todo/list", {id: _self.user.id}).then(function (res) {
                    if (res.data.code !== 0) {
                        _self.$alert(res.data.message, "获取待办失败")
                    } else {
                        _self.todoList = res.data.result
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            },
            save() {
                let _self = this
                http.fetchPost("/todo/add", {user_id: _self.user.id, content: _self.inputValue}).then(function (res) {
                    if (res.data.code !== 0) {
                        _self.$alert(res.data.message, "增加待办失败")
                    } else {
                        _self.todoList.push(res.data.result)
                    }
                }).catch(function (err) {
                    console.log(err)
                })
                this.inputValue = ""
            },
            deleteOne(row) {
                let _self = this
                http.fetchPost("/todo/delete", {id: row.id}).then(function (res) {
                    if (res.data.code !== 0) {
                        _self.$alert(res.data.message, "删除失败")
                    } else {
                        _self.getList()
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            },
            finish(row) {
                let _self = this
                http.fetchPost("/todo/finish", {id: row.id}).then(function (res) {
                    if (res.data.code !== 0) {
                        _self.$alert(res.data.message, "操作失败")
                    } else {
                        row.finish = 1
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #Todo {
        min-height: 800px;
        margin: 20px;
    }
    .title{
        font-size: 20px;
    }
    i {
        color: #409EFF;
        font-size: 20px;
    }
    .form{
        margin-top: 30px;
    }
</style>
