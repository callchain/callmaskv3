<template>
  <div class="about">
    <setting-header />
    <v-divider />
    <div class="pa-4">
      <div class="fz-16">CallMask Version</div>
      <div class="fz-14 grey--text">{{version}}</div>
      <div class="mt-8">Links</div>
      <div class="links d-flex flex-column">
        <a class="mt-4 mb-3 fz-16" href="https://callchain.cc">Terms of Privacy</a>
        <a class="mb-3 fz-16" href="https://callchain.cc">Terms of Use</a>
        <a class="mb-3 fz-16" href="https://twitter.com/callchainLedger">Contact Us</a>
      </div>
    </div>
  </div>
</template>

<script>
import SettingHeader from "./components/SettingHeader";

export default {
  name: "Abbout",
  components: { SettingHeader },
  data() {
    return {
      version: "0.1.0"
    }
  },
  methods: {
    onCancel() {
      this.$router.back();
    },
    onSubmit() {},
  },
};
</script>
