<template>
  <div class="login">
    <div class="header pa-4 d-flex justify-space-between">
      <logo :show-txt="false" />
      <!-- <network /> -->
    </div>
    <div class="main pa-5">
      <div class="slogan">
        <v-img :src="require('@/assets/logo.png')" width="120" />
        <h1>Welcome Back!</h1>
        <div>Enter Callchain network</div>
      </div>
      <v-form ref="form" v-model="flag" lazy-validation>
        <v-text-field
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="password"
          :rules="valid.password"
          type="password"
          placeholder="Password"
          @click:append="show1 = !show1"
          ></v-text-field>
        <v-btn class="py-7 fz-20" color="primary" block @click="onUnlock">Unlock</v-btn>
        <div class="text-center mt-4">
          or
          <a href="#">Import Using Mnemonic?</a>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MSG_TYPE } from '../scripts/message'
import { encryptMD5, checkPassword } from '../apis/cryptor'
import { isEmpty } from 'lodash'

export default {
  name: "Login",
  data() {
    return {
      password: '',
      show1: false,
      flag: true,
      valid: {
        password: [
          (v) => !!v || "Should not empty",
          (v) => checkPassword(v, this.$store.state.walletPwd, this.$store.state.mnemonic) || "Not correct password"
        ]
      },

      params: {}
    }
  },
  computed: {
    ...mapGetters([
      "accountList",
      "passwordSaved"
    ]),
  },
  methods: {
    onUnlock() {
      const flag = this.$refs.form.validate()

      if (flag) {
        // decrypt all secret, save passwd
        if (!this.$store.state.walletPwd) {
          const encPassword = encryptMD5(this.password)
          const callRPC = true
          this.$store.dispatch("decAccount", {encPassword, callRPC})
        }

        this.$store.commit("setShowConnected", false)
        this.$store.commit("setShowToConnect", false)

        if (!isEmpty(this.params)) {
          switch (this.params.type) {
            case MSG_TYPE.CONNECT:
            case MSG_TYPE.CURRENT_ACCOUNTS:
              this.$router.push({path: '/account/select', query: this.params})
              break;
            case MSG_TYPE.SIGN:
            case MSG_TYPE.SUBMIT:
              this.$router.push({path: '/enable', query: this.params})
              break;
          }
        } else {
          this.$router.push("/home")
        }
      }
    }
  },
  created() {
    this.params = this.$route.query
  }
};
</script>

<style lang="scss" scoped>
.login {
  .header {
    background-color: #f2f3f4;
  }
}

.slogan {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 32px;
  }
  div {
    color: #aeaeae;
  }
}
.v-form {
  margin-top: 54px;
}
</style>
