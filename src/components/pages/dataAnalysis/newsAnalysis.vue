<template>
  <div id="newsAnalysis">
    <div class="newsAnalysis_header">
      <div class="header_left">
        检察机关公益诉讼新闻热力图
      </div>
      <!--<div class="header_right">-->
        <!--<el-form :inline="true" class="header_form">-->
          <!--<el-form-item >-->
            <!--<i  class="fa fa-th"></i>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="选择省份 :">-->
            <!--<area-select style="line-height: 100%;margin-top: 4px;" class="provinces_select" :level="0" type="text" :data = "pcaa" v-model="citySelected"></area-select>-->
            <!--&lt;!&ndash;<el-select class="provinces_select" v-model="provinces_select">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-option v-for="(item,index) in provinces" :key="index" :label="item.DM" :value="item.DM"></el-option>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
          <!--</el-form-item>-->

          <!--<el-form-item >-->
            <!--<el-input  class="provinces_search" v-model="provincesSearch" placeholder="搜索省份">-->
              <!--<i  slot="suffix" class="provinces_icon iconfont icon-sousuo" @click="search"></i>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
    </div>
    <div id="newsAnalysis_body" v-loading="isLoading">
      <div id="newsAnalysis_main" ref="heatmap">
      </div>
      <div class="map_return"  v-show="isReturn" @click="returnChina">
        <i class="fa fa-reply"></i>
        返回上级地图
      </div>
      <ul id="region_list_header" ref="listHeader">
        <li>
          <p>{{listName}}</p>
          <p>总量/条</p>
        </li>
      </ul>
      <ul id="region_list" ref="listBody" >
        <li v-for="(item,index) in freqData" :key="index">
          <p v-text="item.DM"></p>
          <p v-text="item.PC"></p>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
  import { pca, pcaa } from 'area-data';
  export default {
    data() {
      return {
        moveData: [],//移入data
        optionData: "",//热力图配置数据(经纬度、频次)
        isLoading: false,
        mapType: 'china',//地图类型
        mapTitle: '全国',//地名名称
        listName: "省份",//
        max: '',//
        isReturn: false,//返回按钮显示
        provinces_select: '',//选择省份
        provinces: "",//省份
        provincesSearch: "",//搜索省份,
        freqData: "",//地区频次数据
        clickMapStatus: true,//点击省份
        myChart: "",
        pca: pca,
        pcaa: pcaa,
        citySelected:[],
        maxVal: 0,//最大值
        splitNumber:  1,//分割
      }
    },
    methods : {
      //图表初始化
      initChart() {
        if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
          this.myChart.dispose();
        }
        let myChart = echarts.init(document.getElementById('newsAnalysis_main'));
        let option =  this.getOption();
        let _this = this;
        myChart.setOption(option);
        this.myChart = myChart;
        if(this.clickMapStatus) {
          _this.echartClick(myChart);//添加点击省份
        }
      },
      getChinaData() {
        let _this = this;
        let data = [];//热力图数据,经纬度、频次
        // let moveData = [];
        let listBody = _this.$refs.listBody;
        let province = _this.mapType;
        if(_this.mapType=="china") {
          province = "";
        }
        _this.isLoading = true;
        listBody.style.overflowY="hidden";
        _this.axios({
          url: (webApi.News.GetCityFreq).format({
            province: province
          }),
          timeout: 10000,
        })
          .then(function(res){
            if(res.data.code==0) {
              _this.maxVal = 0;
              _this.freqData = res.data.data;
              if(!_this.provinces) {
                _this.provinces = res.data.data;
              }
              res.data.data.forEach(function(item,index){
                if(item.JWD) {
                  let x = item.JWD.split(",")[0];
                  let y = item.JWD.split(",")[1];
                  let val = item.PC;
                  if(val > _this.maxVal) {
                    _this.maxVal = val;
                  }
                  data.push([x, y, val]);
                }
              });
              _this.optionData = data;
              _this.initChart();//初始化图表
              _this.isLoading = false;
              listBody.style.overflowY="auto";
              _this.resizeWindow();
              _this.$nextTick(()=>{
                _this.hasScroll();
              })
            }
          }).catch(function(err) {
          _this.isLoading = false;
          listBody.style.overflowY="auto";
          console.log(err)
        })
      },
      //点击
      echartClick(myChart) {
        let _this = this;
        if(_this.clickMapStatus) {
          myChart.on('click', function (params) {
            if(params.name!="台湾"&&params.name){
              _this.mapType = params.name;
              _this.mapTitle = params.name;
              _this.listName = '市区';
              _this.clickMapStatus = false;//设置点击状态(为true则添加点击事件)
              _this.getChinaData();//获取数据
              _this.isReturn = true;//返回全国地图
            }
          });
        }
      },
      returnChina() {//返回中国地图
        this.mapType = 'china';
        this.mapTitle = "全国";
        this.listName = '省份';
        this.clickMapStatus = true;
        this.getChinaData();
        this.isReturn = false;
      },
      //获取option设置
      getOption() {
        let _this = this;
        let maxVal = _this.maxVal;
        let splitNum;
        if(_this.maxVal>=500) {
          maxVal = 300;
          splitNum = 50;
        }else if(_this.maxVal>=100) {
          maxVal = 50;
          splitNum = 1;
        }else {
          splitNum = 1;
        }
        if(_this.listName=="市区"){
          splitNum = 1;
        }
        if(_this.mapType=="重庆"){
          splitNum = 50;
          maxVal = 10000;
        }
        var option = {
          tooltip: {
            trigger: 'item',
            // formatter: "{b}"
            formatter: function(params){
              for(let i=0;i<_this.freqData.length;i++){
                if(_this.freqData[i].DM==params.name){
                  params.value = _this.freqData[i].PC;
                  break;
                }
              }
              if(params.name&&params.value&&params.name!="台湾"){
                return params.name+" : "+params.value
              }else if(params.name&&params.name!="台湾") {
                return params.name;
              }
            }
          },
          title: {
            text: _this.mapTitle,
            left: 'center',
            textStyle: {
              color: '#000',
            }
          },
          backgroundColor: '#fff',
          visualMap: {
            show: false,
            min: 0,
            max: maxVal,
            splitNumber: splitNum,
            inRange: {
              // color: ['#d94e5d','#eac736','#50a3ba'].reverse()
              color: ['blue', 'green', 'yellow', 'red']
            },
            textStyle: {
              color: '#000'
            },
          },
          geo: {
            map: _this.mapType,
            label: {
              normal:{
                show:true,
                textStyle:{
                  color:'#fff',
                  fontSize:13
                }
              },
              emphasis: {
                color: '#fff'
              }
            },
            roam: true,
            scaleLimit: {
              max: 1.3,
              min: .7
            },
            itemStyle: {
              normal: {
                // areaColor: '#3f7696',
                areaColor: '#a4d2ec',
                borderColor: '#3f7696'
              },
              emphasis: {
                areaColor: '#3f7696'
              }
            }
          },
          series: [
            {
            name: _this.mapType,
            type: 'heatmap',
            coordinateSystem: 'geo',
            data: _this.optionData,
            center: [ '50%' , '50%'],
            },
            {
              name: _this.mapTitle,
              geoIndex: 0,
              type: 'map',
              data: _this.moveData,
            },
          ],
        };
        return option;
      },
      //设置省市区
      setRegion() {
        let _this = this;
        this.axios({
          url: '@/../static/echarts/mapName.json'
        }).then(function(res){
          _this.moveData = res.data;
        })
      },
      //窗口改变重绘图表
      resizeWindow() {
        let _this = this;
        window.addEventListener('resize',_this.initChart);
      },
      //判断是否有滚动条
      hasScroll() {
        let listHeader = this.$refs.listHeader;
        let listBody = this.$refs.listBody;
        let height = listBody.getElementsByTagName('li').length*40;
        let bodyHeight = parseInt(window.getComputedStyle(listBody,null).height);
        if(height > bodyHeight) {
          listHeader.style.paddingRight = '17px';

        }else {
          listHeader.style.paddingRight = '0px';
        }
      },
      search() {//搜索省份
        console.log(1)
      }
    },
    mounted() {
      this.getChinaData();
      this.setRegion();
    },
    watch: {
      provinces_select() {
        console.log(this.provinces_select)
      }
    },
    destroyed() {
      window.removeEventListener('resize',this.initChart);
    }
  }
