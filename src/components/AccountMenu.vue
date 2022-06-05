<template>
  <div class="account-menu">
    <v-menu v-model="show" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="black" v-bind="attrs" v-on="on">
          mdi-dots-vertical
        </v-icon>
      </template>
      <div class="list px-4">

        <div class="list-item py-3" @click="onViewDetail">
          <v-icon size="16">mdi-view-dashboard-outline</v-icon>
          <span class="ml-2">Account Info</span>
        </div>

        <div class="list-item py-3 d-flex align-center" @click="toExplorer">
          <v-icon size="16">mdi-open-in-new</v-icon>
          <div class="ml-2">
            <div>View in Explorer</div>
            <div class="fz-12 grey--text">CallExplorer</div>
          </div>
        </div>

        <div v-if="showConnect" class="list-item py-3" @click="onConnect">
          <v-icon size="16">mdi-adjust</v-icon>
          <span class="ml-2">Connected Apps</span>
        </div>

      </div>
    </v-menu>
    <v-dialog v-model="dialog1">
      <v-card class="d-flex flex-column align-center">
        <v-icon class="align-self-end mt-4 mr-4" @click="onClose1" size="30"
          >mdi-close</v-icon
        >
        <div class="box d-flex flex-column align-center">
          <div class="account-name d-flex justify-center align-center">
            <template v-if="!isEdit">
              <span class="text-center fz-18">{{ currentAccount.name }}</span>
              <v-icon @click="isEdit=!isEdit" class="ml-1" size="24"
                >mdi-pencil</v-icon
              >
            </template>
            <template v-else>
              <input
                width="200"
                class="text-center fz-18"
                v-model="name"
                type="text"
              />
              <v-icon @click="changeName" size="24">mdi-check-bold</v-icon>
            </template>
          </div>
          <v-img
            class="my-4"
            :src="require('@/assets/qrcode.png')"
            width="164"
          ></v-img>
          <v-text-field
            class="d-block"
            v-model="currentAddress"
            outlined
            dense
            hide-details
            readonly
          ></v-text-field>
        </div>
        <v-divider class="my-4"></v-divider>
        <div class="box pb-8">
          <v-btn @click="toExplorer" class="fz-12" color="primary" outlined block
            >View in CallExplorer</v-btn
          >
          <v-btn @click="onExport" class="mt-4" color="primary" outlined block
            >Export Secret</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2">
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <div @click="onBack" class="to-back">
            <v-icon>mdi-chevron-left</v-icon>
            <span>Back</span>
          </div>
          <v-icon class="mt-4 mr-4" @click="onClose2" size="30"
            >mdi-close</v-icon
          >
        </div>

        <div class="box d-flex flex-column align-center mx-auto">
          <div>{{name}}</div>
          <v-text-field
            class="d-block mt-6"
            v-model="currentAddress"
            outlined
            dense
            hide-details
            readonly
          ></v-text-field>
        </div>
        <v-divider class="my-4"></v-divider>
        <div class="box text-center pb-8 mx-auto">
          <div class="fz-18">Show Secret</div>
          <v-text-field
            class="mt-6"
            label="Enter Password"
            type="password"
            v-model="password"
            outlined
            dense
            v-if="!showKey"
          >
          </v-text-field>
          <v-textarea
            v-else
            label="This is your secret(Click to copy)"
            readonly
            auto-grow
            outlined
            class="pa-4 fz-8"
            @focus="onFocus"
            v-model="currentAccount.secret"
          ></v-textarea>
          <div class="tip red--text light-red">
            Warning: Never show secret to others. Anyone own your secret can steal all your money.
          </div>
          <div class="btns mt-4" v-if="!showKey">
            <v-btn @click="onClose2" class="mr-4" large>Cancel</v-btn>
            <v-btn @click="onShowKey" class="" color="primary" outlined large
              >Confirm</v-btn
            >
          </div>
          <v-btn
            v-else
            @click="onComplete"
            class="mt-4"
            color="primary"
            block
            outlined
            large
            >OK</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <v-snackbar class="copy-tip" top height="50" v-model="flag" :timeout="time">{{
      txt
    }}</v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
import { encryptMD5 } from '../apis/cryptor'

export default {
  name: "AccountMenu",
  props: {
    showConnect: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      "currentAddress",
      "currentAccount"
    ]),
  },
  data() {
    return {
      show: false,
      dialog1: false,
      dialog2: false,

      name: "",
      password: "",
      
      isEdit: false,
      showKey: false,
      flag: false,
      time: 1500,
      txt: ""
    };
  },
  methods: {
    changeName() {
      if (!isEmpty(this.name)) {
        this.$store.dispatch("changeAccountName", this.name)
      }
      this.isEdit = !this.isEdit;
    },
    onConnect() {
      this.$store.commit("setShowConnected", true);
    },
    onViewDetail() {
      this.dialog1 = true;
    },
    onClose1() {
      this.dialog1 = false;
    },
    onClose2() {
      this.dialog2 = false;
      this.showKey = false
    },
    onBack() {
      this.dialog2 = false;
      this.dialog1 = true;
      this.showKey = false
    },
    onExport() {
      this.dialog1 = false;
      this.dialog2 = true;
    },
    onShowKey() {
      if (encryptMD5(this.password) == this.$store.state.walletPwd) {
        this.showKey = true;
        this.password = ''
      }
    },
    onFocus(e) {
      e.target.select();
      setTimeout(() => {
        this.$copyText(this.currentAccount.secret).then(() => {
          this.txt = "Copy Success";
          this.flag = true;
        });
      }, 500);
    },
    onComplete() {
      this.dialog2 = false;
      this.showKey = false
    },
    toExplorer() {
      window.open("https://block.callchain.cc/#/account/" + this.currentAddress)
    }
  },
  created() {
    console.log("AccountMenu created")
    this.name = this.currentAccount.name
  }
};
</script>

<style lang="scss" scoped>
.v-menu__content {
  background-color: #fff;
}
.txt {
  max-width: 250px;
}
.box {
  width: 290px;
}
hr {
  width: 100%;
}
.v-btn {
  font-size: 12px;
  letter-spacing: 0;
}
.account-name {
  position: relative;
  input {
    height: 40px;
    width: 200px;
    max-width: 200px;
    border: 1px solid #333;
  }
  .v-icon {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(150%, -50%);
  }
}
.list {
  width: 200px;
}

.list-item {
  cursor: pointer;
}

.copy-tip {
  z-index: -100;
}

.to-back {
  cursor: pointer;
}

</style>
