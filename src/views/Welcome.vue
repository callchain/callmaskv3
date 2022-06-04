<template>
  <div class="welcome">
    <v-img :src="require('@/assets/logo.png')" width="125"></v-img>
    <div class="tit">Welcome to CallMask</div>
    <div class="text-center">
      We are glad to see you!<br/>
      We will connect you with Callchain.
    </div>
    <v-btn @click="goToProtocol" class="px-10 btn" color="primary" large>Start</v-btn
    >
  </div>
</template>

<script>
export default {
  name: "Welcome",
  methods: {
    goToProtocol() {
      this.$router.push("/protocol");
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  .tit {
    margin: 50px auto 22px;
    font-size: 24px;
  }
  .btn {
    margin-top: 44px;
  }
}
</style>
