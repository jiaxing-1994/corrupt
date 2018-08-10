<template>
  <div id="internetCue">
    <div class="internet-cue-head clearfix">
      <div class="title-wrap clearfix">
        <div class="title-icon">
          <i class="iconfont icon-changyonglogo46"></i>
        </div>
        <div class="title">互联网线索</div>
      </div>
      <div class="search-wrap clearfix">
        <input class="search-ipt" type="text" v-model="keyword" placeholder="请输入内容" @keyup.13="getInternetCueList">
        <span class="search-btn" @click="getInternetCueList()">
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
      <div class="cue-filter-wrap">
          <div class="cue-source clearfix">
            <div class="left-title">
                <i class="iconfont icon-caiji"></i>
                采集网站:
            </div>
            <div class="right" >
              <div v-show="siteList.length>0" class="site-check-btn" :class="{'site-check-btn-on':siteCheckShow}"  @click.stop.prevent="siteModal">
                <i class="el-icon-d-caret"></i>
              </div>
              <span v-show="siteList.length>0" class="curr-site" v-text="site==''?'全部':site" @click.stop.prevent="siteModal"></span>
              <check-box class="site-check-box" :site-list = 'siteList' :curr-site="site" @currSite="currSite" v-show="siteCheckShow"  @click.stop.prevent></check-box>
              <span v-show="siteList.length==0">无</span>
            </div>
          </div>
          <div class="cue-sort clearfix">
            <div class="left-title">
              <i class="iconfont icon-paixu01"></i>
              排序字段:
            </div>
            <div class="right">
                <div class="sort-item" :class='{"sort-item-on":order== "cjsj"}' @click="clueOrder('cjsj')">采集时间</div>
                <div class="sort-item" :class='{"sort-item-on":order== "fbsj"}' @click="clueOrder('fbsj')">发布时间</div>
                <div class="sort-item-tip">(倒序排列)</div>
            </div>
          </div>
      </div>
      <div class="cue-list" ref="cueList" v-loading="isLoad">
        <el-table
          ref="oTable"
          :data=" internetCueList"
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
            prop="ZY"
            label="内容"
            min-width="300"
            >
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" >
                <!-- <p style="text-indent: 2em;">{{ scope.row.ZY }}</p> -->
                <div slot="reference" class="td-content">
                  {{ scope.row.ZY}}
                </div>
                <div style="width:300px; max-height: 200px; overflow: auto;" v-html="scope.row.ZY"></div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="FBSJ"
            label="发布时间"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            prop="CJSJ"
            label="采集时间"
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
            prop="XSLY"
            label="线索来源"
            width="150">
          </el-table-column>
          <el-table-column
            prop="GJC"
            label="关键词"
            width="200">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" >
                <p>{{ scope.row.GJC }}</p>
                <div slot="reference" class="td-content">
                  {{ scope.row.GJC}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="details(scope.$index,scope.row.XSBH ,scope.row.SFYD,'2',scope.row.GZBH)" title="详情" type="text" size="small"><i class="fa fa-file-text"></i></el-button>
              <el-button v-show="scope.row.SFGZ =='0'" title="未关注(关注)" @click="followClue(scope.row.XSBH ,'2')" style="color: #F66" type="text" size="small"><i class="fa fa-heart-o"></i></el-button>
              <el-button v-show="scope.row.SFGZ =='1'" title="已关注(取消关注)" @click="cancelFollowClue(scope.row.XSBH ,'2')" style="color: #F66" type="text" size="small"><i class="fa fa-heart"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap">
        <el-pagination
          @current-change="pageTo"
          :page-size="pageSize"
          :current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="totalPages">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  import checkBox from '../../pubilcComponents/toolComponets/checkBox'
  export default {
      name:'cue-list',
      components:{
          checkBox
        },
      data(){
        return{
          //来源地址
          outerVisible:false,
          siteList:[
          ],
          tableH:0, //表格高度
          internetCueList: [  //互联网线索列表

          ],
          typeList:[], //线索类型列表
          keyword:'',//查询列表关键字
          type:'', //线索类型
          page:1, //页码
          pageSize: 20,//每页条数
          totalPages:0,//总条数
          order:'fbsj',//排序方式
          site:'',//来源站点
          isLoad:false,//数据是否在加载
          siteCheckShow:false,//是否显示网站筛选框
        }
      },
    mounted(){
      let _this = this;
      localStorage.removeItem('cueList');
      localStorage.removeItem('cueIndex');
      localStorage.removeItem('pageNum');
      localStorage.removeItem('cueType');
      localStorage.removeItem('site');
      localStorage.removeItem('order');
      localStorage.removeItem('keyword');
      _this.tableResize();//表格高度自适应
      _this.getInternetCueList(); //获取互联网线索列表
      _this.getClueSites(); //获取来源网站
      _this.getClueType(); //获取线索类型
      window.onclick=function(){
        _this.siteCheckShow=false;
      }
    },

    methods:{
        //获取互联网线索列表
      getInternetCueList(){
        let _this = this;
       if(_this.isLoad ==false){
         _this.isLoad = true;
         let url = webApi.Clue.GetWebClues.format({keyword:_this.keyword,type:_this.type,site:_this.site,order:_this.order,p:_this.page,ps:_this.pageSize})
         _this.axios({
           method:'get',
           url:url,
           timeout:10000
         }).then(function(res){
           _this.isLoad = false;
           if(res.data.code == 0){
             let data = res.data.data.data;
             _this.totalPages = res.data.data.total
             _this.internetCueList = data;
           }else {
             _this.$message.error(res.data.errorMessage);
           }
         }).catch(function(err){
           _this.isLoad = false;
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

      //获取线索来源网站
      getClueSites(){
        let _this = this;
        _this.axios({
          method:'get',
          url:webApi.Host + webApi.Clue.GetClueSites
        }).then(function(res){
          if(res.data.code == 0){
            let data = res.data.data;
            _this.siteList = data;
          }else {
            _this.siteList = [];
          }
        }).catch(function(){

        })
      },
      //线索排序
      clueOrder(order){
        let _this = this;
       if(_this.isLoad == false){
         if(_this.order != order){
           _this.page = 1;
           _this.order = order;
           _this.getInternetCueList();
         }
       }
      },
      //网站来源筛选弹出框
      siteModal(){
          let _this = this;
          _this.siteCheckShow = !_this.siteCheckShow;
      },
      //按线索来源筛选
      // 当前选择的数据来源(网站) ----子传父
      currSite(site){
        let _this = this ;
        if(_this.site== site){
          return
        }else {
          _this.site = site;
          _this.siteCheckShow = false;
          _this.getInternetCueList();
        }
      },

      //按举报类型筛选
      clueTypeOder(type){
        let _this = this;
      if(_this.isLoad == false){
        if(_this.type!= type){
          _this.page = 1;
          _this.type = type;
          _this.getInternetCueList();
        }else{
          _this.type = '';
          _this.page = 1;
          _this.getInternetCueList();
        }
      }
      },

      // 页码跳转
      pageTo(curr) {
        let _this = this ;
        _this.page = curr;
        _this.getInternetCueList();
      },
      // 查看详情
      details(index,id,SFYD,xssjbly,GZBH){
        let _this = this;
        localStorage.setItem('cueList',JSON.stringify(_this.internetCueList));
        localStorage.setItem('cueIndex',index);
        localStorage.setItem('pageNum',_this.page);
        localStorage.setItem('cueType',_this.type);
        localStorage.setItem('site',_this.site);
        localStorage.setItem('order',_this.order);
        localStorage.setItem('keyword',_this.keyword);
        var param = {
          type:2,
          id:id
        }
        if(SFYD != 0){
          this.$router.push({
            path:'/home/cueDetail',
            query:param
          });
        }else {
          _this.axios({
            method:'POST',
            url:webApi.Clue.ClueRead.format({xssjbly:xssjbly,xsbh:id})
          }).then((res)=>{
            this.$router.push({
              path:'/home/cueDetail',
              query:param
            });
          }).catch((err)=>{
            this.$router.push({
              path:'/home/cueDetail',
              query:param
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
                  _this.getInternetCueList()
              }else {
                _this.$message({
                  showClose: true,
                  message: '发生错误,关注失败',
                  type: 'error',
                  duration:1000,
                });
              }
            }).catch(function(err){
              _this.$message({
                showClose: true,
                message: '发生错误,关注失败',
                type: 'error',
                duration:1000,
              });
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
              _this.getInternetCueList()
            }else {
              _this.$message({
                showClose: true,
                message: '发生错误,取消关注失败',
                type: 'error',
                duration:1000,
              });
            }
          }).catch(function(err){
            _this.$message({
              showClose: true,
              message: '发生错误,取消关注失败',
              type: 'error',
              duration:1000,
            });
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
  #internetCue{
    height: 100%;
    max-height:100%;
    min-width: 750px;
    overflow-y:hidden;
    .internet-cue-head{
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
            font-size: 26px;
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
      .cue-filter-wrap{
        margin-top: 24px;
        .cue-source,
        .cue-sort{
          height: 40px;
          line-height: 40px;
          border:1px solid #dcdcdc;
          .left-title{
            float: left;
            padding-left: 20px;
            height: 100%;
            width: 144px;
            background:#EEEEEE;
            font-size: 16px;
            color: #333;
            border-right: 1px solid #dcdcdc;
            .iconfont{
              font-size: 16px;
              font-weight: 800;
              margin-right: 10px;
            }
          }
          .right{
            position: relative;
            float: left;
            font-size: 16px;
            height: 100%;
            width: calc(100% - 144px);
            padding: 0 20px;
            color: #333;
            .site-check-box{
              top: 40px;
            }
            .curr-site{
              color: #FF6600;
              cursor: pointer;
            }
            .site-check-btn{
              display: inline-block;
              cursor:pointer;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            .site-check-btn-on{
              color: #FF6600;
            }
            .sort-item-tip{
              height: 100%;
              float: left;
              cursor: default;
            }
            .sort-item{
              height: 100%;
              float: left;
              margin-right: 40px;
              cursor: pointer;
              -webkit-transition: all 0.3s;
              -moz-transition: all 0.3s;
              -ms-transition: all 0.3s;
              -o-transition: all 0.3s;
              transition: all 0.3s;
            }
            .sort-item:hover,
            .sort-item-on{
              color: #FF6600;
            }
            .sort-item:last-child{
              margin-right: 0;
            }
          }
        }
        .cue-sort{
          border-top:none;
        }
      }
      .cue-list{
        margin-top: 24px;
        height: calc( 100% - 314px);
        max-height: calc( 100% - 314px);
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

    #internetCue{
      .internet-cue-head{
        height: 40px;
        line-height: 40px;
        /*标题*/
        .title-wrap{
          .title-icon{
            width: 40px;
            .iconfont{
              font-size: 22px;
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
              width: 86px;
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
        .cue-filter-wrap{
          margin-top: 16px;
          .cue-source,
          .cue-sort{
            height: 32px;
            line-height: 32px;
            border:1px solid #dcdcdc;
            .right{
              font-size: 14px;
              .site-check-box{
                top: 30px;
              }
            }
          }
          .cue-sort{
            border-top:none;

          }
        }
        .cue-list{
          margin-top: 16px;
          height: calc( 100% - 254px);
          max-height: calc( 100% - 254px);
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
