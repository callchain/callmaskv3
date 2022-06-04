<template>
  <div class="choose">
    <div class="tit">Start with CallMask</div>
    <v-card class="d-flex flex-column align-center">
      <v-img :src="require('@/assets/download-alt.svg')" width="40"></v-img>
      <div class="h6">I have one mnemonic already.</div>
      <v-btn @click="goToPwd(false)" class="px-12 btn" color="primary" large>Import Mnemonic</v-btn>
    </v-card>
    <v-card class="d-flex flex-column align-center">
      <v-img :src="require('@/assets/thin-plus.svg')" width="40"></v-img>
      <div class="h6">Create new account.</div>
      <v-btn @click="goToPwd(true)" class="px-12 btn" color="primary" large>Create Account</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Choose",
  methods: {
    goToPwd(to_create) {
      if (to_create)
        this.$router.push('/pwd');
      else
        this.$router.push('/import');
    },
  },
};
</script>

<style lang="scss" scoped>
.choose {
  margin: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  .tit {
    font-size: 24px;
  }
  .v-card {
    margin-top: 20px;
    box-shadow: none;
    border: 1px solid #d8d8d8;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    .h6 {
      color: #000;
      font-size: 18px;
      margin: 20px auto 10px;
    }
    .btn {
      margin-top: 30px;
    }
  }
}
</style>
