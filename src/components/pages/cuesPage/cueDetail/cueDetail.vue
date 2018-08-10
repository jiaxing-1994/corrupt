<template>
    <div id="main" v-loading="isLoad">
        <div id="header">
            <span class="heart-icon">
                <i class="fa fa-heart"></i>
            </span>
            <span class="header-title"><span class="back-btn" @click="backBtn">{{cueFrom}}</span>/线索详情</span>
        </div>
        <div id="nav">
            <ul>
                <li :class="isThisNav == 1?'active':''" @click="chooseNav(1)">
                    <i class="fa fa-file-text-o"></i>
                    线索详情
                </li><li v-show="(followPage&&IdentityType == 1) || (followPage&&IdentityType == 3)" :class="isThisNav == 2?'active':''" @click="chooseNav(2)">
                    <i class="fa fa-pencil-square-o"></i>
                    审批信息
                </li><li v-show="followPage&&IdentityType == 1" :class="isThisNav == 3?'active':''" @click="chooseNav(3)" v-if="IdentityType==1?true:false">
                    <i class="fa fa-sitemap"></i>
                    线索分流
                </li><li v-show="followPage" :class="isThisNav == 4?'active':''" @click="chooseNav(4)">
                    <i class="fa fa-random"></i>
                    结果反馈
                </li>
                <li class="cue-item-btn" v-if="identity == 1" >
                    <span :class="['cue-btn',isFollow?'followed':'']" @click="changeCueStatus(1)">
                        <i :class="['fa',isFollow?'fa-heart':'fa-heart-o']"></i>
                        <span v-if="isFollow">已关注</span>
                        <span v-if="!isFollow">未关注</span>
                    </span>
                </li>
                <li class="cue-item-btn" v-show="identity == 5&&page">
                    <span  :class="['cue-btn',confirmReceive?'confirmReceived':'']" @click="changeCueStatus(2)">
                        <i :class="['fa',confirmReceive?'fa-check':'fa-times']"></i>
                        <span v-if="confirmReceive">已接收</span>
                        <span v-if="!confirmReceive">未接收</span>
                    </span>
                </li>
            </ul>
            <span class="tip-info" v-show="!followPage&&identity == 1">关注后进行后续操作</span>
        </div>
        <div id="content">
            <div class="switch-btn prev-btn" @click="switchCue(1)">
                <span>
                    <i class="fa fa-chevron-left"></i>
                    上一条
                </span>
            </div><div class="content-box">
                <div id="detail" v-show="isThisNav == 1">
                    <report-detail @followData = "followCue" v-if="cueType == 1" ></report-detail>
                    <internet-detail @followData = "followCue" v-if="cueType == 2"></internet-detail>
                </div>
                <div id="approval" v-show="isThisNav == 2">
                    <approval></approval>
                </div>
                <div id="send" v-show="isThisNav == 3">
                    <send></send>
                </div>
                <div id="result" v-show="isThisNav == 4">
                    <result></result>
                </div>
            </div><div class="switch-btn next-btn" @click="switchCue(2)">
                <span>
                    下一条
                    <i class="fa fa-chevron-right"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import internetDetail from './internetCueDetail'; //导入互联网线索详情页组件
import reportDetail from './reportCueDetail'; //导入举报线索详情页组件
import approval from './approvalCue'; // 导入提交审批组件
import send from './sendCue'; //导入分流下院组件
import result from './result'; //导入分流下院组件

