import Vue from 'vue'
import Router from 'vue-router'

import Home      from '../components/home';
import receiving  from '../components/receiving/ReceivingMain';

Vue.use(Router);

export default new Router({
    hashbang: false,
    base: '/',
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },

        {
            path: '/receiving',
            name: 'Погрузо-разгрузочные работы',
            component: receiving
        },
    ]
})