<template>
    <div id="info">
        <div id="tool-bar" :class="isHidden?'hidden-box':''">
          <div class="check-wrap">
            <!-- <el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkall" @change="handleCheckAllChange">全选</el-checkbox> -->
            <el-checkbox-group class="check-group" v-model="checkedTable" @change="handleCheckedCitiesChange">
              <el-checkbox class="check-item" v-for="table in allTableName" :label="table" :key="table">{{table}}</el-checkbox>
            </el-checkbox-group>
            <div class="switch-btn" @click="hiddenBtn">
              <i v-show="!isHidden" class="fa fa-angle-double-left"></i>
              <i v-show="isHidden" class="fa fa-angle-double-right"></i>
            </div>
          </div>
          <div class="list-wrap">
            <div class="list-check-wrap clearfix" v-show="checkedTable.length>0">
              <div class="title-label">
                表名:
              </div>
              <div class="title" @click.stop.prevent="checkTableModal">
                {{currTableName}}
              </div>
              <div class="check-btn" :class="{ 'check-on':listCheckShow}" @click.stop.prevent="checkTableModal">
                <i class="el-icon-d-caret"></i>
              </div>
              <check-box class="list-check-box" :table-names = 'checkedTable' :curr-table="currTableName" @currTable="tableChecked" v-show="listCheckShow"   @click.stop.prevent></check-box>
            </div>
            <div class="curr-list-wrap" v-loading="isLoad">
                <div class="cue-list" ref="cueList" >
                    <el-table
                      v-show="header.length>0 && checkedTable.length>0"
                      :data="oTable"
                      :max-height="tableH"
                      :height="tableH"
                      style="width: 100%">
                      <el-table-column  v-for="(item,key) in header" :key=key
                        :label=item
                        min-width="150">
                        <template slot-scope="scope" >
                          <div class="td-content" :title=oTable[scope.$index][key]>
                            {{oTable[scope.$index][key]}}
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="60">
                        <template slot-scope="scope">
                          <el-button @click="moveToCenter(scope)" type="text" size="medium"><i class="fa fa-location-arrow"></i></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                <div class="page-wrap" v-show="currIdArr.length>0">
                  <el-pagination
                    @current-change="pageTo"
                    :page-size="pageSize"
                    :current-page="page"
                    layout="prev, pager, next"
                    :total="totalPages">
                  </el-pagination>
                </div>
            </div>
          </div>
        </div>
        <div id="map-bar">
            <light-map :tableId="currIdArr"></light-map>
        </div>
    </div>
</template>

