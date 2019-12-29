<template>
    <el-card id="addImage" :body-style="{padding:'0px'}">
    <el-upload
            ref="upload"
            class="upload"
            action="invalid"
            multiple
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :http-request="uploadFile">
        <i class="el-icon-plus"/>
        <div class="info">
            只支持上传png、jpg、jpeg格式的图片
        </div>
    </el-upload>
    </el-card>
</template>

<script>
    import {mapState} from "vuex"
    import http from "../../http"
    export default {
        name: "addImage",
        computed:{
            ...mapState([
                "user"
            ])
        },
        methods:{
            uploadFile(para){
                let fileObj = para.file;
                // FormData 对象
                let form = new FormData();
                let _self=this;
                // 文件对象
                form.append("files", fileObj);
                form.append("userId", _self.user.id);
                http.fetchPost('/file/upload',form).then(res => {
                    if(res.data.code ===0){
                        this.$message({
                            type:'success',
                            message:"上传成功"
                        });
                        _self.$emit("insertImage",res.data.result)
                    } else {
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
    #addImage{
        position: relative;
    width: 300px;
    height: 40px;
    padding: 169px 0;
}
    .upload {
        font-size: 40px;
    }
    .info{
        position: absolute;
        font-size: 12px;
        width: 100%;
        left: 0;
        bottom: 20px;
        color: #909399;
    }
</style>