<template>
  <div class="safe">
    <setting-header />
    <v-divider />
    <div class="pa-4">
      <div class="mt-4">Show Account Mnemonic</div>
      <v-text-field
        class="mt-6"
        label="Enter Password"
        type="password"
        v-model="password"
        outlined
        dense
        v-if="!show"
        >
      </v-text-field>
      <div v-if="show" class="mt-4 fz-18 font-weight-bold text-center">
        {{mnemonicSaved}}
      </div>
      <div class="tip red--text light-red">
            Warning: Never show mnemonic to others. Anyone own your mnemonic can steal all your money.
      </div>
      <v-btn @click="onShow" class="mt-4" color="primary" block outlined>{{
        show ? "Hide Mnemonic" : "Show Mnemonic"
      }}</v-btn>

      <div class="item mt-12">
        <div class="fz-16">Receive Notify of Transaction</div>
        <div class="grey--text mt-2">
          Incoming transaction will show in notify and activity.
        </div>
        <v-switch v-model="sw1" :label="sw1 ? 'On' : 'Off'"></v-switch>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import SettingHeader from "./components/SettingHeader"
import { encryptMD5 } from '../../apis/cryptor'

export default {
  name: "Safe",
  components: { SettingHeader },
  data() {
    return {
      show: false,

      sw1: true,
      sw2: true,
      sw3: true,

      password: ''
    };
  },
  computed: {
    ...mapGetters([
      "mnemonicSaved"
    ]),
  },
  methods: {
    onShow() {
      if (!this.show) {
        // to show
        if (encryptMD5(this.password) == this.$store.state.walletPwd) {
          this.show = true
          this.password = ''
        }
      } else {
        // to hide
        this.show = false
      }
    },
    onCancel() {
      this.$router.back();
    },
    onSubmit() {},
  },
};
</script>

<style scoped></style>
