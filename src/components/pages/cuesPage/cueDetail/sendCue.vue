<template>
    <div id="send">
        <el-select class="select" v-model="text">
            <el-option v-bind:value="item.DWMC" v-for="(item,index) in XJY" :key="index">{{item.DWMC}}</el-option>
        </el-select>
        <el-button @click="confirmBtn">确认分流</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            XJY:[], //下级院数据
            text:'',
            GZBH:'',
        }
    },
    mounted(){
        var _this = this;
        this.$root.Bus.$on('sendGZBH',function(obj){
            _this.GZBH = obj;
            _this.XJYget();
        })
    },
    methods:{
        //获取下级院
        XJYget(){
            var _this = this;
            this.axios({
                method:'get',
                url:webApi.Host + webApi.User.GetUserSubOrgs,
                timeout:10000
            }).then(function(response){
                if(response.data.code == 0){
                    _this.XJY = response.data.data;
                }else{

                }
            }).catch(function(error){

            })
        },
        //确认分流
        confirmBtn(){
            var _this = this;
            let obj = {};
            for(var i = 0;i<this.XJY.length;i++){
                if(_this.XJY[i].DWMC == _this.text){
                    obj = _this.XJY[i];
                }
            }
            console.log(obj);
            this.axios({
                method:'post',
                url:webApi.ClueManager.DispatchClue.format({id:this.GZBH,cbdwbh:obj.DWBM,cbdwmc:obj.DWMC}),
                timeout:10000
            }).then(function(response){
                if(response.data.code == 0){
                    _this.$message({
                        message:'已成功分流至'+ obj.DWMC,
                        type:'success'
                    })
                }else{

                }
            }).catch(function(error){

            })
        },
    }
}
</script>

<style lang="scss" scoped>
    #send{
        margin-top: 10px;
        .select{
            width: 60%;
        }
    }
</style>
