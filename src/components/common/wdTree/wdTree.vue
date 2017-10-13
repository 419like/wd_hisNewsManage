<template>
    <div >
        <div v-if="show" v-for="item in value" class="hisItem"  >
            <div style="width:30px;">
                <div v-if="item.state=='closed'">
                    <div v-if="!item.expanded" @click="expand(item)" style="display:flex">
                        <div style="width:15px;text-align: center;">
                            <svg viewBox="0 0 1024 1024" class="svgIcon" style="margin-top:6px;width:10px;fill:#000;">
                                <path d="M863.232 512L204.8 1024V0l658.432 512z"></path>
                            </svg>
                        </div>
                        <div style="width:15px;text-align: center;">
                             <svg viewBox="0 0 1024 1024" class="svgIcon" style="margin-top:2px;width:15px;fill:#000;">
                                <path d="M891.1 236.3H615.4c0-142.8-137.9-137.9-137.9-137.9H201.8c-129.6 0-137.9 68.9-137.9 68.9v137.9H960l-68.9-68.9zM63.9 925.6H960V374.1H63.9v551.5z"></path>
                            </svg>
                        </div>
                    </div>
                    <div v-if="item.expanded" @click="closeExpand(item)" style="display:flex">
                        <div style="width:15px;text-align: center;">
                            <svg viewBox="0 0 1024 1024" class="svgIcon" style="margin-top:8px;width:10px;fill:#000;">
                                <path  d="M512 841.216L0 182.784h1024L512 841.216z"></path>
                            </svg>
                        </div>
                        <div style="width:15px;text-align: center;">
                            <svg viewBox="0 0 1024 1024" class="svgIcon" style="margin-top:2px;width:18px;fill:#000;">
                                <path d="M288.4 372.6h447.5l55.9-55.9H456.2c0-130.5-55.9-111.9-55.9-111.9H120.6c-62.3 0-56 111.9-56 111.9v447.5l223.8-391.6z m55.9 56L120.6 820.1h615.3l223.7-391.5H344.3z" fill="" p-id="8857"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div v-if="item.state!='closed'">
                    <div style="margin-left:15px;width:15px;text-align: center;">
                        <svg viewBox="0 0 1024 1024" class="svgIcon" style="width:15px;fill:#000;">
                            <path d="M600.576 68.096H245.76c-49.152 0-88.064 39.936-88.064 88.576l-0.512 710.144c0 49.152 39.424 88.576 88.064 88.576H778.24c49.152 0 88.576-39.936 88.576-88.576v-532.48l-266.24-266.24z m-44.032 310.784v-244.224l244.224 244.224H556.544z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div  style="flex:1" >
                <div class="row" :class="{choosed:(item.id==handleId)}" @click="classifyNodeClick(item)">&nbsp;{{item.mc}}</div>
                <div v-if="item.expanded">
                    <wd-tree :value="item.children" @nodeChoose="nodeChoose" :handleId="handleId" @expand="expand"></wd-tree>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import wdTree from '../../common/wdTree/wdTree.vue';

export default {
    name:"wdTree",
	data(){
		return {
            show:true,
            myValue: this.value
        }
	},
	methods:{
        expand(item){
            if(item.loaded){
                item.expanded = true;
                this.$emit('refreshView');
            }else{
                this.$emit('expand', item);
            }
        },
        closeExpand(item){
            
            item.expanded = false;
                this.$emit('refreshView');
        },
        nodeChoose(item){
            
            this.$emit('nodeChoose', item);
        },
        classifyNodeClick(item){
            
            console.log(item.id);
            this.$emit('nodeChoose', item);
        },
        watch:{
            value(val) {
                 
                this.myResult = val;//新增result的watch，监听变更并同步到myResult上
            },
            myValue(val){
                
                this.$emit('dataChange', val);
            }
        },
        update(){
            
            console.log('msg');
            var tempValue = JSON.parse(JSON.stringify(this.value))
            // this.$set(this.$data,'value',tempValue);
        }
	},
	mounted(){

	},
    components: {
        wdTree
    },
    props:['value','handleId']
}

</script>
<style type="text/css" scoped>
.hisItem{
    display: flex;
}
.row:hover{
    background: #CCCCCC;
    cursor:pointer;
}
.choosed{
    background: rgb(125, 200, 255);
    color:#E8F8F5;
}
</style>