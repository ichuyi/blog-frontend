<template>
    <div class="todo-item" :class="{show:todo.finish!==1}">
        <i class="el-icon-info center info" @click="toggle"/>
        <i class="el-icon-success center success" @click="toggle" v-show="todo.finish===1"/>
        <p class="center" :class="{delete:todo.finish===1,show:todo.finish!==1}">{{todo.content}}</p>
        <i class="el-icon-close center close" v-show="todo.finish===1"/>
        <el-divider v-if="todo.finish===1"/>
    </div>
</template>

<script>
    export default {
        name: "todoItem",
        props:{
            todo:{
                type:Object,
                default:null
            }
        },
        methods:{
            toggle(){
                this.$emit("toggle")
            }
        }
    }
</script>

<style scoped>
    .todo-item{
        margin-bottom: 10px;
        height: 50px;
        font-size: 26px;
        width: 100%;
        position: relative;
        display: inline-block;
        border: 1px solid lightgrey;
        border-radius: 5px;
    }
    .todo-item:hover{
        border: #409EFF 2px solid;
    }
    .center{
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
        -ms-transform: translate(0,-50%);
    }
    .todo-item p{
        margin: 0 0 0 15px;
    }
    .todo-item p{
        left: 35px;
    }
    i{
        font-size: 26px;
    }
    .delete{
        text-decoration: line-through;
        color:#909399
    }
    .show{
        color: black;
    }
    .grey{
        color:#909399
    }
    .success{
        left:11px;
        color: #8c939d;
    }
    .close{
        right: 11px;
        color: #8c939d;
    }
    .info{
        left: 11px;
    }
</style>