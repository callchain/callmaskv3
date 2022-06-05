<template>
  <div class="send-confirm">
    <div class="header d-flex align-center pa-4">
      <div class="" @click="onPrev">
        <v-icon size="32">mdi-chevron-left</v-icon>
        <span class="fz-16">Back</span>
      </div>
    </div>
    <v-divider />
    <div class="account-list d-flex pa-4">
      <div
        class="d-flex flex-grow-1 align-center justify-center"
        @click="onCopy(currentAddress)"
      >
        <v-avatar size="30">
          <v-img :src="require('@/assets/call.png')"></v-img>
        </v-avatar>
        <span class="ml-2">{{currentAddress.substring(currentAddress.length-6)}}</span>
      </div>
      <v-icon class="swap" size="30"
        >mdi-arrow-right-thin-circle-outline</v-icon
      >
      <div
        class="d-flex flex-grow-1 align-center justify-center"
        @click="onCopy(recipient)"
      >
        <v-avatar size="30">
          <v-img :src="require('@/assets/call.png')"></v-img>
        </v-avatar>
        <span class="ml-2">{{recipient.substring(recipient.length-6)}}</span>
      </div>
    </div>
    <v-divider />
    <div class="pa-4">
      <v-btn x-small outlined>Send {{balanceItem.currency}}</v-btn>
      <div class="fz-40">{{amount}}</div>
    </div>
    <v-divider />
    <div class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <span>Gas Fee</span>
        <div class="text-right">
          <div class="fz-18">{{fee}}</div>
          <!-- <div class="fz-18 grey--text">无可用转换率</div> -->
        </div>
      </div>
      <!-- <div class="d-flex align-center mt-6">
        <div class="d-flex flex-grow-1 align-center">
          <v-text-field
            class="mr-2"
            v-model.number="num1"
            label="燃料价格"
            outlined
            dense
            hide-details
          ></v-text-field>
          <v-text-field
            v-model.number="num2"
            label="燃料限制"
            outlined
            dense
            hide-details
          ></v-text-field>
        </div>
      </div> -->
      <v-divider class="my-4" />
      <div class="d-flex align-center justify-space-between">
        <span>TOTAL</span>
        <div class="text-right">
          <div class="fz-18">Amount + Gas Fee</div>
          <div class="fz-20 mt-2 primary--text">
            {{
              balanceItem.currency == 'CALL' ? ((Number(amount) + Number(fee)).toFixed(6) + ' CALL')
              : ( amount + ' ' + balanceItem.currency + ' + ' + fee + ' CALL' )
            }}
          </div>
          <!-- <div class="fz-18 grey--text">无可用转换率</div> -->
        </div>
      </div>
    </div>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onBack" width="160" large>Cancel</v-btn>
      <v-btn @click="onSubmit" width="160" large color="primary">Confirm</v-btn
      >
    </div>
    <v-snackbar top height="50" v-model="flag" :timeout="time">{{
      txt
    }}</v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { doPayment } from '../apis/wallet'

export default {
  name: "Send",
  data() {
    return {
      flag: false,
      time: 1500,
      txt: "",

      fee: '0.0012',
      balanceItem: {},
      recipient: '',
      amount: ''
    };
  },
  computed: {
    ...mapGetters([
      "currentAddress",
      "currentAccount"
    ]),
  },
  methods: {
    onPrev() {
      this.$router.go(-1);
      this.$router.push({path: "/send", query: {
        recipient: this.recipient,
        balanceItem: this.balanceItem
      }})
    },
    onBack() {
      this.$router.push("/home");
    },
    async onSubmit() {
      const result = await doPayment(this.currentAccount, this.recipient, this.amount, this.balanceItem)
      if (result.success) {
        this.$toast.success("Payment submitted")
        this.$router.push("/home")
      } else {
        this.$toast.error(result.msg)
      }
    },
    onCopy(val) {
      this.$copyText(val).then(() => {
        this.txt = "Copy Success";
        this.flag = true;
      });
    },
  },
  created() {
    console.log("SendConfirm created")

    this.fee = this.$route.query.fee
    this.balanceItem = this.$route.query.balanceItem
    this.amount = this.$route.query.amount
    this.recipient = this.$route.query.recipient
  }
};
</script>

<style lang="scss" scoped>
.send-confirm {
  .account-list {
    position: relative;
  }
  .label {
    width: 90px;
    flex: 0 0 90px;
  }
  .item {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 8px;
  }
  .num {
    width: 160px;
  }
  .foot {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
