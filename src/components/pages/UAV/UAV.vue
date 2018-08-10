<template>
  <div id="UAV">
    <div class="UAV_header">
      <i class="fa fa-get-pocket"></i>
      无人机取证
    </div>
    <!--筛选-->
    <div class="UAV_filter">
      <template>
        <i class="fa fa-calendar"></i>
        时间段:
        <el-date-picker style="height: 100%;border:none;padding:0"
                        v-model="timeSearch"
                        type="daterange"
                        align="right"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">

        </el-date-picker>
        <span @click="confirm" class="confirm">确定</span>
      </template>
      <div class="search-wrap">
        <input class="search-ipt" type="text" v-model="keyword" placeholder="请输入内容" @keyup.13="getTheme">
        <span class="search-btn" @click="getTheme()">
            <i class="iconfont icon-sousuo"></i>
          </span>
      </div>
    </div>
    <!--内容-->
    <div class="UAV_body">
      <!--编辑主题-->
      <div class="UAV_theme">
        <!--添加主题-->
        <div class="add_theme_wrap">
          <div class="add_theme" @click="toggleAddTheme">
            <i class="fa fa-plus-square-o"></i>
            添加主题
          </div>
        </div>
        <!--主题列表-->
        <ul class="theme_list">
          <li  @click="selectTheme(index)" :class="index==selectThemeIndex?'selectTheme':''" v-for="(item,index) in themeList" :key="index">
            <span class="theme_name" v-text="item.name">{{index}}</span>
            <span class="theme_time" v-text="item.time"></span>
          </li>
          <!--<li>-->
            <!--<span class="theme_name">气体污染</span>-->
            <!--<span class="theme_time">2018-07-25</span>-->
          <!--</li>-->
        </ul>
      </div>
      <!--主题图片内容-->
      <div class="UAV_img">
        <!--上传图片-->
        <div class="add_img">
          <label for="img-input">
            <i class="fa fa-camera"></i>
            上传照片
          </label>
          <input @change="changeImg" style="display:none;" id="img-input" type="file">
        </div>
        <div class="img_content">
          <ul class="img_list" id="imgViewer">
            <!--<li v-for="(item,index) in imgList" :key="index">-->
            <!--<img :src="item">-->
            <!--</li>-->
            <li>
              <img src="../../../assets/UAV/UAV1.jpg" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV2.jpg" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV3.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV4.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV5.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV6.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV7.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV8.png" alt="">
            </li>
            <li>
              <img src="../../../assets/UAV/UAV9.png" alt="">
            </li>
          </ul>
          <!--分页-->
          <div class="page-wrap" style="clear: both;">
            <el-pagination
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total"
              @current-change="currentChange"
              @size-change="">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--添加主题对话框-->
    <transition name="toggleShow">
      <div class="UAV_dialog_wrap" v-show="addThemeDialogVisible">
        <div class="UAV_dialog">
          <div class="UAV_dialog_header">
            <span>添加主题</span>
            <i class="fa fa-times-circle-o" @click="toggleAddTheme"></i>
          </div>
          <el-form class="UAV_form"  label-width="80px">
            <el-form-item label="主题名称">
              <el-input style="max-width:220px;" v-model="addThemeName"></el-input>
            </el-form-item>
            <el-form-item label="选择时间">
              <el-date-picker
                v-model="addThemeTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="confirmBtn" @click="confirmAddTheme">确定</el-button>
              <el-button @click="toggleAddTheme">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        addThemeDialogVisible: false,//添加主题对话框显示
        addThemeName:"",//添加主题名称
        addThemeTime: "",//添加主题时间
        themeList: [{name:'空气污染',time:'2018-08-22'}],//主题列表
        selectThemeIndex: 0,//选中主题索引
        keyword: "",//关键字
        timeSearch: '',//时间范围
        pageSize: 20,//每页数量
        total: 9,//总数量
        imgList: [//图片数据
          "../../../assets/UAV/UAV1.jpg",
          "../../../assets/UAV/UAV2.jpg",
          "../../../assets/UAV/UAV3.png",
          "../../../assets/UAV/UAV4.png",
          "../../../assets/UAV/UAV5.png",
          "../../../assets/UAV/UAV6.png",
          "../../../assets/UAV/UAV7.png",
          "../../../assets/UAV/UAV8.png",
          "../../../assets/UAV/UAV9.png"
        ],
      }
    },
    methods: {
      selectTheme(index){//选择主题
        this.selectThemeIndex = index;
      },
      confirmAddTheme() {//确认添加主题
        if(!this.addThemeName) {
          this.$message({
            message: "请填写主题名称",
            showClose: true,
            duration: 2000,
            type: "error"
          });
          return;
        }
        if(!this.addThemeTime) {
          this.$message({
            message: "请选择时间",
            showClose: true,
            duration: 2000,
            type: "error"
          });
          return;
        }
        this.themeList.push({name:this.addThemeName,time:this.addThemeTime});
        this.toggleAddTheme();
        // console.log(`名称:${this.addThemeName},时间:${this.addThemeTime}`)
      },
      toggleAddTheme() {//切换显示添加主题
        this.addThemeDialogVisible = !this.addThemeDialogVisible;
        this.addThemeName = "";
        this.addThemeTime = "";
      },
      getTheme(){//搜索主题

      },
      changeImg(){//上传图片
        // console.log(document.getElementById("img-input").value);
      },
      currentChange(val) {//页码改变
        console.log(val)
      },
      confirm() {
        this.$message({
          message: "暂无更多内容"
        })
      }
    },
    mounted() {
      let viewer = new Viewer(document.getElementById('imgViewer'));
    }
  }
