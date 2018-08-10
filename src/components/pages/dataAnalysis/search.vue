<template>
    <div id="searchAll">
      <div class="main-box">
        <div></div>
        <div class="title">
          <div class="cloud-icon">
            <img src="@/assets/search/icon.png" />
          </div>
          <div class="font-icon">
            <img src="@/assets/search/font.png" />
          </div>
        </div>
        <div class="search-wrap">
          <input class="search-ipt"  type="text" v-model="keyword" placeholder="请输入内容" @keyup.13="search()">
          <span class="search-btn" @click="search()">
            <i class="el-icon-search"></i>
          </span>
        </div>
      </div>
      <div id="pie-chart">
         <!-- <search-pie></search-pie> -->
      </div>
      <div id="word-cloud">
        <word-cloud></word-cloud>
      </div>
    </div>
</template>

<script>
import searchPie from '../../pubilcComponents/eChartComponents/searchPie';
import wordCloud from '../../pubilcComponents/eChartComponents/dataWordCloud'
export default {
  name:'searchAll',
  components:{searchPie,wordCloud},
  data(){
    return{
      keyword:'',
    }
  },
  mounted(){

  },
  methods:{
    search(){
      let _this = this;
      if(_this.keyword.trim()==''){
        this.$message({
          message: '查询条件不能为空！',
          type: 'warning'
        });
      }else {
        this.$router.push({
          path:'/home/searchResult',
          query:{keyword:_this.keyword.trim()}
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #searchAll{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    .main-box{
      width: 100%;
      .title{
        font-size: 40px;
        font-weight: 800;
        color: #666666;
        text-align: center;
        line-height: 0;
        .cloud-icon{
          img{
            width: 35px;
          }
        }
        .font-icon{
          margin-bottom: 10px;
          img{
          }
        }
      }
      .search-wrap{
        height: 40px;
        width: 600px;
        margin: 0 auto;
        .search-ipt{
          float: left;
          width: 500px;
          padding-left: 10px;
          height: 100%;
          font-size: 16px;
          color: #333333;
          border: 1px solid #11a967;
        }
        .search-btn{
          float: left;
          width: 98px;
          height: 100%;
          line-height: 38px;
          font-size: 24px;
          text-align: center;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          color: #FFFFFF;

          background: -webkit-linear-gradient(#1cd37d, #018d50); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(#1cd37d, #018d50); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(#1cd37d, #018d50); /* Firefox 3.6 - 15 */
          background: linear-gradient(#1cd37d, #018d50); /* 标准的语法 */
        }
      }

    }
    #pie-chart{
      width: 100%;
      height: 300px;
      margin:0 auto;

    }
    #word-cloud {
      display: none;
      width: 80%;
      height: 350px;
      margin:0 auto;
    }
  }
</style>
