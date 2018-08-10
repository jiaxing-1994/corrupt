<template>
    <div class="amap-page-container" v-loading="isLoad">
        <el-amap ref="map" vid="amap" :center="center" :zoom="zoom" class="amap-demo">
            <el-amap-marker :events="item.events" v-for="(item,index) in markers1" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers2" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers3" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers4" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers5" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers6" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers7" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers8" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers9" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-marker :events="item.events"  v-for="(item,index) in markers10" :position="item.position" :template="item.template" ></el-amap-marker>
            <el-amap-info-window
                :position="currentWindow.position"
                :visible = "currentWindow.visible"
                :offset = "offset"
            >
                <div :style="amapWindow">
                    <div v-for="item in content">
                        <span>{{item}}</span>
                    </div>
                </div>
            </el-amap-info-window>
        </el-amap>
    </div>
</template>

<script>
export default {
    props:['tableId'],
    data: function() {
        return {
            zoom: 10, //地图放大级别
            center: [114.055038,22.627974], //地图中心左边(深圳)
            markers1:[], //图标标点
            markers2:[], //图标标点
            markers3:[], //图标标点
            markers4:[], //图标标点
            markers5:[], //图标标点
            markers6:[], //图标标点
            markers7:[], //图标标点
            markers8:[], //图标标点
            markers9:[], //图标标点
            markers10:[], //图标标点
            content:{
                name:'XXXX',
                content:'撒打算'
            },
            currentWindow:{
                position:[114.025973657,22.5460535462],
                visible:false,
            },
            offset:[5,-15], //弹出框偏移量
            amapWindow:{}, //弹出框样式
            iconClass:[
                'iconfont icon-ruhehupaiwukou', //重点排污单位环境信息
                'iconfont icon-fenshaolei-default', //生活垃圾焚烧厂
                'iconfont icon-jingxihuaxuepin', //危险化学品企业
                'iconfont icon-yingyongjianceqi', //非国家重点监控企业污染源
                'iconfont icon-gongsimingcheng', //深圳自然灾害室内应急避难场所
                'iconfont icon-gongsimingcheng', //深圳严控废物经营单位
                'iconfont icon-jiandukaohejiankong', //国家重点监控企业污染源监督性结果
                'iconfont icon-gongyuan', //湿地公园
                'iconfont icon-ziranfengguang', //自然保护区
                'iconfont icon-huwaixiuxi', //森林公园
                'iconfont icon-huwaixiuxi', //危险废物产生企业
            ],
            isLoad:false,
            tableId2:[],
            allTableId:{
            '289569672':1,
            '664369253':2,
            '886003415':3,
            '982575290':4,
            '1341555166':5,
            '1161369484':6,
            '59049102':7,
            '789079836':8,
            '1301452358':9,
            '789087524':10,
            // '危险废物产生企业信息':'1265508712'
          },
        }
    },
    mounted(){
        let marker = [];
        let _this = this;
        this.tableId2 = this.tableId;
        this.getData(_this.tableId[0]);
        this.$root.Bus.$on('moveToCenter',function(obj){
            _this.center = obj;
        })
    },
    methods: {
        //获取数据
        getData(id){
            var _this = this;
            _this.isLoad = true;
                _this.axios({
                    method:'get',
                    url:webApi.WebData.GetData.format({sjsybh:id,p:1,ps:10000}),
                    timeout: 1000 * 30
                }).then(function(response){
                    if(response.data.code == 0){
                        _this.isLoad = false;
                        if(response.data.data[0].表名称 == "重点排污单位环境信息"){
                            _this.drawOnMap(1,response.data.data);
                        }else if(response.data.data[0].表名称 == "生活垃圾焚烧厂一览表"){
                            _this.drawOnMap(2,response.data.data);
                        }else if(response.data.data[0].表名称 == "危险化学品企业信息"){
                            _this.drawOnMap(3,response.data.data);
                        }else if(response.data.data[0].表名称 == "非国家重点监控企业污染源监督性监测结果"){
                            _this.drawOnMap(4,response.data.data);
                        }else if(response.data.data[0].表名称 == "深圳市自然灾害室内应急避难场所"){
                            _this.drawOnMap(5,response.data.data);
                        }else if(response.data.data[0].表名称 == "深圳市严控废物经营单位名称"){
                            _this.drawOnMap(6,response.data.data);
                        }else if(response.data.data[0].表名称 == "国家重点监控企业污染源监督性监测结果"){
                            _this.drawOnMap(7,response.data.data);
                        }else if(response.data.data[0].表名称 == "湿地公园"){
                            _this.drawOnMap(8,response.data.data);
                        }else if(response.data.data[0].表名称 == "自然保护区"){
                            _this.drawOnMap(9,response.data.data);
                        }else if(response.data.data[0].表名称 == "森林公园"){
                            _this.drawOnMap(10,response.data.data);
                        }
                    }else{

                    }
                }).catch(function(error){
                  _this.isLoad = false;
                })
        },
        //数据上图
        drawOnMap(index,data){
            var _this = this;
            let marker = [];
            let iconName = ''; //图标名称
            let styleName = ''; //样式//获得图标
            if(index == 1){
                iconName = _this.iconClass[0];
                styleName = 'color: #4b65c7;'
            }else if(index == 2){
                iconName = _this.iconClass[1];
                styleName = 'color: #a11c08;'
            }else if(index == 3){
                iconName = _this.iconClass[2];
                styleName = 'color: #03a6fc'
            }else if(index == 4){
                iconName = _this.iconClass[3];
                styleName = 'color: #d3257a;'
            }else if(index == 5){
                iconName = _this.iconClass[4];
                styleName = 'color: #dd51f5;'
            }else if(index == 6){
                iconName = _this.iconClass[5];
                styleName = 'color: #14227b;'
            }else if(index == 7){
                iconName = _this.iconClass[6];
                styleName = 'color: #f77008;'
            }else if(index == 8){
                iconName = _this.iconClass[7];
                styleName = 'color: #38e858;'
            }else if(index == 9){
                iconName = _this.iconClass[8];
                styleName = 'color: #0eadac;'
            }else if(index == 10){
                iconName = _this.iconClass[9];
                styleName = 'color: #029e07;'
            }
            for(var i = 0;i<data.length;i++){
                    let position = '';
                    //获得坐标
                    if(data[i].经纬度 != ''&&data[i].经纬度 != null){
                        position = data[i].经纬度.split(',');
                        position[0] = parseFloat(position[0]);
                        position[1] = parseFloat(position[1]);
                        //获得内容
                        let content = {}; //内容
                        for(var j in data[i]){
                            content[j] = data[i][j];
                        }
                        marker.push(
                        {
                            position:position,
                            template:'<i class="' + iconName + '" style="font-size: 30px;font-weight: bold;' + styleName + '"></i>',
                            events:{
                                click:(o)=>{
                                    // _this.showInfo = true;
                                    _this.currentWindow = {
                                        position:position,
                                        visible:false,
                                    };
                                    _this.content = content;
                                    _this.$nextTick(() => {
                                        _this.currentWindow.visible = true;
                                    });
                                }
                            }
                        }
                        )
                    }
            }
            if(index == 1){
                _this.markers1 = marker;
            }else if(index == 2){
                _this.markers2 = marker;
            }else if(index == 3){
                _this.markers3 = marker;
            }else if(index == 4){
                _this.markers4 = marker;
            }else if(index == 5){
                _this.markers5 = marker;
            }else if(index == 6){
                _this.markers6 = marker;
            }else if(index == 7){
                _this.markers7 = marker;
            }else if(index == 8){
                _this.markers8 = marker;
            }else if(index == 9){
                _this.markers9 = marker;
            }else if(index == 10){
                _this.markers10 = marker;
            }
        }
    },
    watch:{
        tableId:function(){
            var _tableId = this.tableId;
            _tableId = _tableId.slice(0,_tableId.length-1);
            // if(this.tableId.length == 0){
            //     this.markers = [];
            // }else{
            //     this.getData();
            // }
            var _this = this;
            var currId = '';
            var type = '0'; //0删除 1增加
            if(_tableId.length == 0){
                this.markers1=[]; //图标标点
                this.markers2=[]; //图标标点
                this.markers3=[]; //图标标点
                this.markers4=[]; //图标标点
                this.markers5=[]; //图标标点
                this.markers6=[]; //图标标点
                this.markers7=[]; //图标标点
                this.markers8=[]; //图标标点
                this.markers9=[]; //图标标点
                this.markers10=[]; //图标标点
                this.tableId2 = [];
            }else if(_tableId.length > 0&&this.tableId2.length > 0){
                function sortNumber(a,b)
                {
                    return a - b
                }
                _tableId.sort(sortNumber);
                _this.tableId2.sort(sortNumber);
                //增加
                if(_tableId.length > _this.tableId2.length){
                    for(var i = 0;i<_tableId.length;i++){
                        for(var j = 0;j<_this.tableId2.length;j++){
                            if(_this.tableId2[j] == _tableId[i]){
                                break;
                            }else if(j == _this.tableId2.length - 1){
                                currId = _tableId[i];
                                type = 1;
                            }
                        }
                    }
                }else if(_tableId.length < _this.tableId2.length){ //删除
                    for(var i = 0;i<_this.tableId2.length;i++){
                        for(var j = 0;j<_tableId.length;j++){
                            if(_this.tableId2[i] == _tableId[j]){
                                break;
                            }else if(j == _tableId.length - 1){
                                currId = _this.tableId2[i];
                                type = 0;
                            }
                        }
                    }
                }
            }else if(_tableId.length >0 &&this.tableId2.length == 0){
                currId = _tableId[0];
                type = 1;
            }
            _this.tableId2 = _tableId;
            if(type == 0){
                var id = _this.allTableId[currId];
                if(id == 1){
                    _this.markers1 = [];
                }else if(id == 2){
                    _this.markers2 = [];
                }else if(id == 3){
                    _this.markers3 = [];
                }else if(id == 4){
                    _this.markers4 = [];
                }else if(id == 5){
                    _this.markers5 = [];
                }else if(id == 6){
                    _this.markers6 = [];
                }else if(id == 7){
                    _this.markers7 = [];
                }else if(id == 8){
                    _this.markers8 = [];
                }else if(id == 9){
                    _this.markers9 = [];
                }else if(id == 10){
                    _this.markers10 = [];
                }
            }else if(type == 1){
                _this.getData(currId);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.amap-page-container{
    height: 100%;
    .amap-demo {
      height: 100%;
    }
    .circle{
        display: block;
        border-radius: 50px;
        width: 20px;
        height: 20px;
        background: black;
    }
}
</style>
