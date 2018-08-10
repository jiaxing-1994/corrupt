<template>
    <div id="search-result">
        <div id="head" class="clearfix">
          <div class="title-wrap clearfix">
            <div class="title-icon">
              <i class="fa fa-file-text"></i>
            </div>
            <div class="title">大数据检索</div>
          </div>
            <div class="search-wrap clearfix">
              <input class="search-ipt" type="text" v-model="keyword" placeholder="请输入检索内容" @keyup.13="searchTo()">
              <span class="search-btn" @click.stop.prevent="searchTo()">
                <i class="iconfont icon-sousuo"></i>
              </span>
            </div>
        </div>
        <div id="main-body" class="clearfix"   ref="mainBody" v-loading="tableLoad">
          <div id="sideMenu-wrap"  ref="sideMenuWrap" v-loading="isLoading">
            <div class="search-wrap">
              <input class="search-ipt"  type="text" v-model="titleKeyword" placeholder="请输入检索标题" @focus="inputTitle" @blur="searchBlur()" v-on:input="inputTitle" @keyup.13="searchTitle()">
              <span class="search-btn" @click.stop.prevent="searchTitle()">
              <i class="iconfont icon-sousuo"></i>
              </span>
              <ul v-show="tipTitleList.length > 0">
                <li v-for="(item, index) in tipTitleList" :key="index" @mousedown="searchTitle(item.name)">
                  <span v-text="item.name"></span>
                </li>
              </ul>
              <!--<datalist id="titleList">-->
                <!--<option  v-for="(item,index) in allTableList" :key="index" :value="item.name"></option>-->
              <!--</datalist>-->
            </div>
            <ul class="side-menu" id="sideMenu">
              <li class="menu-item" :class="{'menu-item-on':item.name == currMenuOn}" v-for="(item,index) in sideMenuList" :id="item.numId" @click.stop.prevent="currMenuIndex == index;checkResult(item.name,item.numId,item.hit,item.isLoad,index)">
                <div class="text" :title="item.name">{{item.name}}</div>
                <div class="hit">
                  <span >({{item.hit>999? '999+':item.hit}})</span>
                </div>
              </li>
            </ul>
          </div>
          <div id="result-wrap"  ref="resultWrap">
            <div class="no-data" v-show="header.length==0">
              <img v-show="noDataTip == 1" src="../../../assets/search/noData3.png" alt="">
              <img v-show="noDataTip == 2" src="../../../assets/search/noData1.png" alt="">
              <img v-show="noDataTip == 3" src="../../../assets/search/noData2.png" alt="">
              <img v-show="noDataTip == 4" src="../../../assets/search/noData4.png" alt="">
            </div>
            <div class="cue-list" ref="cueList" >
              <el-table v-show="header.length>0"
                :data="oTable"
                :max-height="tableH"
                :height="tableH"
                style="width: 100%">
                <el-table-column  v-for="(item,key) in header" :key=key
                                  :label=item
                                  min-width="200">
                  <template slot-scope="scope" >
                    <el-popover trigger="click" placement="top" >
                      <p style="width:350px; max-height: 250px; overflow: auto;" v-html="oTable[scope.$index][key]"></p>
                      <div style="height:100%" slot="reference" class="td-content" v-html="oTable[scope.$index][key]">
                        <!-- {{oTable[scope.$index][key]}} -->
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="详情"
                  width="60">
                  <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row)" type="text" size="medium"><i class="fa fa-file-text"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page-wrap" v-show="header.length>0">
              <el-pagination
                @current-change="pageTo"
                :page-size="pageSize"
                :current-page="currPage"
                layout="total, prev, pager, next, jumper"
                :total="totalPages">
              </el-pagination>
            </div>
          </div>
        </div>

      <!-- <el-dialog
        title="详情"
        :visible.sync="isShowBox"
        width="70%"
        top="10px">
        <div class="dialog-content">
          <table>
            <tr class="dialog-item" v-for="item in dialogData">
              <td class="item-box">{{item.name}}</td>
              <td class="item-box">{{item.value}}</td>
            </tr>
          </table>
        </div>
      </el-dialog> -->
      <transition name="fade">
        <div id="float-box" v-show="isShowBox" >
          <div class="dialog-content">
            <div class="dialog-header">
              <span class="dialog-title">详情</span>
              <span class="dialog-close" @click.stop.prevent="closeDialog"><i class="fa fa-times"></i></span>
            </div>
            <div class="dialog-table">
              <table>
                <tr class="dialog-item" v-for="item in dialogData">
                  <td class="item-box">{{item.name}}</td>
                  <td class="item-box" style="padding: 5px 20px" v-html="item.value"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </transition>

    </div>
