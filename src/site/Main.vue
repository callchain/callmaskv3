<template>
  <div class="box" id="page">
    <div class="header d-flex align-center pa-4">
      <logo :url="'/enable'" class="mr-auto" :show-txt="false" />
      <!-- <network /> -->
      <account class="ml-4" />
    </div>
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style lang="scss" scoped>
#page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header {
    background-color: #f2f3f4;
    flex: 0 0 78px;
  }
  .main {
    padding-bottom: 20px;
    flex: 1 1;
    overflow-y: auto;
    position: relative;
  }
}
</style>
