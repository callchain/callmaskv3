<template>
  <div class="search">
    <div class="header d-flex justify-space-between pa-4">
      <span class="fz-24">Add Recipient</span>
      <v-icon size="24" @click="onBack">mdi-close</v-icon>
    </div>
    <v-divider />
    <v-text-field
      class="ma-4"
      placeholder="Enter recipient address"
      append-icon="mdi-magnify"
      hide-details
      v-model="recipient"
      @change="checkRecipient"
      outlined
    ></v-text-field>
    <v-divider />
    <div class="list">
      <div class="list-tit px-4 py-2">Latest Recipients</div>
      <div class="list-item px-4 py-2"
          v-for="(item, index) in recipients"
          :key="index"
          @click="onSend(item)">
        <v-avatar size="30">
          <v-img :src="require('@/assets/call.png')"></v-img>
        </v-avatar>
        <span class="ml-2">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isValidAddr } from '../apis/utils'

export default {
  name: "Search",

  data() {
    return {
      recipient: '',
      balanceItem: {}
    }
  },

  computed: mapState({
    recipients: (state) => state.recipients
  }),

  methods: {
    onBack() {
      this.$router.push("/");
    },
    onSend(item) {
      this.$router.push({path: "/send", query: {balanceItem: this.balanceItem, recipient: item}});
    },
    checkRecipient() {
      if (isValidAddr(this.recipient)) {
        this.$store.dispatch('newRecipient', this.recipient)
      }
    }
  },

  created() {
    this.balanceItem = this.$route.query
  }
};
</script>

<style lang="scss" scoped>
.list {
  &-tit {
    background-color: #f2f3f4;
  }
  &-item {
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
