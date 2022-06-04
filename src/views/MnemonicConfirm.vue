<template>
  <div class="mnemonicConfirm">
    <logo />
    <back class="mt-8 mb-4" />
    <h4>Confirm Mnemonic</h4>
    <div class="my-4">Please enter mnemonic word in order, split by space.</div>
    <v-form ref="form" v-model="flag" lazy-validation>
      <div class="mt-6 box">
        <v-textarea
        v-model="form.mnemonic"
        :rules="valid.mnemonic"
        label="Mnemonic"
        outlined
      ></v-textarea>
      </div>
      <div class="btns d-flex mt-4">
        <v-btn @click="onRoute" color="primary">Confirm</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
const Utils = require('../apis/utils')
const Cryptor = require('../apis/cryptor')
const Wallet = require('../apis/account')

export default {
  name: "MnemonicConfirm",
  data() {
    return {
      flag: true,
      show: true,
      mnemonic: '',
      val: "",
      password: undefined,

      form: {
        mnemonic: '',
      },
      valid: {
        mnemonic: [
          (v) => !!v || "Should not empty",
          (v) =>  Utils.formatMnemonic(v) === this.mnemonic || "Not correct mnemonic"
        ],
      }
    };
  },
  methods: {
    onShow() {
      this.show = !this.show
    },
    async onRoute() {
      const flag = this.$refs.form.validate()
      if (flag) {
        const encPassword = Cryptor.encryptMD5(this.password)
        const encMnemonic = Cryptor.encryptAES(this.mnemonic, encPassword)
        const accounts = await Wallet.prepareAccounts(this.mnemonic, false)
        const enc_accounts = accounts
        for (let i = 0; i < enc_accounts.length; ++i) {
          enc_accounts[i].secret = Cryptor.encryptAES(enc_accounts[i].secret, encPassword)
        }

        this.$store.dispatch('initAccount', {encMnemonic, encPassword, accounts, enc_accounts})
        this.$router.push("/home");
      }
    },
  },
  created: function() {
    this.mnemonic = this.$route.query.mnemonic
    this.password = this.$route.query.password
  }
};
</script>

<style lang="scss">
.mnemonicConfirm {
  padding: 20px;
  h4 {
    font-size: 24px;
    font-weight: normal;
  }
  textarea {
    font-size: 24px !important;
    line-height: 1.5 !important;
    min-height: 100px;
  }
  .v-btn {
    width: 48%;
  }
}
</style>
