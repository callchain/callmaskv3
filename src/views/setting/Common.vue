<template>
  <div class="safe">
    <setting-header />
    <v-divider />
    
    <div class="pa-4">

      <div class="item mt-2">
        <div class="fz-16">Currency Used</div>
        <v-select :items="currencyItems" label="Select Currency" class="mt-2"></v-select>
      </div>

      <div class="item mt-2">
        <div class="fz-16">Current Language</div>
        <div class="grey--text mt-2">
          English
        </div>
        <v-select :items="langItems" label="Select Language" class="mt-2"></v-select>
      </div>
      
    </div>
      
  </div>
</template>

<script>
import SettingHeader from "./components/SettingHeader";

export default {
  name: "Common",
  components: { SettingHeader },
  data() {
    return {
      currencyItems: ["USD"],
      langItems: ["en_US"]
    };
  },
  methods: {
  },
};
</script>

<style scoped></style>
