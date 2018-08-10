<template>
    <div id="cue-field">
        <div id="cue-field-header">
            最近30天线索来源分布情况
        </div>
        <div id="line-cue-field-box" v-loading.lock="isLoad">
            <div id="cue-field-chart"></div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            isLoad:false,
            myChart:null,
        }
    },
    mounted(){
        this.initChart();
        window.addEventListener('resize',this.initChart);
    },
    methods:{
        initChart(){
            var option = {
                legend: {
                    data:['举报线索','互联网线索','公益组织线索','热点线索','自行发现线索']
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid:{
                    left:'3%',
                    right:'4%',
                    bottom:'3%',
                    containLabel:true
                },
                xAxis: [
                    {
                        type:'category',
                        boundaryGap:false,
                        data:['2018-07-16','2018-07-17','2018-07-18','2018-07-19','2018-07-20','2018-07-21','2018-07-22','2018-07-23','2018-07-24','2018-07-25','2018-07-26',]
                    }
                ],
                yAxis:[
                    {
                        type:'value'
                    }
                ],
                series:[
                    {
                        name:'自行发现线索',
                        type:'line',
                        stack:'总量',
                        areaStyle:{normal:{}},
                        data:[4,12,11,14,21,23,12,16,18,17,10]
                    },
                    {
                        name:'热点线索',
                        type:'line',
                        stack:'总量',
                        areaStyle:{normal:{}},
                        data:[3,2,12,3,5,8,6,9,11,3,13]
                    },
                    {
                        name:'公益组织线索',
                        type:'line',
                        stack:'总量',
                        areaStyle:{normal:{}},
                        data:[10,21,12,32,12,42,13,42,12,25,38]
                    },
                    {
                        name:'互联网线索',
                        type:'line',
                        stack:'总量',
                        areaStyle:{normal:{}},
                        data:[120,221,121,94,67,131,102,90,85,123,132]
                    },
                    {
                        name:'举报线索',
                        type:'line',
                        stack:'总量',
                        areaStyle:{normal:{}},
                        data:[20,30,53,14,51,23,14,84,63,24,32]
                    }
                ]
            }
            var chart = document.getElementById('cue-field-chart');
            var width = document.getElementById('line-cue-field-box').clientWidth;
            var height = document.getElementById('line-cue-field-box').clientHeight;
            chart.style.width = width;
            chart.style.height = height;
            this.myChart = this.echarts.init(chart);
            this.myChart.setOption(option);
        }
    },
    destroyed(){
        window.removeEventListener('resize',this.initChart);
    }
}
</script>


<style scoped>
    #cue-field{
        width: 100%;
        border: solid 1px #ddd;
        border-radius: 5px;
    }
    #cue-field-header{
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
        border-bottom: solid 1px #ddd;
        border-top: solid 2px #44649e;
        padding-left: 10px;
        font-weight: bold;
    }
    #line-cue-field-box{
        width: 100%;
        height: 250px;
    }
    #cue-field-chart{
        width: 100%;
        height: 250px;
    }
</style>