<template>
    <div id="leader-result">
        <div id="header">
            <span class="header-icon">
                <i class="fa fa-check-square"></i>
            </span>
            <span class="header-title">结果反馈</span>

            <!-- <div class="search-wrap clearfix">
                <input class="search-ipt" type="text" v-model="keyword" placeholder="请输入内容" @keyup.13="getInternetCueList">
                <span class="search-btn" @click="getInternetCueList()">
                    <i class="iconfont icon-sousuo"></i>
                </span>
            </div> -->

        </div>

        <div class="follow_filter">
            <el-form class="follow_form" :inline="true" >
                <el-form-item label="所属领域 :">
                    <el-select class="follow_select" v-model="xslb">
                        <el-option label="全部" value="" ></el-option>
                        <el-option v-for="(item,index) in typeList"  :key="index" :value="item">{{item}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="线索发布时间 :">
                    <el-date-picker
                        v-model="timeSearch"
                        type="daterange"
                        align="right"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        unlink-panels
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关键词 :" >
                    <el-input  class="follow_input" v-model="keyword" placeholder="请输入关键词">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button style="border: 1px solid #dcdfe6;" class="follow_btn"  @click="search">搜索 <i class="iconfont icon-sousuo"></i></el-button>
                </el-form-item>
            </el-form>
        </div>

        <div id="content">
            <div class="table-list" ref="cueList" v-loading="isLoad">
                <el-table
                    ref="oTable"
                    :data="approvalResult"
                    :max-height="tableH"
                    :height="tableH"
                    style="width: 100%">
                    <el-table-column
                        prop="JBNR"
                        label="内容"
                        min-width="300">
                        <template slot-scope="scope">
                            <el-popover trigger="click" placement="top" max-width="200">
                              <div slot="reference" class="td-content">
                                {{ scope.row.JBNR}}
                              </div>
                              <div style="width:300px; max-height: 200px; overflow: auto;" v-html="scope.row.JBNR"></div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="GJC"
                        label="关键词"
                        min-width="300">
                        <template slot-scope="scope">
                            <el-popover trigger="click" placement="top" max-width="400">
                                <p style="text-indent: 2em;">{{ scope.row.GJC }}</p>
                                <div slot="reference" class="td-content">
                                {{ scope.row.GJC}}
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="XSLB"
                        label="线索类别"
                        min-width="100"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="XSSJBLY"
                        label="线索来源"
                        min-width="110"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="XSFBSJ"
                        label="线索发布时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="XSCJSJ"
                        label="采集时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="detail(scope.$index,scope.row.XSSJBLY,scope.row.XSBH,scope.row.BH)"  type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
            </div>
            <div class="page-wrap">
                <el-pagination
                @current-change="pageTo"
                :page-size="pageSize"
                :current-page="pageNum"
                layout="total, prev, pager, next, jumper"
                :total="totalPages">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'review-cue',
    data(){
        return{
            isLoad:false, //数据加载
            isThisNav:1,//导航
            pageSize:10, //每页条数
            pageNum:1, //当前页
            totalPages: 0, //总条数
            approvalResult: [
            ], //待审批线索

            tableH:0, //表格高度
            keyword:'', //关键字
            xslb:'', //线索类别
            xssjbly:'', //线索来源
            sfbl:'2', //是否办理
            order:'fbsj', //排序字段
            typeList:[] , //线索类别
            timeSearch: '' , //时间
        }
    },
    mounted(){
        localStorage.removeItem('cueList');
        localStorage.removeItem('beginDate');
        localStorage.removeItem('endDate');
        localStorage.removeItem('cueIndex');
        localStorage.removeItem('pageNum');
        localStorage.removeItem('keyword');
        localStorage.removeItem('cueType');
        localStorage.removeItem('cueFrom');
        localStorage.removeItem('sfbl');
        this.initTime();
        this.tableResize();
        this.getData();
        this.resize();
    },
    methods:{
        //搜索
        search(){
            this.pageNum = 1;
            this.getData();
        },
        //获取门类
        getClueType(){
            let _this = this;
            _this.axios({
            method:'get',
            url:webApi.Host + webApi.Clue.GetClueTypes
            }).then(function(res){
            if(res.data.code == 0){
                let data = res.data.data;
                _this.typeList = data;
            }
            }).catch(function(err){
            console.log(err);
            })
        },
        //默认时间
        initTime(){
            var time = new Date();
            var begin = '2017-01-01';
            var end = time.getFullYear() + '-' + addZero(time.getMonth() + 1) + '-' + addZero(time.getDate());
            this.timeSearch = [begin,end];

            function addZero(obj){
                if(obj < 10){
                    return '0' + obj;
                }else{
                    return obj
                }
            }
        },
        //跳转分页
        pageTo(val){
            this.pageNum = val;
            this.getData();
        },
        //获取数据
        getData(){
            var _this = this;
            var begin = this.timeSearch[0];
            var end = this.timeSearch[1];
            this.isLoad = true;
            this.axios({
                method:'get',
                url:webApi.ClueManager.GetLDFollowClues.format({xssjbly:this.xssjbly,sfbl:this.sfbl,keyword:this.keyword,beginDate:begin,endDate:end,pageNum:this.pageNum,pageSize:this.pageSize,xslb:this.xslb,order:this.order}),
                timeout:10000
            }).then(function(response){
                _this.isLoad = false;
                if(response.data.code == 0){
                    response.data.data.data.forEach(function(item){
                    if(item.XSSJBLY=="1") {
                        item.XSSJBLY = "举报线索";
                    }else if(item.XSSJBLY=="2") {
                        item.XSSJBLY = "互联网线索";
                    }else if(item.XSSJBLY=="3") {
                        item.XSSJBLY = "公益组织线索";
                    }else if(item.XSSJBLY=="4") {
                        item.XSSJBLY = "热点线索";
                    }else if(item.XSSJBLY=="5") {
                        item.XSSJBLY = "自行发现线索";
                    }
                    })
                    _this.approvalResult = response.data.data.data;
                    _this.totalPages = response.data.data.total;

                }
            }).catch(function(error){
                _this.isLoad = false;

            });
        },
        //审批
        detail(index,text,id,spid){
            var type = 0;
            localStorage.setItem('cueList',JSON.stringify(this.approvalResult));
            localStorage.setItem('beginDate',this.timeSearch[0]);
            localStorage.setItem('endDate',this.timeSearch[1]);
            localStorage.setItem('cueIndex',index);
            localStorage.setItem('pageNum',this.pageNum);
            localStorage.setItem('keyword',this.keyword);
            localStorage.setItem('cueType',this.xslb);
            localStorage.setItem('sfbl',this.sfbl);
            localStorage.setItem('cueFrom',this.xssjbly);
            if(text == '举报线索'){
                type = 1
            }else if(text == '互联网线索'){
                type = 2
            }else if(text == '公益诉讼线索'){
                type = 3
            }else if(text == '热点线索'){
                type = 4
            }else if(text == '自行发现线索'){
                type = 5
            }
            this.$router.push({
                path:'/home/cueDetail',
                query:{type:8,type2:type,nav:1,id:id,spid:spid}
            });
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
            let width = document.body.offsetWidth;
            var box = document.getElementById('content');
            if(width >= 1363) {
            box.style.height = 'calc(100% - 122px)';
            }else if(width < 1364) {
            box.style.height = 'calc(100% - 174px)';
            }
            _this.$nextTick(()=>{
                _this.tableH = _this.$refs.cueList.clientHeight;
            })
        }
    },
    //实例销毁钩子
    destroyed(){
      window.removeEventListener('resize',this.resize)
    }
}
</script>

