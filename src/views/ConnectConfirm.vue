<template>
  <div class="account-select pa-4 pt-12 text-center">
    <v-avatar color="grey" size="30">
      <img :src="params.data.logoUrl" />
    </v-avatar>
    <div class="fz-16 mt-2">{{params.data ? params.data.app : ''}}</div>
    <div class="fz-20 mt-4">
      Connect to {{selectedList[0].name}}({{selectedList[0].address | showAddress}})
    </div>
    <div class="grey--text">Allow this app: </div>
    <div class="d-flex justify-center">
      <v-checkbox
        class="mt-8"
        input-value="true"
        disabled
        label="View your account address(required)"
      ></v-checkbox>
    </div>

    <div class="mt-4">Only connect trusted app. <a href="">Show More</a></div>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onPrev" width="160" large>Cancel</v-btn>
      <v-btn @click="onNext" width="160" large color="primary">Connect</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { confirmMessage } from '../apis/message'
import { SENDER } from '../scripts/message'

export default {
  name: "AccountSelect",
  data() {
    return {
      params: {},
      selected: []
    };
  },
  computed: {
    ...mapGetters([
      "currentAccount"
    ]),
    selectedList() {
      let i = 0;
      for (; i < this.selected.length; ++i) {
        if (this.selected[i].address === this.currentAccount.address)
          break;
      }
      // not found
      if (i === this.selected.length) {
        return this.selected
      }
      // current is first item
      if (i === 0) {
        return this.selected
      }

      // not the first item
      const list = this.selected
      const _tempItem = list[0]
      list[0] = list[i]
      list[i] = _tempItem
      return list
    }
  },
  methods: {
    onPrev() {
      if (this.params && this.params.sender === SENDER.BACKGROUND) {
        window.close()
      } else {
        this.$router.back()
      }
    },
    onNext() {
      const accountList = this.selectedList.map((item) => item.address)
      this.$store.dispatch("updateConnect", {
        info: this.params.data,
        accountList
      });
      confirmMessage(this.params, accountList);

      if (this.params && this.params.sender === SENDER.BACKGROUND) {
        window.close()
      } else {
        this.$router.back()
      }
    },
  },
  created() {
    this.params = this.$route.query.params
    this.selected = this.$route.query.selected
  }
};
</script>

<style lang="scss" scoped>
.acc-list {
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  height: 300px;
  overflow-y: scroll;
  &-item {
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
