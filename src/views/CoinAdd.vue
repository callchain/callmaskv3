<template>
  <div class="coin">
    <div class="header pa-4 pb-0">
      <div class="fz-24">Trust Token</div>
      <div class="mt-4 mb-2">Issuer</div>
    </div>
    <v-divider></v-divider>
    <v-form class="pa-4" ref="form" v-model="flag" lazy-validation>
      <v-text-field
        label="Issuer Address"
        v-model="issuer" outlined
        :rules="valid.issuer"
        ref="issuer"
        @blur="checkIssuer"></v-text-field>
      <v-select
        :items="issuedTokens"
        :rules="valid.symbols"
        v-model="symbol"
        label="Symbols" outlined></v-select>
    </v-form>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onBack" width="160">Cancel</v-btn>
      <v-btn width="160" color="primary" @click="doTrust">Next</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isValidAddr } from '../apis/utils'
import { getIssueList, doTrustline } from '../apis/wallet'

export default {
  name: "CoinAdd",
  data() {
    return {
      items: [],

      issuer: '',
      symbol: '',

      flag: true,
      valid: {
        issuer: [
          (v) => !!v || "Should not empty",
          (v) => isValidAddr(v) || "Invalid address"
        ],
        symbols: [
          () => this.items.length > 0 || "No Token"
        ]
      }
    }
  },
  computed: {
    issuedTokens() {
      return this.items.map(item => item.specification.currency)
    },
    ...mapGetters([
      "currentAccount"
    ]),
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    async checkIssuer() {
      const flag = this.$refs.issuer.validate()
      if (flag) {
        const _items = await getIssueList(this.issuer)
        this.items = _items.results
      }
    },
    async doTrust() {
      const flag = this.$refs.form.validate()
      if (flag) {
        const item = this.items.find((i) => i.specification.currency == this.symbol)
        const result = await doTrustline(this.currentAccount, item)
        if (result.success) {
          this.$toast.success("Add trustline submitted");
          this.$router.push("/home")
        } else {
          this.$toast.error(result.msg)
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.coin {
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
