import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
    components: {
      VSnackbar,
      VBtn,
      VIcon
    }
})

const VuetifyObj = new Vuetify({
    icons: {
        iconfont: 'mdi'
    }
})
Vue.use(VuetifyToast, {
    $vuetify: VuetifyObj.framework,
    x: 'left',
    y: 'top',
    timeout: 3000,
    multiLine: true,
    showClose: false
})

export default VuetifyObj
