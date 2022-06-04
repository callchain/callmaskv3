<template>
  <div class="protocol">
    <logo />
    <v-img
      class="flex-grow-0 my-4"
      :src="require('@/assets/metrics-chart.svg')"
      width="90"
    />
    <div class="tit">Learn before use CallMask</div>
    <div class="desc mt-4">CallMask</div>
    <div class="item mt-4">
      <v-icon color="error">mdi-close</v-icon>
      <span>
        <strong>Never</strong> Collect secret, address, transaction, balance hash or any personal inforamtion.
        </span>
    </div>
    <div class="item">
      <v-icon color="error">mdi-close</v-icon>
      <span><strong>Never</strong> Collect your Geo IP.</span>
    </div>
    <div class="item">
      <v-icon color="error">mdi-close</v-icon>
      <span><strong>Never</strong> Sell your data for profit. Never!</span>
    </div>
    <div class="btns d-flex justify-space-between my-12">
      <v-btn @click="backToWelcome">No, Thanks</v-btn>
      <v-btn color="primary" @click="toChoose">Yes, I Agree</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "Protocol",
  methods: {
    backToWelcome() {
      this.$router.go(-1);
    },
    toChoose() {
      this.$router.push({path: "/choose"});
    },
  },
};
</script>

<style lang="scss" scoped>
.protocol {
  padding: 20px 20px;
  .tit {
    font-size: 24px;
  }
  .btns {
    .v-btn {
      width: 48%;
    }
  }
  .sum {
    color: #9a9a9a;
  }
}
</style>
