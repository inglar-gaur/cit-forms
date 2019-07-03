import Vue from 'vue'
import Router from 'vue-router'

import Home      from '../components/home';
import takeGet  from '../components/take-get';

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
            path: '/take-get',
            name: 'Контакты',
            component: takeGet
        },
    ]
})