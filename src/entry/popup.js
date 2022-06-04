import Vue from 'vue'
import VueClipboard from "vue-clipboard2";

import App from '../view/popup.vue'
import router from '../router'
import store from '../store'
import vuetify from '../plugins/vuetify'

import Logo from "../components/Logo";
import Back from "../components/Back";
import Network from "../components/Network";
import Account from "../components/Account";
import AccountMenu from "../components/AccountMenu";

Vue.component("Logo", Logo);
Vue.component("Back", Back);
Vue.component("Network", Network);
Vue.component("Account", Account);
Vue.component("AccountMenu", AccountMenu);
Vue.config.productionTip = false

Vue.use(VueClipboard);

const vue = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

export default vue
