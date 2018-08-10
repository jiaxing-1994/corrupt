<template>
  <el-menu id="menu" class="el-menu-vertical-demo"  :default-openeds="openeds">
    <router-link to="/home">
      <el-menu-item index="1" :class="isThisNav == '主页'?'is-actived':''" @click="switchNav('主页')">
        <i class="iconfont icon-zhuye"></i>
        <span slot="title">系统主页</span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/waitApproval" v-if="IdentityType==3?true:false">
      <el-menu-item index="7" :class="isThisNav == '待审批' ?'is-actived':''" @click="switchNav('待审批')">
        <i class="fa fa-pencil-square-o"></i>
        <span slot="title">待审批<span class="note-tag">({{waitApproval}})</span></span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/allreadyApproval" v-if="IdentityType==3?true:false">
      <el-menu-item index="8" :class="isThisNav == '已审批'?'is-actived':''" @click="switchNav('已审批')">
        <i class="fa fa-th-list"></i>
        <span slot="title">已审批</span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/approvalResult" v-if="IdentityType==3?true:false">
      <el-menu-item index="9" :class="isThisNav == '结果反馈'?'is-actived':''" @click="switchNav('结果反馈')">
        <i class="fa fa-check-square"></i>
        <span slot="title">结果反馈</span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/waitReceive" v-if="IdentityType==5?true:false">
      <el-menu-item index="10" :class="isThisNav == '待接收'?'is-actived':''" @click="switchNav('待接收')">
        <i class="fa fa-th-list"></i>
        <span slot="title">待确认接收<span class="note-tag">({{waitReceive}})</span></span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/waitFeedback" v-if="IdentityType==5?true:false">
      <el-menu-item index="11" :class="isThisNav == '待反馈'?'is-actived':''" @click="switchNav('待反馈')">
        <i class="fa fa-pencil-square-o"></i>
        <span slot="title">待反馈</span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/complete" v-if="IdentityType==5?true:false">
      <el-menu-item index="12" :class="isThisNav == '已反馈'?'is-actived':''" @click="switchNav('已反馈')">
        <i class="fa fa-check-square"></i>
        <span slot="title">已反馈</span>
      </el-menu-item>
    </router-link>

    <el-submenu index="2" v-if="IdentityType==1?true:false">
      <template slot="title">
        <i class="iconfont icon-fenlei1"></i>
        <span slot="title">线索资源库</span>
      </template>
      <el-menu-item-group >
        <template slot="title" id="menu-group-title" style="display:none"></template>
        <router-link to="/home/reportCue">
          <el-menu-item index="2-1" :class="isThisNav == '举报线索'?'is-actived':''" @click="switchNav('举报线索')" >
            <i class="iconfont icon-biaoqian1"></i>
            <span slot="title">举报线索</span>
          </el-menu-item>
        </router-link>

        <router-link to="/home/internetCue">
          <el-menu-item index="2-2" :class="isThisNav == '互联网线索'?'is-actived':''" @click="switchNav('互联网线索')">
            <i class="iconfont icon-changyonglogo46"></i>
            <span slot="title">互联网线索</span>
          </el-menu-item>
        </router-link>

       <router-link to="/home/welfareCue">
         <el-menu-item index="2-3" :class="isThisNav == '公益组织线索'?'is-actived':''" @click="switchNav('公益组织线索')">
           <i class="iconfont icon-ai62"></i>
           <span slot="title">公益组织线索</span>
         </el-menu-item>
       </router-link>

        <router-link to="/home/heartCue">
          <el-menu-item index="2-4" :class="isThisNav == '热点线索'?'is-actived':''" @click="switchNav('热点线索')">
            <i class="iconfont icon-remen"></i>
            <span slot="title">热点线索</span>
          </el-menu-item>
        </router-link>

        <router-link to="/home/selfDiscovery">
          <el-menu-item index="2-5" :class="isThisNav == '自行发现线索'?'is-actived':''" @click="switchNav('自行发现线索')">
            <i class="fa  fa-search-plus "></i>
            <span slot="title">自行发现线索</span>
          </el-menu-item>
        </router-link>

      </el-menu-item-group>
    </el-submenu>
    <router-link to="/home/followCue" v-if="IdentityType==1?true:false">
      <el-menu-item index="3" :class="isThisNav == '关注线索'?'is-actived':''" @click="switchNav('关注线索')">
        <i class="iconfont icon-guanzhu1"></i>
        <span slot="title">关注线索</span>
      </el-menu-item>
    </router-link>


    <router-link to="/home/news">
      <el-menu-item index="4" :class="isThisNav == '新闻页' || isThisNav == '新闻页详情'?'is-actived':''" @click="switchNav('新闻页')">
        <i class="iconfont icon-xiangji"></i>
        <span slot="title">新闻聚合</span>
      </el-menu-item>
    </router-link>

    <!-- <router-link to="/home/knowledge">
      <el-menu-item index="5" :class="isThisNav == '知识库' || isThisNav == '知识库详情'?'is-actived':''" @click="switchNav('知识库')">
        <i class="iconfont icon-boshimao"></i>
        <span slot="title">知识库</span>
      </el-menu-item>
    </router-link> -->

    <el-submenu index = "5">
      <template slot="title">
        <i class="fa fa-leanpub"></i>
        <span slot="title">知识库</span>
      </template>
      <el-menu-item-group >
        <template slot="title" id="menu-group-title" style="display:none"></template>

        <router-link to="/home/knowledge?knowtype=1">
          <el-menu-item index="5-1" :class="isThisNav == '理论研究' || isThisNav == '知识库详情'?'is-actived':''" @click="switchNav('理论研究')">
            <i class="iconfont icon-boshimao"></i>
            <span slot="title">理论研究</span>
          </el-menu-item>
        </router-link>
        <router-link to="/home/knowledge?knowtype=2">
          <el-menu-item index="5-2" :class="isThisNav == '法律法规' || isThisNav == '知识库详情'?'is-actived':''" @click="switchNav('法律法规')">
            <i class="fa fa-columns"></i>
            <span slot="title">法律法规</span>
          </el-menu-item>
        </router-link>

      </el-menu-item-group>
    </el-submenu>



    <router-link to="/home/UAV">
      <el-menu-item index="13" :class="isThisNav == '无人机取证' ?'is-actived':''" @click="switchNav('无人机取证')">
        <i class="fa fa-plane"></i>
        <span slot="title">无人机取证</span>
      </el-menu-item>
    </router-link>

    <router-link to="/home/search">
      <el-menu-item index="14" :class="isThisNav == '全文搜索' || isThisNav == '全文搜索结果'?'is-actived':''" @click="switchNav('全文搜索')">
        <i class="fa fa-search"></i>
        <span slot="title">大数据检索</span>
      </el-menu-item>
    </router-link>

    <el-submenu index="6">
      <template slot="title">
        <i class="fa fa-cubes"></i>
        <span slot="title">数据分析</span>
      </template>
      <el-menu-item-group >
        <template slot="title" id="menu-group-title" style="display:none"></template>
        <router-link to="/home/newsAnalysis">
          <el-menu-item index="6-1" :class="isThisNav == '新闻热力分析'?'is-actived':''" @click="switchNav('新闻热力分析')" >
            <i class="fa fa-newspaper-o"></i>
            <span slot="title">新闻热力分析</span>
          </el-menu-item>
        </router-link>

        <router-link to="/home/cueFieldAnalysis">
          <el-menu-item index="6-2" :class="isThisNav == '线索领域分析'?'is-actived':''" @click="switchNav('线索领域分析')">
            <i class="fa fa-window-restore"></i>
            <span slot="title">线索情况分析</span>
          </el-menu-item>
        </router-link>

        <!-- <router-link to="/home/infoAnalysis">
          <el-menu-item index="6-3" :class="isThisNav == '信息分析'?'is-actived':''" @click="switchNav('信息分析')">
            <i class="fa fa-inbox"></i>
            <span slot="title">深圳环保数据分析</span>
          </el-menu-item>
        </router-link> -->


      </el-menu-item-group>
    </el-submenu>
    <!--<el-menu-item index="7">-->
      <!--<i class="el-icon-setting"></i>-->
      <!--<span slot="title">手动录入</span>-->
    <!--</el-menu-item>-->
    <router-link to="/home/inspectionReport">
      <el-menu-item index="13" :class="isThisNav == '检验报告' ?'is-actived':''" @click="switchNav('检验报告')">
        <i class="fa fa-list-alt"></i>
        <span slot="title">检验报告</span>
      </el-menu-item>
    </router-link>
  </el-menu>

