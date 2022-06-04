<template>
  <div class="help">
    <logo />
    <back class="mt-8 mb-4" />
    <h4>Account Mnemonic</h4>
    <div class="my-4">Your mnemonic will help you backup and restore account.</div>
    <div>
      <strong>
      WARNING: NEVER share your mnemonic with ANY one. When leak it, you will lose account money.
      </strong>
    </div>
    <div class="mt-6 box">
      <v-textarea
        class="txt"
        auto-grow
        v-model="mnemonic"
        hide-details
        solo
        readonly
        @click="onCopy"
      ></v-textarea>
      <div
        class="mask d-flex flex-column justify-center align-center"
        @click="onShow"
        v-if="show"
      >
        <v-icon color="white" size="24">mdi-lock</v-icon>
        <div class="mt-2">Show Mnemonic</div>
      </div>
    </div>
    <div class="btns d-flex justify-space-between mt-3">
      <v-btn @click="goHome" color="primary" outlined>Reminder Later</v-btn>
      <v-btn @click="onNext" color="primary" :disabled="show">Next</v-btn>
    </div>
    <v-snackbar top height="50" v-model="flag" :timeout="time">{{
      txt
    }}</v-snackbar>
  </div>
</template>

<script>
const wallet = require('../apis/account');

export default {
  name: "Create",
  data() {
    return {
      show: true,
      mnemonic: '',
      flag: false,
      time: 1500,
      txt: "",

      password: undefined
    };
  },
  methods: {
    onShow() {
      this.show = !this.show;
    },
    goHome() {
      this.$router.push('/home');
    },
    onNext() {
      this.$router.push({path: '/mnemonicConfirm', query: {mnemonic: this.mnemonic, password: this.password}});
    },
    onCopy() {
      this.$copyText(this.mnemonic).then(() => {
        this.txt = "Copy Mnemonic Success";
        this.flag = true;
      });
    },
  },
  created: function() {
    this.password = this.$route.query.password;
    this.mnemonic = wallet.generateMnemonic();
  }
};
</script>

<style lang="scss">
.help {
  padding: 20px;
  h4 {
    font-size: 24px;
    font-weight: normal;
  }
  textarea {
    font-size: 24px !important;
    line-height: 1.5 !important;
    min-height: 100px;
    text-align: center;
  }
  .box {
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: #fff;
      background-color: rgba(0, 0, 0);
      font-size: 18px;
      text-align: center;
    }
  }
  .v-btn {
    width: 48%;
  }
}
</style>
