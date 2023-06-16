<template>
    <div class="page">
        <div class="left">
            <div class="left-top">
                <ul>
                    <li @click="filter(1)">全部({{ tableAll || 0 }})</li>
                    <li @click="filter(2)">在线({{ tableOnline || 0 }})</li>
                    <li @click="filter(3)">已满(1)</li>
                    <li @click="filter(4)">离线({{ tableOffline || 0 }})</li>
                </ul>
            </div>
            <div class="left-search">
                <el-input suffix-icon="el-icon-search" v-model="searchInput" @change="searchValue()"></el-input>
            </div>
            <div class="left-table">
                <el-table :data="tableData">
                    <el-table-column prop="did" align="center" label="所属乡镇">
                    </el-table-column>
                    <el-table-column prop="nm" align="center" label="名称">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.st === 1">
                                <img @click="getmonitoring()" style="width: 20px;height: 20px;"
                                    src="./img/blue监控.png" />
                                <img @click="getoilConsumption()" style="width: 20px;height: 20px;"
                                    src="./img/blue曲线图.png" />
                            </span>
                            <span v-else>
                                <img @click="getmonitoring()" style="width: 20px;height: 20px;"
                                    src="./img/智慧环保_监控.png" />
                                <!-- <img @click="getoilConsumption()" style="width: 20px;height: 20px;"
                                    src="./img/gren曲线图.png" /> -->
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="right">
            <div id="container"></div>
        </div>
    </div>
</template>
<script type="text/javascript">
window._AMapSecurityConfig = {
    securityJsCode: '79a5d3b87ec5dacf7aa2f57074ae75d5',
}
</script>
<script src="https://webapi.amap.com/maps?v=2.0&key=79a5d3b87ec5dacf7aa2f57074ae75d5&plugin=AMap.Autocomplete"></script>
<script>
import axios from "axios";
import img1 from './img/检测站 (3).png'
export default {
    data() {
        return {
            // 地图
            map:null,
            // 左侧表格数据
            tableData: [],
            // 搜索框数据
            searchInput:'',
            jsession:''
        }
    },
    methods: {
        // 获取左侧全部信息
        async getArmamentariums() {
            const {data} = await axios.get(`http://dy.qc-online.net:9000/OpenApi/service/devlist?jsession=${this.jsession}`)
            console.log(data);
            data.devices.forEach(item=>{
                data.domain.forEach(item1=>{
                    if(item.did == item1.did){
                        item.did = item1.dn
                    }
                })
            })
            this.tableData = data.devices
        },
        // 左侧人员信息的筛选事件
        filter(type) {
            console.log(type);
        },
        // 搜索
        searchValue(e){
            console.log(this.searchInput);
        },
        // 查看监控
        getmonitoring(){
            console.log('监控');
        },
        // 查看油耗曲线
        getoilConsumption(){
            console.log('油耗');
        },
        // 地图覆盖物
        async getMarkers(map){
            const {data} = await axios.get(`http://dy.qc-online.net:9000/OpenApi/gnss/devpos?jsession=${this.jsession}`)
            console.log(data.pos,'地图');
            let markers = []
            let Icon
            data.pos.forEach(item => {
                if(item.st == 0){
                    Icon = img
                }else{
                    Icon = img1
                }
                let marker = new AMap.Marker({
                    map: this.map,
                    icon: Icon,
                    position: [item.ln, item.la],
                    offset: new AMap.Pixel(0, 0)
                })
                marker.setTitle('中转站')
                marker.setLabel({
                    offset:new AMap.Pixel(0,0),
                    content:"<div>123123123123</div>",
                    direction: 'bottom-center'
                })
                markers.push(marker)
            });
            this.map.add(markers)
        },
        async createMap() {
            const {data} = await axios.get(`http://dy.qc-online.net:9000/OpenApi/gnss/devpos?jsession=${this.jsession}`)
            var map = new AMap.Map('container',{
                zoom:11,//级别
                center: [data.pos[1].ln, data.pos[1].la],//中心点坐标
                viewMode:'3D'//使用3D视图
            });
            this.map = map
            console.log(map);
            this.getMarkers(map)
        },
        // 保存登录状态
        async loginAndKeepalive() {
            const data = await axios.get('http://dy.qc-online.net:9000/OpenApi/service/login?account=test&password=test')
            this.jsession = data.data.jsession
            this.keepaliveTimer = setInterval(async () => {
                const data = await axios.get('http://dy.qc-online.net:9000/0penApi/service/login?account=test&password=test')
                this.jsession = data.data.jsession
            }, 1000 * 60 * 3);
        },
    },
    async mounted() {
        await this.loginAndKeepalive()
        this.getArmamentariums()
        this.createMap()
    },
    computed:{
        tableAll: function () {
            return this.tableData.length
        },
        tableOnline:function () {
            return this.tableData.filter((item)=>{
                return item.offTime == '在线'
            }).length0
        },
        tableOffline:function () {
            return this.tableData.filter((item)=>{
                return item.offTime == '离线'
            }).length
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

// 图标
.el-jiankong1 {
    background: url(./img/blue曲线图.png) center no-repeat;
}

.amap-marker-label {
    border: 0;
    background-color: transparent;
}

.page {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
        width: 28%;
        height: 100%;
        // background-color: antiquewhite;

        .left-top {
            height: 1.5rem;

            ul {
                align-items: center;
                display: flex;
                list-style: none;

                li {
                    height: 1.5rem;
                    line-height: 1.5rem;
                    // border-right: 1px solid black;
                    width: 25%;
                    text-align: center;
                    cursor: pointer;
                }

                li:nth-child(1) {
                    background-color: #d0cfd1;
                    color: #326dd4;
                }

                li:nth-child(2) {
                    background-color: #3519FF;
                    color: white;
                }

                li:nth-child(3) {
                    background-color: #D80520;
                    color: white;
                }

                li:nth-child(4) {
                    background-color: #C0C0C0;
                    color: black;
                }
            }
        }

        .left-search {
            width: 100%;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .left-table {
            width: 100%;
        }
    }

    .right {
        margin-left: 15px;
        // width: 72%;
        width: 100%;
        height: 85vh;
        // background-color: aqua;

        #container {
            width: 100%;
            height: 100%;

            .amap-marker-label {
                border: 0;
                background-color: transparent;
            }
        }
    }
}
</style>