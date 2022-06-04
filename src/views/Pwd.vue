<template>
  <div class="pwd">
    <logo />
    <back class="mt-8 mb-4" />
    <h4>Create Password</h4>
    <v-form ref="form" v-model="flag" lazy-validation>
      <v-text-field
        v-model="form.pwd"
        :rules="valid.pwd"
        label="New Password(8 Characters At Least)"
        type="password"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="form.rpwd"
        :rules="valid.rpwd"
        label="Confirm Password"
        type="password"
        outlined
      ></v-text-field>
      <v-checkbox v-model="form.checked" :rules="valid.checked" class="ma-0">
        <template v-slot:label>
          <div>I have read and agreed with <a href="#">Terms of Use</a></div>
        </template>
      </v-checkbox>
      <v-btn @click="onSubmit" class="px-12 mt-4" color="primary" large>Create</v-btn>
    </v-form>
  </div>
</template>

<script>
const C = require('../apis/constant');

export default {
  name: "Pwd",
  data() {
    return {
      flag: true,
      form: {
        pwd: "",
        rpwd: "",
        checked: false,
      },
      valid: {
        pwd: [
          (v) => !!v || "Should not empty",
          (v) => (v && v.length >= C.MIN_PWD_LENGTH) || "Password length not enough",
        ],
        rpwd: [
          (v) => !!v || "Should not empty",
          (v) => {
            return (v && v === this.form.pwd) || "Password mismatch";
          },
        ],
        checked: [(v) => !!v || "Please agree with terms of use"],
      },
    };
  },
  methods: {
    onSubmit() {
      const flag = this.$refs.form.validate();
      if (flag) {
        this.$router.push({path: '/create', query: {password: this.form.pwd}});
      }
    },
  },
  created: function() {
  }
};
</script>

<style lang="scss" scoped>
.pwd {
  padding: 20px;
  h4 {
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 40px;
  }
  .v-btn {
    width: 200px;
  }
}
</style>
