<template>
  <div class="setting">
    <setting-header />
    <v-divider></v-divider>
    <v-list>
      <v-list-item to="/setting/common">
        <v-list-item-content>
          <v-list-item-title class="fz-16">Common</v-list-item-title>
          <v-list-item-subtitle class="fz-14 mt-2"
            >Currency & Language</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon size="30">mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item to="/setting/safe">
        <v-list-item-content>
          <v-list-item-title class="fz-16">Security & Privacy</v-list-item-title>
          <v-list-item-subtitle class="fz-14 mt-2"
            >Privacy Setting and Mnemonic</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon size="30">mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider></v-divider>

      <!-- <v-list-item to="/setting/net">
        <v-list-item-content>
          <v-list-item-title class="fz-16">Network</v-list-item-title>
          <v-list-item-subtitle class="fz-14 mt-2"
            >Add and Edit Network</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon size="30">mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider></v-divider> -->


      <v-list-item to="/about">
        <v-list-item-content>
          <v-list-item-title class="fz-16">About</v-list-item-title>
          <v-list-item-subtitle class="fz-14 mt-2"
            >Version & Contact</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon size="30">mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider></v-divider>


    </v-list>
  </div>
</template>

<script>
import SettingHeader from "./components/SettingHeader";

export default {
  name: "Setting",
  components: { SettingHeader },
  methods: {
    onBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped></style>
