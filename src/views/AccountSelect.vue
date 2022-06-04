<template>
  <div class="account-select pa-4 pt-12 text-center">
    <v-avatar color="grey" size="30">
      <img :src="params.data.logoUrl" />
    </v-avatar>
    <div class="fz-16 mt-2">{{params.data ? params.data.app : ''}}</div>
    <div class="fz-20 mt-4">Use CallMask to connect</div>
    <div class="d-flex align-center justify-space-between mt-4">
      <v-checkbox
        @change="onAll"
        class="mt-0"
        label="Select All"
        indeterminate
        hide-details
      ></v-checkbox>
      <!-- <v-btn @click="onShowAdd" color="primary" text>New Account</v-btn> -->
    </div>
    <div class="acc-list flex-grow-1">
      <div class="acc-list-item pa-2" v-for="(item, idx) in list" :key="idx">
        <v-checkbox v-model="item.check" hide-details>
          <template v-slot:label>
            <v-avatar size="34">
              <v-img :src="require('@/assets/logo.png')"></v-img>
            </v-avatar>
            <div class="ml-2">
              <div class="fz-8 black--text">
                {{ item.name }} ({{ item.address.substring(item.address.length-6) }})
              </div>
              <div class="grey--text">{{ 0 }} CALL</div>
            </div>
          </template>
        </v-checkbox>
      </div>
    </div>
    <div class="mt-2">Only connect trust app. <a href=""> Show More</a></div>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onPrev" width="160" large>Cancel</v-btn>
      <v-btn @click="onNext" width="160" large color="primary"
        >Next</v-btn
      >
    </div>
    <v-dialog v-model="show">
      <v-card>
        <div class="text-right mr-2 mt-2">
          <v-icon size="30" @change="onCancel">mdi-close</v-icon>
        </div>
        <div class="px-6 pb-4">
          <div class="fz-18 font-weight-bold">New Account</div>
          <v-text-field
            class="mt-4"
            label="Account Name"
            outlined
            hide-details
          ></v-text-field>
        </div>
        <v-divider />
        <div class="btns pa-4 d-flex">
          <v-btn @click="onCancel" class="flex-grow-1 mr-4" large>Cancel</v-btn>
          <v-btn
            @click="onSave"
            class="flex-grow-1"
            color="primary"
            outlined
            large
            >Save</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
import { createWalletFromMnemonic } from '../apis/account'
import { SENDER } from '../scripts/message'

import Cryptor from '../apis/cryptor'

export default {
  // components: { Import },
  name: "AccountSelect",
  data() {
    return {
      list: [],
      show: false,
      name: '',
      
      params: {}
    };
  },
  computed: {
    ...mapGetters([
      "accountList",
      "currentIndex",
      "accountCount",
      "mnemonicSaved",
      "accountIndex",
      "passwordSaved"
    ]),
  },
  methods: {
    onAll(val) {
      if (val) {
        this.list = this.list.map((item) => ({ ...item, check: true }))
      } else {
        this.list = this.list.map((item) => ({ ...item, check: false }))
      }
    },
    onPrev() {
      if (this.params && this.params.sender === SENDER.BACKGROUND) {
        window.close()
      } else {
        this.$router.back()
      }
    },
    onNext() {
      const selected = this.list.filter(item => item.check)
      if (selected.length > 0) {
        this.$router.push({path: "/connect/confirm", query: {
          params: this.params,
          selected: selected.map((item) => { return {address: item.address, name: item.name} })
        }})
      }
    },
    onShowAdd() {
      this.show = true
    },
    async onSave() {
      const name = isEmpty(this.name) ? "Account " + (this.accountCount + 1) : this.name
      const mnemonic = this.mnemonicSaved
      const account = await createWalletFromMnemonic(mnemonic, this.accountIndex)
      account["derived"] = true
      account["name"] = name

      const enc_account = account
      enc_account.secret = Cryptor.encryptAES(enc_account.secret, this.passwordSaved)

      this.$store.dispatch("addAccount", {account, enc_account})

      this.show = false
    },
    onCancel() {
      this.show = false
    },
  },
  async created() {
    this.params = this.$route.query

    const list = this.accountList
    for (let i = 0; i < list.length; ++i) {
        if (i === this.currentIndex) list[i]["check"] = true
        else list[i]["check"] = false
    }
    this.list = list
  }
};
</script>

<style lang="scss" scoped>
.acc-list {
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  height: 280px;
  overflow-y: scroll;
  &-item {
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
