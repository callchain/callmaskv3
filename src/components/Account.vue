<template>
  <div class="account">
    <v-menu min-width="240" class="tool" v-model="show" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar size="32" v-bind="attrs" v-on="on">
            <jazzicon :address="convertAddress(currentAddress)" :diameter="100" />
        </v-avatar>
      </template>
      <div class="account-modal">
        <div
          class="
            account-modal-header
            d-flex
            justify-space-between
            align-center
            pa-4
            white--text
          "
        >
          <span>Accounts</span>
          <!-- <v-btn color="white" small outlined>锁定</v-btn> -->
        </div>
        <div class="account-modal-main">
          <div class="list py-2">
            <div
              class="list-item pa-2 d-flex align-top menu-item"
              v-for="(item, idx) in accountList"
              :key="idx"
              @click="onSwitch(idx)"
            >
              <v-icon
                class="d-inline-block"
                color="white"
                :style="{ visibility: idx === currentIndex ? 'visible' : 'hidden' }"
                >mdi-check
              </v-icon>
              <v-avatar class="mx-2" size="26">
                <jazzicon :address="convertAddress(item.address)" :diameter="100" />
              </v-avatar>
              <div>
                <div class="acc-name white--text fz-20">{{ item.name }}</div>
                <div class="acc-val">{{ 0 }}</div>
              </div>
            </div>
          </div>
          <v-divider class="white--text white" />
          <div class="menu pb-2">
            <div
              class="menu-item d-flex align-center pa-3"
              @click="onAccountAdd"
            >
              <v-icon color="white">mdi-plus</v-icon>
              <span class="ml-3 fz-16 white--text">Create Account</span>
            </div>
            <div
              class="menu-item d-flex align-center pa-3"
              @click="onAccountImport"
            >
              <v-icon color="white">mdi-download</v-icon>
              <span class="ml-3 fz-16 white--text">Import Account</span>
            </div>
            <div class="menu-item d-flex align-center pa-3" @click="onSetting">
              <v-icon color="white">mdi-cog</v-icon>
              <span class="ml-3 fz-16 white--text">Settings</span>
            </div>
          </div>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurrentApp } from '../apis/utils'
import Jazzicon from 'vue-jazzicon'
import { encryptMD5 } from '../apis/cryptor'

export default {
  name: "Account",
  data() {
    return {
      show: false,
      selIdx: 0
    };
  },
  components: { Jazzicon },
  computed: {
    ...mapGetters([
      "accountList",
      "currentAddress",
      "currentIndex"
    ]),
  },
  methods: {
    convertAddress(str) {
      return encryptMD5(str)
    },

    onAccountAdd() {
      this.$router.push("/account/add")
    },

    onAccountImport() {
      this.$router.push("/account/import")
    },

    onSetting() {
      this.$router.push("/setting")
    },
    async onSwitch(idx) {
      const app = await getCurrentApp()
      this.$store.dispatch("changeView", {app: app, index: idx})
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  // border: 2px solid blue;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &-modal {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
.list {
  max-height: 200px;
  overflow-y: scroll;
}
.acc-val {
  color: #5d5d5d;
}

.menu-item {
  cursor: pointer;
}

</style>
