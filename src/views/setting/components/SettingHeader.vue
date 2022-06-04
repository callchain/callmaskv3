<template>
  <div class="header d-flex justify-space-between pa-4">
    <span class="fz-24">Settings</span>
    <v-icon size="24" @click="onBack">mdi-close</v-icon>
  </div>
</template>

<script>
export default {
  name: "SettingHeader",
  methods: {
    onBack() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
