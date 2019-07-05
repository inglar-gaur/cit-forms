import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router';
import router from './router';
Vue.use(Router);

import Vuetify from 'vuetify';
Vue.use(Vuetify);

// import 'vuetify/dist/vuetify.min.css'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});