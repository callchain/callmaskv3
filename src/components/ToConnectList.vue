<template>
  <v-dialog :value="showDialog" @click:outside="onClose">
    <v-card>
      <div class="text-right mr-2 mt-2">
        <v-icon @click="onClose" size="30">mdi-close</v-icon>
      </div>
      <div class="px-6 pb-4">
        <div class="fz-18 font-weight-bold mb-4">{{appInfo.app}}</div>
        <div>
          Your current account(<b>{{currentAccount.name}}</b>) is not connected
        </div>
      </div>
      <v-divider />
      <div v-if="accountItems.length > 0" class="list px-4">
        <div class="list-item py-4 d-flex align-center"
            v-for="(item, index) in accountItems" :key="index">
          <!-- <v-avatar :size="30" color="grey"> </v-avatar> -->
          <span class="ml-2">{{item.name}}({{item.address.substring(item.address.length-6)}})</span>
          <span>&nbsp;&nbsp;</span>
          <strong :class="{ activetext: item.active, nonactivetext: !item.active }">{{item.active ? " Active" : "Not Connected"}}</strong>
          <span @click="onSwitch(item)" class="ml-auto switch-text">{{item.active ? "Switch To" : "Connect"}}</span>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { getCurrentApp } from '../apis/utils'

export default {
  name: "ToConnectList",
  data() {
    return {
      appInfo: {},
      // accountItems: []
    };
  },
  computed: mapState({
    showDialog: (state) => {
      return state.isShowToConnect
    },
    ...mapGetters([
      "currentAccount",
      "accountList",
      "addressList"
    ]),
    accountItems(state) {
      const addressToName = {}
      for (let i = 0; i < this.accountList.length; ++i) {
          const account = this.accountList[i]
          addressToName[account.address] = account.name
      }
      const list = state.whitelist[this.appInfo.app] || []
      let result = [{
        address: this.currentAccount.address,
        name: this.currentAccount.name,
        active: false
      }]
      for (let i = 0; i < list.length; ++i) {
        const addr = list[i]
        result.push({
          address: addr,
          name: addressToName[addr],
          active: true
        })
      }

      return result
    }
  }),
  
  methods: {
    onConnect() {
      this.$router.push("/account/select");
    },
    onClose() {
      this.$store.commit("setShowToConnect", false);
    },
    onSwitch(item) {
      const idx = this.addressList.indexOf(item.address);
      if (idx === -1) return;

      if (item.active) {
        // switch to
        this.$store.dispatch("changeView", {app: this.appInfo, index: idx})
      } else {
        // connect
        this.$store.dispatch("updateConnect", {
          info: this.appInfo,
          accountList: [item.address]
        })
      }

      this.$store.commit("setShowToConnect", false);
    },
  },
  async created() {
    this.appInfo = await getCurrentApp()
  }
};
</script>

<style scoped>
.activetext {
  color: green;
}
.nonactivetext {
  font-size: 9px;
  color: red;
}
.switch-text {
  color: blue;
  font-size: 9px;
  cursor: pointer;
}
</style>