</template>

<script>
  export  default {
    name:'side_menu',
    data(){
      return{
        IdentityType: localStorage.getItem('IdentityType'),//身份信息
        openeds: ['2','5','6','7','7-3'],
        isThisNav: '',
        waitReceive:0, //待接收 下级院
        waitApproval:0, //待审批 领导
        endDate:'', //
      }
    },
    mounted(){
      var _this = this;
      console.log(this.$route.meta.name);
      this.$root.Bus.$on('changeMenu',function(index){
        if(index == '5-1'){
          _this.isThisNav = '理论研究';
        }else if(index == '5-2'){
          _this.isThisNav = '法律法规';
        }else if(index == 'news'){
          _this.isThisNav = _this.$route.meta.name;
        }
      })
      this.$root.Bus.$on('boxMenu',function(item){
        console.log(item);
        if(_this.IdentityType == 1){ //管理员
          if(item=='关注线索总量'){
            _this.isThisNav = '关注线索';
          }else if(item=='已办理线索'){
            _this.isThisNav = '关注线索';
          }else if(item=='举报接收线索'){
            _this.isThisNav = '举报线索';
          }
        }else if(_this.IdentityType == 3){ //领导
          if(item=='在办线索总量'){
            _this.isThisNav = '待审批';
          }else if(item=='已办理线索'){
            _this.isThisNav = '已审批';
          }else if(item=='举报接收线索'){
            _this.isThisNav = '待审批';
          }
        }else if(_this.IdentityType == 5){ //下级院
          if(item=='待接收线索'){
            _this.isThisNav = '待接收';
          }else if(item=='已接收线索'){
            _this.isThisNav = '待反馈';
          }else if(item=='已办理线索'){
            _this.isThisNav = '已反馈';
          }
        }
        console.log(_this.isThisNav);
      })
      if(this.$route.query.type){
        if(this.$route.query.type == 1){
          this.isThisNav = '举报线索';
        }else if(this.$route.query.type == 2){
          this.isThisNav = '互联网线索';
        }else if(this.$route.query.type == 3){
          this.isThisNav = '公益诉讼线索';
        }else if(this.$route.query.type == 4){
          this.isThisNav = '热点线索';
        }else if(this.$route.query.type == 5){
          this.isThisNav = '关注线索';
        }else if(this.$route.query.type == 6){
          this.isThisNav = '待审批';
        }else if(this.$route.query.type == 7){
          this.isThisNav = '已审批';
        }else if(this.$route.query.type == 8){
          this.isThisNav = '结果反馈';
        }else if(this.$route.query.type == 9){
          this.isThisNav = '待接收';
        }else if(this.$route.query.type == 10){
          this.isThisNav = '待反馈';
        }else if(this.$route.query.type == 11){
          this.isThisNav = '已反馈';
        }
      }else{
        this.isThisNav = this.$route.meta.name;
        if(this.$route.meta.name == '知识库'||this.$route.meta.name == '知识库详情'){
          if(this.$route.fullPath.split('?')[1].split('=')[1] == 1){
            this.isThisNav = '理论研究';
          }else if(this.$route.fullPath.split('?')[1].split('=')[1] == 2){
            this.isThisNav = '法律法规';
          }else if(this.$route.query.knowtype == 1){
            this.isThisNav = '理论研究';
          }else if(this.$route.query.knowtype == 2){
            this.isThisNav = '法律法规';
          }
        }
      };
      var _this = this;
      this.$root.Bus.$on('changeIdentity',function(val){
        _this.IdentityType = val;
        console.log(1);
        if(_this.IdentityType == 5){
          _this.countWaitConfirm();
        }
        if(_this.IdentityType == 3){
          _this.countWaitApproval();
        }
      })
      this.$root.Bus.$on('changeWaitConfirm',function(){
        _this.countWaitConfirm();
        console.log(2);
      })
      this.$root.Bus.$on('changeWaitApproval',function(){
        _this.countWaitApproval();
        console.log(3);
      })
      this.initTime();
    },
    methods:{
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
      switchNav(title){
        this.isThisNav = title;
      },
      //统计待确认接收线索
      countWaitConfirm(){
        var _this = this;
        _this.axios({
          method: 'post',
          url: webApi.Host + webApi.Stats.CountUnConfirmClues,
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.waitReceive = res.data.data;
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      //统计待办理线索
      countWaitApproval(){
        var _this = this;
        // _this.axios({
        //   method: 'get',
        //   url: webApi.Host + webApi.Stats.CountHanddingClues,
        //   timeout: 10000,
        // }).then(function(res){
        //   if(res.data.code==0){
        //     _this.waitApproval = res.data.data;
        //   }
        // }).catch(function(err){
        //   console.log(err)
        // })
        _this.axios({
          method: 'get',
          url: webApi.ClueManager.GetApprovalClues.format({type:0,xslb:'',keyword:'',beginDate:'2017-01-01',endDate:_this.endDate,pageNum:1,pageSize:1}),
          timeout: 10000,
        }).then(function(res){
          if(res.data.code==0){
            _this.waitApproval = res.data.data.count;
          }
        }).catch(function(err){
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #menu{
    // .active{
    //   color: red;
    // }
    height: 100%;
    el-menu-item-group{
      overflow: hidden;
    }
    .note-tag{
      color: #ff6000;
      display: inline-block;
      vertical-align: bottom;
    }
    .is-actived{
      color: #5bade2 !important;
      i{
        color: #5bade2 !important;
      }
    }
  }
  /*.el-menu-item.is-active{*/
    /*color: #c0ecaa;*/
  /*}*/
  /*.el-menu-item:focus, .el-menu-item:hover{*/
    /*background: #00a65a;*/
  /*}*/
</style>
