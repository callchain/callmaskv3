<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

const getItem = async (key) => {
    const stored = await browser.storage.local.get(key)
    try {
        const obj = JSON.parse(stored)
        if (obj.accounts) return obj
    } catch (e) {
      console.log("Error in get stored")
      console.error(e)
    }

    return null
}

export default {
  name: 'App',

  data: () => ({
    //
  }),
  async created() {
    console.log("Enter App.vue ...")
    const storeId = browser.runtime.id + "-callstore"
    const storedState = await getItem(storeId)
    if (storedState) {
        // restore state data
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
