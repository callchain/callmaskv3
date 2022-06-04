<template>
  <div class="send">
    <div class="header d-flex justify-space-between pa-4">
      <span class="fz-24">Send</span>
      <v-icon size="24" @click="onBack">mdi-close</v-icon>
    </div>
    <v-divider />
    <div class="account-list pa-4">
      <div class="account d-flex">
        <v-icon color="success">mdi-check-circle</v-icon>
        <span class="ml-2">{{recipient}}</span>
        <v-icon class="ml-auto">mdi-close</v-icon>
      </div>
    </div>
    <v-divider />
    <v-form class="pa-4">
      <div class="form-item d-flex align-center">
        <div class="label">Asset</div>
        <div class="item d-flex flex-grow-1 align-center">
          <v-avatar size="30">
            <v-img :src="require('@/assets/call.png')"></v-img>
          </v-avatar>
          <div class="ml-2">
            <div>{{balanceItem.currency}}</div>
            <div class="fz-12">Balance {{balanceItem.value}}</div>
          </div>
        </div>
      </div>
      <div class="form-item d-flex align-center mt-4">
        <div class="label">Amount</div>
        <div class="item d-flex flex-grow-1 align-center">
          <div class="ml-2">
            <div class="num">
              <v-text-field v-model="amount" suffix="CALL">
                <template v-slot:prepend>
                  <v-btn class="fz-12" x-small @click="toMax">MAX</v-btn>
                </template>
              </v-text-field>
            </div>
            <!-- <div class="fz-12">无可用转换率</div> -->
          </div>
          <!-- <v-icon class="ml-auto" size="30">mdi-swap-vertical</v-icon> -->
        </div>
      </div>
      <div class="form-item d-flex align-center mt-4">
        <div class="label">Fee</div>
        <div class="d-flex flex-grow-1 align-center">
          <v-text-field
            class="mr-2"
            v-model.number="fee"
            label="Network Fee"
            outlined
            dense
            hide-details
          ></v-text-field>
          <!-- <v-text-field
            v-model.number="num2"
            label="燃料限制"
            outlined
            dense
            hide-details
          ></v-text-field> -->
        </div>
      </div>
    </v-form>
    <div class="foot pa-4 d-flex justify-space-between">
      <v-btn @click="onBack" width="160" large>Cancel</v-btn>
      <v-btn @click="onNext" width="160" large color="primary">Next</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BN from 'bignumber.js'
const ZERO = new BN(0)

export default {
  name: "Send",
  data() {
    return {
      fee: '0.0012',
      balanceItem: {},
      recipient: '',
      amount: ''
    };
  },
  computed: {
    reservedAmount() {
        if (this.balanceItem.currency == 'CALL') return this.reservedCALL
        else return ZERO
    },
    ...mapGetters([
      "reservedCALL"
    ]),
  },
  methods: {
    onBack() {
      this.$router.push("/");
    },
    onNext() {
      this.$router.push({path: "/send/confirm", query: {
        recipient: this.recipient,
        amount: this.amount,
        fee: this.fee,
        balanceItem: this.balanceItem
      }});
    },
    toMax() {
      this.amount = this.balanceItem.value.minus(this.reservedAmount).toString()
    }
  },
  created() {
    this.balanceItem = this.$route.query.balanceItem
    this.recipient = this.$route.query.recipient
  }
};
</script>

<style lang="scss" scoped>
.send {
  .account {
    border: 1px solid #c91c46;
    padding: 16px;
    border-radius: 8px;
    color: #c91c46;
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
