<template>
	<div id="app">
		<router-view class="window" keep-alive transition transition-mode="out-in"></router-view>
	</div>
</template>
<script type="text/javascript">
export default {
	data(){
		return {

		}
	},
	watch:{
		Msgs(curVal,oldVal){
			console.log(curVal,oldVal);
		}
	},
	computed: {
        Msgs (){
            return this.$store.getters.getMsg;
        }
    }
}
</script>