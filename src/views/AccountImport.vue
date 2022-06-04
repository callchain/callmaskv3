<template>
  <v-form class="account-import pa-8">
    <v-select
      label="Select Type"
      @change="onSelectType"
      :items="items"
      v-model="type"
      outlined
    >
    </v-select>
    <v-text-field
      v-if="type === 'Secret'"
      label="Paste your secret"
      type="password"
      v-model="secret"
      outlined
    ></v-text-field>
    <!-- <div v-else>
      <v-file-input label="选择json文件" outlined></v-file-input>
      <v-text-field label="输入密码" type="password" outlined></v-text-field>
    </div> -->
    <div class="btns mt-4 d-flex">
      <v-btn @click="onCancel" class="flex-grow-1 mr-4" large>Cancel</v-btn>
      <v-btn
        @click="onSubmit"
        class="flex-grow-1"
        color="primary"
        large
        >Import</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { createWalletFromSecret } from '../apis/account'
import { isValidSec } from '../apis/utils'

import Cryptor from '../apis/cryptor'

export default {
  name: "AccountImport",
  data() {
    return {
      secret: '',
      items: ["Secret"],
      type: "Secret",
    };
  },
   computed: {
    ...mapGetters([
      "accountList",
      "accountCount",
      "passwordSaved"
    ]),
  },
  methods: {
    onSelectType() {},
    onCancel() {
      this.$router.back();
    },
    onSubmit() {
      if (isValidSec(this.secret)) {
        const account = createWalletFromSecret(this.secret)
        account["derived"] = false
        account["name"] = "Account " + (this.accountCount + 1)

        const enc_account = account
        enc_account.secret = Cryptor.encryptAES(enc_account.secret, this.passwordSaved)

        this.$store.dispatch("addAccount", {account, enc_account})
        this.$router.push("/home")

      }
    },
  },
};
</script>

<style lang="scss">
</style>
