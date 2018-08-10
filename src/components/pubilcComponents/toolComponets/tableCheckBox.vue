<template>
  <div id="tableCheckBox">
    <span :class="{'on':currTable==item}" v-for="(item,index) in tableNames" @click="selectTable(item)"  @click.stop.prevent  >{{item}}</span>
  </div>
</template>

<script>
  export default {
    name: "tableCheckBox",
    props:['tableNames','currTable'],
    data(){
      return{

      }
    },
    mounted(){

    },
    methods:{
      selectTable(item){
        this.$emit('currTable',item)
      }
    }
  }

</script>

<style lang="scss" scoped>
  #tableCheckBox{
    position: absolute;
    padding: 10px 20px;
    max-height: 100px;
    overflow-y: auto;
    width: 100%;
    left: 0;
    background: #FFFFFF;
    z-index: 100;
    border-top: 2px solid #cccccc;
    -webkit-box-shadow: 4px 6px 8px rgba(0,0,0,0.3);
    -moz-box-shadow: 4px 6px 8px rgba(0,0,0,0.3);
    box-shadow: 4px 6px 8px rgba(0,0,0,0.3);
    text-align: left;
    span{
      cursor: pointer;
      display: inline-block;
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      font-size: 16px;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -ms-transition: all 0.3s;
      -o-transition: all 0.3s;
      transition: all 0.3s;
    }
    span:hover{
      color: #FF6600;
    }
    .on{
      color: #FF6600;
    }
  }
  @media (max-width: 1440px){
    #tableCheckBox{
      span{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }
  }

</style>
