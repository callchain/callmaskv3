<template>
  <div class="enable">
    <div class="header pa-4 d-flex align-center">
      <v-avatar>
        <v-img :src="require('@/assets/logo.png')" width="64"></v-img>
      </v-avatar>
      <span class="ml-2">{{currentAddress.substring(currentAddress.length - 6)}}</span>
      <v-btn class="ml-auto fz-12" small outlined rounded>
        {{params.data.app}}
      </v-btn>
    </div>
    <div class="pa-4 text-center">
      <v-avatar size="40">
        <v-img :src="params.data.logoUrl" width="64"></v-img>
      </v-avatar>
      <div class="my-4 fz-20">
        Allow {{params.data.app}}<br />
        to do {{tx.txJSON.TransactionType}}?
      </div>
      <div>
        Please check transaction detail before your confirm this transaction.<br />
        Submitted transaction cannot be reverted.
      </div>
    </div>
    <v-divider />
    <div class="pa-4">
      <div class="fz-16 font-weight-bold d-flex align-center">
        <v-icon>mdi-tag</v-icon>Transaction Fee
      </div>
      <div class="d-flex justify-space-between mt-4">
        <span>Transaction need some gas fee</span>
        <div class="text-right">
          <div class="fz-18 font-weight-bold">{{tx.instructions.fee}} CALL</div>
        </div>
      </div>
      <v-btn @click="onToggle" class="mt-4" color="primary" text
        >View full transaction details
        <v-icon>{{ show ? "mdi-menu-up" : "mdi-menu-down" }}</v-icon></v-btn
      >
    </div>
    <v-divider />
    <template v-if="show">
      <div class="pa-4">
        <div class="fz-16 font-weight-bold d-flex align-center">
          <v-icon>mdi-file</v-icon>Transaction
        </div>
        <div class="word-break mt-4">
          <vue-json-pretty :data="tx" />
        </div>
      </div>
    </template>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onBack" width="160" large>Reject</v-btn>
      <v-btn @click="onSubmit" width="160" large color="primary">Confirm</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import VueJsonPretty from 'vue-json-pretty'
import "../styles/vue-json-pretty.css"

import { doSubmitTx } from '../apis/wallet'
import { confirmMessage } from '../apis/message'

export default {
  name: "Enable",
  data() {
    return {
      show: false,

      params: {},
      tx: {}
    };
  },
  components: {
    VueJsonPretty
  },
  computed: {
    // TODO, may not current address
    ...mapGetters([
      "currentAddress",
      "currentAccount",
      "accountList"
    ]),
  },
  methods: {
    onBack() {
      window.close()
    },
    async onSubmit() {
        const from = this.tx.txJSON.Account;
        const account = this.accountList.find((item) => item.address === from);
        if (!account) {
          this.$toast.error("Account Not found")
          return;
        }
        // TODO, account secret decrypt
        const result = await doSubmitTx(account, JSON.stringify(this.tx.txJSON))

        // return result to user
        confirmMessage(this.params, result)

        if (result.success) {
          this.$toast.success("Success submitted")
          setTimeout(function() { window.close(); }, 3000)
        } else {
          this.$toast.error(result.msg)
        }
    },
    onToggle() {
      this.show = !this.show
    },
  },
  created() {
    console.log("Enable created")

    this.params = this.$route.query

    this.tx = {
      instructions: this.params.data.instructions,
      txJSON: JSON.parse(this.params.data.txJSON)
    }
  }
};
</script>

<style lang="scss" scoped>
.enable {
  margin-bottom: 100px;
  .header {
    background-color: #f2f3f4;
  }
}


</style>