</script>

<style lang="scss" scoped>
  #newsAnalysis {
    position: relative;
    height: 100%;
    font-size: 16px;
    /*头部*/
    .newsAnalysis_header {
      height: 60px;
      background-color: #c0ecaa;
      .header_left {
        float: left;
        height: 60px;
        width: 60%;
        line-height: 60px;
        font-size: 18px;
        text-align: center;
        font-weight: bold;
      }
      .header_right {
        float: right;
        width: calc(40% - 16px);
        height: 100%;
        .header_form {
          margin-top: 10px;
          .el-form-item {
            margin-bottom: 0;
            .provinces_search {
              width: 110px;
              .provinces_icon {
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
    /*内容*/
    #newsAnalysis_body {
      position: relative;
      height: calc(100% - 60px);
      padding: 16px;
      #newsAnalysis_main {
        float: left;
        height: 100%;
        width: 60%;
      }
      .map_return {
        position: absolute;
        top: 25px;
        left: 25px;
        &:hover {
          cursor: pointer;
          color: #00a0e9;
          user-select: none;
        }
      }
      #region_list {/*地区列表*/
        float: right;
        font-size: 14px;
        width: calc(40% - 16px);
        height: calc(100% - 40px);
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        li {
          border-bottom: 1px solid #dcdcdc;
          border-left: 1px solid #dcdcdc;
          border-right: 1px solid #dcdcdc;
          height: 40px;
          line-height: 40px;
          box-sizing: border-box;
          &:nth-child(even) {
            background-color: #eee;
          }
          /*&:first-child {*/
            /*background-color: #c0ecaa;*/
            /*border-top: 1px solid #dcdcdc;*/
          /*}*/
          p {
            position: relative;
            display: inline-block;
            width: 50%;
            text-align: center;
            margin-right: -4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:first-child {
              &:after {
                position: absolute;
                right: 0;
                top: 0;
                content: "";
                height: 100%;
                width: 1px;
                background-color: #dcdcdc;
              }
            }
          }
        }
      }
      #region_list_header {
        @extend  #region_list;
        overflow: hidden;
        height: auto;
        background-color: #c0ecaa;
        li {
          background-color: #c0ecaa;
          border-top: 1px solid #dcdcdc;
        }
      }
    }
  }
@media (max-width: 1440px) {
  #newsAnalysis {
    /*头部*/
    .newsAnalysis_header {
      height: 50px;
      .header_left {
        height: 50px;
        width: 60%;
        line-height: 50px;
      }
      .header_right {
        width: calc(40% - 16px);
        .header_form {
          margin-top: 5px;
        }
      }
    }
    /*内容*/
    #newsAnalysis_body {
      height: calc(100% - 50px);
    }
  }
}
</style>
