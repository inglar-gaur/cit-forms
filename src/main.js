import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router';
import router from './router';
Vue.use(Router);

import Datepicker from 'vue2-datepicker';
Vue.component('datepicker', Datepicker);

import store from './store/index';

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});