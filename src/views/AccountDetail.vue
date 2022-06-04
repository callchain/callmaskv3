<template>
  <div class="account-detail">
    <div class="account-info pa-4">
      <div class="d-flex align-center" @click="onBack">
        <v-icon>mdi-chevron-left</v-icon>
        <div class="account-name">Account1/<strong>CALL</strong></div>
      </div>
      <div class="abs mr-4">
        <account-menu />
      </div>
    </div>
    <div class="account-action d-flex flex-column align-center">
      <v-img
        class="band my-2"
        :src="require('@/assets/call.png')"
        width="32"
        rounded
      />
      <div class="amount mt-2">0.9998 CALL</div>
      <div class="ac d-flex py-5">
        <div class="ac1 text-center">
          <v-btn color="primary" x-small fab>
            <v-icon class="ac1">mdi-download</v-icon>
          </v-btn>
          <div class="txt">购买</div>
        </div>
        <div class="ac2 text-center">
          <v-btn color="primary" fab>
            <v-icon class="ac2">mdi-arrow-top-right</v-icon>
          </v-btn>
          <div class="txt">发送</div>
        </div>
        <!-- <div class="ac3 text-center">
          <v-btn color="primary" fab>
            <v-img
              class="flex-grow-0"
              :src="require('@/assets/transfer.svg')"
              width="16"
            />
          </v-btn>
          <div class="txt">兑换Swap</div>
        </div> -->
      </div>
    </div>
    <div class="act-list">
      <div class="act-list-item py-6 px-4 d-flex align-center">
        <div class="icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15 29C22.732 29 29 22.732 29 15C29 7.26801 22.732 1 15 1C7.26801 1 1 7.26801 1 15C1 22.732 7.26801 29 15 29Z"
              stroke="#D73A49"
            ></path>
            <path
              d="M18.8889 18.65C18.8889 18.8433 18.7322 19 18.5389 19H11.4611C11.2678 19 11.1111 18.8433 11.1111 18.65V17.4621C11.1111 17.1479 10.7292 16.9928 10.5102 17.2181L8.2372 19.556C8.10513 19.6919 8.10513 19.9081 8.2372 20.044L10.5102 22.3819C10.7292 22.6072 11.1111 22.4521 11.1111 22.1379V20.95C11.1111 20.7567 11.2678 20.6 11.4611 20.6H20.0944C20.2877 20.6 20.4444 20.4433 20.4444 20.25V16.15C20.4444 15.9567 20.2877 15.8 20.0944 15.8H19.2389C19.0456 15.8 18.8889 15.9567 18.8889 16.15V18.65ZM11.1111 12.35C11.1111 12.1567 11.2678 12 11.4611 12H18.5389C18.7322 12 18.8889 12.1567 18.8889 12.35V13.5379C18.8889 13.8521 19.2708 14.0072 19.4898 13.7819L21.7628 11.444C21.8949 11.3081 21.8949 11.0919 21.7628 10.956L19.4898 8.61812C19.2708 8.39284 18.8889 8.5479 18.8889 8.8621V10.05C18.8889 10.2433 18.7322 10.4 18.5389 10.4H9.90556C9.71226 10.4 9.55556 10.5567 9.55556 10.75V14.85C9.55556 15.0433 9.71226 15.2 9.90556 15.2H10.7611C10.9544 15.2 11.1111 15.0433 11.1111 14.85V12.35Z"
              fill="#D73A49"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <div class="fz-16">合约交互</div>
          <div class="fz-12">
            <span class="error--text">失败.</span>
            CallMask
          </div>
        </div>
        <div class="ml-auto text-right">
          <div class="fz-16">-0.0008 CALL</div>
          <div class="fz-12">-0.0008 CALL</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountDetail",
  components: {},
  data() {
    return {
      tab: null,
    };
  },
  methods: {
    onBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.account-info {
  position: relative;
  .account-val {
    color: #989a9b;
    font-size: 12px;
  }
  .abs {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
.account-action {
  .amount {
    font-size: 32px;
  }
  .ac {
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
      color: #c91c46;
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
  border-bottom: 1px solid #e5e5e5;
}
.act-list {
  &-item {
    border-bottom: 1px solid #e5e5e5;
    .icon {
      svg {
      }
    }
  }
}
</style>
