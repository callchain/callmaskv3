<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    const storeId = browser.runtime.id + "-callstore"
    if (localStorage.getItem(storeId) ) {
        // restore state data
        const storedState = JSON.parse(localStorage.getItem(storeId))
        const needState = {
          accounts: storedState.accounts,
          currentAccIndex: storedState.currentAccIndex,
          mnemonic: storedState.mnemonic,
          nextAccountIndex: storedState.nextAccountIndex,
          recipients: storedState.recipients,
          whitelist: storedState.whitelist
        }
        this.$store.replaceState(Object.assign({}, this.$store.state, needState))
    }
    console.log("Appstate");
    console.dir(this.$store.state)
  }
};
</script>

<style lang="scss" scoped>
html {
  width: 350px;
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
