<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { MSG_TYPE, POPUP_WINDOW_NAME } from '../scripts/message'
import qs from 'qs'
import { getWalletPwdRPC, initMessage } from '../apis/message'
import { isEmpty } from 'lodash'

// initMessage()

export default {
  name: 'App',

  data: () => ({
    //
  }),
  async created() {
    // init connection between bg and popup
    await initMessage();

    // processed
    let params = null
    if (window.name === POPUP_WINDOW_NAME) {
        params = qs.parse(window.location.search.substring(1))
    }

    // In this state, state should have account info(include secrets)
    if (this.$store.state.accounts.length === 0) {
      // ignore params for not created account
      this.$router.push("/welcome")
    } else {
      if (!this.$store.state.walletPwd) {
        const encPassword = await getWalletPwdRPC()
        if (isEmpty(encPassword)) {
          // should do redirect
          this.$router.push({path: '/login', query: params})
          return
        } else {
          const callRPC = false
          this.$store.dispatch("decAccount", {encPassword, callRPC})
        }
      }

      // normal
      if (params) {
        switch (params.type) {
          case MSG_TYPE.CONNECT:
          case MSG_TYPE.CURRENT_ACCOUNTS:
            this.$router.push({path: '/account/select', query: params})
            break;
          case MSG_TYPE.SIGN:
          case MSG_TYPE.SUBMIT:
            this.$router.push({path: '/enable', query: params})
            break;
        }
      } else {
        this.$router.push('/home')
      }

    }
  }
};
</script>

<style lang="scss">
html {
  width: 380px;
  height: 800px;
}
* {
  font-size: 14px;
}

.v-select-list {
  .v-list-item__title {
    font-size: 14px;
  }
}

.v-snack__content {
  font-size: 14px !important;
}

.v-btn {
  text-transform: none !important;
}

.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e5e5;
}

.fz-12 {
  font-size: 12px !important;
}

.fz-14 {
  font-size: 14px !important;
}

.fz-16 {
  font-size: 16px !important;
}

.fz-18 {
  font-size: 18px !important;
}

.fz-20 {
  font-size: 20px !important;
}

.fz-24 {
  font-size: 24px !important;
}

.fz-40 {
  font-size: 40px !important;
}
</style>
