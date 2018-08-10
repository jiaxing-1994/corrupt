<template>
    <div id="main" v-loading="isLoad">
        <div class="detail-item">
            <span class="item-title">数据来源</span><span class="item-content">{{cueData.XSLY}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">线索类别</span><span class="item-content">{{cueData.XSLB}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">发布时间</span><span class="item-content">{{cueData.FBSJ}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">采集时间</span><span class="item-content">{{cueData.CJSJ}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">数据地址</span><span style="overflow: hidden;" class="item-content"><a style="white-space: nowrap;" class="link" :href="cueData.SJDZ" target="_blank">{{cueData.SJDZ}}</a></span>
        </div>
        <div class="detail-item">
            <span class="item-title resource-box">采集内容</span>
            <div class="item-content resource-content">
                <div class="text-title">机器分析</div>
                <div class="text-keyword">
                    <span class="text-title-item">关键字:{{cueData.GJC}}</span>
                    <span></span>
                </div>
                <div class="text-name">
                    <span class="text-title-item">人名:</span><span>{{cueData.RENM}}</span>
                    <br/>
                    <span class="text-title-item">地名:</span><span>{{cueData.DIM}}</span>
                    <br/>
                    <span class="text-title-item">机构名:</span><span>{{cueData.JIGOUM}}</span>
                </div>
                <div class="text-remark">
                    <span class="text-title-item">摘要:</span><span v-html="cueData.ZY"></span>
                </div>
            </div>
            <div class="item-content resource-content" style="margin-top: 20px">
                <span v-html="cueData.JBNR"></span>
            </div>
        </div>
        
        <div class="detail-item" v-show="TP.length > 0">
            <span class="item-title resource-box">图片内容</span>
            <span class="item-content resource-content">
                <ul id="imgViewer">
                    <li class="resource-item" v-for="item in TP">
                        <img :src="item">
                    </li>
                </ul>
            </span>
        </div>
        <div class="detail-item" v-show="SP.length > 0">
            <span class="item-title resource-box">视频内容:</span>
            <span class="item-content resource-content">
                <video :src="item" controls="controls" v-for="item in SP"></video>
            </span>
        </div>

        <div class="detail-item" v-show="cueData.SFSJGZ == 3">
            <span class="item-title track-title">事态跟踪:</span>
            <span class="item-content timeline-content">
                <ul class="itemline-box">
                    <li class="timeline-item">
                        <i class="timeline-icon fa fa-circle-o"></i>
                        <div class="tiemline-text">
                            <h3 class="timeline-time">{{trackHead.time}}</h3>
                            <p>{{trackHead.content}}</p>
                        </div>
                    </li>
                    <li class="timeline-item" v-for="item in trackData">
                        <i class="timeline-icon fa fa-circle-o"></i>
                        <div class="tiemline-text">
                            <h3 class="timeline-time">{{item.time}}</h3>
                            <div class="circle-icon1">
                                <i class="timeline-icon fa fa-circle-o"></i>
                                <span>回帖数:{{item.preNum}}</span>
                            </div>
                            <h4 class="tiemline-name">{{item.name}}</h4>
                            <pre>{{item.content}}</pre>
                            <div class="circle-icon2" v-show="item.lastReply">
                                <i class="timeline-icon fa fa-circle-o"></i>
                                <span>剩余回帖数:{{item.lastReply}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    // props:{
    //   cueData: Object,
    // },
    data(){
        return{
          cueData:{}, //线索信息
          TP:[], //图片信息
          SP:[], //视频信息
          trackHead:{}, //事件跟踪头部
          trackData:[], //事件跟着内容
          isLoad:false, //数据加载 
        }
    },
    mounted(){
        this.TP = [];
        this.SP = [];
        this.dataGet();
    },
    methods:{
        //获取事件跟踪数据
        getTrack(track){
            var _this = this;
            track = JSON.parse(track);
            _this.trackHead = track[0];
            _this.trackData = track.slice(1,track.length);
        },
        //获取图片
        getImg(img){
            var _this = this;
            var imgs = img.split(',');
            for(var i = 0 ;i < imgs.length; i++){
                if(imgs[i] != 'null'&&imgs[i] != ''){
                    var src = webApi.WxClue.DownLoadFile.format({id:imgs[i]});
                    _this.TP.push(src);
                }
            }
            _this.$nextTick(()=>{
                let viewer = new Viewer(document.getElementById('imgViewer'));
            })
        },
        //获取数据
        dataGet(){
            var _this = this;
            this.isLoad = true;
            this.axios({
                method: 'get',
                url:webApi.Clue.GetWebClueData.format({id:this.$route.query.id}),
                timeout: 10000
            }).then(function(response){
                _this.isLoad = false;
                if(response.data.code == 0){
                    if(response.data.data.length >0){
                        _this.cueData = response.data.data[0];
                        if(_this.cueData.GZBH){
                            _this.$root.Bus.$emit('sendGZBH',_this.cueData.GZBH);
                        }
                        if(_this.cueData.SFSJGZ == 1 && _this.cueData.SJGZSJ != ''){
                            _this.getTrack(_this.cueData.SJGZSJ);
                        }
                        if(_this.cueData.TPJH != null&&_this.cueData.TPJH != ''){
                            _this.getImg(_this.cueData.TPJH);
                        }
                        if(response.data.data[0].SFYD == 0){
                            _this.readed();
                        }
                        _this.$emit("followData",response.data.data[0].SFGZ)
                    }else{
                        _this.$message({
                            message:'该线索为空',
                            type:'error'
                        })
                    }
                }else{

                }
            }).catch(function(error){
                _this.isLoad = false;
                console.log(error);
            })
        },
        //标为已读
        readed(){
            var _this = this;
            this.axios({
                method:'post',
                url:webApi.Clue.ClueRead.format({xssjbly:2,xsbh:this.$route.query.id}),
                timeout:10000
            }).then(function(response){
                if(response.data.code == 0){
                }else{
                    _this.$message({
                        message:'已读出现错误,请联系维护人员',
                        type:'error'
                    })
                }
            }).catch(function(error){

            })
        }
    },
    // watch:{
    //     '$route.fullPath':function(){
    //         this.TP = [];
    //         this.SP = [];
    //         this.dataGet();
    //     }
    // }
}
</script>

<style lang="scss" scoped>
#main{
    color: #333;
    .detail-item{
        margin: 15px 0;
        span{
            display: inline-block;
        }
        .item-title{
            width: 300px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            float: left;
            background-color: #c0ecaa;
        }
        .item-content{
            border: solid 1px #ddd;
            height: 30px;
            line-height: 30px;
            padding: 0px 10px;
            width: calc(100% - 300px);
            .link{
                color: #3897c6;
            }
            .link:hover{
                text-decoration: underline;
            }
        }
        .resource-box{
            width: 100%;
            display: block;
            float: none;
        }
        .resource-content{
            height: initial;
            line-height: 22px;
            padding: 15px;
            width: 100%;
            ul{
                padding: 0;
                .resource-item{
                    width: 24%;
                    display: inline-block;
                    padding: 10px;
                    border: solid 2px #fff;
                    cursor: pointer;
                    vertical-align: top;
                    height: 300px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .resource-item:hover{
                    border: solid 2px #00a65a
                }
            }
            .text-title{
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .text-title-item{
                font-size: 14px;
                font-weight: bold;
                margin-right: 10px;
                vertical-align: top;
            }
        }
        .track-title{
            width: 80px;
            background: #fff;
            font-weight: bold;
            line-height: 20px;
        }
        .timeline-content{
            border: none;
            width: 88%;
            .itemline-box{
                padding: 0;
                .timeline-item{
                    padding-bottom: 10px;
                    position: relative;
                    margin-left: 155px;
                    margin-top: 20px;
                    .timeline-icon{
                        position: absolute;
                        left: -5px;
                        top: 0;
                        z-index: 10;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        background-color: #fff;
                        color: #5FB878;
                        border-radius: 50%;
                        text-align: center;
                    }
                    .tiemline-text{
                        line-height: 22px;
                        display: inline-block;
                        padding-left: 30px;
                        .circle-icon2,
                        .circle-icon1{
                            margin-top: -21px;
                            margin-left: -35px;
                            .timeline-icon{
                                position: inherit;
                                width: 20px;
                                height: 20px;
                                line-height: 20px;
                                background-color: #fff;
                                color: #5FB878;
                                border-radius: 50%;
                                text-align: center;
                            }
                            span{
                                margin-left: 10px;
                                color: #ff7900;
                            }
                        }
                        .circle-icon2{
                            margin-top: 0px;
                        }
                        .timeline-time{
                            margin-bottom: 5px;
                            font-size: 16px;
                            color: #333;
                            font-weight: 500;
                            position: absolute;
                            left: -158px;
                            font-size: 15px;
                            top: 0px;
                        }
                        .tiemline-name{
                            color: #333;
                        }
                        pre{
                            white-space: pre-wrap;
                            color: #333;
                            font-size: 13px;
                            font-family: "微软雅黑";
                        }
                    }
                }
                .timeline-item:first-child{
                    margin-top: 0;
                }
                .timeline-item:before{
                        content: '';
                        position: absolute;
                        left: 5px;
                        top: 0;
                        z-index: -1;
                        width: 1px;
                        height: 100%;
                        background-color: #e6e6e6;
                }
                .timeline-item:last-child:before{
                    // display: none;
                }
            }
        }
    }
}
</style>