<script>
import lightMap from '../../pubilcComponents/toolComponets/lightMap'
import checkBox from '../../pubilcComponents/toolComponets/tableCheckBox'
export default {
    components:{lightMap,checkBox},
    data(){
        return{
          checkall: false,
          checkedTable: ['重点排污单位环境信息'],
          isIndeterminate: true,
          header:[ //表头

          ],
          oTable:[ //渲染表格

          ],
          tableH:0, //表格高度,
          allTableName:['重点排污单位环境信息','生活垃圾焚烧厂一览表','危险化学品企业信息','非国家重点监控企业污染源监督性监测结果','深圳市自然灾害室内应急避难场所',
          '国家重点监控企业污染源监督性监测结果','湿地公园','自然保护区','森林公园'],//所有表格名称
          allTableId:{
            '重点排污单位环境信息':'289569672',
            '生活垃圾焚烧厂一览表':'664369253',
            '危险化学品企业信息':'886003415',
            '非国家重点监控企业污染源监督性监测结果':'982575290',
            '深圳市自然灾害室内应急避难场所':'1341555166',
            '国家重点监控企业污染源监督性监测结果':'59049102',
            '湿地公园':'789079836',
            '自然保护区':'1301452358',
            '森林公园':'789087524',
            // '危险废物产生企业信息':'1265508712'
          },
          currId:'',//当前表格编号
          currIdArr:['289569672'],//所选表格ID集
          page:1, //页码
          pageSize: 20,//每页条数
          totalPages:0, //总条数
          pagecount:3,
          isLoad:false,//数据是否在加载
          currTableName:'重点排污单位环境信息',  //当前展示的表格名称
          listCheckShow:false,//是否显示表格选择框
          isHidden:false, //是否显示左边操作框
        }
    },
  mounted(){
    let _this = this;
    _this.tableResize();//表格高度自适应
    _this.returnId(); //返回所选表格ID
    _this.changeId(); //切换表格
    _this.getData(); // 获取表格数据
    _this.getTotalPage(); //获取总页数
    window.onclick=function(){
      _this.listCheckShow = false;
    }
  },
  methods:{
    //是否显示左边操作框
    hiddenBtn(){
      this.isHidden = !this.isHidden;
    },
    //移动地图
    moveToCenter(scope){
      var data = scope.row;
      var name = scope.store.states.columns;
      var position = '';
      for(var i = 0;i<name.length;i++){
        if(name[i].label == '经纬度'){
          position = data[i];
        }
      }
      if(position == ''||position == null){
        this.$message({
          message:'暂无此坐标',
          type:'error'
        })
        return;
      }else{
        var obj = position.split(',');
        obj[0] = parseFloat(obj[0]);
        obj[1] = parseFloat(obj[1]);
        this.$root.Bus.$emit('moveToCenter',obj);
      }
    },
    //  切换当前ID(切换当前表)
    changeId(){
      let _this = this;
      _this.currId = _this.allTableId[_this.currTableName];
    },

    //  全选
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.allTableName : [];
      this.isIndeterminate = false;
    },
    //表格选择
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkall = checkedCount === this.allTableName.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allTableName.length;
      this.returnId();
      var _this = this;
      var isTrue = false;
      if(value.length > 0){
        for(var i in value){
          if(value[i] == _this.currTableName){
            isTrue = true;
            return;
          }
        };
        if(!isTrue){
          _this.currTableName = value[0];
          _this.currId = _this.allTableId[value[0]];
          _this.page= 1;
          _this.getTotalPage();
          _this.getData();
        }
      }
    },

    //返回当前所选表格编号
    returnId(){
      let _this = this;
      let arr = [];
      if(_this.checkedTable.length>0){
        for(let index in _this.checkedTable){
          arr.push(_this.allTableId[_this.checkedTable[index]]);
        }
        _this.currIdArr = arr;
      }else if(_this.checkedTable.length == 0){
        _this.currIdArr =[];
      }

    },
    //获取当前表格数据
    getData(){
      let _this = this;
      if(!_this.isLoad){
        _this.isLoad = true;
        let url =  webApi.WebData.GetData.format({sjsybh:_this.currId,p:_this.page,ps:_this.pageSize});
        _this.axios({
          method:'GET',
          url:url
        }).then((res)=>{
          _this.isLoad = false;
          if(res.data.code == 0){
            let header = [];
            let tbody = [];
            let data = res.data.data
            for ( let key in data[0]){
              if(key.trim()!='表名称') {
                header.push(key)
              }
            }
           for(let i=0;i<data.length ;i++){
             let arr = [];
             for(let val in data[i]){
               if(val.trim()!='表名称' ){
                 arr.push(data[i][val]);
               }
             }
             tbody.push(arr)
           }
           _this.header =  header;
           _this.oTable = tbody;
          }

        }).catch((err)=>{
          _this.isLoad = false;
        })
      }
    },
    //获取总页数
    getTotalPage(){
      let _this = this;
        let url =  webApi.WebData.CountData.format({sjsybh:_this.currId})
        _this.axios({
          method:'GET',
          url:url
        }).then((res)=>{
          if(res.data.code == 0){
            _this.totalPages = res.data.data
          }
        }).catch((err)=>{
        })
    },

    //页码跳转
    pageTo(val){
      let _this = this;
      _this.page = val;
      _this.getData();
    },

    //表格选择弹出
    checkTableModal(){
      let _this = this;
     if(_this.checkedTable.length>1){
       _this.listCheckShow = !_this.listCheckShow
     }
    },
    //表格选择
    tableChecked(curr){
      let _this = this;
      _this.currTableName = curr;
      _this.changeId()
      _this.page= 1;
      _this.getData();
      _this.getTotalPage();
      _this.listCheckShow = false;
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
#info{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .hidden-box{
      left: -400px!important;
    }
    #tool-bar{
      position: absolute;
      width: 400px;
      height: 100%;
      top:0;
      left: 0;
      z-index: 161;
      transition: all .3s;
      .head{
        height: 50px;
        width: 100%;
        background: #EEEEEE;
        border-bottom: 1px solid #dcdcdc;
        .search-wrap{
          float: right;
          background: #FFFFFF;
          height: 42px;
          width: 300px;
          margin-right: 30px;
          margin-top: 4px;
          border: 1px solid #dcdcdc;
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          border-radius: 8px;
          .search-ipt{
            width: 260px;
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
            width: 38px;
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
      .check-wrap{
        height: 200px;
        max-height: 200px;
        padding: 10px;
        background: #fff;
        position: relative;
        .switch-btn{
          position: absolute;
          width: 40px;
          height: 40px;
          top: 0px;
          right: -40px;
          text-align: center;
          line-height: 40px;
          background: #f4f4f4;
          color: #00a65a;
          font-size: 25px;
          cursor: pointer;
          box-shadow: 2px 0px 10px #e0e0e0;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .check-all{
          margin-bottom: 10px;
        }

        .check-group{
          padding-top: 4px;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          .check-item{
            display: block;
            box-sizing: content-box;
            padding: 0 10px;
            margin-left:0;
            margin-bottom: 4px;
            max-width: 100%;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
      }
      .list-wrap{
        height:calc(100% - 200px);
        background: #fff;
        .list-check-wrap{
          position: relative;
          height: 40px;
          border-top: 1px solid #e4e7ed;
          border-bottom: 1px solid #e4e7ed;
          font-size: 16px;
          text-align: center;
          line-height: 38px;
          .title-label{
            float: left;
            width: 80px;
            background: #E5E5E5;
            height: 100%;
          }
          .title{
            float: left;
            width: calc( 100% - 120px);
            max-width: calc( 100% - 120px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 20px;
            color: #f60;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background: #fff;
          }
          .check-btn{
            height: 100%;
            float:right;
            width: 40px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            background: #E5E5E5;
            cursor: pointer;
          }
          .check-on,
          .check-btn:hover{
            color: #f60;
          }
          .list-check-box{
            top: 39px;
          }
        }
        .curr-list-wrap{
          height: calc(100% - 40px);
          .cue-list{
            height: calc(100% - 50px);
          }
          .page-wrap{
            height: 50px;
            .el-pagination{
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          }
        }
      }
    }
    #map-bar{
        width: 100%;
        height: 100%;
    }
}

  @media (max-width: 1440px) {
    #info{
      #tool-bar{
        .head{
          height: 40px;
          .search-wrap{
            height: 32px;
            .search-ipt{
              font-size: 14px;
            }
            .search-btn{
              line-height: 32px;
            }
            .search-btn:after{
              left: 0;
              top: 8px;
              width: 2px;
              height: 14px;
            }
          }
        }
        .check-wrap{
          .check-group{

            .check-item{

            }
          }
        }
        .list-wrap{
          .list-check-wrap{
            height: 30px;
            font-size: 14px;
            line-height: 29px;
            .title-label{

            }
            .title{

            }
            .check-btn{
            }
            .check-btn:hover{
            }
            .list-check-box{
              top: 29px;
            }
          }
          .curr-list-wrap{
            height: calc(100% - 30px);
            .cue-list{
            }
          }
        }
      }
      #map-bar{

      }
    }
  }
</style>
