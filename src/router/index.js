import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const index = resolve => {
    require(['../components/index/index.vue'], resolve)
};
const routes = [{
	path: '/',
	redirect: '/index'
},{
	path: '/index',
	component: index
}]
const router = new Router({
    routes
})
router.beforeEach((to, from, next) => {
    document.body.scrollTop = 0;
    next()
});
export default router;
