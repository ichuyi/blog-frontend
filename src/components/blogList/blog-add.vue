<template>
  <el-card id="blog-add" :body-style="{ padding: '0px' }">
    <i class="el-icon-plus" @click.async="openLabel" />
  </el-card>
</template>

<script>
export default {
  name: "blog-add",
  methods: {
    openLabel() {
      this.$emit("addPost");
    }
  }
};
</script>

<style scoped>
#blog-add {
  width: 300px;
  height: 40px;
  padding: 170px 0;
}
i {
  font-size: 40px;
}
</style>
