import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from './plugins/Firebase'

import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  firebase,
  render: h => h(App)
}).$mount('#app')
