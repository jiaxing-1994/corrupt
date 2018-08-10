<template>
  <div id="wordCloud_main" style="width: 100%;height: 250px;" v-loading="isLoading"></div>
</template>

<script>
    export default {
        name: "word-cloud",
        data() {
          return {
            optionData: "",
            isLoading: false,
            myChart: null,
            cloudData:[], //文字云数据
          }
        },
        methods : {
          //初始化
          initCloud(){
            var _this = this;
            if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
              this.myChart.dispose();
            }
            this.myChart = this.echarts.init(document.getElementById('wordCloud_main'));
            this.myChart.setOption({
              title:{
                text:'活跃关键词',
                top: 'top',
                left:'center'
              },
              tooltip:{},
              series: [{
                type: 'wordCloud',
                shape:'circle',
                left:'center',
                top:'center',
                right: null,
                bottom: null,
                sizeRange:[15,30],
                rotationRange:[-90,90],
                rotationStep:45,
                gridSize: 1,
                autoSize: {
                  enable: true,
                  minSize: 10
                },
                drawOutOfBound: false,
                textStyle:{
                  normal: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                  }
                },
                data:_this.cloudData
              }]
            })
          },
          //获取数据
          getData(){
            var _this = this;
            _this.isLoading = true;
            var data = [];
            _this.axios({
              url: webApi.Host + webApi.Clue.GetWebClueKeywordFreq,
              timeout: 15000,
            }).then(function(res){
                if(res.data.code==0) {
                  _this.isLoading = false;
                  for(var i = 0; i<res.data.data.length; i++){
                    var item = {};
                    item['name'] = res.data.data[i].Key;
                    item['value'] = res.data.data[i].Value;
                    data.push(item);
                  }
                  _this.cloudData = data;
                  _this.initCloud();
                }
              }).catch(function(err) {
              _this.isLoading = false;
              console.log(err)
            })
          },
          //窗口改变重绘图表
          resizeWindow() {
            let _this = this;
            window.addEventListener('resize',_this.initCloud)
          },
        },
        mounted() {
          this.getData();//初始化图表
          this.resizeWindow();
        },
        destroyed() {
          window.removeEventListener('resize',this.initCloud);
        }
    }
</script>

<style scoped>

</style>
