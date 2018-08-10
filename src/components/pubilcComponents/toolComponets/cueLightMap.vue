<template>
    <div id="light-map">
        <div id="cue-lightMap">
        </div>
        <span id="satellite" @click="switchMap" :class="isSatellite?'active':''">
            <span ><i class="fa fa-globe"></i>卫星</span>
        </span>
    </div>
</template>

<script>
    
    export default {
        props:['JWD','FBDD'],
        data(){
            return {
                zoom: 10, //地图放大级别
                center:[114.055038,22.627974],
                map:null,
                isSatellite:true,
            }
        },
        mounted(){
            this.initSatellite();
        },
        methods:{
            //初始化卫星地图
            initSatellite(){
                var _this = this;
                this.map = new AMap.Map('cue-lightMap',{
                    layers: [new AMap.TileLayer.Satellite()],
                    zoom: 15, //地图放大级别
                    center:_this.JWD,
                })
                this.pointMark();
            },
            //初始化默认地图
            initDefault(){
                var _this = this;
                this.map = new AMap.Map('cue-lightMap',{
                    layers: [new AMap.TileLayer()],
                    zoom: 15, //地图放大级别
                    center:_this.JWD,
                })
                this.pointMark();
            },
            //点标记
            pointMark(){
                var _this = this;
                var mark = new AMap.Marker({
                    icon:'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    center:_this.JWD,
                });
                mark.setMap(this.map);
                mark.setLabel({
                    offset:new AMap.Pixel(20,0),
                    content:_this.FBDD
                })
            },
            //切换地图
            switchMap(){
                this.isSatellite = !this.isSatellite;
                if(this.isSatellite){
                    //卫星地图
                    this.initSatellite();
                }else{
                    //路况地图
                    this.initDefault();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
#light-map{
    width: 100%;
    height: 100%;
    position: relative;
    #cue-lightMap{
        width: 100%;
        height: 100%;
    }
    #satellite{
        position: absolute;
        top: 10px;
        left: 10px;
        display: block;
        padding:0px 5px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color:rgb(119, 119, 119);
        background: #fff;
        z-index: 10;
        border-radius: 5px;    
        box-shadow: 0 0 5px #5d5d5d;
        cursor: pointer;
    }
    .active{
        color:#68b4d7 !important;
    }
}
</style>
