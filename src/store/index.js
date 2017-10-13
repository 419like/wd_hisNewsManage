import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        msg:''
    },
    mutations:{
        systemMessage(state,value){
    		state.msg = value;
            window.app.$alert(value, '错误信息', {
	          confirmButtonText: '确定'
	        });
        }
    },
    getters:{
    	getMsg(state,getters){
    		return state.msg;
    	}
    }
})
export default store;