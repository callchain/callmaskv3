<template>
  <div class="net">
    <setting-header />
    <v-divider />
    <div class="pa-4 fz-18 text-center">网络</div>
    <v-divider />

    <v-form class="pa-4">
      <div class="tip mb-4">
        A malicious network provider can lie about the state of the blockchain
        and record your network activity. Only add custom networks you trust.
      </div>
      <v-text-field label="网络名称" dense outlined></v-text-field>
      <v-text-field label="新增 RPC URL" dense outlined></v-text-field>
      <v-text-field label="链 ID" dense outlined></v-text-field>
      <v-text-field label="符号（选填）" dense outlined></v-text-field>
      <v-text-field
        label="区块浏览器 URL（选填）"
        dense
        outlined
      ></v-text-field>
      <div class="btns mt-4 d-flex">
        <v-btn @click="onCancel" class="flex-grow-1 mr-4" large>取消</v-btn>
        <v-btn
          @click="onSubmit"
          class="flex-grow-1"
          color="primary"
          outlined
          large
          >保存</v-btn
        >
      </div>
    </v-form>
  </div>
</template>

<script>
import SettingHeader from "./components/SettingHeader";

export default {
  name: "Net",
  components: { SettingHeader },
  methods: {
    onCancel() {
      this.$router.back();
    },
    onSubmit() {},
  },
};
</script>

<style lang="scss" scoped>
.net {
  .tip {
    border: 1px solid #ffd33d;
    background-color: #fefae8;
    padding: 12px;
  }
}
</style>
