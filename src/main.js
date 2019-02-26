// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VueSocketIO from "vue-socket.io";
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import store from './store'

const ip = "192.168.255.28";
//const ip = "localhost";

Vue.use(Vuetify, {
    iconfont: 'mdi'
});
Vue.use(Vuex);
Vue.use(VueAxios, axios);

Vue.use(new VueSocketIO({
    connection: "ws://" + ip + ":3535",
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}));

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: {App},
});
