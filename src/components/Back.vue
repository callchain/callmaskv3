<template>
  <div class="back d-flex align-center" @click="onRoute">
    <v-icon class="font-weight-bold" size="30">mdi-chevron-left</v-icon>
    <span>Back</span>
  </div>
</template>

<script>
export default {
  name: "Logo",
  methods: {
    onRoute() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.back {
  * {
    font-size: 18px;
  }
}
</style>
