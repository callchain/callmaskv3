<template>
  <div class="logo d-flex align-center" @click="onHome">
    <v-img class="flex-grow-0" :src="require('@/assets/logo.png')" width="50" />
    <span v-if="showTxt" class="fz-18 font-weight-bold">CallMask</span>
  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    showTxt: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: "",
    },
  },
  methods: {
    onHome() {
      if (this.url) this.$router.push(this.url);
    },
  },
};
</script>

<style scoped></style>
