import axios from 'axios'
import store from '@/store'
// axios 配置
// axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://172.16.110.168:8080/testapi/';
axios.defaults.baseURL = 'http://172.16.110.41:8080/testapi';
// axios.defaults.baseURL = 'http://tfxq.jw028.cn:7080/hisapi';

if (window.wdphisJsObject && JSON.parse(window.wdphisJsObject.wdphis.getmainurl()).data) {
    axios.defaults.baseURL = JSON.parse(wdphisJsObject.wdphis.getmainurl()).data;
    console.log(axios.defaults.baseURL);
}

let personInfo = {
  "jgid": "70",
  "czryid": "178",
  "czryid": "178",
  "czryxm": "周勇",
  "czryksid": "120",
  "czryksmc": "中医科",
  "loginname": "zhouyong",
}
if (window.wdphisJsObject) {
  personInfo = JSON.parse(window.wdphisJsObject.wdphis.varget("0","ryxx"));
}
export function fetch(url, params, config) {
  console.log(url, params, config);
    if (window.wdphisJsObject) {
      console.log(wdphisJsObject);
      console.log(JSON.stringify(params));
        let res = window.wdphisJsObject.wdphis.httppost(url, JSON.stringify(params));

        console.log(params,res);
        res = JSON.parse(res);
        return new Promise((resolve, reject) => {
            resolve(res);
            reject(res)
        })
    }
    if (!config) {
        config = {};
    }
    if (!config.timeout) {
        config.timeout = 5000;
    }
    params = Object.assign(personInfo,params);
    console.log(JSON.stringify(params));

    return new Promise((resolve, reject) => {
        axios({
                method: 'post',
                url: url,
                transformRequest: [function(data) {
                  // Do whatever you want to transform the data
                  let ret = ''
                  for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                  }
                  return ret
                }],
                data: {
                  data: JSON.stringify(params)
                },
                config: config,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(function(response) {
                if(response.data.code!=1){
                  store.commit('systemMessage', response.data.msg);
                }
                resolve(response.data);
            }).catch(function(error) {
                reject(error)
            });
    })
}

export function uploadFile(url, fileDom, maskHandle) {
    if(maskHandle){
         maskHandle(true)
    }
    var form = new FormData();
    form.append('file', fileDom.files[0]);
    return new Promise((resolve, reject) => {
        axios.post(url, form, {
                    headers: {
                        'Content-Type': form.type
                    }
                }).then((response) => {
                    fileDom.value = '';
                    resolve(response.data);
                    if(response.data.code!=1){
                        window.app.$alert(response.data.msg, '错误信息', {
                          confirmButtonText: '确定'
                        });
                    }else{
                        window.app.$message('上传成功');
                    }
                        if(maskHandle){
                             maskHandle(false)
                        }
                }).catch((error) => {
                    fileDom.value = '';
                    reject(error)
                        if(maskHandle){
                             maskHandle(false)
                        }
                })
    });
}

export default {
    /**
     * 文件上传
     */
    fileUpload(fileDom, maskHandle) {
        return uploadFile(axios.defaults.baseURL + "/rest/uploadOriginalFile/04", fileDom,maskHandle)
    },
    getPerson(){
      return personInfo;
    },
    /**
     * 获取机构列表
     */
    getJGList(params, config) {
        return fetch('/rest/queryDataBySql/000202/1', params)
    },
    /**
     * 获取部门列表
     */
    getBMList(params, config) {
        return fetch('/rest/queryDataBySql/000204/1', params)
    },
    /**
     * 获取人员列表
     */
    getRyList(params, config) {
        return fetch('/rest/queryDataBySql/000102/1', params)
    },
    /**
     * 获取部门子列表
     */
    getBMNodeList(params, config) {
        return fetch('/rest/queryDataBySql/000204/2', params)
    },
    /**
     * 获取文章列表
     */
    getArticleList(params, config) {
        return fetch('/rest/queryDataBySql/080104/7', params)
    },
    /**
     * 保存
     */
    saveArticle(params, config) {
        return fetch('/rest/commitData/080104/3', params)
    },
    /**
     * 获取机构列表
     */
    getHisList(params, config) {
        return fetch('/rest/queryDataBySql/080101/1', params)
    },
    /**
     * 获取机构列表
     */
    saveClassify(params, config) {
        return fetch('/rest/commitData/080104/2', params)
    },
    /**
     * 获取机构列表
     */
    getClassifyList(params, config) {
        return fetch('/rest/queryDataBySql/080104/6', params)
    },

}