<template>
    <div id="main" v-loading="isLoad">
        <div class="advise">
            <i class="timeline-icon fa fa-circle-thin"></i>
            <div class="advise-title">初核意见</div>
            <div class="advise-content">
                <span class="no-result" v-show="firstData == ''">暂无初核意见</span>
                <span v-html="firstData"></span>
            </div>
            <div v-show="firstData != ''" style="font-size: 12px;color: #696969;">{{firstTime}}</div>
        </div>
        <div class="advise advise-notice" v-show="isSubmitFirst">
            <i class="timeline-icon fa fa-circle-thin"></i>
            <span v-show="isSubmitFirst&&!isSubmitLeader">已提交，等待领导审批</span>
            <span v-show="isSubmitFirst&&isSubmitLeader">已审批</span>
        </div>
        <div class="advise" v-if="isSubmitFirst&&isSubmitLeader">
            <i class="timeline-icon fa fa-circle-thin"></i>
            <div class="advise-title">审批意见</div>
            <div class="advise-content">
                <!-- <span v-html="leaderData"></span> -->
                <pre>{{leaderData}}</pre>
            </div>
            <div v-show="leaderData != ''" style="font-size: 12px;color: #696969;">{{leaderTime}}</div>
        </div>
        <div v-loading="isSubmitLoad" class="advise edit-advise" v-if="((identity == 1 && !isSubmitFirst) || (identity == 1 && isSubmitFirst && isSubmitLeader)) || identity == 3">
            <!-- <i class="timeline-icon fa fa-circle-thin"></i> -->
            <div class="advise-title">编写意见</div>
            <editor id="approval-edit" height="300px" width="100%" :content="editorText"
            pluginsPath="@/../static/kindeditor/plugins/"
            :loadStyleMode="false"
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
        return {
            isLoad:true, //数据加载
            editorText:'', //编辑意见
            firstData:'', //初核意见
            firstTime:'', //初核时间
            leaderData:'', //审批意见
            leaderTime:'', //审批时间
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
            identity:null, //权限
            XSBH:'',
            GZBH:'',
            isSubmitFirst:false,
            isSubmitLeader:false,
            isSubmitLoad: false, //提交等待
        }
    },
    mounted(){
        var _this = this;
        this.identity = localStorage.IdentityType;  //获取身份权限
        this.XSBH = this.$route.query.id; //获取线索编号
        this.$root.Bus.$on('sendGZBH',function(obj){
            _this.GZBH = obj;
            _this.getAdvise();
        })
    },
    methods:{
        //获取初核/审核意见
        getAdvise(){
            var _this = this;
            // this.firstData = this.editorText; //
            this.isLoad = true;
            this.axios({
                method:'get',
                url:webApi.ClueManager.GetApprovalResult.format({gzbh:this.GZBH}),
                timeout:10000
            }).then(function(response){
                _this.isLoad = false;
                if(response.data.code == 0){
                    if(response.data.data[0].CHYJ){
                        _this.firstData = response.data.data[0].CHYJ;
                        _this.firstTime = response.data.data[0].CJSJ;
                        _this.isSubmitFirst = true;
                    }else{
                        _this.firstData = '';
                        _this.isSubmitFirst = false;
                    }
                    if(response.data.data[0].SPYJ){
                        _this.leaderData = response.data.data[0].SPYJ;
                        _this.leaderTime = response.data.data[0].SPSJ;
                        _this.isSubmitLeader = true;
                    }else{
                        _this.leaderData = '';
                        _this.isSubmitLeader = false;
                    }
                }else{

                }
            }).catch(function(error){
                _this.isLoad = false;

            })
        },
        //提交审批
        submitBtn(){
            var _this = this;
            if(this.editorText.trim() == ''){
                this.$message({
                    message:'请输入内容',
                    type:'error'
                })
            }else{
                if(!localStorage.IdentityType){
                    window.location.reload()
                }else{
                    if(this.identity == 1){
                        //管理员
                        var param = {
                            xsbh:_this.XSBH,
                            xschyj:_this.editorText,
                        }
                        _this.isSubmitLoad = true;
                        _this.axios({
                            method:'post',
                            url:webApi.Host + webApi.ClueManager.SaveClueOpinion,
                            data:param,
                            timeout: 10000
                        }).then(function(response){
                            _this.isSubmitLoad = false;
                            if(response.data.code == 0){
                                _this.editorText = '';
                                _this.$message({
                                    message:'提交成功',
                                    type:'success',
                                })
                                _this.getAdvise();
                            }else{

                            }
                        }).catch(function(error){
                            _this.isLoad = false;
                        })
                    }else if(this.identity == 3){
                        //领导
                        if(this.$route.query.spid){
                            var param = {
                                spbh:this.$route.query.spid,
                                spyj:this.editorText
                            }
                            this.isSubmitLoad = true;
                            this.axios({
                                method:'post',
                                url:webApi.Host + webApi.ClueManager.Approval,
                                data:param,
                                timeout:10000
                            }).then(function(response){
                                _this.isSubmitLoad = false;
                                if(response.data.code == 0){
                                    _this.editorText = '';
                                    _this.$root.Bus.$emit('changeWaitApproval')
                                    _this.$message({
                                        message:'提交成功',
                                        type:'success',
                                    })
                                    _this.getAdvise();
                                }
                            }).catch(function(error){
                                _this.isSubmitLoad = false;

                            })
                        }
                    }
                }
            }
        },
        //修改内容
        onContentChange(val){
            this.editorText = val;
        }
    }
}
</script>

<style lang="scss" scoped>
    #main{
        width: 100%;
        padding: 20px;    
        padding-right: 0;
        padding-left: 0;
        .advise{
            position: relative;
            padding-left: 40px;
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
            .timeline-icon:last-child:before{
                display: none;
            }
            .advise-tip{
                height: 30px;
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
        .advise-notice{
            height: 50px;
            line-height: 50px;
            .timeline-icon{
                top: 15px;
            }
        }
        .edit-advise{
            margin-top: 10px;
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
        .advise:before{
            content:'';
            position: absolute;
            width: 1px;
            height: 100%;
            background: #dfdfdf;
            top: 15px;
            left: 9px;
        }
        .advise:nth-child(3):before{
            display: none;
        }
        .advise:nth-child(4):before{
            display: none;
        }
        .advise:last-child:before{
            display: none;
        }
    }
</style>
