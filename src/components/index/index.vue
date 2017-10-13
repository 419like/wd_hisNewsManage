<template>
    <div id="app" class="holePage">
        <div class="mask" v-if="maskShow">
            <div style="position:absolute;top:calc(50% - 63px);left:calc(50% - 63px);width:126px;height:126px;">
                <el-progress type="circle" :percentage="percentNum"></el-progress>
            </div>
        </div>
        <div class="left">
            <div class="" style="height:50%" v-if="mode=='dev'">
                <div class="head">机构列表</div>
                <div style="height:calc(100% - 40px);width:100%;overflow:auto;">
                    <div v-for="item in hisList" @click="jghandleNodeClick(item)" class="hisItem" :class="{choosed:(item==handleNode)}">
                        &nbsp;&nbsp;{{item.text}}
                    </div>
                </div>
            </div>
            <div class="" :style="modeStyle">
                <div class="head">
                    <span @click="switchMode()">分类列表</span>
                </div>
                <div class="chbA">
                    <el-button type="primary" size="mini" icon="plus" @click="addClassify()">新增</el-button>
                    <el-button type="primary" size="mini" icon="edit" @click="editClassify();">编辑</el-button>
                    <el-button type="primary" size="mini" icon="delete" @click="deleteClassify">删除</el-button>
                </div>
                <div style="height:calc(100% - 80px);width:100%;overflow:auto;">
                    <wd-tree ref="tree" v-if="show&&classifyList.length" :value="classifyList" @expand="classifyExpand" @nodeChoose="classifyNodeClick" :handleId="handleClassify.id" @dataChange="treeDataChange" @refreshView="refreshTree"></wd-tree>
                </div>
            </div>
        </div>
        <div v-if="handleClassify.id" class="right">
            <div class="content">
                <div style="text-align:center;height:50px;line-height: 50px;">
                    <el-button type="primary" size="small" icon="plus" @click="addArticle()">新增</el-button>
                    <el-button type="primary" size="small" icon="edit" @click="edit(handleArticle);">编辑</el-button>
                    <el-button type="primary" size="small" icon="delete" @click="deleteSure">删除</el-button>
                </div>
                <div>
                    <div class="tHead">
                        <div style="width:100%;display:flex;text-align: center;" class="">
                            <div class="itemCell" style="width:40px;">序号</div>
                            <div class="itemCell" style="flex:1;">标题</div>
                            <div class="itemCell" style="width:100px;">类别</div>
                            <div class="itemCell" style="width:100px;">分类</div>
                            <div class="itemCell" style="width:150px;">启用日期</div>
                            <div class="itemCell" style="width:70px;">创建人</div>
                        </div>
                    </div>
                    <div class="tbody" style="color:#4C4C4C;">
                        <div v-for="(item,index) in articleList" class="tRow" style="width:100%;display:flex;" @dblclick="editItem(item)" @click="articleItemChoose(item)" :class="{choosed:(item==handleArticle)}">
                            <div class="itemCell" style="width:40px;">{{index+1}}</div>
                            <div class="itemCell" style="flex:1;text-align: left;">{{item.wzbt}}</div>
                            <div class="itemCell" style="width:100px;">{{item.lxmc}}</div>
                            <div class="itemCell" style="width:100px;">{{item.flmc}}</div>
                            <div class="itemCell" style="width:150px;">{{item.qyrq.split(' ')[0]}}</div>
                            <div class="itemCell" style="width:70px;">{{item.cjrxm}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="选择图片" :visible.sync="imgUploadVisible">
            <div style="height: 200px;width:90%;border-radius: 5px;border:1px solid #808080;overflow-y:auto;padding:10px;">
                <div v-for="item in imgArr" class="imgItem">
                    <div style="width:90px;">
                        <img class="imgArr" :src="dellImgSrc(item)" alt="">
                    </div>
                    <div style="flex:1;word-break:break-all;">
                        {{item}}
                    </div>
                    <div style="width:80px;text-align: center;">
                        <span class="btnText" @click="setHeadImg(item)"><a>选择</a></span>
                        <!-- <span class="btnText" @click="copy(item,$event)"><a>复制</a></span> -->
                    </div>
                </div>
            </div>
            <div>
                <el-button @click="uploadImg()">上传图片</el-button>
                <el-button @click="outLink()">外部链接</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="imgUploadVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="外部链接" :visible.sync="linkPasteVisible">
            <el-form label-width="80px">
                <el-form-item label="链接地址">
                    <el-input v-model="pasteLinkText"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sureLinkPaste()">确 定</el-button>
                <el-button @click="linkPasteVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑分类" :visible.sync="editClassifyDialogVisible">
            <el-form label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="classify.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sureEditClassigy()">确 定</el-button>
                <el-button @click="editClassifyDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增分类" :visible.sync="classifyDialogVisible">
            <el-form label-width="80px">
                <el-form-item v-if="handleClassify.id" label="是否基类">
                    <el-switch on-text="" off-text="" v-model="isBase"></el-switch>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-if="isBase" value="基类" :disabled="true"></el-input>
                    <el-input v-if="!isBase" v-model="handleClassify.mc" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="classify.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sureAddClassigy()">确 定</el-button>
                <el-button @click="classifyDialogVisible = false;isBase = false;">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="handleState" :visible.sync="dialogVisible" size="large" top=true :before-close="handleClose">
            <el-form label-width="80px">
                <div style="width:100%;display:flex;">
                    <div style="flex:1;">
                        <el-form-item label="标题">
                            <el-input v-model="article.title" style="width:300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="示意图">
                            <div style="display:flex;">
                                <div style="height:50px;width:50px;" @click="headImgAdd">
                                    <svg v-if="!article.headImgSrc" viewBox="0 0 1024 1024" class="svgIcon" style="height:50px;fill:#000;">
                                        <path d="M582.087759 0c47.405203 0.041277 94.729102 1.479732 141.969195 4.315363 16.134455 0.959387 22.30605 9.463779 18.512283 25.51693-2.251494 9.672668-8.339283 14.63471-18.263368 14.884876C676.900666 45.926722 629.494212 46.57215 582.087759 46.655956c-6.463038 0-11.42508-2.648007-14.884876-7.94277C554.23678 19.033879 559.197571 6.129067 582.087759 0zM302.652356 0c47.365176 0.041277 94.729102 0.771762 142.094278 2.188952 10.88222 0.375249 17.115106 5.962706 18.699907 16.761121 2.419105 16.427149-4.628071 24.954057-21.139026 25.579472-47.322648 1.333385-94.646547 1.772426-141.969195 1.313371-5.462374-0.041277-9.693932-2.376577-12.695924-7.004648C274.758849 19.075156 279.762169 6.129067 302.652356 0zM1017.751817 565.750369c4.002656 3.878824 6.023997 8.589449 6.066525 14.134378 0.459055 47.365176 0.70797 94.729102 0.751749 142.095529 0 2.292771-0.396513 4.544265-1.188288 6.753231-3.669935 10.506971-11.007303 15.343931-22.015857 14.510878-14.216933 0.041277-21.471746-7.047176-21.76319-21.264108-1.000664-47.365176 1.020677-94.458922 6.066525-141.281239C988.003329 559.017152 998.697925 554.035096 1017.751817 565.750369zM1017.751817 286.314967c4.002656 3.836295 6.023997 8.546921 6.066525 14.134378 0.459055 47.365176 0.70797 94.729102 0.751749 142.094278 0 2.376577-0.3765 4.628071-1.125747 6.754482-3.711212 10.465694-11.069845 15.301402-22.077148 14.509627-14.216933 0-21.471746-7.088453-21.76319-21.264108-1.000664-47.365176 1.020677-94.458922 6.066525-141.281239C988.003329 279.581749 998.697925 274.598443 1017.751817 286.314967zM698.102233 467.372596c16.302066 0.333972 28.685282 7.526244 37.148398 21.576816 6.588121 10.88222 8.172923 22.473661 4.754404 34.773072-5.71254 20.34725-18.971337 31.249484-39.777642 32.707951-48.90745 4.211544-97.00186 5.045848-144.28323 2.50166 0 47.365176-0.230153 94.750366-0.687956 142.156819-0.126334 12.007967-4.440446 22.180967-12.94734 30.52025-0.582887 0.541609-1.167024 1.083219-1.749911 1.626079-13.008631 11.298747-27.830966 14.301989-44.467003 9.005975-19.972001-6.380483-30.311361-20.118348-31.020582-41.214846-1.542273-47.365176-2.314035-94.729102-2.314035-142.095529-46.57215 0-93.145551-0.145096-139.717701-0.43779-3.084547 0-6.150331-0.250166-9.1936-0.750498-5.962706-0.875581-11.341275-3.21088-16.135706-7.005898-22.348578-17.677979-26.392511-38.775727-12.13305-63.291994 7.379896-12.592105 18.303394-19.09642 32.771744-19.512947 48.115674-1.334636 96.251362-2.042605 144.408313-2.126411 0.083806-48.156952 0.521596-96.313903 1.313371-144.470855 0.16636-9.339947 3.21088-17.552896 9.131058-24.641349 7.12973-8.630726 16.15697-13.446422 27.080468-14.447085 33.02191-3.335963 51.57547 11.257469 55.661931 43.779047L555.944163 465.809059C603.309339 465.809059 650.695779 466.330655 698.102233 467.372596zM565.639345 984.966014c3.961378-3.835045 8.673255-5.796346 14.134378-5.878901 47.365176-0.584138 94.729102-0.562873 142.095529 0.062541 12.049245 0.167611 18.970086 6.171595 20.763777 18.011951 2.460382 16.343344-4.460459 24.766432-20.763777 25.266764-47.365176 1.41719-94.458922-0.439041-141.281239-5.566193C558.822322 1014.694488 553.839016 1004.062434 565.639345 984.966014zM444.746634 980.337943c10.88222 0.375249 17.095092 5.982719 18.637366 16.823662 2.376577 16.343344-4.628071 24.766432-21.013943 25.266764-47.365176 1.41719-94.709088 1.876245-142.031736 1.375913-5.462374-0.041277-9.693932-2.356564-12.695924-6.942106-12.883548-19.721835-7.880228-32.626647 15.009959-38.713186C350.017533 978.190268 397.381458 978.919502 444.746634 980.337943zM0.764557 579.947289c0.16636-5.54618 2.50166-9.757724 7.004648-12.634633 19.929473-13.00738 32.855549-8.04784 38.775727 14.884876-0.041277 47.405203-1.459719 94.729102-4.252822 141.969195-0.959387 16.134455-9.46503 22.409869-25.51693 18.82499-8.755809-2.085133-13.38388-7.587534-13.884212-16.510955C-0.027218 676.74026-0.736439 627.895352 0.764557 579.947289zM0.88964 300.449345c0.083806-5.54618 2.355313-9.756473 6.817023-12.633382 19.97075-12.924825 32.91684-7.94277 38.838269 14.947417-0.041277 47.406454-0.208889 94.812907-0.500332 142.219361 0 1.459719-0.250166 2.898173-0.750498 4.315363-3.627407 10.465694-10.944762 15.280138-21.952065 14.447085-14.218184 0.083806-21.472997-6.983383-21.76444-21.201567C0.535655 395.178446 0.305503 347.814521 0.88964 300.449345z" p-id="1531"></path>
                                        <path d="M866.151232 18.137034c51.201472-7.171008 89.643227 10.88222 115.326518 54.160935 15.260125 25.808374 21.013943 53.619326 17.261453 83.430355M863.649572 1000.038514c59.289338 3.920101 101.08707-20.054556 125.395699-71.92272 6.086538-13.008631 8.985962-26.705219 8.693268-41.089763-0.126334-5.755068-0.625415-11.445094-1.500996-17.073828M19.339381 864.948884c-3.793767 57.204204 19.471669 98.335244 69.796309 123.394371 13.425157 6.670676 27.727147 10.069181 42.903466 10.193013 6.670676 0.082555 13.300074-0.250166 19.888196-1.000664M21.841041 150.725004c-4.753154-47.072482 12.299411-82.116984 51.158943-105.132254C98.100389 30.749152 125.243398 24.09974 154.429012 25.642013" p-id="1532"></path>
                                    </svg>
                                    <img v-if="article.headImgSrc" :src="article.headImgSrc" style="width:50px;height:50px;">
                                </div>
                                <div style="line-height: 50px;margin-left: 10px;">
                                    最佳分辨率 320：150（宽：高）
                                </div>
                            </div>
                            <input class="hide" type="file" id="headImg" @change="uploadHeadImg($event)" />
                            <input class="hide" type="file" id="uploadImg" @change="uploadImgAction($event)" />
                        </el-form-item>
                    </div>
                    <div style="flex:1">
                        <el-form-item label="发布日期">
                            <el-date-picker v-model="article.startTime" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="文章类型">
                            <el-select v-model="article.type" placeholder="请选择">
                                <el-option v-for="item in articleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div>
                    <quill-editor v-model="article.content" :options="editorOption" ref="myTextEditor">
                    </quill-editor>
                    <input class="hide" type="file" id="getFile" @change="uploadFunction($event)" />
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="handleState=='新增'" type="primary" @click="sureSave">确 定</el-button>
                <el-button v-if="handleState=='编辑'" type="primary" @click="sureEdit">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
import wdTree from '../common/wdTree/wdTree.vue';

import {
    quillEditor
} from 'vue-quill-editor'; // 导入quillEditor组件
export default {
    data() {
        return {
            handleImg: '',
            startStr: '<div name="imgArr" style="display:none;">',
            endStr: '</div>',
            imgUploadVisible: false,
            imgArr: [],
            percentNum: 25,
            maskShow: false,
            xgjgid: '',
            articleTypeOptions: [{
                value: '01',
                label: '普通'
            }, {
                value: '02',
                label: '就诊须知'
            }, {
                value: '03',
                label: '首页动态'
            }],
            modeStyle: {
                height: '100%',
            },
            mode: 'normal',
            editClassifyDialogVisible: false,
            show: true,
            isBase: false,
            handleArticle: {},
            articleList: [],
            currentRow: null,
            handleClassify: {},
            classifyList: [],
            classifyDialogVisible: false,
            classify: {},
            hisList: '',
            handleState: '',
            pickerOptions0: {
                disabledDate(time) {
                    // return time.getTime() < Date.now() - 8.64e7;
                }
            },
            jgData: [],
            defaultProps: {
                children: 'children',
                label: 'text',
            },
            aticleList: [],
            handleNode: {},
            dialogVisible: false,
            articleType: '',
            startTime: '',
            article: {
                headImgSrc: '',
                content: '',
                title: '',
                intro: '',
            },
            editorOption: { // 编辑器的配置
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                            ['blockquote', 'code-block'],

                            [{
                                'header': 1
                            }, {
                                'header': 2
                            }], // custom button values
                            [{
                                'list': 'ordered'
                            }, {
                                'list': 'bullet'
                            }],
                            [{
                                'script': 'sub'
                            }, {
                                'script': 'super'
                            }], // superscript/subscript
                            [{
                                'indent': '-1'
                            }, {
                                'indent': '+1'
                            }], // outdent/indent
                            [{
                                'direction': 'rtl'
                            }], // text direction

                            [{
                                'size': ['small', false, 'large', 'huge']
                            }], // custom dropdown
                            [{
                                'header': [1, 2, 3, 4, 5, 6, false]
                            }],

                            [{
                                'color': []
                            }, {
                                'background': []
                            }], // dropdown with defaults from theme
                            [{
                                'font': []
                            }],
                            [{
                                'align': []
                            }],
                            ['clean'],
                            ['image']
                        ],
                        handlers: {
                            image() {
                                _this.imgUploadVisible = true;
                                _this.handleImg = 'article';
                                // document.getElementById('getFile').click()
                            }
                        }
                    }
                }
            },
            linkPasteVisible: false,
            pasteLinkText: '',
        }
    },
    methods: {
        sureLinkPaste() {
            debugger
            this.imgArr.push(this.pasteLinkText);
            this.linkPasteVisible = false;
        },
        copy(item, e) {
            copyTextToClipboard(item);
        },
        linkPaste() {
            this.linkPasteVisible = true;
        },
        outLink() {
            this.linkPaste();
        },
        dellImgSrc(item) {
            debugger
            if ((item.indexOf('http://') >= 0) || (item.indexOf('https://') >= 0)) {
                return item;
            } else {
                return this.axios.defaults.baseURL + '/rest/downLoadFileById?fileId=' + item;
            }
        },
        switchMode(mode) {
            if (window.config.devMode) {
                if (this.mode == 'normal') {
                    this.modeStyle = { height: '50%' };
                    this.mode = 'dev';
                    this.loadHisList();
                } else {
                    this.modeStyle = { height: '100%' }
                    this.mode = 'normal';
                    debugger
                    this.loadClassifyList(this.api.getPerson().jgid);
                }
            }
        },
        refreshTree() {
            debugger
            var tempData = JSON.parse(JSON.stringify(this.classifyList));
            this.$set(this.$data, 'classifyList', tempData);
        },
        treeDataChange(val) {
            debugger
            this.classifyList = val;
        },
        sureEditClassigy() {
            debugger
            let params = {
                id: this.classify.id,
                mc: this.classify.title,
            }
            this.api.saveClassify(params)
                .then(
                    res => {
                        if (res.code) {
                            this.$message({
                                type: 'info',
                                message: '保存成功！'
                            });

                            this.editClassifyDialogVisible = false;
                            this.loadClassifyList(this.xgjgid);
                        } else {
                            if (res.msg.indexOf('已存在') >= 0) {
                                this.$message({
                                    type: 'info',
                                    message: '该分类下名称已存在！'
                                });
                            }
                        }
                        debugger
                    }
                )
        },
        classifyExpand(item) {
            debugger
            console.log(item);
            let params = {
                fljgid: this.handleNode.id,
                sjid: item.id,
            }
            this.api.getClassifyList(params)
                .then(
                    res => {
                        item.children = res.data;
                        item.loaded = true;
                        item.expanded = true;
                        this.refreshTree();
                    }
                )
        },
        deleteClassify() {
            let params = {
                id: this.handleClassify.id,
                sfsc: '0',
            }
            this.api.saveClassify(params)
                .then(
                    (res) => {
                        if (res.code == 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loadClassifyList(this.xgjgid);
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    },
                    (res) => {
                        console.log(res);
                    }
                );
        },
        editClassify() {
            this.classify = {
                id: this.handleClassify.id,
                title: this.handleClassify.mc
            }
            this.editClassifyDialogVisible = true;
        },
        articleItemChoose(item) {
            this.handleArticle = item;
        },
        addArticle() {
            this.handleState = '新增';
            this.dialogVisible = true;
            let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            this.article = {
                headImgSrc: '',
                content: '',
                title: '',
                intro: '',
                startTime: time,
                type: '01',
            }
        },
        handleCurrentChange() {

        },
        classifyNodeClick(node) {
            console.log(node.id);
            this.$set(this.$data, 'handleClassify', node);
            this.loadArticleList();
        },
        loadArticleList() {
            let params = {
                flid: this.handleClassify.id
            }
            this.api.getArticleList(params)
                .then(
                    res => {
                        this.articleList = res.data;
                    }
                )
        },
        loadClassifyList(id) {
            this.xgjgid = id;
            let params = {
                fljgid: id,
                sjid: '0',
            }
            this.api.getClassifyList(params)
                .then(
                    res => {
                        this.setClassifyList(res.data)
                    }
                )
        },
        setClassifyList(data) {
            this.classifyList = data;
        },
        sureAddClassigy() {
            let sjid;
            if (this.isBase) {
                sjid = '0'
            } else {
                sjid = this.handleClassify.id;
            }
            let params = {
                mc: this.classify.title,
                xgjgid: this.xgjgid,
                sjid: sjid,
            }
            this.api.saveClassify(params)
                .then(
                    res => {
                        if (res.code) {
                            this.$message({
                                type: 'info',
                                message: '添加成功！'
                            });

                            this.classifyDialogVisible = false;
                            this.loadClassifyList(this.xgjgid);
                        } else {
                            if (res.msg.indexOf('已存在') >= 0) {
                                this.$message({
                                    type: 'info',
                                    message: '该分类下名称已存在！'
                                });
                            }
                        }
                    }
                )
        },
        addClassify() {
            if (!this.handleClassify.id) {
                this.isBase = true;
            }
            this.classifyDialogVisible = true;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        maskHandle(value) {
            this.maskShow = value;
        },
        uploadFunction(e) {
            debugger
            let quill = this.$refs.myTextEditor.quill;
            let index = quill.getSelection().index;
            //you can get images data in e.target.files
            //an single example for using formData to post to server
            let rootUrl = this.axios.defaults.baseURL;
            this.api.fileUpload(e.target, this.maskHandle).then(
                (res) => {
                    debugger
                    let src = rootUrl + `/rest/downLoadFileById?fileId=` + res.msg.file;
                    quill.clipboard.dangerouslyPasteHTML(index, `<p><img src="` + src + `" width="100%"></img></p>`);
                    quill.setSelection(index + 1, 0);
                    // let imgArr = this.imgArr;
                    // imgArr.push(res.msg.file);
                    // this.imgArr = imgArr;
                }
            )
        },
        deleteActicle(item) {
            this.$confirm('此操作将删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.deleteSure(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        deleteSure() {
            let params = {
                id: this.handleArticle.id,
                sfsc: '0',
            }
            this.api.saveArticle(params)
                .then(
                    (res) => {
                        debugger
                        if (res.code == 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loadArticleList();
                        }
                    },
                    (res) => {
                        console.log(res);
                    }
                );
        },
        editItem(item) {
            this.handleArticle = item;
            this.edit(item);
        },
        edit(item) {
            debugger
            this.handleState = '编辑';
            let content = decodeURIComponent(item.nr);
            if (content.indexOf('<') < 0) {
                content = decodeURIComponent(content);
            }
            content = this.dell(content);
            this.article = {
                id: item.id,
                intro: item.wzjj,
                headImgSrc: item.zst,
                content: content,
                startTime: item.qyrq,
                title: item.wzbt,
                type: item.wzlx,
            }
            this.dialogVisible = true;
        },
        dell(htmlStr) {
            let startStr = this.startStr;
            let endStr = this.endStr;
            let arr = htmlStr.split(startStr);
            debugger
            let content = arr[0];
            if (arr.length > 1) {
                this.imgArr = JSON.parse((arr[1].split(endStr))[0]);
            }
            debugger
            return content;
        },
        sureEdit() {
            debugger
            let tempIntro = getTextFromHtmlStr(this.article.content, window.config.articleIntroLength);
            var time = new Date(this.article.startTime).Format("yyyy-MM-dd hh:mm:ss");
            let quill = this.$refs.myTextEditor.quill;
            let str = JSON.stringify(this.imgArr);
            let nr = this.article.content + this.startStr + str + this.endStr;
            var param = {
                id: this.article.id,
                flid: this.handleClassify.id,
                qyrq: time,
                nr: encodeURIComponent(encodeURIComponent(nr)),
                zt: "1",
                wzbt: this.article.title,
                wzjj: tempIntro,
                zst: this.article.headImgSrc,
                wzlx: this.article.type,
                xgjgid: this.xgjgid,
            }
            this.api.saveArticle(param)
                .then(
                    (res) => {
                        debugger
                        if (res.code == 1) {
                            this.$message({
                                message: '保存成功！',
                                duration: 1000
                            });
                            this.dialogVisible = false;
                            this.loadArticleList();
                        }
                    },
                    (res) => {
                        console.log(res);
                    }
                );
        },
        sureSave() {
            debugger
            let tempIntro = getTextFromHtmlStr(this.article.content, window.config.articleIntroLength);
            var time = new Date(this.article.startTime).Format("yyyy-MM-dd hh:mm:ss");
            let str = JSON.stringify(this.imgArr);
            let nr = this.article.content + this.startStr + str + this.endStr;
            var param = {
                flid: this.handleClassify.id,
                qyrq: time,
                nr: encodeURIComponent(encodeURIComponent(nr)),
                zt: "1",
                wzbt: this.article.title,
                wzjj: tempIntro,
                zst: this.article.headImgSrc,
                wzlx: this.article.type,
                xgjgid: this.xgjgid,
            }
            if (this.id) {
                param.id = this.id
            }
            this.api.saveArticle(param)
                .then(
                    (res) => {
                        debugger
                        if (res.code == 1) {
                            this.$message({
                                message: '保存成功！',
                                duration: 1000
                            });
                            this.dialogVisible = false;
                            this.loadArticleList();
                        }
                    },
                    (res) => {
                        console.log(res);
                    }
                );
        },
        uploadImgAction(e) {
            if (!e.target.files) {
                return;
            }
            let rootUrl = this.axios.defaults.baseURL;
            this.api.fileUpload(e.target, this.maskHandle).then(
                (res) => {
                    this.imgArr.push(res.msg.file);
                }
            )
        },
        uploadImg() {
            document.getElementById('uploadImg').click();
        },
        headImgAdd() {
            this.imgUploadVisible = true;
            this.handleImg = 'head';
            // document.getElementById('headImg').click();
        },
        uploadHeadImg(e) {
            if (!e.target.files) {
                return;
            }
            let rootUrl = this.axios.defaults.baseURL;
            this.api.fileUpload(e.target, this.maskHandle).then(
                (res) => {
                    debugger
                    this.article.headImgSrc = `/rest/downLoadFileById?fileId=` + res.msg.file;

                }
            )
        },
        setHeadImg(fileId) {
            if (this.handleImg == 'head') {
                this.article.headImgSrc = this.dellImgSrc(fileId);
            }
            if (this.handleImg == 'article') {
                let quill = this.$refs.myTextEditor.quill;
                let index = quill.getSelection().index;
                let src = this.dellImgSrc(fileId);
                quill.clipboard.dangerouslyPasteHTML(index, `<p><img src="` + src + `" width="100%"></img></p>`);
                quill.setSelection(index + 1, 0);
            }
            this.imgUploadVisible = false;
        },
        addNew(type) {
            this.handleState = '新增';
            this.dialogVisible = true;
            this.article = {
                headImgSrc: '',
                content: '',
                title: '',
                intro: '',
                startTime: time,
            }
        },
        nodeExpand(nodeData) {
            if (nodeData.loaded) {
                return;
            } else {
                this.loadNode(nodeData);
            }
        },
        jghandleNodeClick(nodeData) {
            this.handleNode = nodeData;
            this.xgjgid = this.handleNode.id;
            debugger
            this.loadClassifyList(this.xgjgid);
        },
        loadClassify(node) {

        },
        childLoad() {

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
        loadInfo(id) {
            var params = {
                xgid: id,
                lx: '1',
            }
            this.api.getArticleList(params).then(
                res => {
                    this.aticleList = res.data;
                });
        },
        loadHisList() {
            let params = {
                length: '999',
            }
            this.api.getHisList(params).then(
                res => {
                    this.hisList = res.data;
                    // this.handleNode = this.hisList[7];
                    this.loadInfo(this.handleNode.id);
                });
        }

    },
    mounted() {
        _this = this;
        if (this.mode == 'dev') {
            this.loadHisList();
        }
        if (this.mode == 'normal') {
            this.loadClassifyList(this.api.getPerson().jgid);
        }
    },
    components: {
        quillEditor,
        wdTree
    },
}
let _this;

function getTextFromHtmlStr(htmlStr, len) {
    var objE = document.createElement("div");
    objE.innerHTML = htmlStr;
    var tempStr = objE.innerText.trim();
    if (tempStr.length >= len) {
        tempStr = tempStr.substr(0, len);
    } else {
        tempStr = tempStr.substr(0, tempStr.length);
    }
    return tempStr;
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

function copyTextToClipboard(text) {
    debugger
    setTimeout(function() {
        var textArea = document.createElement("textarea");
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log(msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    }, 1000)

}
</script>
<style type="text/css" scoped>
.imgItem {
    display: flex;
    border: 1px solid #CCCCCC;
}

.imgItem:hover {
    background: #bae9ff;
}

.imgArr {
    background: #E6E6E6;
    height: 32px;
    width: 64px;
    border: 1px solid #ffffff;
    padding: 2px;
}

.imgArr:hover {
    cursor: hand;
    background: #66CCFF;
}

.mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99999;
}

.chbA {
    text-align: center;
    line-height: 30px;
    height: 30px;
    width: 100%;
    background: #CCCCCC
}

.tHead {
    background: #4C4C4C;
    color: #E6E6E6;
}

.itemCell {
    text-align: center;
    border: 1px solid #E6E6E6;
}

.tRow:hover {
    background: #e6e6e6;
}

.hisItem {
    display: flex;
}

.hisItem:hover {
    background: #CCCCCC;
    cursor: pointer;
}

.choosed {
    background: rgb(125, 200, 255);
    color: #E8F8F5;
}

.articleIntro {
    color: #7F7F7F;
    font-size: 12px;
}

.articleTitle {
    flex: 1;
}

.articleItem {
    width: 100%;
    border-bottom: 1px solid #999999;
}

.content {
    height: 100%;
    width: 100%;
}

.holePage {
    height: 100%;
    display: flex;
}

.left {
    width: 200px;
    background: #E6E6E6;
    height: 100%;
}

.right {
    width: calc(100% - 200px);
}

.btnText {
    color: #66CCFF;
    line-height: 35px;
}

.btnText:hover {
    color: #0080FF;
    cursor: pointer;
}
</style>