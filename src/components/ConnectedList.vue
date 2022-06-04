<template>
  <v-dialog :value="showDialog" @click:outside="onClose">
    <v-card>
      <div class="text-right mr-2 mt-2">
        <v-icon @click="onClose" size="30">mdi-close</v-icon>
      </div>
      <div class="px-6 pb-4">
        <div class="fz-18 font-weight-bold mb-4">{{appInfo.app}}</div>
        <div>
          You have {{accountItems.length}} account connected to this site
        </div>
      </div>
      <v-divider />
      <div v-if="accountItems.length > 0" class="list px-4">
        <div class="list-item py-4 d-flex align-center"
            v-for="(item, index) in accountItems" :key="index">
          <span class="ml-2">{{item.name}}({{item.address.substring(item.address.length-6)}})</span>
          <v-icon @click="onDisconnect(item)" class="ml-auto">mdi-link-variant-off</v-icon>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { getCurrentApp } from '../apis/utils'

export default {
  name: "ConnectedList",
  data() {
    return {
      appInfo: {}
    }
  },
  computed: mapState({
    showDialog: (state) => {
      return state.isShowConnected
    },
    ...mapGetters([
      "currentAccount",
      "accountList"
    ]),
    accountItems(state) {
      const addressToName = {}
      for (let i = 0; i < this.accountList.length; ++i) {
          const account = this.accountList[i]
          addressToName[account.address] = account.name
      }
      const list = state.whitelist[this.appInfo.app] || []
      const result = []
      for (let i = 0; i < list.length; ++i) {
        const addr = list[i]
        result.push({
          address: addr,
          name: addressToName[addr]
        })
      }

      return result
    }
  }),
  methods: {
    onConnect() {
      this.$router.push("/account/select")
    },
    onClose() {
      this.$store.commit("setShowConnected", false)
    },
    onDisconnect(item) {
      this.$store.dispatch("updateDisconnect", {app: this.appInfo, account: item.address})
      this.$store.commit("setShowConnected", false)
    }
  },
  async created() {
    this.appInfo = await getCurrentApp()
  }
};
</script>

<style scoped></style>
