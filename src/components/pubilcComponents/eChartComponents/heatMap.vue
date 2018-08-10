<template>
  <div id="heatmap_main" ref="heatmap" style="width: 100%;height: 700px;" v-loading="isLoading">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        optionData: "",
        isLoading: false,
        myChart: "",
      }
    },
    methods : {
      //图表初始化
      initChart() {
        if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
          this.myChart.dispose();
        }
        let myChart = echarts.init(document.getElementById('heatmap_main'));
        let option =  this.getOption();
        myChart.setOption(option);
        this.myChart = myChart;
      },
      getChinaData() {
        let _this = this;
        let data = [];
        _this.isLoading = true;
        _this.axios({
          url: (webApi.News.GetCityFreq).format({
            province: ""
          }),
          timeout: 15000,
        })
          .then(function(res){
            if(res.data.code==0) {
              res.data.data.forEach(function(item,index){
                if(item.JWD) {
                  let x = item.JWD.split(",")[0];
                  let y = item.JWD.split(",")[1];
                  let val = item.PC;
                  data.push([x, y, val]);
                }
              });
              _this.optionData = data;
              _this.initChart();//初始化图表
              _this.isLoading = false;
              _this.resizeWindow();
            }
          }).catch(function(err) {
          _this.isLoading = false;
          console.log(err)
        })
      },
      //获取option设置
      getOption() {
        let _this = this;
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          title: {
            text: "全国检察机关公益诉讼新闻热力图",
            left: 'center',
            textStyle: {
              color: '#000',
              fontSize: 18
            }
          },
          backgroundColor: '#fff',
          visualMap: {
            show: false,
            min: 0,
            max: 300,
            splitNumber: 50,
            inRange: {
              // color: ['#d94e5d','#eac736','#50a3ba'].reverse()
              color: ['blue', 'green', 'yellow', 'red']
            },
            textStyle: {
              color: '#000'
            }
          },
          geo: {
            map: 'china',
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
            roam: false,
            scaleLimit: {
              max: 2,
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
              name: 'china',
              type: 'heatmap',
              coordinateSystem: 'geo',
              data: _this.optionData,
              center: [ '50%' , '50%'],
            },
            {
              geoIndex: 0,
              type: 'map',
              data: [
                {name: '北京'},
                {name: '天津'},
                {name: '上海'},
                {name: '重庆'},
                {name: '河北'},
                {name: '河南'},
                {name: '云南'},
                {name: '辽宁'},
                {name: '黑龙江'},
                {name: '湖南'},
                {name: '安徽'},
                {name: '山东'},
                {name: '新疆'},
                {name: '江苏'},
                {name: '浙江'},
                {name: '江西'},
                {name: '湖北'},
                {name: '广西'},
                {name: '甘肃'},
                {name: '山西'},
                {name: '内蒙古'},
                {name: '陕西'},
                {name: '吉林'},
                {name: '福建'},
                {name: '贵州'},
                {name: '广东'},
                {name: '青海'},
                {name: '西藏'},
                {name: '四川'},
                {name: '宁夏'},
                {name: '海南'},
                {name: '台湾'},
                {name: '香港'},
                {name: '澳门'}
              ],
            },
          ],
        };
        return option;
      },
      //窗口改变重绘图表
      resizeWindow() {
        let _this = this;
        window.addEventListener('resize',_this.initChart);
      },
    },
    mounted() {
      this.getChinaData();
    },
    destroyed() {
      window.removeEventListener('resize',this.initChart);
    }
  }
</script>

<style lang="scss" scoped>

</style>
