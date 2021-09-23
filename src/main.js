import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from './plugins/Firebase'
import realtimeDB from './plugins/RealtimeDB'

import VueSocketIO from 'vue-socket.io'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false


new Vue({
  router,
  store,

  firebase,
  // realtimeDB,

  vuetify,
  render: h => h(App)
}).$mount('#app')
