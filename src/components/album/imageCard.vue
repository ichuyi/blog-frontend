<template>
  <el-card id="imageCard" :body-style="{ padding: '0px' }" class="image-card">
    <el-image
      :src="`/api/file/get?id=${image.id}`"
      fit="fill"
      class="image"
      :z-index="0"
    />
    <div
      class="delete-div"
      @mouseover="show = true"
      @mouseout="show = false"
      :class="{ show: !show, hidden: show }"
    >
      <i class="el-icon-view" v-show="show" @click="preview" />
      <i class="el-icon-delete" v-show="show" @click="deleteOne" />
    </div>
  </el-card>
</template>

<script>
export default {
  name: "imageCard",
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteOne() {
      this.$emit("deleteOne");
    },
    preview() {
      this.$emit("preview");
    }
  },
  data() {
    return {
      show: false
    };
  }
};
</script>

<style scoped>
.image-card {
  width: 300px;
  height: 340px;
  position: relative;
}
.delete-div {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 40px;
  padding: 150px 0;
  color: white;
}
.show {
  background-color: transparent;
}
.hidden {
  background-color: rgba(0, 0, 0, 0.5);
}
.image {
  width: 300px;
  height: 340px;
}
</style>
