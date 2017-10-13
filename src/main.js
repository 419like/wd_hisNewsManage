import Vue from 'vue'
import store from '@/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'


import './assets/css/index.css'


Vue.use(ElementUI)

import axios from 'axios';
Vue.prototype.axios = axios;


import api from './fetch/api.js';
Vue.prototype.api = api;

import router from './router'


window.app = new Vue({
	router,
	store,
  	el: '#app',
  	render: h => h(App)
}).$mount('#app')