</script>

<style lang="scss" scoped>
  #UAV {
    height: 100%;
    font-size: 16px;
    overflow: hidden;
    .UAV_dialog_wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      background-color: rgba(0,0,0,.4);
      &.toggleShow-enter-active,
      &.toggleShow-leave-active {
        transition: opacity .5s;
      }
      &.toggleShow-enter,
      &.toggleShow-leave-to {
        opacity: 0;
      }
      .UAV_dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 490px;
        height: 320px;
        border-radius: 8px;
        background-color: rgba(0,166,90,1);
        padding: 0 5px 5px 5px;
        .UAV_dialog_header {
          position: relative;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          i {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translate(0,-50%);
            color: #fff;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .UAV_form {
          width: 100%;
          height: calc( 100% - 60px);
          background-color: #fff;
          border-radius: 0 0 5px 5px;
          padding-left: 75px;
          padding-top: 38px;
          font-size: 18px;
          font-weight: bold;
          .confirmBtn {
            background-color:rgba(0,166,90,1);
            color:#fff;
            &:hover {
              background-color: rgba(52, 177, 120, 0.83);
            }
          }
        }
      }
    }
    /*头部*/
    .UAV_header {
      height: 50px;
      background-color: #eeeeee;
      color: #666666;
      border-bottom: 1px solid #dcdcdc;
      i {
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #dcdcdc;
        margin-right: 15px;
      }
    }
    /*筛选*/
    .UAV_filter {
      padding: 10px 60px;
      box-shadow: 0 2px 1px rgba(0,0,0,0.15);
      .confirm {
        user-select: none;
        &:hover {
          cursor: pointer;
          color: #00a0e9;
        }
      }
      .search-wrap{
        float: right;
        background: #FFFFFF;
        height: 42px;
        width: 320px;
        margin-right: 10px;
        margin-top: -4px;
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
    /*内容*/
    .UAV_body {
      height: calc( 100% - 102px);
      /*主题*/
      .UAV_theme {
        float: left;
        width: 370px;
        font-size: 18px;
        background-color: rgba(245,243,244,0.83);
        height: 100%;
        /*添加主题*/
        .add_theme_wrap {
          background-color: rgba(238,238,238,0.83);
          .add_theme {
            width: 150px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background-color:  rgba(0,166,90,0.83);
            color: #fff;
            &:hover {
              cursor: pointer;
              background-color: rgba(52, 177, 120, 0.83);
            }
          }
        }
        /*主题列表*/
        .theme_list {
          padding: 0 25px 5px 25px;
          overflow-y: auto;
          height: calc( 100% - 40px);
          li {
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-top: 20px;
            border-bottom: 1px solid rgba(219,217,218,0.83);
            font-size: 16px;
            &:hover {
              cursor: pointer;
              border-bottom: 2px solid rgba(142, 140, 141, 0.83);
            }
            .theme_name {
              float: left;
            }
            .theme_time {
              float: right;
              font-size: 12px;
              color: rgba(172,170,171,0.83);
            }
          }
          .selectTheme {
            border-bottom: 2px solid rgba(0,166,90,0.83);
            &:hover {
              border-bottom: 2px solid rgba(0,166,90,0.83);
            }
          }
        }
      }
    }
    /*图片内容*/
    .UAV_img {
      float: left;
      width: calc(100% - 370px);
      height:  100%;
      padding-left:  18px;
      /*添加照片*/
      .add_img {
        background-color: rgba(238,238,238,0.83);
        label {
          display: inline-block;
          background-color: rgba(0,166,90,0.83);
          color: #fff;
          width: 150px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          &:hover {
            cursor: pointer;
            background-color: rgba(52, 177, 120, 0.83);
          }
        }
      }
      .img_content {
        height: calc( 100% - 50px);
        background-color: rgba(245,243,244,0.83);
        .img_list {
          height: calc( 100% - 50px);
          overflow-y: auto;
          padding-left: 10px;
          padding-top: 30px;
          li {
            float: left;
            width: calc(20% - 10px);
            height: 300px;
            min-width: 230px;
            margin-right: 10px;
            margin-bottom: 40px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              &:hover {
                transform: scale(1.2);
                cursor: pointer;
              }
            }
          }
        }
        .page-wrap {
          margin-top: 9px;
        }
      }
    }
  }
  @media (max-width: 1440px) {
    #UAV {
      font-size: 14px;
      /*头部*/
      .UAV_header {
        height: 40px;
        i {
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
      }
      .UAV_filter {
        /*搜索框*/
        /*.search-wrap{*/
          /*height: 32px;*/
          /*width: 300px;*/
          /*.search-ipt{*/
            /*width: 260px;*/
            /*font-size: 14px;*/
          /*}*/
          /*.search-btn{*/
            /*line-height: 32px;*/
            /*width: 38px;*/
          /*}*/
          /*.search-btn:after{*/
            /*content: '';*/
            /*left: 0;*/
            /*top: 8px;*/
            /*width: 2px;*/
            /*height: 14px;*/
          /*}*/
        /*}*/
      }
      .UAV_body {
        height: calc( 100% - 92px);
        /*图片内容*/
        .UAV_img {
          .img_list {
            li {
              width: calc(33% - 10px);
            }
          }
        }
      }
    }
  }
</style>
