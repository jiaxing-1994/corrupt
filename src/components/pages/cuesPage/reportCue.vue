<template>
  <div id="reportCue">
      <div class="report-cue-head clearfix">
          <div class="title-wrap clearfix">
            <div class="title-icon">
              <i class="iconfont icon-biaoqian1"></i>
            </div>
            <div class="title">举报线索</div>
          </div>
        <div class="search-wrap clearfix">
          <input class="search-ipt" type="text" v-model="keyword" @keyup.13="getReportCue()" placeholder="请输入内容">
          <span class="search-btn" @click="getReportCue()" >
            <i class="iconfont icon-sousuo"></i>
          </span>
        </div>
      </div>
      <div class="main-body">
        <div class="cue-types-wrap">
          <div class="title-wrap">
            <i class="iconfont icon-leibieguanli"></i>
            <span>所属领域</span>
          </div>
          <div class="types-wrap clearfix">
            <div v-for="(item ,index) in typeList" class="type-item" :class="{'type-item-on':type == item}" @click = "clueTypeOder(item)">
              <div class="type-icon">
                <i v-if="item == '食药安全'" class="iconfont icon-shipinshengchanqiye"></i>
                <i v-else-if="item == '英烈保护'" class="iconfont icon-44"></i>
                <i v-else-if="item == '国有财产'" class="iconfont icon-jinqian"></i>
                <i v-else-if="item ==  '食品安全'" class="iconfont icon-shouyeshipin"></i>
                <i v-else-if="item ==  '国土资源'" class="iconfont icon-diqiuyi"></i>
                <i v-else-if="item ==  '环境保护'" class="iconfont icon-huanjingbaohu"></i>
              </div>
              <div class="type-name">
                {{item}}
              </div>
            </div>
          </div>
        </div>
        <div class="cue-list" ref="cueList"  v-loading="isLoad">
          <el-table
             ref="oTable"
            :data="reportCueList"
             :max-height="tableH"
             :height="tableH"
            style="width: 100%">
            <el-table-column
              prop="SFYD"
              label=""
              width="40">
              <template slot-scope="scope" >
                <i v-show="scope.row.SFYD == 0" class="fa fa-circle isRead"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="举报内容"
              min-width="300">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" max-width="400">
                  <!-- <p style="text-indent: 2em;">{{ scope.row.JBNR }}</p> -->
                  <div slot="reference" class="td-content" >
                    {{ scope.row.JBNR}}
                  </div>
                  <div style="width:300px; max-height: 200px; overflow: auto;" v-html="scope.row.JBNR"></div>
              </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="CJSJ"
              label="举报时间"
              min-width="180"
              >
            </el-table-column>
            <el-table-column
              prop="XSLB"
              label="所属领域"
              min-width="100"
              >
            </el-table-column>
            <el-table-column
              prop="city"
              label="事发地点"
              min-width="200"
              >
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" >
                  <p>{{ scope.row.SFDD }}</p>
                  <div slot="reference" class="td-content" >
                    {{ scope.row.SFDD}}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="JBRXM"
              label="举报人姓名"
              min-width="100"
              >
            </el-table-column>
            <el-table-column
              prop="zip"
              label="联系方式"
              min-width="200"
              >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="details(scope.$index,scope.row.XSBH ,scope.row.SFYD,'1')" type="text" size="small">查看</el-button>
                <el-button v-show="scope.row.SFGZ =='0'" title="未关注(关注)" @click="followClue(scope.row.XSBH ,'1')" style="color: #F66" type="text" size="small"><i class="fa fa-heart-o"></i></el-button>
                <el-button v-show="scope.row.SFGZ =='1'" title="已关注(取消关注)" @click="cancelFollowClue(scope.row.XSBH ,'1')" style="color: #F66" type="text" size="small"><i class="fa fa-heart"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-wrap">
          <el-pagination
            @current-change="pageTo"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalPages">
          </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableH: 0,  //表格高度
        reportCueList:[       //举报列表
         ],
        typeList:[], //线索类型列表
        keyword:'',//查询列表关键字
        type:'', //线索类型
        page:1, //页码
        pageSize: 20,//每页条数
        totalPages:0,//总条数
        isLoad:false,//数据是否在加载
      }
    },
    mounted(){
      let _this = this;
      localStorage.removeItem('cueList');
      localStorage.removeItem('cueIndex');
      localStorage.removeItem('pageNum');
      localStorage.removeItem('cueType');
      localStorage.removeItem('keyword');
      _this.tableResize(); //表格高度自适应
      _this.getReportCue(); //获取举报线索列表
      _this.getClueType(); //获取举报门类
    },
    methods:{
      //获取举报线索列表
      getReportCue:function(){
        let _this = this;
        if(_this.isLoad == false){
          _this.isLoad = true;
          let url = webApi.Clue.GetReportClues.format({keyword:_this.keyword,type:_this.type,p:_this.page,ps:_this.pageSize})
          _this.axios({
            method:'get',
            url:url
          }).then(function(res){
            _this.isLoad = false
            if(res.data.code == 0){
              let data = res.data.data.data;
              _this.reportCueList = data;
              _this.totalPages = res.data.data.total;
            }else {
              _this.$message.error(res.data.errorMessage);
            }
          }).catch(function(err){
            console.log(err)
            _this.isLoad = false
          })
        }

      },
      //获取举报门类
      getClueType(){
        let _this = this;
        _this.axios({
          method:'get',
          url:webApi.Host + webApi.Clue.GetClueTypes
        }).then(function(res){
          if(res.data.code == 0){
            let data = res.data.data;
            _this.typeList = data;
          }
        }).catch(function(err){

        })
      },

      //按举报类型筛选
      clueTypeOder(type){
        let _this = this;
        if(_this.isLoad == false){
          if(_this.type!= type){
            _this.page = 1;
            _this.type = type;
            _this.getReportCue();
          }else{
            _this.type = '';
            _this.page = 1;
            _this.getReportCue();
          }
        }
      },

      // 页码跳转
      pageTo(curr) {
        let _this = this ;
        _this.page = curr;
        _this.getReportCue();
      },

      // 查看详情
      details(index,id,SFYD,xssjbly){
        let _this = this;
        localStorage.setItem('cueList',JSON.stringify(_this.reportCueList));
        localStorage.setItem('cueIndex',index);
        localStorage.setItem('pageNum',_this.page);
        localStorage.setItem('cueType',_this.type);
        localStorage.setItem('keyword',_this.keyword);
        if(SFYD != 0){
          this.$router.push({
            path:'/home/cueDetail',
            query:{type:1,id:id}
          });
        }else {
          _this.axios({
            method:'POST',
            url:webApi.Clue.ClueRead.format({xssjbly:xssjbly,xsbh:id})
          }).then((res)=>{
            this.$router.push({
              path:'/home/cueDetail',
              query:{type:1,id:id}
            });
          }).catch((err)=>{
            this.$router.push({
              path:'/home/cueDetail',
              query:{type:1,id:id}
            });
          })
        }
      },

      //关注线索
      followClue(clueId,clueType){
        let _this = this;
        if(_this.isLoad ==false){
          _this.axios({
            method:'post',
            url:webApi.ClueManager.FollowClue.format({xsid:clueId,xssjbly:clueType})
          }).then(function(res){
            if(res.data.code == 0){
              _this.getReportCue()
            }
          }).catch(function(err){

          })
        }
      },
      //取消关注线索
      cancelFollowClue(clueId,clueType){
        let _this = this;
        if(_this.isLoad ==false){
          _this.axios({
            method:'post',
            url:webApi.ClueManager.UnFollowClue.format({xsid:clueId,xssjbly:clueType})
          }).then(function(res){
            if(res.data.code == 0){
              _this.getReportCue()
            }
          }).catch(function(err){

          })
        }
      },
      //表格高度自适应
      tableResize(){
        let _this = this;
        this.$nextTick(function () {
          _this.tableH = _this.$refs.cueList.clientHeight;
          window.addEventListener('resize',_this.resize);
        })
      },
      resize(){
        let _this = this;
        _this.tableH = _this.$refs.cueList.clientHeight;
      }

    },
    //实例销毁钩子
    destroyed(){
      window.removeEventListener('resize',this.resize)
    }
  }
