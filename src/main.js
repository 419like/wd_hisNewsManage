import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import VueResource from 'vue-resource'

import './assets/css/index.css'


Vue.use(VueResource);
Vue.use(ElementUI)

import axios from 'axios';
Vue.prototype.axios = axios;

import api from './fetch/api.js';
Vue.prototype.api = api;

import router from './router'


new Vue({
	router,
  	el: '#app',
  	render: h => h(App)
})
