<template>
    <el-card id="Todo">
        <div slot="header">todoList</div>
        <el-form>
            <el-form-item size="medium">
                <el-input v-model="inputValue" size="medium" @change="save" placeholder="请输入待办" suffix-icon="el-icon-success"/>
            </el-form-item>
        </el-form>
        <el-table :data="todoList">
            <el-table-column prop="content" label="待办" show-overflow-tooltip/>
            <el-table-column align="center" :sortable="true" sort-by="finish" label="状态">
                <template slot-scope="scope">
                    <i :class="scope.row.finish===1?'el-icon-success':'el-icon-warning'">
                    </i>
                </template>
            </el-table-column>
            <el-table-column align="left" label="操作">
                <template slot-scope="scope">
                        <el-button type="danger" @click="deleteOne(scope.row)" size="mini">删除</el-button>
                        <el-button type="primary" @click="finish(scope.row)" v-if="!scope.row.finish" size="mini">完成</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

</template>

<script>
    import {mapState} from "vuex"
    import http from "../http"

    export default {
        name: 'Todo',
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
        methods: {
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
    i {
        color: #409EFF;
        font-size: 20px;
    }
</style>