export default {
    components: {internetDetail,reportDetail,approval,send,result},
    inject:['reload'],
    data(){
        return {
            IdentityType: localStorage.getItem('IdentityType'),//身份信息
            isThisNav: 1, //导航
            cueType:0, //线索类型
            cueId: '' ,//线索编号
            gzId:'', //关注编号
            cueData: {}, //线索数据
            cueFrom:'', //线索类别
            identity: null, //权限
            confirmReceive:false, //线索是否确认接收
            isFollow:false, //该线索是否关注
            page: false, //待接收页
            followPage: false, //是否关注
            isLoad:false, //数据加载

            cueList:[], //线索列表
            cueIndex:0, //线索位数
            pageNum:1, //当前页
        }
    },
    mounted(){
        var _this = this;
        this.cueList = JSON.parse(localStorage.getItem('cueList')); //获取线索列表
        this.cueIndex = parseInt(localStorage.getItem('cueIndex')); //获取线索索引
        this.pageNum = parseInt(localStorage.getItem('pageNum')); //获取线索索引

        //获取身份权限信息
        this.identity = localStorage.IdentityType;
        if(this.identity == 3){
            this.followPage = true;
        }
        //如果没有type值或id值则返回上一页
        if(!this.$route.query.type || !this.$route.query.id){
            this.$router.go(-1);
        }
        //判断跳某个导航
        if(this.$route.query.nav){
            this.isThisNav = this.$route.query.nav;
        }
        this.cueType = this.$route.query.type;
        if(this.cueType == 1){
            this.cueFrom = '举报线索';
            // this.isFollow = false;
        }else if(this.cueType == 2){
            this.cueFrom = '互联网线索';
            // this.isFollow = false;
        }else if(this.cueType == 3){
            this.cueFrom = '公益组织线索';
            // this.isFollow = false;
        }else if(this.cueType == 4){
            this.cueFrom = '热点线索';
            // this.isFollow = false;
        }else if(this.cueType == 5){
            this.cueFrom = '关注线索';
            this.followPage = true;
            if(this.$route.query.type2){
                this.cueType = this.$route.query.type2;
            }
        }else if(this.cueType == 6){
            this.cueFrom = '待审批';
            if(this.$route.query.type2){
                this.cueType = this.$route.query.type2;
            }
        }else if(this.cueType == 7){
            this.cueFrom = '已审批';
            if(this.$route.query.type2){
                this.cueType = this.$route.query.type2;
            }
        }else if(this.cueType == 8){
            this.cueFrom = '结果反馈';
            if(this.$route.query.type2){
                this.cueType = this.$route.query.type2;
            }
        }else if(this.cueType == 9){
          this.cueFrom = '待接收';
          this.page = true;
          if(this.$route.query.type2){
            this.cueType = this.$route.query.type2;
          }
        }else if(this.cueType == 10){
          this.cueFrom = '待反馈';
          if(this.$route.query.type2){
            this.cueType = this.$route.query.type2;
          }
        }else if(this.cueType == 11){
          this.cueFrom = '已反馈';
          if(this.$route.query.type2){
            this.cueType = this.$route.query.type2;
          }
        }else if(this.cueType == 12){
          this.cueFrom = '自行发现线索';
        }
        if(this.$route.query.gzid){
            this.gzId = this.$route.query.gzid;
        }
        this.$route.meta.name = this.cueFrom;
        this.cueId = this.$route.query.id;
        this.cueDataGet();
        
        // this.dataGet();
    },
    methods: {
        followCue(index){
            var _this = this;
            if(index == 0){
                _this.isFollow = false;
                _this.followPage = _this.isFollow;
            }else if(index == 1){
                _this.isFollow = true;
                _this.followPage = _this.isFollow;
            }
        },
        //切换线索
        switchCue(index){
            var _this = this;
            let params = {
                type:this.$route.query.type, //进入页面
                id:this.cueId, //线索编号
            }
            if(this.$route.query.type2){
                params['type2'] = this.cueType;
            }
            let site = localStorage.getItem('site'); //获取网站
            let order = localStorage.getItem('order'); //获取排序字段
            let keyword = localStorage.getItem('keyword'); //获取关键字
            let cueType = localStorage.getItem('cueType'); //获取线索类别
            let cueFrom = localStorage.getItem('cueFrom'); //获取数据来源
            let beginDate = localStorage.getItem('beginDate'); //获取开始时间
            let endDate = localStorage.getItem('endDate'); //获取结束时间
            let sfbl = localStorage.getItem('sfbl'); //获取结束时间
            if(index == 1){
                if(this.cueIndex == 0&&this.pageNum == 1){
                    this.$message({
                        message:'已是第一条',
                        type:'success'
                    })
                    return;
                }else if(this.cueIndex == 0 && this.pageNum > 1){
                    localStorage.setItem('pageNum',this.pageNum - 1);
                    localStorage.setItem('cueIndex',19);
                    //获取上一页数据
                    if(this.cueFrom == '举报线索'){
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url: webApi.Clue.GetReportClues.format({keyword:keyword,type:cueType,p:_this.pageNum - 1,ps:20}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }else{

                            }
                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '互联网线索'){ //获取互联网线索
                        _this.isLoad = true;
                        this.axios({
                            method:'get',
                            url: webApi.Clue.GetWebClues.format({keyword:keyword,type:cueType,site:site,order:order,p:_this.pageNum - 1,ps:20}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }else{

                            }
                        }).catch(function(error){
                            _this.isLoad = false;
                        })

                    }else if(this.cueFrom == '公益组织线索'){ //获取公益组织线索

                    }else if(this.cueFrom == '热点线索'){  //获取热点线索

                    }else if(this.cueFrom == '自行发现线索'){   //获取自行发现线索
                        
                    }else if(this.cueFrom == '关注线索'){   //获取关注线索
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetFollowClues.format({keyword:keyword,pageNum:_this.pageNum - 1,pageSize:20,beginDate:beginDate,endDate:endDate,xslb:cueType,order:order,xssjbly:cueFrom,sfbl:sfbl}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待接收'){
                        //下级院 待接收
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum - 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:0,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待反馈'){
                        //下级院 待反馈
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum - 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:1,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '已反馈'){
                        //下级院 已反馈
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum - 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:2,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待审批'){
                        //领导 待审批
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetApprovalClues.format({type:0,keyword:keyword,beginDate:beginDate,endDate:endDate,pageNum:_this.pageNum - 1,pageSize:20}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }else if(this.cueFrom == '已审批'){
                        //领导 已审批
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetApprovalClues.format({type:1,keyword:keyword,beginDate:beginDate,endDate:endDate,pageNum:_this.pageNum - 1,pageSize:20}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }else if(this.cueFrom == '结果反馈'){
                        //领导 结果反馈
                        this.isLoad = true;
                        if(cueFrom == '举报线索'){
                            cueFrom = 1;
                        }else if(cueFrom = '互联网线索'){
                            cueFrom = 2;
                        }else if(cueFrom = '公益组织线索'){
                            cueFrom = 3;
                        }else if(cueFrom = '热点线索'){
                            cueFrom = 4;
                        }else if(cueFrom = '自行发现线索'){
                            cueFrom = 5;
                        }
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetLDFollowClues.format({xssjbly:cueFrom,sfbl:sfbl,keyword:keyword,beginDate:begin,endDate:end,pageNum:_this.pageNum - 1,pageSize:20,xslb:_this.cueType,order:order}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }
                }else{
                    localStorage.setItem('cueIndex',this.cueIndex - 1);//修改线索索引
                    let preCue = this.cueList[this.cueIndex - 1].XSBH; //上一页线索编号
                    if(this.cueList[this.cueIndex + 1].XSSJBLY == '举报线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 1){
                        params['type2'] = 1;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '互联网线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 2){
                        params['type2'] = 2;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '公益组织线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 3){
                        params['type2'] = 3;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '热点线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 4){
                        params['type2'] = 4;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '自行发现线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 5){
                        params['type2'] = 5;
                    }
                    params['id'] = preCue;
                    //上一条
                    this.$router.push({
                        path:'/home/cueDetail',
                        query:params
                    });
                    _this.reload();
                }
            }else if(index == 2){
                console.log(this.cueList);
                console.log(this.cueIndex);
                console.log(this.cueType);
                if(this.cueList.length != 20 && this.cueIndex == this.cueList.length-1){
                    this.$message({
                        message:'已是最后一条',
                        type:'success'
                    })
                    return;
                }else if(this.cueList.length == 20&&this.cueIndex == 19){
                    localStorage.setItem('pageNum',this.pageNum + 1);
                    localStorage.setItem('cueIndex',0);
                    //获取下一页数据
                    //获取举报线索
                    if(this.cueFrom == '举报线索'){
                        _this.isLoad = true;
                        this.axios({
                            method:'get',
                            url: webApi.Clue.GetReportClues.format({keyword:keyword,type:cueType,p:_this.pageNum + 1,ps:20}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }else{

                            }
                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '互联网线索'){ //获取互联网线索
                        _this.isLoad = true;
                        this.axios({
                            method:'get',
                            url: webApi.Clue.GetWebClues.format({keyword:keyword,type:cueType,site:site,order:order,p:_this.pageNum + 1,ps:20}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }else{

                            }
                        }).catch(function(error){
                            _this.isLoad = false;
                        })

                    }else if(this.cueFrom == '公益组织线索'){ //获取公益组织线索

                    }else if(this.cueFrom == '热点线索'){  //获取热点线索

                    }else if(this.cueFrom == '自行发现线索'){   //获取自行发现线索
                        
                    }else if(this.cueFrom == '关注线索'){   //获取关注线索
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetFollowClues.format({keyword:keyword,pageNum:_this.pageNum + 1,pageSize:20,beginDate:beginDate,endDate:endDate,xslb:cueType,order:'fbsj',xssjbly:cueFrom,sfbl:sfbl}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待接收'){
                        //下级院 待接收
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum + 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:0,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待反馈'){
                        //下级院 待反馈
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum + 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:1,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '已反馈'){
                        //下级院 已反馈
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetSubClues.format({pageNum:_this.pageNum + 1,pageSize:20,beginDate:beginDate,endDate:endDate,type:2,order:order}),
                            timeout: 10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }

                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.cueFrom == '待审批'){
                        //领导 待审批
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetApprovalClues.format({type:0,keyword:keyword,beginDate:beginDate,endDate:endDate,pageNum:_this.pageNum + 1,pageSize:20}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }else if(this.cueFrom == '已审批'){
                        //领导 已审批
                        this.isLoad = true;
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetApprovalClues.format({type:1,keyword:keyword,beginDate:beginDate,endDate:endDate,pageNum:_this.pageNum + 1,pageSize:20}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }else if(this.cueFrom == '结果反馈'){
                        //领导 结果反馈
                        this.isLoad = true;
                        if(cueFrom == '举报线索'){
                            cueFrom = 1;
                        }else if(cueFrom = '互联网线索'){
                            cueFrom = 2;
                        }else if(cueFrom = '公益组织线索'){
                            cueFrom = 3;
                        }else if(cueFrom = '热点线索'){
                            cueFrom = 4;
                        }else if(cueFrom = '自行发现线索'){
                            cueFrom = 5;
                        }
                        this.axios({
                            method:'get',
                            url:webApi.ClueManager.GetLDFollowClues.format({xssjbly:cueFrom,sfbl:sfbl,keyword:keyword,beginDate:begin,endDate:end,pageNum:_this.pageNum + 1,pageSize:20,xslb:_this.cueType,order:order}),
                            timeout:10000
                        }).then(function(response){
                            _this.isLoad = false;
                            if(response.data.code == 0){
                                localStorage.setItem('cueList',JSON.stringify(response.data.data.data));
                                let preCue = response.data.data.data[0].XSBH;
                                params['id'] = preCue;
                                _this.$router.push({
                                    path:'/home/cueDetail',
                                    query:params
                                });
                                _this.reload();
                            }
                        }).catch(function(error){
                            _this.isLoad = false;

                        });
                    }
                }else{
                    localStorage.setItem('cueIndex',this.cueIndex + 1); //修改线索索引
                    let preCue = this.cueList[this.cueIndex + 1].XSBH; //下一页线索编号
                    if(this.cueList[this.cueIndex + 1].XSSJBLY == '举报线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 1){
                        params['type2'] = 1;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '互联网线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 2){
                        params['type2'] = 2;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '公益组织线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 3){
                        params['type2'] = 3;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '热点线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 4){
                        params['type2'] = 4;
                    }else if(this.cueList[this.cueIndex + 1].XSSJBLY == '自行发现线索' || this.cueList[this.cueIndex + 1].XSSJBLY == 5){
                        params['type2'] = 5;
                    }
                    params['id'] = preCue;
                    //下一条
                    this.$router.push({
                        path:'/home/cueDetail',
                        query:params
                    });
                    this.reload();
                }
            }
        },
        //改变线索状态(是否关注是否接收)
        changeCueStatus(index){
            var _this = this;
            if(index == 1){
                //关注线索
                if(this.isFollow == true){
                    //调用取消关注接口
                    _this.isLoad = true;
                    this.axios({
                        method:'post',
                        url:webApi.ClueManager.UnFollowClue.format({xsid:_this.cueId,xssjbly:_this.cueType}),
                        timeout:10000
                    }).then(function(response){
                        _this.isLoad = false;
                        if(response.data.code == 0){
                            _this.isFollow = false;
                            _this.followPage = _this.isFollow;
                            _this.isThisNav = 1;
                        }else{
                            _this.$message({
                                message:response.data.errorMessage,
                                type:'error'
                            })
                        }
                    }).catch(function(error){
                        _this.isLoad = false;
                        console.log(error);
                    })
                }else if(this.isFollow == false){
                    //调用关注接口
                    _this.isLoad = true;
                    this.axios({
                        method:'post',
                        url:webApi.ClueManager.FollowClue.format({xsid:_this.cueId,xssjbly:_this.cueType}),
                        timeout:10000
                    }).then(function(response){
                        _this.isLoad = false;
                        if(response.data.code == 0){
                            _this.isFollow = true;
                            _this.followPage = _this.isFollow;
                            _this.gzId = response.data.data;
                            _this.$root.Bus.$emit('sendGZBH',_this.gzId);
                        }else{

                        }
                    }).catch(function(error){
                        _this.isLoad = false;
                        console.log(error);
                    })
                }
            }else if(index == 2){
                //接收线索
                if(this.confirmReceive == true){
                    return;
                }else{
                    //调用接收线索接口
                    this.axios({
                        method:'post',
                        url:webApi.ClueManager.RecvClues.format({id:this.$route.query.gzid}),
                        timeout:10000
                    }).then(function(response){
                        if(response.data.code == 0){
                            _this.confirmReceive = true;
                            _this.$root.Bus.$emit('changeWaitConfirm');
                        }else{

                        }
                    }).catch(function(error){

                    })
                }
            }
        },
        //返回上页
        backBtn(){
            if(this.cueFrom == '举报线索'){
                this.$router.push({
                    path:'/home/reportCue' //返回举报线索页
                });
            }else if(this.cueFrom == '互联网线索'){
                this.$router.push({
                    path:'/home/internetCue' ////返回互联网线索页
                });
            }else if(this.cueFrom == '公益组织线索'){
                this.$router.push({
                    path:'/home/welfareCue' ////返回公益组织线索页
                });
            }else if(this.cueFrom == '热点线索'){
                this.$router.push({
                    path:'/home/heartCue' ////返回热点线索页
                });
            }else if(this.cueFrom == '自行发现线索'){
                this.$router.push({
                    path:'/home/selfDiscovery' ////返回自行发现线索页
                });
            }else if(this.cueFrom == '关注线索'){
                this.$router.push({
                    path:'/home/followCue' ////返回关注线索页
                });
            }else if(this.cueFrom == '待接收'){
                this.$router.push({
                    path:'/home/waitReceive' ////返回下级院待接收页
                });
            }else if(this.cueFrom == '待反馈'){
                this.$router.push({
                    path:'/home/waitFeedback' ////返回下级院待接反馈页
                });
            }else if(this.cueFrom == '已反馈'){
                this.$router.push({
                    path:'/home/complete' ////返回下级院已反馈页
                });
            }else if(this.cueFrom == '待审批'){
                this.$router.push({
                    path:'/home/waitApproval' ////返回下级院已反馈页
                });
            }else if(this.cueFrom == '已审批'){
                this.$router.push({
                    path:'/home/allreadyApproval' ////返回下级院已反馈页
                });
            }else if(this.cueFrom == '结果反馈'){
                this.$router.push({
                    path:'/home/approvalResult' ////返回下级院已反馈页
                });
            }
        },
        //切换顶部导航
        chooseNav(index){
            this.isThisNav = index;
        },
        //线索数据获取
        cueDataGet(){
            let _this = this;
            if(_this.cueType == 1){
                //举报线索
            }else if(_this.cueType == 2){
                //互联网线索
            }
        }
    },
    // watch:{
    //     "$route.fullPath":function(){
    //         var _this = this;
    //         this.cueList = JSON.parse(localStorage.getItem('cueList')); //获取线索列表
    //         this.cueIndex = parseInt(localStorage.getItem('cueIndex')); //获取线索索引
    //         this.pageNum = parseInt(localStorage.getItem('pageNum')); //获取线索索引
    //         this.cueId = this.$route.query.id;
    //     }
    // }
}
</script>

<style lang="scss" scoped>
#main{
    height: 100%;
    #header{
        height: 50px;
        line-height: 50px;
        color: #666;
        font-size: 16px;
        border-bottom: solid 1px #dcdcdc;
        background: #eee;
        .heart-icon{
            display: inline-block;
            height: 100%;
            width: 40px;
            text-align: center;
            border-right:solid 1px #ddd;
        }
        .header-title{
            padding-left: 15px;
        }
        .back-btn{
            cursor: pointer;
        }
        .back-btn:hover{
            color:#00a65a;
        }
    }
    #nav{
        border-bottom: solid 1px #ddd;
        height: 80px;
        position: relative;
        .tip-info{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            color: #8ec795;
        }
        ul{
            height: 100%;
            padding-left: 39px;
            li:first-child{
                border-left: solid 1px #ddd;
            }
            li{
                display: inline-block;
                height: 100%;
                line-height: 100px;
                width: 100px;
                text-align: center;
                cursor: pointer;
                position: relative;
                border-right: solid 1px #ddd;
                i{
                    position: absolute;
                    font-size: 20px;
                    top: 23%;
                    left: 50%;
                    margin-left: -8px;
                }
            }
            .cue-item-btn{
                border:none;
                float: right;
                margin-right: 60px;
                line-height: 80px;
                width: inherit;
                .cue-btn{
                    i{
                        position: initial;
                    }
                    display: inline-block;
                    height: 35px;
                    line-height: 35px;
                    border-radius: 5px;
                    border: solid 1px #ddd;
                    padding: 0 20px;
                }
            }
            .followed{
                border-color:#00a65a!important;
                color: #00a65a;
            }
            .confirmReceived{
                border-color:#00a65a!important;
                color: #00a65a;
                cursor: default;
            }
            .active{
                color: #0a8f46;
                border-bottom: solid 2px #fff;
                height: 80px;
            }
        }
    }
    #content{
        height: calc(100% - 120px - 15px);
        overflow: auto;
        .switch-btn{
            display: inline-block;
            width: 10%;
            vertical-align: top;
            text-align: center;
            color: #00a65a;
            margin-top: 15px;
            cursor: pointer;
        }
        .switch-btn:hover{
            color:#a0cfbf;
        }
        .switch-btn:active{
            color:#04771d;
        }
        .content-box{
            display: inline-block;
            width: 80%;
            margin: 0 auto;
        }
        .prev-btn{

        }
        .next-btn{

        }
    }
}
@media (max-width: 1440px) {
    #main{
      #header{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        .heart-icon{
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
</style>
