<template>
	<div class="holePage">
		<div class="left">
			<div class="">
                    <div class="head">机构列表</div>
                    <div class="grid-content bg-purple h300">
                        <el-tree :indent="10" :data="jgData" highlight-current :props="defaultProps" :expand-on-click-node="false" @load="childLoad" @node-click="jghandleNodeClick" @node-expand="nodeExpand"></el-tree>
                    </div>
                </div>
		</div>
		<div class="right" v-if="handleNode.id">
			<!-- <div>信息简介</div>
			<div v-for="item in aticleList" v-if="!item.wzlx">
				{{item.id}}
			</div> -->
			<div @click="addNew('1')">中心动态</div>
			<div v-for="item in aticleList" v-if="item.wzlx==1">
				{{item.id}}
			</div>
			<div>广告展示</div>
			<div v-for="item in aticleList" v-if="item.wzlx==2">
				{{item.id}}
			</div>
			<div>就诊须知</div>
			<div v-for="item in aticleList" v-if="item.wzlx==3">
				{{item.id}}
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
	data(){
		return {
			jgData:[],
            defaultProps: {
                children: 'children',
                label: 'text',
            },
            aticleList:[],
            handleNode:{}
		}
	},
	methods:{
		addNew(type){
			var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var param = {
                xgid: this.handleNode.id + '',
                lx:'1',
                wzlx:type,
                qyrq: time,
                nr: encodeURIComponent(encodeURI('<b>123</b>')),
                zt: "1"
            }
            if (this.id) {
                param.id = this.id
            }
            this.api.saveActicle(param)
                .then(
                    (res) => {
                    	debugger
                        if (res.code == 1) {
                            this.$message({
                                message: '保存成功！',
                                duration: 1000
                            });
                        }
                    },
                    (res) => {
                        console.log(res);
                    }
                );
		},
        nodeExpand(nodeData) {
            if (nodeData.loaded) {
                return;
            } else {
                this.loadNode(nodeData);
            }
        },
        jghandleNodeClick(nodeData){
        	this.handleNode = nodeData;
        	this.loadInfo(nodeData);
        },
        childLoad(){

        },
        loadNode(nodeData) {
		    let params = {
		        gljgid: nodeData.id,
		    }
		    this.api.getJGList(params).then(
		        res => {
		            console.log(res);
		            let data = res.data;
		            for (var i = 0; i < data.length; i++) {
		                if (data[i].state == 'open') {
		                    data[i].children = [];
		                } else {
		                    data[i].children = [{
		                        text: '[空]'
		                    }]
		                }
		            }
		            nodeData.children = data;
		            nodeData.loaded = true;
		        }
		    );
		},
		loadInfo(nodeData) {
		    var params = {
		        xgid: nodeData.id,
		        lx: '1',
		    }
		    this.api.getActicleList(params).then(
		        res => {
		        	debugger
		            this.aticleList = res.data;
	        });
		}

	},
	mounted(){
		let params = {
            gljgid: '',
        }
        this.api.getJGList(params).then(
            res => {
                console.log(res);
                let data = res.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].state == 'open') {
                        data[i].children = [];
                    } else {
                        data[i].children = [{
                            text: '[空]'
                        }]
                    }
                }
                this.jgData = data;
            }
        );
	}
}

Date.prototype.Format = function(fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


</script>
<style type="text/css" scoped>
.holePage{
	height:100%;
	display: flex;
}
.left{
	width:200px;
	background: #666666;
	height:100%;
}
.right{
	width:calc(100% - 200px);

}
</style>