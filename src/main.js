import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router';
import router from './router';
Vue.use(Router);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});