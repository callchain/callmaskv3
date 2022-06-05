<template>
  <div class="index">
    <div class="account-info text-center py-3 px-4">
      <div class="abs lft top-menu" @click="onConnect">
        <span class="status" :class="{ connect: isConnect }"></span>
        <span class="ml-1">{{isConnect ? "Connected" : "Not connected"}}</span>
      </div>

      <div @click="onCopy" class="top-menu">
        <div class="account-name">{{currentAccount.name}}</div>
        <div class="account-val">
          {{ currentAddress | showAddress }}
        </div>
      </div>

      <account-menu class="abs rft top-menu" />
    </div>
    <v-divider />
    <div class="account-action d-flex flex-column align-center">
      <div class="amount mt-8">{{callBalance}} CALL</div>
      <div class="ac d-flex justify-center py-5">
        <!-- <div class="ac1 text-center" @click="doBuy()">
          <v-btn color="primary" x-small fab>
            <v-icon class="ac1">mdi-download</v-icon>
          </v-btn>
          <div class="txt">Buy</div>
        </div> -->
        <div class="ac2 text-center" @click="onSend({'currency': 'CALL', 'value': callBalance})">
          <v-btn color="primary" fab>
            <v-icon class="ac2">mdi-arrow-top-right</v-icon>
          </v-btn>
          <div class="txt">Send</div>
        </div>
      </div>
      <v-tabs grow v-model="tab">
        <v-tab>Asset</v-tab>
        <v-tab>Activity</v-tab>
      </v-tabs>
      <v-tabs-items class="d-block" grow v-model="tab">
        <!-- asset -->
        <v-tab-item>
          <div class="list d-block">
            <v-hover
              v-slot="{ hover }"
              class="list-item py-6 px-4 d-flex"
              v-for="(item, index) in balanceList"
              :key="index"
            >
              <div :elevation="hover ? 16 : 2" :class="{ 'on-hover': hover }" @click="onRoute(item)" >
                <v-img
                  class="band flex-grow-0"
                  width="30"
                  height="30"
                  :src="require('@/assets/call.png')"
                />
                <div class="ml-2">
                  <div class="fz-16">{{item.value}} {{item.currency}}{{ item.counterparty ? '@' + (item.counterparty | showAddress) : ''  }}
                  </div>
                  <div class="grey--text">$0.00 USD</div>
                </div>
                <v-icon class="ml-auto font-weight-bold" size="24">mdi-chevron-right</v-icon>
              </div>
            </v-hover>
          </div>
          <div class="text-center">
            <v-btn
              @click="onAddCoin"
              class="px-6 py-3 mt-3"
              color="primary"
              outlined
              rounded
              >Trust Token</v-btn
            >
          </div>
        </v-tab-item>
        <!-- interactive -->
        <v-tab-item>
          <div class="act-list">
            <div class="act-list-item py-6 px-4 d-flex align-center"
              v-for="(item, index) in transactionList"
              :key="index"
              @click="toExplorer(item.id)"
              >
              <v-icon>{{item.icon}}</v-icon>
              <div class="ml-3">
                <div class="fz-16">{{item.type}}</div>
                <div class="fz-12">
                  <span class="error--text">{{item.success ? '' : 'Failed'}}</span>
                  {{''}}
                </div>
              </div>
              <div class="ml-auto text-right">
                <div class="fz-16">{{item.amount}}</div>
                <div class="fz-12"></div>
              </div>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-snackbar top height="50" v-model="flag" :timeout="time">{{
      txt
    }}</v-snackbar>
    <connected-list />
    <to-connect-list />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ConnectedList from '../components/ConnectedList'
import ToConnectList from '../components/ToConnectList'
import { getAccountInfo, getBalances, getTransactions } from '../apis/wallet'
import { getCurrentApp } from '../apis/utils'

export default {
  name: "Home",
  components: { ConnectedList, ToConnectList },
  computed: mapState({
    ...mapGetters([
      "currentAccount",
      "currentAddress",
      "callBalance",
      "balanceList",
      "transactionList"
    ]),
    isConnect(state) {
        const curAddr = this.currentAddress
        if (!this.appInfo.app) return false

        const list = state.whitelist[this.appInfo.app] || []
        const _isConnected = list && list.indexOf(curAddr) !== -1
        return _isConnected
    },
  }),
  data() {
    return {
      tab: null,
      show: true,
      flag: false,
      time: 1500,
      txt: "",

      appInfo: {}
      
    }
  },
  methods: {
    onRoute(item) {
      this.$router.push({path: "/search", query: item})
    },
    onSend(balanceItem) {
      this.$router.push({path: "/search", query: balanceItem})
    },
    doBuy() {
    },
    onAddCoin() {
      this.$router.push("/coin/add")
    },
    onCopy() {
      this.$copyText(this.currentAddress).then(() => {
        this.txt = "Copy Success"
        this.flag = true
      })
    },
    onConnect() {
      if (this.isConnect) {
        this.$store.commit("setShowConnected", true)
      } else {
        this.$store.commit("setShowToConnect", true)
      }
    },
    async doInit() {
        const address = this.currentAddress
        const balances = await getBalances(address)
        this.$store.commit('updateBalance', balances)

        const info = await getAccountInfo(address)
        this.$store.commit('updateAccountInfo', info)

        const transactions = await getTransactions(address, {limit: 10})
        this.$store.commit('updateTransactions', transactions)
    },
    toExplorer(id) {
      window.open('https://block.callchain.cc/#/transaction/' + id)
    }
  },
  async created() {
    console.log("Home created")
    await this.doInit()
    this.appInfo = await getCurrentApp()
  }
}

</script>

<style lang="scss" scoped>
.account-info {
  position: relative;
  .status {
    display: inline-flex;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid #333;
    &.connect {
      background-color: green;
      border-color: green;
    }
  }
  .account-val {
    color: #989a9b;
    font-size: 12px;
  }
  .abs {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &.lft {
      left: 16px;
    }
    &.rft {
      right: 16px;
    }
  }

  .top-menu {
    cursor: pointer;
  }
}
.account-action {
  .amount {
    font-size: 32px;
  }
  .ac {
    flex: 0 0 100%;
    .ac1,
    .ac2,
    .ac3 {
      width: 70px;
    }
    .v-btn {
      width: 40px;
      height: 40px;
    }
    .txt {
      margin-top: 6px;
      // color: #c91c46;
    }
  }
}
.band {
  border: 1px solid #dedede;
  border-radius: 50%;
}
.v-tabs {
  .v-tab {
    font-size: 14px;
  }
  &-items {
    width: 100%;
  }
}
.v-slide-group__content {
  border-bottom: 1px solid #e5e5e5;
}
.list-item {
  cursor: pointer;
  border-bottom: 1px solid #e5e5e5;

  .on-hover {
    background: #dedede;
  }
}
.act-list {
  cursor: pointer;

  &-item {
    border-bottom: 1px solid #e5e5e5;
    .icon {
      svg {
      }
    }
  }
}
</style>
