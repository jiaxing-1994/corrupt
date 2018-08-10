<template>
  <div id="homePage">
    <!--数据分析-->
    <el-row :gutter="10" class="dataAnalysis">
      <el-col :lg="6" :sm="12" class="analysisBox_wrap" v-for="(item,index) in dataCount" :key="index" >
        <div class="analysisBox" @click="linkTo(item)">
          <div class="analysisBox_top">
            <span v-text="item.val"></span>
            <i class="fa  fa-3x" :class="item.icon"></i>
          </div>
          <div class="analysis_more" v-text="item.title"></div>
          <!-- 管理员 -->
          <div class="hover-box" v-show='IdentityType==1'>
            <div class="hover-item clearfix"  >
              <div class="left"> <i class="iconfont icon-biaoqian1"></i>举报线索数量</div>
              <div class="right">{{reportClueTotal}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-changyonglogo46"></i>互联网线索数量</div>
              <div class="right">{{internetClueTotal}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-ai62"></i>公益组织线索数量</div>
              <div class="right">{{welfareCueTotal}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-remen"></i>热点线索数量</div>
              <div class="right">{{heartCueTotal}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="fa fa-search-plus"></i>自行发现线索数量</div>
              <div class="right">{{selfCueTotal}}</div>
            </div>
          </div>

          <!-- 领导 -->
          <div class="hover-box" v-show='IdentityType==3'>
            <div class="hover-item clearfix"  >
              <div class="left"> <i class="iconfont icon-biaoqian1"></i>待审批线索数量</div>
              <div class="right">{{waitApproval}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-changyonglogo46"></i>已审批线索数量</div>
              <div class="right">{{alreadyApproval}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-ai62"></i>已反馈线索数量</div>
              <div class="right">{{alreadyFeedback}}</div>
            </div>
          </div>

          <!-- 下级院 -->
          <div class="hover-box" v-show='IdentityType==5'>
            <div class="hover-item clearfix"  >
              <div class="left"> <i class="iconfont icon-biaoqian1"></i>待接收线索数量</div>
              <div class="right">{{waitReceive}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-changyonglogo46"></i>待反馈线索数量</div>
              <div class="right">{{alreadyReceive}}</div>
            </div>
            <div class="hover-item clearfix">
              <div class="left"><i class="iconfont icon-ai62"></i>已反馈线索数量</div>
              <div class="right">{{alreadyFinish}}</div>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="16">
        <heatmap></heatmap>
      </el-col>
      <el-col :lg="8">
        <!--关键词图表-->
        <word-cloud></word-cloud>
        <!--线索领域占比图-->
        <pie-chart></pie-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :lg="12" :sm="24">
        <!--新闻-->
        <div class="text_box">
          <!--标题-->
          <div class="text_head">
            <span>新闻聚合</span>
            <span @click="clickMore('home/news')">更多>></span>
            <!--<router-link tag="span" to="home/news">更多>></router-link>-->
          </div>
          <!--内容-->
          <ul class="text_body" v-loading="newsLoading">
            <li v-for="(item, index) in newsData.slice(0,6)" :key="index">
              <div class="text_title">
                <p v-text="item.BT" @click="details('news',item.BH)"></p>
                <p>
                  <span>来源: {{item.LY}}</span>
                  <span>发布时间: {{item.FBSJ}}</span>
                </p>
              </div>
              <div class="text_content" v-text="item.NR"></div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :lg="12" :sm="24">
        <!--知识库-->
        <div class="text_box">
          <!--标题-->
          <div class="text_head">
            <span>理论研究 | 法律法规</span>
            <!--<router-link tag="span" to="/home/knowledge">更多>></router-link>-->
            <span @click="clickMore('/home/knowledge?knowtype=1')">更多>></span>
          </div>
          <!--内容-->
          <ul class="text_body" v-loading="knowLoading">
            <li v-for="(item, index) in knowledgeData.slice(0,6)" :key="index">
              <div class="text_title">
                <p v-text="item.BT" @click="details('know',item.BH,item.SSLB)"></p>
                <p>
                  <span>来源: {{item.LY}}</span>
                  <span>发布时间: {{item.FBSJ}}</span>
                </p>
              </div>
              <div class="text_content" v-text="item.NR"></div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import heatmap from '../pubilcComponents/eChartComponents/heatMap'
  import wordCloud from '../pubilcComponents/eChartComponents/wordCloud'
  import pieChart from '../pubilcComponents/eChartComponents/pieChart'
  export default {
    components: {heatmap,wordCloud,pieChart},
    data() {
      return {
        IdentityType: localStorage.getItem("IdentityType"),//身份信息
        knowLoading: false,
        newsLoading: false,
        newsData: [],//新闻动态信息
        knowledgeData: [],//知识库信息
        dataCount: [//数据统计
        ],
        // hoverBoxShow:false,//线索总数框显示
        internetClueTotal:0,//互联网线索总数
        reportClueTotal:0,//举报线索总数
        welfareCueTotal:0, //公益组织线索
        heartCueTotal:0, //热点线索
        selfCueTotal:0, //自行发现线索
        //领导数量统计
        waitApproval:0,
        alreadyApproval:0,
        alreadyFeedback:0,
        //下级院数量统计
        waitReceive:0,
        alreadyReceive:0,
        alreadyFinish:0,

        endDate:'',

      }
    },
    mounted() {
      // this.getUerInfo();//获取用户权限
      this.initTime();
      this.getDataCount();//数据统计信息
      this.getNewsData();//新闻和知识库信息
    },
    methods: {
      //初始化时间
      initTime(){
        var date = new Date();
        this.endDate = date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
        function addZero(obj){
          if(obj<10){
            return '0' + obj;
          }else{
            return obj
          }
        }
      },
      //   获取用户信息
      getUerInfo(){
        let _this = this ;
        _this.axios({
          method:'get',
          url:webApi.Host + webApi.User.GetUser
        }).then(function(res){
          if(res.data.code == 0){
            let data = res.data.data;
             if(data.IdentityType == 4) {//下级院
              data.IdentityType = 5;
            }else if(data.IdentityType == 2) {//领导
              data.IdentityType = 3;
            }
            _this.IdentityType = data.IdentityType;
            if(_this.IdentityType == 1){ //管理员
              _this.getReportClueTotal();//获取举报线索总数
              _this.getInterClueTotal();//获取互联网线索总数
            }else if(_this.IdentityType == 3) {//领导

            }else if(_this.IdentityType== 5) {//下级院
            }
          }
        }).catch(function(err){

        })
      },
      //未办理线索总数(领导)
      getUnhandleClueTotal(){

      },
      //已办理线索总数(领导)
      getHandledClueTotal(){

      },
      //结果反馈总数(领导)
      getResultClueTotal(){
        var _this = this;
        this.axios({
          method:'get',
          url: webApi.ClueManager.GetLDFollowClues.format({xssjbly:'',xslb:'',keyword:'',sfbl:2,beginDate:'2017-01-01',endDate:_this.endDate,pageNum:1,pageSize:1,order:'fbsj'}),
            timeout: 10000,
          }).then(function(res){
            if(res.data.code==0){
              _this.alreadyFeedback = res.data.data.total;
             }
          }).catch(function(err){
            console.log(err)
        })
      },
      //获取互联网线索总数(管理员)
      getInterClueTotal(){
        let _this = this;
        let url = webApi.Clue.GetWebClues.format({keyword:'',type:'',site:'',order:'cjsj',p:1,ps:20})
        _this.axios({
          method:'get',
          url:url
        }).then(function(res){
          if(res.data.code == 0){
            _this.internetClueTotal = res.data.data.total
          }else {
            console.log(res.data.errorMessage);
          }
        }).catch(function(err){

        })
      },
      //获取举报线索总数(管理员)
      getReportClueTotal(){
        let _this = this;
        let url = webApi.Clue.GetReportClues.format({keyword:'',type:'',p:1,ps:20})
        _this.axios({
          method:'get',
          url:url
        }).then(function(res){
          if(res.data.code == 0){
            _this.reportClueTotal = res.data.data.total;
          }else {
            console.log(res.data.errorMessage);
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      //点击更多,跳转(新闻,知识库)
      clickMore(path) {
        this.$router.push({path:path});
      },
      //跳转详情
      details(type,id,SSLB) {
        let path = "";
        if(type=="news") {
          path = '/home/newsDetail';
        }else {
          path = '/home/knowledgeDetail';
        }
        this.$router.push({
          path: path,
          query: {id: id,type:SSLB}
        })
      },
      linkTo(item){
        this.$root.Bus.$emit('boxMenu',item.title);
        if(this.IdentityType == 1){  //管理员
          if(item.title == '线索总量'){
            return
          }else if(item.title=='关注线索总量'){
            this.$router.push({
              path: '/home/followCue'
            });
          }else if(item.title=='已办理线索'){
            this.$router.push({
              path: '/home/followCue?status=1'
            });
          }else if(item.title=='举报接收线索'){
            this.$router.push({
              path: '/home/reportCue'
            });
          }
        }else if(this.IdentityType == 3){ //领导
          if(item.title == '线索总量'){
            return
          }else if(item.title=='在办线索总量'){
            this.$router.push({
              path: '/home/waitApproval'
            });
          }else if(item.title=='已办理线索'){
            this.$router.push({
              path: '/home/allreadyApproval'
            });
          }else if(item.title=='举报接收线索'){
            this.$router.push({
              path: '/home/waitApproval'
            });
          }
        }else if(this.IdentityType == 5){
          if(item.title == '线索总量'){
            return
          }else if(item.title=='待接收线索'){
            this.$router.push({
              path: '/home/waitReceive'
            });
          }else if(item.title=='已接收线索'){
            this.$router.push({
              path: '/home/waitFeedback'
            });
          }else if(item.title=='已办理线索'){
            this.$router.push({
              path: '/home/complete'
            });
          }
        }
      },
      getNewsData() {//获取新闻动态信息、知识库信息
        let _this = this;
        let setDataContent = function(data) {
          if(data.length > 0) {
            for(let i=0;i<data.length;i++){
              (data[i].NR) && (data[i].NR = data[i].NR.slice(0,200) + '...')
            }
          }
        };
        _this.knowLoading = true;
        _this.newsLoading = true;
        _this.axios({//新闻动态
          method: 'get',
          url: (webApi.News.GetTopNews).format({'top': 6}),
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0) {
            setDataContent(res.data.data.data);
            _this.newsData = res.data.data.data;
            _this.newsLoading = false;
          }
        }).catch(function(err){
          _this.newsLoading = false;
          console.log(err)
        })
        _this.axios({//知识库
          method: 'get',
          url: (webApi.Knowledge.GetTop).format({'top': 6}),
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0) {
            setDataContent(res.data.data.data);
            _this.knowledgeData = res.data.data.data;
            _this.knowLoading = false;
          }
        }).catch(function(err){
          _this.knowLoading = false;
          console.log(err)
        })
      },
      getDataCount() {//获取数据统计信息
        let _this = this;
        let setDataCount = function(obj,newObj) {
          for(let i in obj) {
            _this.$set(obj, i, newObj[i]);
          }
        };
        let setDataCountFunc = function(){
            if(_this.IdentityType =='1'){
              _this.getAdminDataCount(setDataCount);//获取管理员主页数据统计信息
              _this.getReportClueTotal();//获取举报线索总数
              _this.getInterClueTotal();//获取互联网线索总数
            }else if(_this.IdentityType == "5") {
              _this.getSubDataCount(setDataCount);//获取下级院主页统计信息
            }else if(_this.IdentityType=="3"){
              _this.getLeaderDataCount(setDataCount); //获取领导统计信息
              _this.getResultClueTotal();
            }
        };
        if(!_this.IdentityType){
          _this.$root.Bus.$on('changeIdentity',function(data){
            _this.IdentityType = data;
            setDataCountFunc();
          });
        }else {
          setDataCountFunc();
        }

      },
      getAdminDataCount(setDataCount){//获取管理员主页数据统计信息
        let _this = this;
        _this.dataCount = [//数据统计
          {title: "线索总量", val: 0,icon:'fa-list'},
          {title: "关注线索总量", val: 0,icon:'fa-heart-o'},
          {title: "已办理线索", val: 0,icon:'fa-check-circle'},
          {title: "举报接收线索", val: 0,icon:'fa-envelope-o'}
        ];
        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[0],{title: '线索总量', val: res.data.data.Total,icon:'fa-list'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountFollowClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[1],{title: '关注线索总量', val: res.data.data,icon:'fa-heart-o'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'get',
          url: webApi.ClueManager.GetFollowClues.format({xssjbly:'',xslb:'',sfbl:true,keyword:'',beginDate:'2017-01-01',endDate:_this.endDate,pageNum:1,pageSize:1,order:'fbsj'}),
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[2],{title: '已办理线索', val: res.data.data.total,icon:'fa-check-circle'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'get',
          url: (webApi.Clue.GetReportClues).format({
          keyword:"",
          type: "",
          p: "1",
          ps: "1"
          }),
          timeout: 10000
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[3],{title: '举报接收线索', val: res.data.data.total,icon:'fa-envelope-o'});
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      getLeaderDataCount(setDataCount){//获取领导主页数据统计信息
        let _this = this;
        _this.dataCount = [//数据统计
          {title: "线索总量", val: 0,icon:'fa-list'},
          {title: "在办线索总量", val: 0,icon:'fa-indent'},
          {title: "已办理线索", val: 0,icon:'fa-check-circle'},
          {title: "举报接收线索", val: 0,icon:'fa-envelope-o'}
        ];
        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[0],{title: '线索总量', val: res.data.data.Total,icon:'fa-list'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'get',
          url: webApi.Host + webApi.Stats.CountHanddingClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.waitApproval = res.data.data;
            setDataCount(_this.dataCount[1],{title: '在办线索总量', val: res.data.data,icon:'fa-indent'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'get',
          url: webApi.ClueManager.GetApprovalClues.format({type:1,xslb:'',keyword:'',beginDate:'2017-01-01',endDate:_this.endDate,pageNum:1,pageSize:1}),
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.alreadyApproval = res.data.data.count;
            setDataCount(_this.dataCount[2],{title: '已办理线索', val: res.data.data.count,icon:'fa-check-circle'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'get',
          url: (webApi.Clue.GetReportClues).format({
          keyword:"",
          type: "",
          p: "1",
          ps: "1"
          }),
          timeout: 10000
        }).then(function(res){
          if(res.data.code==0){
            setDataCount(_this.dataCount[3],{title: '举报接收线索', val: res.data.data.total,icon:'fa-envelope-o'});
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      getSubDataCount(setDataCount){//获取下级院主页数据统计信息
        let _this = this;
        let subTotal = 0;//线索总量
        _this.dataCount = [//数据统计
          {title: "线索总量", val: 0,icon:'fa-list'},
          {title: "待确认接收线索", val: 0,icon:'fa-indent'},
          {title: "已接收线索", val: 0,icon:'fa-check-square'},
          {title: "已办理线索", val: 0,icon:'fa-check-circle'}
        ];
        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountUnConfirmClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.waitReceive = res.data.data;
            setDataCount(_this.dataCount[1],{title: '待确认接收线索', val: res.data.data,icon:'fa-indent'});
            subTotal+=res.data.data;
            _this.axios({
              method: 'post',
              url: webApi.Host + webApi.Stats.CountSubReciveClues,
              timeout: 10000,
            }).then(function(res){
              if(res.data.code==0){
                subTotal+=res.data.data;
                console.log(subTotal)
                setDataCount(_this.dataCount[0],{title: '线索总量', val: subTotal,icon:'fa-list'});
              }
            }).catch(function(err){
              console.log(err)
            })
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountSubReciveClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.alreadyReceive = res.data.data;
            setDataCount(_this.dataCount[2],{title: '已接收线索', val: res.data.data,icon:'fa-check-square'});
          }
        }).catch(function(err){
          console.log(err)
        })

        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountSubHandled,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.alreadyFinish = res.data.data;
            setDataCount(_this.dataCount[3],{title: '已办理线索', val: res.data.data,icon:'fa-check-circle'});
          }
        }).catch(function(err){
          console.log(err)
        })
      }
    },

  }
</script>

<style lang="scss" scoped>
  #homePage {
    overflow-x: hidden;
    padding: 10px 15px;
  }
  /*数据分析*/
  .dataAnalysis {
    .analysisBox_wrap {
      &:nth-child(1) {
        .analysisBox {
          background-color: #0E9E33;
        }
        /*.hover-box-show{*/
          /*// border: 8px solid rgba(0,0,0,0.3);*/
          /*padding: 6px 0;*/
          /*width: 100%;*/
          /*height: 100%;*/
        /*}*/
        .analysisBox:hover .hover-box{
          background:#616161e0;
          padding: 6px 0;
          width: 100%;
          height: 100%;
        }
      }
      &:nth-child(2) {
        .analysisBox {
          background-color: #0AB1DB;
        }
      }
      &:nth-child(3) {
        .analysisBox {
          background-color: #EC9302;
        }
      }
      &:nth-child(4) {
        .analysisBox {
          background-color: #DA4630;
        }
      }
      .analysisBox {
        position: relative;
        text-align: left;
        color: #fff;
        font-size: 16px;
        margin-bottom: 16px;
        cursor:pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .analysisBox_top {
          padding: 30px 32px 22px 32px;
          overflow: hidden;
          cursor:pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          &>span {
            font-size: 38px;
            float: left;
            font-weight: bold;
          }
          &>i {
            float: right;
            color: rgba(255, 255, 255, 0.25);
          }
        }
        .analysis_more {
          clear: both;
          height: 26px;
          line-height: 26px;
          background-color: rgba(0,0,0,.4);
          margin-bottom: 0;
          font-size: 14px;
          text-align: center;
        }
      }

      .hover-box{
        position: absolute;
        width: 0;
        height: 0;
        background: rgba(255,255,255,0.1);
        color: #333333;
        top: 0;
        left: 0;
        z-index: 100;
        overflow: hidden;
        -webkit-transition: all 0.2s;
        -moz-transition: all 0.2s;
        -ms-transition: all 0.2s;
        -o-transition: all 0.2s;
        transition: all 0.2s;
        .hover-item{
          width: 100%;
          min-width: 100%;
          font-size: 14px;
          .left{
            float: left;
            margin-left: 10px;
            color: rgba(255,255,255,0.8);
            .iconfont{
              font-size: 14px;
              margin-right: 4px;
              font-weight: 100;
            }
          }
          .right{
            float: right;
            margin-right: 10px;
            color: #ffffff;
          }
        }
      }

    }
  }
  /*文本内容(新闻和知识库内容)*/
  .text_box {
    /*头部*/
    .text_head {
      overflow: hidden;
      color: white;
      font-size: 18px;
      background: #48AE72;
      span {
        padding: 10px 20px;
        vertical-align: center;
        &:first-child {
          position: relative;
          float: left;
          background-color: #2B9759;
          &:after {
            position: absolute;
            right: -44px;
            top: 0;
            content: "";
            width: 0;
            height: 0;
            border: 22px solid transparent;
            border-left-color: #2B9759;
          }
        }
        &:last-child {
          float: right;
          font-size: 14px;
          margin-top: 2.5px;
          color: #e5e5e5;
          &:hover {
            color: #f4f4f4;
            cursor: pointer;
          }
        }
      }
    }
    /*内容部分*/
    .text_body {
      list-style: none;
      padding-left: 0;
      margin: 0;
      font-size: 18px;
      min-height: 150px;
      li {
        margin-top: 15px;
        overflow: hidden;
        padding-bottom: 5px;
        p {
          overflow: hidden;
          margin-bottom: 5px;
        }
        /*标题信息*/
        .text_title {
          p {
            /*标题*/
            &:first-child {
              color: rgb(14, 158, 51);
              &:hover {
                text-decoration: underline;
                cursor: pointer;
              }
            }
            /*来源和发布时间*/
            &:last-child {
              color: rgb(115, 115, 115);
              font-size: 12px;
              span {
                /*来源*/
                &:first-child {
                  float: left;
                }
                /*发布时间*/
                &:last-child {
                  float: right;
                }
              }
            }
          }
        }
        /*正文内容*/
        .text_content {
          font-size: 14px;
          text-indent: 27px;
        }
      }
    }
  }





</style>