<style lang="scss" scoped>
#leader-result{
    height: 100%;
    overflow: hidden;
    #header{
        height: 50px;
        line-height: 50px;
        color: #666;
        font-size: 16px;
        border-bottom: solid 1px #dcdcdc;
        background: #eee;
        .header-icon{
            display: inline-block;
            height: 100%;
            width: 40px;
            text-align: center;
            border-right:solid 1px #ddd;
        }
        .header-title{
            padding-left: 15px;
        }
        /*搜索框*/
        .search-wrap{
            float: right;
            background: #FFFFFF;
            height: 42px;
            width: 320px;
            margin-right: 50px;
            margin-top: 4px;
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
    /*筛选*/
    .follow_filter {
        background-color: #eeeeee;
        color: #333333;
        padding-left: 15px;
        padding-top: 5px;
        margin: 15px 20px 0;
        .follow_form {
            .el-form-item {
            margin-bottom: 10px;
            }
            .follow_select {
            width: 130px;
            }
            .follow_date {
            width: 130px;
            min-width: 135px;
            }
            .follow_input {
            width: 180px;
            }
        }
    }
    #content{
        height: calc(100% - 40px);
        .table-list{
            padding-top: 10px;
            height: calc(100% - 70px);
        }
        .page-wrap{
            margin-top: 20px;
            height: 40px;
        }
    }
}
@media (max-width: 1440px) {
    #review{
        #header{
            height: 40px;
            .header-icon{
                width: 40px;
                height: 40px;
                line-height: 40px;
            }
            /*搜索框*/
            .search-wrap{
                height: 32px;
                width: 300px;
                .search-ipt{
                width: 260px;
                font-size: 14px;
                }
                .search-btn{
                line-height: 32px;
                width: 38px;
                }
                .search-btn:after{
                content: '';
                left: 0;
                top: 8px;
                width: 2px;
                height: 14px;
                }
            }
        }
    }
}
</style>
