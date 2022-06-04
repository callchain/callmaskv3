<template>
  <v-form class="account-add pa-8">
    <v-text-field label="Account Name"
      v-model="name"
      outlined></v-text-field>
    <div class="btns mt-4 d-flex">
      <v-btn @click="onCancel" class="flex-grow-1 mr-4" large>Cancel</v-btn>
      <v-btn
        @click="onSubmit"
        class="flex-grow-1"
        color="primary"
        outlined
        large
        >Create</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapGetters } from 'vuex'
import { createWalletFromMnemonic } from '../apis/account'

import Cryptor from '../apis/cryptor'

export default {
  name: "AccountAdd",
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters([
      "accountIndex",
      "mnemonicSaved",
      "accountCount",
      "passwordSaved"
    ]),
  },
  methods: {
    onCancel() {
      this.$router.back();
    },
    async onSubmit() {
      const name = isEmpty(this.name) ? "Account " + (this.accountCount + 1) : this.name
      const mnemonic = this.mnemonicSaved
      const account = await createWalletFromMnemonic(mnemonic, this.accountIndex)
      account["derived"] = true
      account["name"] = name

      const enc_account = account
      enc_account.secret = Cryptor.encryptAES(enc_account.secret, this.passwordSaved)

      this.$store.dispatch("addAccount", {account, enc_account})
      this.$router.push("/home")
    },
  },
};
</script>

<style scoped></style>