</script>

<style lang="scss" scoped>
  #reportCue{
    height: 100%;
    max-height:100%;
    min-width: 750px;
    overflow-y:hidden;
    .report-cue-head{
      height: 50px;
      width: 100%;
      line-height: 50px;
      background: #EEEEEE;
      border-bottom: 1px solid #dcdcdc;

      /*标题*/
      .title-wrap{
        float: left;
        height: 100%;
        .title-icon{
          float: left;
          height: 100%;
          text-align: center;
          width: 50px;
          border-right: 1px solid #dcdcdc;
          .iconfont{
            font-size: 20px;
            color: #666666;
          }
        }
        .title{
          float: left;
          padding-left: 10px;
          font-size: 16px;
          color: #666666;
        }
      }

      /*搜索框*/
      .search-wrap{
        float: right;
        background: #FFFFFF;
        height: 42px;
        width: 320px;
        margin-right: 50px;
        margin-top: 4px;
        border: 1px solid #dcdcdc;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        .search-ipt{
          width: 270px;
          float: left;
          font-size: 16px;
          height: 100%;
          border: none;
          padding-left: 10px;
          color: #999999;
          background: transparent;
        }
        .search-btn{
          float: left;
          position: relative;
          height: 100%;
          line-height: 40px;
          width: 48px;
          color: #999999;
          text-align: center;
          cursor: pointer;
        }
        .search-btn:after{
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 2px;
          height: 20px;
          background: #dcdcdc;
        }
      }

    }
    .main-body{
      margin-top: 24px;
      height: calc(100% - 74px);
      max-height: calc(100% - 74px);
      padding: 0 50px;
      .cue-types-wrap{
        border: 1px solid #dcdcdc;
        .title-wrap{
          background: #EEEEEE;
          padding-left: 20px;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: #333333;
          border-bottom: 1px solid #dcdcdc;
          .iconfont{
            font-weight: 800;
            color: #333;
          }
        }
        .types-wrap{
          height: 80px;
          overflow-y: auto;
          .type-item{
            position: relative;
            float: left;
            width: 90px;
            height: 100%;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
            .type-icon{
              padding-top: 14px;
              .iconfont{
                -webkit-transition: all 0.3s;
                -moz-transition: all 0.3s;
                -ms-transition: all 0.3s;
                -o-transition: all 0.3s;
                transition: all 0.3s;
                color: #333333;
                font-size: 30px;
              }
            }
            .type-name{
              -webkit-transition: all 0.3s;
              -moz-transition: all 0.3s;
              -ms-transition: all 0.3s;
              -o-transition: all 0.3s;
              transition: all 0.3s;
              padding-top: 4px;
              color: #333333;
            }
          }
          .type-item:after{
            position: absolute;
            content: '';
            width: 1px;
            height: 50px;
            background: #dcdcdc;
            top: 16px;
            right: 0;
          }

          .type-item:last-child:after{
            display: none;
          }
          .type-item-on{
            .type-icon{
              .iconfont{
                color: #0B8E45;
              }
            }
            .type-name{
              color: #0B8E45!important;
            }
          }
          .type-item:hover {
            .type-icon{
              .iconfont{
                color: #0B8E45;
              }
            }
            .type-name{
              color: #0B8E45;
            }
          }
        }

      }
      .cue-list{
        margin-top: 24px;
        height: calc( 100% - 210px);
        max-height: calc( 100% - 210px);
        overflow-y: hidden;
        .isRead{
          color: #F66;
        }
      }
      .page-wrap{
        margin-top: 24px;
        height: 40px;
      }
    }
  }

  @media (max-width: 1440px) {

      #reportCue{
        .report-cue-head{
          height: 40px;
          line-height: 40px;
          /*标题*/
          .title-wrap{
            .title-icon{
              width: 40px;
              .iconfont{
                font-size: 18px;
              }
            }
            .title{
              font-size: 16px;
            }
          }

          /*搜索框*/
          .search-wrap{
            height: 32px;
            width: 300px;
            .search-ipt{
              width: 260px;
              font-size: 14px;
            }
            .search-btn{
              line-height: 32px;
              width: 38px;
            }
            .search-btn:after{
              content: '';
              left: 0;
              top: 8px;
              width: 2px;
              height: 14px;
            }
          }
        }
        .main-body{
          margin-top: 16px;
          height: calc(100% - 56px);
          max-height: calc(100% - 56px);
          .cue-types-wrap{
            .title-wrap{
              height: 32px;
              line-height: 32px;
            }
            .types-wrap{
              height: 68px;
              .type-item{
                position: relative;
                float: left;
                width: 86px;
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                .type-icon{
                  padding-top: 8px;
                  .iconfont{
                    font-size: 24px;
                  }
                }
                .type-name{
                  color: #333333;
                }
              }
              .type-item:after{
                position: absolute;
                content: '';
                width: 1px;
                height: 44px;
                background: #dcdcdc;
                top: 16px;
                right: 0;
              }
            }
          }
          .cue-list{
            margin-top: 16px;
            height: calc( 100% - 174px);
            max-height: calc( 100% - 174px);
            overflow-y: hidden;
          }
          .page-wrap{
            margin-top: 16px;
            height: 40px;
          }
        }
      }
  }
</style>
