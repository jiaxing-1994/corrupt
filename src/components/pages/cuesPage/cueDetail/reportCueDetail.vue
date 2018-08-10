<template>
    <div id="main" v-loading="isLoad">
        <div class="detail-item">
            <span class="item-title">举报领域</span><span class="item-content">{{cueData.XSLB}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">举报人姓名</span><span class="item-content">{{cueData.JBRXM}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">联系方式</span><span class="item-content">{{cueData.JBRLXFS}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">事发地点</span><span class="item-content">{{cueData.SFDD}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title">采集时间</span><span class="item-content">{{cueData.CJSJ}}</span>
        </div>
        <div class="detail-item">
            <span class="item-title resource-box">举报内容</span><span class="item-content resource-content ">{{cueData.JBNR}}</span>
        </div>
        <div class="detail-item" v-if='JWD.length > 0'>
            <span class="item-title resource-box">事发地点卫星图</span><span class="item-content resource-content " style="height:300px"><cue-map :JWD="JWD" :FBDD="FBDD"></cue-map></span>
        </div>
        <div class="detail-item" v-show="cueData.TP.length">
            <span class="item-title resource-box">图片内容</span>
            <span class="item-content resource-content">
                <ul id="imgViewer">
                    <li v-for="item in TP">
                        <img :src="item">
                    </li>
                </ul>
            </span>
        </div>
        <div class="detail-item" v-show="cueData.SP.length">
            <span class="item-title resource-box">视频内容:</span>
            <span class="item-content resource-content">
                <video :src="item" controls="controls" v-for="item in SP"></video>
            </span>
        </div>
    </div>
</template>

<script>
import cueMap from '../../../pubilcComponents/toolComponets/cueLightMap'
export default {
    components:{cueMap},
    data(){
        return {
            cueData:{
                TP:[],
                SP:[]
            },
            TP:[],
            SP:[],
            isLoad:false,
            JWD:[], //经纬度
            FBDD:'', //发布地点
        }
    },
    mounted(){
        this.dataGet();
    },
    methods:{
        //获取数据
        dataGet(){
            var _this = this;
            _this.isLoad = true;
            this.axios({
                method:'get',
                url:webApi.Clue.GetReportClueData.format({id:this.$route.query.id}),
                timeout: 10000
            }).then(function(response){
                _this.isLoad = false;
                if(response.data.code == 0){
                    if(response.data.data.length > 0){
                        _this.cueData = response.data.data[0];
                        if(_this.cueData.GZBH){
                            _this.$root.Bus.$emit('sendGZBH',_this.cueData.GZBH);
                        }
                        if(response.data.data[0].SFYD == 0){
                            _this.readed();
                        }
                        if(_this.cueData.JWD){
                            var jwd = [];
                            jwd.push(parseFloat(_this.cueData.JWD.split(',')[0]));
                            jwd.push(parseFloat(_this.cueData.JWD.split(',')[1]));
                            _this.JWD = jwd;
                            _this.FBDD = _this.cueData.SFDD;
                            console.log(_this.JWD);
                            console.log(_this.FBDD);
                        }
                        var tp = JSON.parse(_this.cueData.TP);
                        var sp = JSON.parse(_this.cueData.SP);
                        _this.cueData.TP = tp;
                        _this.cueData.SP = sp;
                        _this.getTPSPData();
                        _this.$emit("followData",response.data.data[0].SFGZ)
                    }else{
                        _this.$message({
                            message:'该线索为空',
                            type:'error'
                        })
                    }
                }else{

                }
            }).catch(function(response){
                _this.isLoad = false;
            })
        },
        //获取图片视频
        getTPSPData(){
            var _this = this;
            if(this.cueData.TP.length > 0){
                for(var i = 0;i<this.cueData.TP.length;i++){
                   var src = webApi.Host + '/api/WxClue/DownLoadFile/' + _this.cueData.TP[i];
                   _this.TP.push(src);
                };
                _this.$nextTick(()=>{
                    let viewer = new Viewer(document.getElementById('imgViewer'));
                })
            };
            if(this.cueData.SP.length > 0){
                for(var i = 0; i<this.cueData.SP.length;i++){
                    var src = webApi.Host + '/api/WxClue/DownLoadFile/' + _this.cueData.SP[i];
                    _this.SP.push(src);
                }
            }
        },
        //标为已读
        readed(){
            var _this = this;
            this.axios({
                method:'post',
                url:webApi.Clue.ClueRead.format({xssjbly:1,xsbh:this.$route.query.id}),
                timeout:10000
            }).then(function(response){
                if(response.data.code == 0){
                    console.log('已读');
                }else{
                    _this.$message({
                        message:'已读出现错误,请联系维护人员',
                        type:'error'
                    })
                }
            }).catch(function(error){

            })
        }
    }
}
</script>

<style lang="scss" scoped>
#main{
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
            background: #c0ecaa;
        }
        .item-content{
            border: solid 1px #ddd;
            height: 30px;
            line-height: 30px;
            padding: 0px 10px;
            width: calc(100% - 300px);
        }
        .resource-box{
            float: none;
            width: 100%;
        }
        .resource-content{
            height: initial;
            padding: 10px;
            width: 100%;
            height: inherit;
            ul{
                padding: 0;
                li{
                    width: 24%;
                    display: inline-block;
                    padding: 10px;
                    border: solid 2px #fff;
                    cursor: pointer;
                    vertical-align: top;
                    img{
                        width: 100%;
                        height: 300px;
                    }
                }
                li:hover{
                    border: solid 2px #00a65a
                }
            }
            video{
                width: 49%;
                height: 300px;
            }
        }
    }
}
</style>
