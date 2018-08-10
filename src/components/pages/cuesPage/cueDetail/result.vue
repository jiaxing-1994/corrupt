<template>
    <div id="result">
        <div class="result-text">
            <!-- <div class="advise-title">处理结果</div>
            <div class="advise-content">
                <span class="no-result" v-show="textData == ''">暂无处理结果</span>
                <span v-show="textData!=''" v-html="textData"></span>
            </div>
            <div v-show="textData != ''" style="font-size: 12px;color: #696969;">{{time}}</div> -->
            
            <div class="detail-item">
                <span class="item-title">处理日期</span>
                <span class="item-content">{{time}}</span>
            </div>
            <div class="detail-item">
                <span class="item-title resource-box">处理内容</span><span class="item-content resource-content "v-html="textData"></span>
            </div>
            <div class="detail-item">
                <span class="item-title resource-box">附件</span><span class="item-content resource-content ">

                </span>
            </div>
            <div class="detail-item" v-if="identity == 1">
                <div class="push-btn" @click="pushSystem">推送到统一业务系统</div>
            </div>

        </div>
        <div class="result-text result-edit" v-if="identity == 5">
            <div class="advise-title">编写处理结果</div>
            <div class="advise-choose-time">
                <span class="advise-choose-time-title">选择处理日期</span><el-date-picker
                    v-model="timeChoose"
                    type="daterange"
                    align="right"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <editor id="result-edit" height="300px" width="100%" v-bind:content="editorText"
            pluginsPath="@/../static/kindeditor/plugins/"
            :loadStyleMode="true"
            @on-content-change="onContentChange"
            :items="items"></editor>
            <div id="submit-btn" @click="submitBtn">
                提交
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            editorText:'', //富文本输入内容
            textData:'', //显示文本内容
            isLoad:false, //数据加载
            //编辑器菜单栏设置
            items:[
            'source', '|', 'undo', 'redo', '|', 'preview', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'lineheight', 'removeformat', '|', 'image',
            'insertfile', 'table', 'hr', 'emoticons', 'pagebreak',
            'anchor', 'link', 'unlink', '|', 'about'
            ],
            identity: null,
            GZBH:'',
            time:'', //时间
            timeChoose:'' ,
        }
    },
    mounted(){
        var _this = this;
        this.identity = localStorage.IdentityType;
        this.$root.Bus.$on('sendGZBH',function(obj){
            _this.GZBH = obj;
            console.log(_this.GZBH);
            _this.getResult();
        })
    },
    methods:{
        //推送
        pushSystem(){
            this.$message({
                message:'暂未开放此功能',
                type:'error'
            })
        },
        //获取办理结果
        getResult(){
            var _this = this;
            this.axios({
                methodL:'get',
                url:webApi.ClueManager.GetResult.format({gzbh:this.GZBH}),
                timeout:10000
            }).then(function(response){
                if(response.data.code == 0){
                    // _this.editorText = response.data
                    if(response.data.data[0].BLJGJS&&response.data.data[0].BLJGFKSJ){
                        _this.textData = response.data.data[0].BLJGJS;
                        _this.time = response.data.data[0].BLJGFKSJ;
                    }
                }else{

                }
            }).catch(function(error){

            })
        },
        //提交按钮
        submitBtn(){
            var _this = this;
            if(this.editorText.trim() == ''){
                console.log("为空");
            }else{
                this.textData = this.editorText;
                this.isLoad = true;
                this.axios({
                    method:'post',
                    url:webApi.ClueManager.ReportResult.format({id:this.GZBH,bljgjs:this.textData}),
                    timeout: 10000
                }).then(function(response){
                    _this.isLoad = false;
                    if(response.data.code == 0){
                        _this.editorText = '';
                        _this.$message({
                            message:'已成功提交',
                            type:'success'
                        })
                    }else{

                    }
                }).catch(function(error){
                    _this.isLoad = false;
                })
            }
        },
        onContentChange(val){
            this.editorText = val;
        },
    }
}
</script>

<style lang="scss" scoped>
    #result{
        width: 100%;
        padding: 20px;
        padding-right: 0;
        padding-left: 0;
        .result-text{
            position: relative;
            padding-left: 40px;
            .detail-item{
                margin: 15px 0;
                .push-btn{
                    width: 170px;
                    height: 50px;
                    border-radius: 5px;
                    background: #00a65a;
                    line-height: 50px;
                    text-align: center;
                    padding: 0 5px;
                    color: #fff;
                    cursor: pointer;
                }
                .push-btn:active{
                    background: #099555;
                }
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
                }
            }
            .timeline-icon{
                position: absolute;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                top: 10px;
                left: 0;
                background-color: #fff;
                color: #c0ecaa;
                font-size: 18px;
            }
            .advise-title{
                width: 240px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                background: #c0ecaa;    
                color: #333;
            }
            .advise-content{
                min-height: 30px;
                min-width: 240px;
                display: inline-block;
                border: solid 1px #ddd;
                max-width: 90%;
                padding: 5px;    
                word-break: break-all;
                color: #666;
                pre{
                    width: 100%;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    line-height: 20px;
                    font-size: 12px;
                }
                .no-result{
                    text-align: center;
                    display: block;
                    width: 100%;
                }
            }
        }
        .result-edit{
            margin-top: 10px;
            .advise-choose-time{
                margin-top: 10px;
                .advise-choose-time-title{
                    display: inline-block;
                    height: 40px;
                    vertical-align: top;
                    text-align: center;
                    line-height: 40px;
                    background: #c0ecaa;
                    color: #333;
                    padding: 0 10px;
                }
            }
            #submit-btn{
                display: inline-block;
                width: 100px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                background: #00a65a;
                border-radius: 5px;
                color: #fff;
                margin-top: 10px;
                cursor: pointer;
            }
            #submit-btn:hover{
                background: #0aba69;
            }
            #submit-btn:active{
                background: #059553;
            }
        }
        
    }
</style>
