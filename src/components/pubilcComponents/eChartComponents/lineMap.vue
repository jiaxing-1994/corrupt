<template>
    <div id="main">
        <div id="chart-header">
            最近30天线索统计情况
        </div>
        <div id="line-chart-box" v-loading.lock="isLoad">
            <div id="lineChart"></div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            timeData:[], //时间线数据
            isLoad:false, //数据加载
            myChart:null, //图标
            cueTotal:[], //线索总量
            followCueTotal:[], //关注线索总量
            timeTotal:[], //时间总量
        }
    },
    mounted(){
        var _this = this;
        window.addEventListener('resize',_this.chartInit);
        this.oneMonthTime();
    },
    methods:{
        chartInit(){
            var _this = this;
            if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
              this.myChart.dispose();
            } 
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    x:'left',
                    data:['线索量','关注线索量']
                },
                toolbox: {
                    x:'right',
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: _this.timeTotal
                },
                yAxis:{
                    type: 'value'
                },
                series: [
                    {
                        name:'线索量',
                        type: 'line',
                        stack:'总量',
                        data:_this.cueTotal,
                    },
                    {
                        name:'关注线索量',
                        type: 'line',
                        stack:'总量',
                        data:_this.followCueTotal,
                    }
                ]
            }
            var chart = document.getElementById('lineChart');
            var width = document.getElementById('line-chart-box').clientWidth;
            var height = document.getElementById('line-chart-box').clientHeight;
            chart.style.width = width;
            chart.style.height = height;
            this.myChart = echarts.init(chart);
            this.myChart.setOption(option);
        },
        //计算一个月的毫秒数
        oneMonthTime(){
            var _this = this;
            var date = new Date().getTime();
            var start = date - 24*3600*1000*30;
            let cueTotal = []; //暂存线索总量
            let followCueTotal = []; //暂存关注线索总量
            this.isLoad = true;
            for(let i = 0;i < 30;i++){
                var begin = new Date(start);
                var end = new Date(start + 3600*24*1000);
                start = start + 3600*24*1000;
                var beginTime = begin.getFullYear() + '-' + addZero(begin.getMonth() + 1) + '-' + addZero(begin.getDate());
                var endTime = end.getFullYear() + '-' + addZero(end.getMonth() + 1) + '-' + addZero(end.getDate());
                _this.timeTotal.push(beginTime);
                _this.axios({
                    method:'post',
                    url:webApi.Stats.CountMonthClues.format({beginDate:beginTime,endDate:endTime}),
                    timeout:10000
                }).then(function(response){
                    if(response.data.code == 0){
                        cueTotal[i] = response.data.data.Total;
                        if(_this.cueTotal.length == 30){
                            console.log(_this.timeTotal);
                            _this.isLoad = false;
                            _this.chartInit();
                        }
                    }
                }).catch(function(error){

                })
                _this.axios({
                    method:'post',
                    url:webApi.Stats.CountMonthFollowClues.format({beginDate:beginTime,endDate:endTime}),
                    timeout:10000
                }).then(function(response){
                    if(response.data.code == 0){
                        followCueTotal[i] = response.data.data;
                    }
                }).catch(function(error){

                })
            };
            this.cueTotal = cueTotal;
            this.followCueTotal = followCueTotal;

            function addZero(obj){
                if(obj < 10){
                    return '0'+obj;
                }else{
                    return obj
                }
            }
        },
        lineChart(){

        }
    },
    destroyed(){
        window.removeEventListener('resize',this.chartInit);
    }
}
</script>

<style scoped>
    #main{
        width: 100%;
        border: solid 1px #ddd;
        border-radius: 5px;
    }
    #chart-header{
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
        border-bottom: solid 1px #ddd;
        border-top: solid 2px #44649e;
        padding-left: 10px;
        font-weight: bold;
    }
    #lineChart{
        width: 100%;
        height: 250px;
    }
    #line-chart-box{
        width: 100%;
        height: 250px;
    }
</style>