</template>

<script>
export default {
  name:'searchResult',
  inject:['reload'],
  data(){
    return {
      tableH:0, //表格高度
      keyword: this.$route.query.keyword,
      titleKeyword: "",//标题关键字
      tipTitleList: [],//提示名称列表
      allTableList: [],//标题名称列表
      sideMenuList:[

      ],
      currMenuOn:'', //左边菜单当前选中
      header:[

      ],
      oTable:[

      ],
      pageSize:20,//每页多少条
      currPage:1, //当前页
      totalPages:0,//总页数
      isLoading:false,//是否在加载中
      noDataTip:1,   //无数据提示   1 --> 加载中, 2-->暂无数据 , 3-->单类数据加载, 4-->加载失败
      tableLoad:false, //表格是否加载
      loadCount:0,// 加载计数器
      currId :'', //当前表格查询ID；
      allDataReady:false,//索引表是否全部加载完毕
      currMenuIndex:0, //当前菜单选中索引
      hasHit:false,//是否有数据
      isInit:true,//是否首次加载
      source: null, // axios请求对象
      isShowBox:false,
      dialogData:[],
      currTableLoad:false,//当前表格是否在加载
      currTableIndex: -1,//当前请求表格的索引
    }
  },
  mounted(){
    let _this = this;
    _this.tableResize();//表格高度自适应
    _this.search();
  },
  methods:{
    searchBlur() {//搜索标题失焦
      this.tipTitleList = [];
    },
    inputTitle() {//输入标题
      let _this = this;
      let keyword = _this.titleKeyword;
      _this.tipTitleList = [];
      if(keyword) {
        for(let i = 0; i < _this.allTableList.length; i++) {
          if(_this.allTableList[i].name.indexOf(keyword) > -1) {
            _this.tipTitleList.push(_this.allTableList[i])
          }
        }
      }
    },
    searchTitle(name) {//检索标题
      let _this = this;
      let keyword = _this.titleKeyword;
      name = name || keyword;
      _this.sideMenuList = [];
      document.getElementById('sideMenu').scrollTop =0;
      if(keyword) {
        for(let i = 0; i < _this.allTableList.length; i++) {
          if(_this.allTableList[i].name.indexOf(name) > -1) {
            _this.sideMenuList.push(_this.allTableList[i])
          }
        }
      }else {
        _this.sideMenuList = _this.allTableList;
      }
    },
    //关闭弹层
    closeDialog(){
      this.isShowBox = false;
      this.dialogData = [];
    },
    //弹层显示具体内容
    showDetail(item){
      var _this = this;
      var content = [];
      for(var i = 0;i<item.length;i++){
        var obj = {};
        obj['name'] = _this.header[i];
        obj['value'] = item[i];
        console.log(item[i])
        content.push(obj);
      }
      this.dialogData = content;
      this.isShowBox = true;
    },
    //选择查询结果
    checkResult(currMenu,id,totalPage,isLoad,index,flag){
      let _this = this;
      _this.currMenuIndex=index;
      if(isLoad){
        _this.currTableLoad = true;
        _this.currTableIndex = index;
        _this.currMenuOn = currMenu;
        _this.noDataTip=3;
        _this.header = [];
        _this.oTable = [];
      }else {
        _this.currTableLoad = false;
        _this.currTableIndex = -1;
          if(flag === undefined){
            _this.currPage = 1;
            _this.currId = id;
            _this.currMenuOn = currMenu;
            _this.totalPages = totalPage;
            if( _this.totalPages>0){
              if(_this.isInit){
                let id = _this.currId;
                let outsideTop = document.getElementById('search-result').offsetTop; //整个组件偏移量
                let headTop = document.getElementById('head').scrollHeight;  //头部高度
                let sideMenuH = document.getElementById('sideMenu').clientHeight; //左边菜单容器高度
                let currItemTop = document.getElementById(id).offsetTop; //当前选中数据相对于浏览器的偏移高度
                let ItemOffsetTop = currItemTop-(outsideTop + headTop); //当前选中菜单 相对父元素的偏移高度
                if(sideMenuH <ItemOffsetTop){
                  document.getElementById('sideMenu').scrollTop = ItemOffsetTop;
                }
                _this.isInit = false;
              }
              _this.getTableData();
            }else {
              _this.noDataTip=2;
              _this.header = [];
              _this.oTable = [];
            }
          }else {
            if(totalPage != 0){
              _this.hasHit = true
            }else {
              _this.hasHit = false;
            }
          }
        }
    },
    //当前页搜索
    searchTo(){
      let _this = this;
      let _currKeyword = _this.$route.query.keyword;
      _this.cancel();
      if(!_this.keyword ==''){
        document.getElementById('sideMenu').scrollTop =0;
        this.$router.push({
          path:'/home/searchResult',
          query:{keyword:_this.keyword.trim()}
        });
        _this.reload();
      }else{
        _this.$message({
          message: '查询条件不能为空！',
          type: 'warning'
        });
        _this.keyword = _currKeyword;
      }
    },

    //全文检索
    search(){
      let _this = this;
      if(!_this.isLoading){
        _this.isLoading= true;
        _this.loadCount = 0;
        _this.source = _this.axios.CancelToken.source();
        _this.axios({
          method:'GET',
          url:webApi.Host + webApi.WebData.GetAllTables,
          cancelToken: _this.source.token,
        }).then((res)=>{
          _this.isLoading = false;
          if(res.data.code==0){
              let data = res.data.data;
              let arr = [];
              for( let key in data){
                let obj =  {};
                obj['name']=data[key];
                obj['numId'] = key;
                obj['hit'] = 0;
                arr.push(obj)
              }
              _this.sideMenuList = arr;
              _this.allTableList = arr;
              _this.keywordHit();

          }
        }).catch((err)=>{
          _this.isLoading = false;
          if(err.message.trim()!= '中断请求'){
            _this.$message({
              message: '发生错误',
              type: 'error'
            });
          }
        })
      }
    },


    //分页查询
    pageTo(page){
      let _this = this;
      _this.currPage = page;
      _this.getTableData()
    },
    //关键字命中
    keywordHit(){
      let _this = this;
      _this.isLoading= true;
      _this.source = _this.axios.CancelToken.source();
      _this.axios({
        method:'get',
        cancelToken:_this.source.token,
        url:webApi.WebData.SearchIndex.format({keywords:_this.keyword})
      }).then((res)=>{
        if(res.data.code == 0){
          if(res.data.data.length>0){
            let data = res.data.data;
            for(let i = 0;i<data.length;i++){
              for(let j = 0;j<_this.sideMenuList.length;j++){
                if(data[i]['_id'] == _this.sideMenuList[j]['numId'])
                {
                  _this.sideMenuList[j]['hit'] = data[i].amount;
                }
              }
            }
            for(let i =0;i<_this.sideMenuList.length;i++){
              _this.checkResult(_this.sideMenuList[i].name,_this.sideMenuList[i].numId,_this.sideMenuList[i].hit,_this.sideMenuList[i].isLoad, i,'1');
              if(_this.hasHit){
                _this.checkResult(_this.sideMenuList[i].name,_this.sideMenuList[i].numId,_this.sideMenuList[i].hit,_this.sideMenuList[i].isLoad, i);
                break
              }else if((_this.sideMenuList.length - 1)== i && _this.hasHit ==0 ){
                _this.checkResult(_this.sideMenuList[0].name,_this.sideMenuList[0].numId,_this.sideMenuList[0].hit,_this.sideMenuList[0].isLoad, 0);
              }
            }
          }
        }
        _this.isLoading= false;
      }).catch((err)=>{
        _this.isLoading= false;
      })
    },

    // keywordHit2(){
    //   let _this = this;
    //   let sjsybh = _this.sideMenuList[_this.loadCount].numId;
    //   _this.source = _this.axios.CancelToken.source();
    //   _this.axios({
    //     methods:'get',
    //     cancelToken: _this.source.token,
    //     url:webApi.WebData.SearchIndex.format({sjsybh:sjsybh,keywords:_this.keyword}),
    //   }).then((res)=>{
    //     if(res.data.code == 0){
    //       let data = res.data.data
    //       _this.sideMenuList[_this.loadCount]['hit'] = data.result;
    //       _this.sideMenuList[_this.loadCount]['isLoad'] =false;
    //
    //       if(_this.currMenuOn !='' && _this.currTableIndex != -1 &&  _this.currTableLoad){
    //         _this.currTableLoad = false;
    //         _this.currTableIndex = -1;
    //         _this.checkResult(_this.sideMenuList[_this.currMenuIndex].name,_this.sideMenuList[_this.currMenuIndex].numId,_this.sideMenuList[_this.currMenuIndex].hit,_this.sideMenuList[_this.currMenuIndex].isLoad,_this.currMenuIndex);
    //       }
    //       _this.loadCount += 1;
    //       if(_this.loadCount< _this.sideMenuList.length){
    //         _this.keywordHit()
    //         if(_this.loadCount == _this.sideMenuList.length -1){
    //           if(_this.currMenuOn !='' ){
    //             return
    //           }else {
    //
    //           }
    //         }
    //       }else {
    //         return
    //       }
    //
    //     }
    //   }).catch((err)=>{
    //    // if(err.message.trim()!= '中断请求'){
    //    //   _this.$message({
    //    //     message: '发生错误',
    //    //     type: 'error'
    //    //   });
    //    // }
    //   })
    // },

    //获取表格数据
    getTableData(){
      let _this = this;
      _this.tableLoad = true;
      _this.source= _this.axios.CancelToken.source();
      _this.axios({
        method:'get',
        cancelToken: this.source.token,
        url:webApi.WebData.SearchDetail.format({sjsybh:_this.currId,keywords:_this.keyword,p:_this.currPage,ps:_this.pageSize}),
        timeout: 1000 * 30,
      }).then((res)=>{
        _this.tableLoad = false;
        if(res.data.code==0){
          let header = [];
          let tbody = [];
          let data = res.data.data;
          if(data.length>0){
            for ( let key in data[0]){
              if(key.trim()!='表名称' && key.trim() !='经纬度'){
                header.push(key)
              }
            }
            for(let i=0;i<data.length ;i++){
              let arr = [];
              for(let val in data[i]){
                if(val.trim()!='表名称' && val.trim() !='经纬度'){
                  arr.push(data[i][val]);
                }
              }
              tbody.push(arr)
            }
            _this.header =  header;
            _this.oTable = tbody;
            console.log(_this.oTable);
          }else {
            _this.noDataTip=2;
            _this.header =  header;
            _this.oTable = tbody;
          }

        }else {
          _this.$message({
            message: res.errorMessage,
            type: 'error'
          });
        }
      }).catch((err)=>{
        _this.tableLoad = false;
        if(err.message.trim()!='中断请求'){
          _this.noDataTip = 4;
          _this.$message({
            message: '发生错误',
            type: 'error'
          });
        }
      })
    },
    //中断请求
    cancel() {
      if(this.source){
        this.source.cancel('中断请求')
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
  },
  // watch:{
  //   '$route.fullPath':function(){
  //     let _this = this;
  //     _this.tableResize();//表格高度自适应
  //     _this.search()
  //   }
  // }
}
</script>

<style lang="scss" scoped>
  #search-result{
    height: 100%;
    .fade-enter-active, .fade-leave-active{
      opacity: 1;
      transition: opacity .3s;
    }
    .fade-enter, .fade-leave-active{
      opacity: 0;
    }
    #float-box{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.3);
      z-index: 200;
      .dialog-content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        width: 80%;
        height: 80%;
        border-radius: 5px;
        min-width: 970px;
        .dialog-header{
          height: 50px;
          line-height: 50px;
          width: 100%;
          .dialog-title{
            font-size: 16px;
            margin-left: 20px;
          }
          .dialog-close{
            float: right;
            margin-right: 20px;
            color: #84d1db;
            cursor: pointer;
          }
        }
        .dialog-table{
          height: calc(100% - 50px);
          overflow: auto;
          table{
            border:solid 1px #ddd;
            width: 100%;
            .dialog-item{
              width: 100%;
              height: 30px;
              line-height: 30px;
              text-align: center;
              .item-box{
                display: inline-block;
                width: calc(50% - 0.5px);
              }
              .item-box:last-child{
                border-left: solid 1px #ddd;
              }
            }
            .dialog-item:nth-child(even){
              background: #ebebeb;
            }
          }
        }
      }
    }
    #head{
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
          font-size: 22px;
          color: #666666;

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
   #main-body{
     width: 100%;
     height: calc(100% - 50px);
     overflow: hidden;
     #sideMenu-wrap{
        float: left;
        height: 100%;
        width: 300px;
        border-right: 1px solid #E5E5E5;
       .side-menu{
         padding: 0;
         height: 100%;
         overflow-y: auto;
         color: #333333;
         font-size: 14px;
         -webkit-user-select: none;
         -moz-user-select: none;
         -ms-user-select: none;
         user-select: none;
         .menu-item{
           position: relative;
           height: 40px;
           line-height: 40px;
           padding:0 20px;
           width: 100%;
           cursor: pointer;
           -webkit-transition: all 0.2s;
           -moz-transition: all 0.2s;
           -ms-transition: all 0.2s;
           -o-transition: all 0.2s;
           transition: all 0.2s;
           .text{
             height: 100%;
             width: 200px;
             overflow: hidden;
             -ms-text-overflow: ellipsis;
             text-overflow: ellipsis;
             white-space: nowrap;
           }
           .hit{
            position: absolute;
             right: 0;
             top: 0;
             height: 40px;
             line-height: 40px;
             width: 60px;
             text-align: center;
             color: red;
           }
         }
         .menu-item:hover{
           background: rgba(41, 255, 24, 0.16);
         }
         .menu-item-on{
           background: rgba(41, 255, 24, 0.16);
           color: #3bcb00;
         }
       }
       /*搜索框*/
       .search-wrap{
         position: relative;
         background: #FFFFFF;
         height: 42px;
         width: 90%;
         margin-top: 4px;
         margin-left: 5%;
         border: 1px solid #dcdcdc;
         -webkit-border-radius: 8px;
         -moz-border-radius: 8px;
         border-radius: 8px;
         .search-ipt{
           width: calc( 100% - 48px);
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
         /*提示框*/
         ul {
           position: absolute;
           top: 46px;
           left: 0;
           width: 100%;
           background-color: #fff;
           z-index: 2;
           padding: 10px 0;
           font-size: 14px;
           max-height: 300px;
           overflow-y: auto;
           border: 1px solid darkgray;
           li {
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             height: 30px;
             line-height: 30px;
             padding: 0 15px  15px;
             &:hover {
               background-color: rgba(221,255,218,0.83);
               cursor: pointer;
             }
           }
         }
       }
     }
     #result-wrap{
       float: left;
       height: 100%;
       width: calc(100% - 300px);
       .no-data{
         display: flex;
         height: 100%;
         width: 100%;
         align-items:center;
         justify-content:center;
         .text{
           font-size: 30px;
           font-weight: 800;
           color: #CCCCCC;
         }
       }
       .cue-list{
         height: calc(100% - 64px);
          .td-content{
            /deep/ p{
                margin-top: 0px!important;
                text-indent: 0em!important;
                text-align: left!important;
                /deep/ span{
                  font-size: 14px!important;
                  color: #606266!important;
                  font-family: '微软雅黑'!important;
                }
            }
          }
       }
       .page-wrap{
         margin-top: 24px;
         height: 40px;
       }
     }

   }
  }

  @media (max-width: 1440px) {
    #search-result{
      #head{
        height: 40px;
        line-height: 40px;
        /*标题*/
        .title-wrap{
          .title-icon{
            width: 40px;
            font-size: 18px;
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
      #main-body{
        height: calc( 100% - 40px);
        #sideMenu-wrap{
          .side-menu{
            .menu-item{
              height: 32px;
              line-height: 32px;
              .text{
              }
              .hit{
                height: 30px;
                line-height: 30px;
              }
            }
            .menu-item:hover{
            }
            .menu-item-on{
            }
          }
          /*搜索框*/
          .search-wrap{
            height: 32px;
            .search-ipt{
              width: calc( 100% - 38px);
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
            /*提示框*/
            ul {
              position: absolute;
              top: 36px;
              left: 0;
            }
          }
        }
        #result-wrap{
          .cue-list{
            height: calc(100% - 56px);
            .td-content{
              /deep/ p{
                  margin-top: 0px!important;
                  text-indent: 0em!important;
                  text-align: left;
                  /deep/ span{
                    font-size: 14px;
                    color: #606266;
                    font-family: '微软雅黑';
                  }
              }
            }
          }
          .page-wrap{
            margin-top: 16px;
            height: 40px;
          }
        }
      }
    }
  }
</style>
