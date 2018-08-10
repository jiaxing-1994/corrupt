<template>
  <div id="cue-chart">
    <el-row class="row">
      <el-col class="row-col" :xs="24" :sm="24" :lg="12" :xl="12">
        <line-chart></line-chart>
      </el-col>
      <el-col class="row-col" :xs="24" :sm="24" :lg="12" :xl="12">
        <cue-pie-chart></cue-pie-chart>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col class="row-col" :xs="24" :sm="24" :lg="12" :xl="12">
        <cue-field-line></cue-field-line>
      </el-col>
      <el-col class="row-col" :xs="24" :sm="24" :lg="12" :xl="12">
        <cue-field-pie></cue-field-pie>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import lineChart from '../../pubilcComponents/eChartComponents/lineMap'
import cuePieChart from '../../pubilcComponents/eChartComponents/cuePieChart'
import cueFieldLine from '../../pubilcComponents/eChartComponents/cueFieldLineMap'
import cueFieldPie from '../../pubilcComponents/eChartComponents/cueFieldPieChart'
export default {
  components:{lineChart,cuePieChart,cueFieldLine,cueFieldPie},
  data(){
    return{

    }
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
  #cue-chart{
    .row{
      .row-col{
        text-align: center;
        padding: 10px;
      }
    }
  }
</style>
