<template>
  <div class="help-import">
    <logo />
    <back class="mt-8 mb-4" />
    <h5>Use mnemonic to import account</h5>
    <div class="py-4">Enter your mnemonic here to restore your account.</div>
    <v-form ref="form" v-model="flag" lazy-validation>
      <v-textarea
        label="Account Mnemonic"
        placeholder='Use space to split words'
        v-model="form.mnemonic"
        :rules="valid.mnemonic"
        outlined
      ></v-textarea>
      <div class="py-4">Set Password</div>
      <v-text-field
        v-model="form.pwd"
        :rules="valid.pwd"
        label="New Password(8 Characters At Least)"
        type="password"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="form.rpwd"
        :rules="valid.rpwd"
        label="Confirm Password"
        type="password"
        outlined
      ></v-text-field>
      <v-checkbox v-model="form.checked" :rules="valid.checked" class="ma-0">
        <template v-slot:label>
          <div>I have read and agreed with <a href="#">Terms of Use</a></div>
        </template>
      </v-checkbox>
      <v-btn @click="onSubmit" class="px-12 mt-4" color="primary" large>Import</v-btn>
    </v-form>
  </div>
</template>

<script>
import { MIN_PWD_LENGTH } from '../apis/constant'
import { validMnemonic, prepareAccounts } from '../apis/account'
import { encryptMD5, encryptAES } from '../apis/cryptor'

export default {
  name: "Import",
  data() {
    return {
      flag: true,
      form: {
        mnemonic: '',
        pwd: '',
        rpwd: '',
        checked: false,
      },
      valid: {
        pwd: [
          (v) => !!v || "Should not empty",
          (v) => (v && v.length >= MIN_PWD_LENGTH) || "Password length not enough",
        ],
        rpwd: [
          (v) => !!v || "Should not empty",
          (v) => (v && v === this.form.pwd) || "Password mismatch"
        ],
        mnemonic: [
          (v) => !!v || "Should not empty",
          (v) => validMnemonic(v) || "Invalid Mnemonic"
        ],
        checked: [(v) => !!v || "Please agree terms of use"],
      },
    };
  },
  methods: {
    async onSubmit() {
      const flag = this.$refs.form.validate();
      if (flag) {
        const encPassword = encryptMD5(this.form.pwd)
        const encMnemonic = encryptAES(this.form.mnemonic, encPassword)
        const accounts = await prepareAccounts(this.form.mnemonic, true)
        const enc_accounts = accounts
        for (let i = 0; i < enc_accounts.length; ++i) {
          enc_accounts[i].secret = encryptAES(enc_accounts[i].secret, encPassword)
        }

        this.$store.dispatch('initAccount', {encMnemonic, encPassword, accounts, enc_accounts})
        this.$router.push("/home");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.help-import {
  padding: 20px;
  h4 {
    font-size: 24px;
    font-weight: normal;
  }
  .v-btn {
    width: 200px;
  }
}
</style>
