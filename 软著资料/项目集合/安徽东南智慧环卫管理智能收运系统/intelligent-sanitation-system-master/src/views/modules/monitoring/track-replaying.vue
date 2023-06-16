<template>
  <el-dialog width="85vw" style="margin-top: 0px !important; margin-left: 70px" title="轨迹回放"
    :visible="addOrUpdateVisible" @close="closeDialog">
    <div class="map-outbox" @click="wawaww">
      <div id="containerTrack"></div>
      <!-- 进度条 -->
      <div class="map-control">
        <Icon v-if="!isPlay" class="play-icon" type="ios-play" @click="
  isPlay = true;
navgControl(playIcon);
        " />
        <Icon v-else class="play-icon" type="ios-pause" @click="
  isPlay = false;
navgControl('pause');
        " />
        <span class="passed-time">{{ messageTime }}</span>
        <Slider class="map-slider" v-model="sliderVal" :tip-format="hideFormat" :step="0.01"></Slider>
        <div class="map-times" @mouseenter="isTimesChoose = true" @mouseleave="isTimesChoose = false">
          <div class="times-show">倍速 {{ times / 20 }}</div>
          <div class="choose-box">
            <ul v-show="isTimesChoose">
              <li v-for="item in speedList" :key="item" :class="{ active: times == item }" @click="changeSpeed(item)">
                倍速 {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <span class="passed-time">{{ endTime }}</span>
      </div>
      <div class="carMessage">
        <!-- <el-button @click="changeValue1(0)">今天</el-button>
        <el-button @click="changeValue1(1)">昨天</el-button>
        <el-button @click="changeValue1(2)" style="margin-right: 3px">前天</el-button> -->
        <el-date-picker v-model="value1" style="width:340px" range-separator="至" start-placeholder="开始日期"
          type="datetimerange" :picker-options="pickerOptions" end-placeholder="结束日期" align="right">
        </el-date-picker>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="queryCarTrack">查询</el-button>
        <el-button @click="
  isPlay = true;
navgControl(playIcon);
        " v-if="!isPlay">播放</el-button>
        <el-button @click="
  isPlay = false;
navgControl('pause');
        " v-else>暂停</el-button>

        <br />

        <div style="margin: 10px" v-if="messageDept != '' && type == 1">
          <span class="messageTitle">所属部门：</span><span>{{ messageDept }}</span><br />
          <span class="messageTitle">车辆编号：</span><span>{{ messageCode }}</span><br />
          <span class="messageTitle">行驶速度：</span><span>{{ messageSpeed }}</span><br />
          <span class="messageTitle">行驶里程：</span><span>{{ messageMileage }}</span><br />
          <span class="messageTitle">作业里程：</span><span>{{ messageWorkMileage }}</span><br />
          <span class="messageTitle">当前时间：</span><span>{{ messageTime }}</span><br />
          <span class="messageTitle">状态：</span>
          <span v-if="messagegostatus == 0">停车</span>
          <span v-if="messagegostatus == 1">行驶</span>
          <br />
          <span class="messageTitle">当前油量：</span><span>{{ messagegostatus }}</span><br />
          <span class="messageTitle">当前位置：</span><span>{{ messageaddress }}</span><br />
        </div>
        <div style="margin: 10px" v-if="messageDept != '' && type == 2">
          <span class="messageTitle">所属部门：</span><span>{{ messageDept }}</span><br />
          <span class="messageTitle">人员姓名：</span><span>{{ messageCode }}</span><br />
          <span class="messageTitle">行驶速度：</span><span>{{ messageSpeed }}</span><br />
          <span class="messageTitle">作业里程：</span><span>{{ messageMileage }}</span><br />
          <span class="messageTitle">总里程：</span><span>{{ messageTotalDistance }}</span><br />
          <span class="messageTitle">当前时间：</span><span>{{ messageTime }}</span><br />

          <!-- messagegostatus -->
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getPositionStatusList,
  getPositionStatusList4Datetime,
  getMistakeInfoList,
  getWorkScheduleRoadIdsByVehId,
  getListRoadSectionById,
  getOilByPositionId,
  getMistakeInfoVehTree,
  getPersonEventByIds
} from "@/api/carmonitoring";
import formatDate from "@/utils/dateUtil.js";
import carWork from "@/assets/img/carWork3.png";
import workerWork from "@/assets/img/personRun.png";
import greenPng from "@/assets/img/green.png";

let markers = [];
let cluster;
export default {
  name: "carmonitoring2",
  data() {
    return {
      infoData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              let e = new Date();
              let year = e.getFullYear(); //获取完整的年份(4位)
              let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
              let day = e.getDate(); //获取当前日(1-31)
              const end = e;
              const start = new Date(year, month, day, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              let e = new Date();
              let year = e.getFullYear(); //获取完整的年份(4位)
              let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
              let day = e.getDate() - 1; //获取当前日(1-31)
              const end = new Date(year, month, day, 23, 59, 59, 0);
              const start = new Date(year, month, day, 0, 0, 0);
              // start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "前天",
            onClick(picker) {
              let e = new Date();
              let year = e.getFullYear(); //获取完整的年份(4位)
              let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
              let day = e.getDate() - 2; //获取当前日(1-31)
              const end = new Date(year, month, day, 23, 59, 59, 0);
              const start = new Date(year, month, day, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      polygon: {},
      addOrUpdateVisible: false,
      car: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
      map: null,
      isOnSlider: false, //是否为手动鼠标拉动进度条
      playIcon: "resume", //开始按钮是重新开始还是继续
      isTimesChoose: false, //选择速度弹窗的open/close
      passedTime: "00:00:00", //已经走了的时间
      totalTime: "00:00:00", //已经走了的时间
      isPlay: false, //是否为播放
      sliderVal: 0, //进度条滑动速度
      speed: 100, //初始速度，km、h
      times: 20, //几倍速度播放
      navgtr: null, //巡航器
      speedList: [8, 4, 2, 1],
      pathList: [],
      trackList: [],
      queryParams: {
        eventStartDate: "2020-10-01",
        eventEndDate: "2021-12-30",
        workerId: null,
        startDate: '',
        endDate: ''
      },
      renyuanqueryParams: {
        ids: null,
        startDate: "2020-10-01",
        endDate: "2021-12-30",
        workerId: null,
      },
      messageDept: "",
      messageCode: "",
      messageSpeed: 0,
      messageMileage: 0,
      messageWorkMileage: 0,
      messageTime: "",
      messagegostatus: "",
      messageaddress: "",
      messageTotalDistance: 0,
      endTime: "",
      value1: "",
      value2: "",
      type: 1,
    };
  },
  mounted() { },
  created() {
    this.getOilByPositionIdw();
  },
  methods: {
    initEventTree() {
      console.log(111)
      let that = this;
      getMistakeInfoVehTree().then((response) => {
        let eventDataList = [];
        eventDataList = response.data.data.filter(
          (item) => {
            console.log(item)
          }
        );
        console.log(this.infoData)
        // eventDataList.map((item) => {
        //   item.len = item.children.length;
        // });
      });
    },
    changeValue1(data) {
      if (data == 0) {
        let e = new Date();
        let year = e.getFullYear(); //获取完整的年份(4位)
        let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
        let day = e.getDate(); //获取当前日(1-31)
        const end = e;
        const start = new Date(year, month, day, 0, 0, 0);
        this.$set(this.value1, 0, start);
        this.$set(this.value1, 1, end);
      } else if (data == 1) {
        let e = new Date();
        let year = e.getFullYear(); //获取完整的年份(4位)
        let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
        let day = e.getDate() - 1; //获取当前日(1-31)
        console.log(year, month, day);
        const end = new Date(year, month, day, 23, 59, 59, 0);
        const start = new Date(year, month, day, 0, 0, 0);
        this.$set(this.value1, 0, start);
        this.$set(this.value1, 1, end);
      } else {
        let e = new Date();
        let year = e.getFullYear(); //获取完整的年份(4位)
        let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
        let day = e.getDate() - 2; //获取当前日(1-31)
        console.log(year, month, day);
        const end = new Date(year, month, day, 23, 59, 59, 0);
        const start = new Date(year, month, day, 0, 0, 0);
        this.$set(this.value1, 0, start);
        this.$set(this.value1, 1, end);
      }
      console.log(this.value1, 'value1');
    },
    initParameter() {
      this.addOrUpdateVisible = true;
      let that = this;
      this.$nextTick(() => {
        this.value1 = [];
        let e = new Date();
        let year = e.getFullYear(); //获取完整的年份(4位)
        let month = e.getMonth(); //获取当前月份(0-11,0代表1月)
        let day = e.getDate(); //获取当前日(1-31)
        this.value1.push(new Date(year, month, day, 0, 0, 0));
        let s = new Date();
        this.value1.push(new Date(year, month, day, 23, 59, 59, 0));
        that.clearMap();

        // this.init();
      }, 200);
      // this.init();
    },
    queryCarTrack() {
      console.log(this.value1, 'value1');
      this.clearMap();
      if (this.value1.length > 0) {
        this.queryParams.startDate = formatDate.format(
          this.value1[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        this.queryParams.endDate = formatDate.format(
          this.value1[1],
          "yyyy-MM-dd HH:mm:ss"
        );
        this.init();
      }
    },
    clearMap() {
      this.messageDept = "";
      this.isOnSlider = false;
      this.isTimesChoose = false;
      this.passedTime = "00:00:00";
      this.totalTime = "00:00:00";
      this.isPlay = false;
      this.playIcon = "resume";
      this.isTimesChoose = false;
      this.isPlay = false;
      this.sliderVal = 0;
      this.navgtr = null;
      this.pathList = [];
      this.trackList = [];
      this.speed = 100;
      this.times = 20;
      let param = {
        resizeEnable: true,
        zoom: 19,
      };
      this.map = new AMap.Map("containerTrack", param);
      cluster = new AMap.MarkerClusterer(this.map, markers, { gridSize: 80 });
    },

    getOilByPositionIdw() {
      getOilByPositionId({
        positionId: "303824594",
        startDate: "2022-08-06",
        endDate: "2022-08-06",
      }).then((data) => {
        console.log(data, "qweqweqqqqqqqqqqqqqqqqqqqqqqqqqq");
      });
    },
    getPositionByLonLats(lng, lat) {
      let that = this;
      var lnglatXY = [lng, lat]; // 地图上所标点的坐标
      let geocoder = new AMap.Geocoder({});
      geocoder.getAddress(lnglatXY, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          let address = result.regeocode.formattedAddress;
          // setTimeout(function(){ console.log(address);  that.messageaddress =address},3000);

          // that.messageaddress = '辽宁省阜新市海州区韩家店镇智能无人系统产业基地(建设中)'
          that.messageaddress = address;
          // console.log(that.messageaddress);
        } else {
          console.log("error");
        }
      });
    },
    init() {
      this.trackList = [];
      this.pathList = [];
      // 创建起始和经过的icon
      let iconList = [];
      let that = this;
      console.log(this.queryParams, 'queryParams');
      if (this.type == 1) {
        that.getMistakeInfo();
        that.getRoadSchedule();
        // this.queryParams.vehicleId = this.$route.query.id;
        getPositionStatusList(this.queryParams).then((date) => {
          let trackList = date.data;
          console.log(trackList, 'trackList')
          // trackList.forEach(item => {
          //   // setTimeout(function () { that.getPositionByLonLats(item.xcd, item.ycd) }, 3000);
          //   // that.getPositionByLonLats(item.xcd, item.ycd)
          //   // that.messageaddress = '辽宁省阜新市海州区韩家店镇智能无人系统产业基地(建设中)'
          //   // console.log(add);
          // })

          // getPositionByLonLats()

          if (trackList != null && trackList.length > 1) {
            let len = trackList.length;
            let startPoint = trackList[0];
            let endPoint = trackList[len - 1];
            that.pathList.splice(0, this.pathList.length);
            trackList.forEach((item) => {
              item.stampTime = new Date(item.date).getTime(); //当前时间戳
              this.pathList.push([item.xcd, item.ycd]);
              console.log(new Date(item.date).getTime(), '当前时间戳');
            });
            // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextDistance:下一段路速度：km/h
            trackList.forEach((item, i) => {
              let next = trackList[i + 1];
              if (next) {
                console.log(next.stampTime, item.stampTime, 'next stampTime')
                item.intervalTime = (next.stampTime - item.stampTime) / 1000;
                item.nextDistance = this.distanceFun(
                  [item.xcd, item.ycd],
                  [next.xcd, next.ycd]
                );
                item.nextSpeed =
                  item.nextDistance / 1000 / (item.intervalTime / 60 / 60);
                console.log(item)
              }
            });

            // 订单记录总时间，hh:mm:ss
            that.totalTime = this.getTime(
              (endPoint.stampTime - startPoint.stampTime) / 1000
            );
            that.trackList = trackList;
            that.endTime = trackList[trackList.length - 1].date;
            // this.messageTime = trackList[0].date;
            that.setPath();
            that.drag();
            setTimeout(() => {
              //设置延迟执行
              that.isPlay = false;
              that.navgControl("pause");
            }, 1000);
          } else {
            this.$message({
              message: "当前车辆，未查到轨迹信息",
              type: "warning",
            });
          }
        });
      }

      if (this.type == 2) {
        console.log(this.queryParams.workerId, '这是人员的id');
        this.renyuanqueryParams.workerId = this.$route.query.id;
        that.getMistakeInfo();
        that.getRoadSchedule();
        getPositionStatusList4Datetime(this.queryParams).then((date) => {
          let trackList = date.data;
          console.log(trackList, 'trackListtrackListtrackListtrackList');
          if (trackList.length > 1) {
            let len = trackList.length;
            let startPoint = trackList[0];
            let endPoint = trackList[len - 1];
            that.pathList.splice(0, this.pathList.length);
            trackList.forEach((item) => {
              item.stampTime = new Date(item.createDate).getTime(); //当前时间戳
              this.pathList.push([item.xcd, item.ycd]);
            });
            // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextDistance:下一段路速度：km/h
            trackList.forEach((item, i) => {
              let next = trackList[i + 1];
              if (next) {
                item.intervalTime = (next.stampTime - item.stampTime) / 1000;
                item.nextDistance = this.distanceFun(
                  [item.xcd, item.ycd],
                  [next.xcd, next.ycd]
                );
                item.nextSpeed =
                  item.nextDistance / 1000 / (item.intervalTime / 60 / 60);
              }
            });

            // 订单记录总时间，hh:mm:ss
            that.totalTime = this.getTime(
              (endPoint.stampTime - startPoint.stampTime) / 1000
            );
            that.trackList = trackList;
            that.endTime = trackList[trackList.length - 1].createDate;
            that.setPath();
            that.drag();
            setTimeout(() => {
              //设置延迟执行
              that.isPlay = false;
              that.navgControl("pause");
            }, 1000);
          } else {
            this.$message({
              message: "当前人员，未查到轨迹信息",
              type: "warning",
            });
          }
          //   that.setPath();
          //   that.drag();
          //   that.isPlay = true;
          //   that.navgControl(that.playIcon);
          // } else {
          //   this.map.clearMap();
          //   console.log("没有轨迹信息");
          // }
        });
      }
    },
    wawaww() {

      setInterval(() => {
        let items = document.getElementsByClassName("amap-info");
        let item = items[items.length - 1];
        item.style.zIndex = 1200;
        // item.onmouseenter=this.displayno()
      }, 300)

    },
    getRoadSchedule() {
      let params = { vehicleId: this.queryParams.vehicleId };
      let that = this;
      getWorkScheduleRoadIdsByVehId(params).then((response) => {
        let roadIds = response.data.data;
        if (roadIds != null && roadIds.length > 0) {
          let roadParams = { pathids: roadIds.toString() };
          getListRoadSectionById(roadParams).then((response) => {
            let roadDataList = response.data.data;
            if (roadDataList != null && roadDataList.length > 0) {
              let polygons = [];
              for (let i = 0; i < roadDataList.length; i++) {
                let path = [];
                path.push([
                  roadDataList[i].startlng * 1,
                  roadDataList[i].startlat * 1,
                ]);
                path.push([roadDataList[i].lng * 1, roadDataList[i].lat * 1]);
                let polygon = new AMap.Polyline({
                  path: path,
                  strokeColor: "green",
                  strokeWeight: 6,
                  strokeOpacity: 0.9,
                  zIndex: 50,
                  bubble: true,
                });
                this.polygon = polygon
                polygons.push(polygon);
              }
              that.map.add(polygons);
            }
          });
        }
      });
    },
    getMistakeInfo() {
      let that = this;
      if (that.type == 1) {
        getMistakeInfoList(this.queryParams).then((response) => {
          // cluster.clearMarkers();
          markers = [];
          let listData = response.data.data;
          console.log(listData, 'listData');
          for (let i = 0; i < listData.length; i++) {
            let icon = "http://121.36.213.139/m/exceedSpeed.png";
            if (listData[i].mistaketype == "超时停车") {
              icon = "http://121.36.213.139/m/exceedStop.png";
            }
            let marker = new AMap.Marker({
              map: this.map,
              icon: icon,
              position: [listData[i].xcd, listData[i].ycd],
              offset: new AMap.Pixel(-13, -30)
            });
            console.log(marker);

            marker.on("click", function (e) {
              console.log(e, 'eeeeeeeeeeeee');
              let driverName =
                listData[i].driverName != null ? listData[i].driverName : "";
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 0),
                position: [listData[i].xcd, listData[i].ycd],
                closeWhenClickMap: true,
              });
              let html =
                '<div style="width: 270px;">' +
                '<span class="particularsClass">所属部门：' +
                listData[i].deptName +
                "</span><br/>" +
                '<span class="particularsClass">车辆编号：' +
                listData[i].plateNumber +
                "</span><br/>" +
                '<span class="particularsClass">司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：' +
                driverName +
                "</span><br/>" +
                '<span class="particularsClass">车辆类型：' +
                listData[i].carTypeName +
                "</span><br/>" +
                '<span class="particularsClass">时&nbsp;&nbsp;间&nbsp;&nbsp;段：' +
                listData[i].parkingtime +
                "</span><br/>" +
                '<span class="particularsClass">违规类型：' +
                listData[i].mistaketype +
                "</span><br/>" +
                '<span class="particularsClass">违规时间：' +
                listData[i].date +
                "</span><br/>" +
                '<span class="particularsClass">违规地点：' +
                listData[i].location +
                "</span><br/>" +
                "</div>";
              infoWindow.setContent(html);
              infoWindow.open(that.map, [listData[i].xcd, listData[i].ycd]);
            });
            markers.push(marker);
            // marker.on("click", function (e) {
            //   console.log("aaaa");
            //   this.polygon.setPath(e.passedPath);
            //   this.map.setCenter(e.target.getPosition(), true);
            // });
          }
          that.map.add(markers);
          if (markers.length > 0) {
            this.map.setCenter([listData[0].xcd, listData[0].ycd]);
          }
        });
      }
      if (that.type == 2) {
        console.log(this.queryParams, 'queryParams');
        getPersonEventByIds(this.queryParams).then((response) => {
          // cluster.clearMarkers();
          markers = [];
          let listData = response.data.data;
          console.log(listData, 'listData');
          console.log(this.queryParams, 'queryParams');
          for (let i = 0; i < listData.length; i++) {
            let icon = 'http://121.36.213.139/m/chidao.png';
            if (listData[i].eventType == '越界') {
              icon = 'http://121.36.213.139/m/yuejie.png';
            }
            if (listData[i].eventType == '滞留') {
              icon = 'http://121.36.213.139/m/zhiliu.png';
            }
            if (listData[i].eventType == '脱岗') {
              icon = 'http://121.36.213.139/m/tuogang.png';
            }
            if (listData[i].eventType == '早退') {
              icon = 'http://121.36.213.139/m/zaotui.png';
            }
            let marker = new AMap.Marker({
              map: this.map,
              icon: new AMap.Icon({
                image: icon,
                size: new AMap.Size(52, 52),  //图标大小
                imageSize: new AMap.Size(40, 40)
              }),
              position: [listData[i].xcd, listData[i].ycd],
              offset: new AMap.Pixel(-20, -30),
            });
            console.log(marker);

            marker.on("click", function (e) {
              console.log(e, 'eeeeeeeeeeeee');
              let driverName =
                listData[i].driverName != null ? listData[i].driverName : "";
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(20, 0),
                closeWhenClickMap: true,
              });
              let html = '<div style="width: 300px;">' +
                '<span class="particularsClass">所属部门：' + listData[i].deptName + '</span><br/>' +
                '<span class="particularsClass">人员姓名：' + listData[i].workerName + '</span><br/>' +
                '<span class="particularsClass">时&nbsp;&nbsp;间&nbsp;&nbsp;段：' + listData[i].parkingTime + '</span><br/>' +
                '<span class="particularsClass">违规时长：' + listData[i].eventLong + '</span><br/>' +
                '<span class="particularsClass">违规类型：' + listData[i].eventType + '</span><br/>' +
                '<span class="particularsClass">违规时间：' + listData[i].createDate + '</span><br/>' +
                '<span class="particularsClass">违规地点：' + listData[i].eventPlace + '</span><br/>' +
                '</div>';
              infoWindow.setContent(html);
              infoWindow.open(that.map, [listData[i].xcd, listData[i].ycd]);
            });
            markers.push(marker);
            // marker.on("click", function (e) {
            //   console.log("aaaa");
            //   this.polygon.setPath(e.passedPath);
            //   this.map.setCenter(e.target.getPosition(), true);
            // });
          }
          that.map.add(markers);
          if (markers.length > 0) {
            this.map.setCenter([listData[0].xcd, listData[0].ycd]);
          }
        });
      }
    },
    setPath() {
      let that = this;
      AMapUI.load(
        ["ui/misc/PathSimplifier", "lib/$", "lib/utils"],
        function (PathSimplifier) {
          if (!PathSimplifier.supportCanvas) {
            // console.log("当前环境不支持 Canvas！");
            return;
          }
          let trackList = that.trackList;
          let len = trackList.length;
          var startPoint = trackList[0];
          var endPoint = trackList[len - 1];
          // 轨迹总数
          function onload() {
            that.pathSimplifierIns.renderLater();
          }
          function onerror() {
            // console.log("图片加载失败！");
          }
          // 创建一个 Icon
          var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(25, 34),
            // 图标的取图地址
            image:
              "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
            // 图标所用图片大小
            imageSize: new AMap.Size(135, 40),
            // 图标取图偏移量
            imageOffset: new AMap.Pixel(-9, -3),
          });

          // 将 icon 传入 marker
          var startMarker = new AMap.Marker({
            position: new AMap.LngLat(startPoint.xcd, startPoint.ycd),
            icon: startIcon,
            offset: new AMap.Pixel(-13, -30),
          });
          // 创建一个 icon
          var endIcon = new AMap.Icon({
            size: new AMap.Size(25, 34),
            image:
              "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
            imageSize: new AMap.Size(135, 40),
            imageOffset: new AMap.Pixel(-95, -3),
          });
          // 将 icon 传入 marker
          var endMarker = new AMap.Marker({
            position: new AMap.LngLat(endPoint.xcd, endPoint.ycd),
            icon: endIcon,
            offset: new AMap.Pixel(-13, -30),
          });
          // 将 markers 添加到地图
          that.map.add([startMarker, endMarker]);
          // 历史轨迹巡航器
          that.pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            autoSetFitView: false,
            map: that.map, //所属的地图实例
            getPath: function (pathData) {
              return pathData.path;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              console.log(pathData, pointIndex);
              let html = "";
              // 不赋值 鼠标滑动之后不展示东西
              // if (pointIndex != undefined) {
              // if (that.type == 1) {
              //   console.log(pathData.data[pointIndex - 1]);
              //   html = html =
              //     "速度：" +
              //     pathData.data[pointIndex - 1].speed +
              //     "，方向：" +
              //     pathData.data[pointIndex - 1].direction +
              //     "，行驶里程：" +
              //     pathData.data[pointIndex - 1].totalDistance +
              //     "，时间：" +
              //     pathData.data[pointIndex - 1].createDate +
              //     "<br/>" +
              //     "，位置：" +
              //     pathData.data[pointIndex - 1].date +
              //     "，当前油量：" +
              //     pathData.data[pointIndex - 1].date +
              //     "，状态：" +
              //     pathData.data[pointIndex - 1].gostatus;
              // }
              // if (that.type == 2) {
              //   html =
              //     "" +
              //     pathData.data[pointIndex - 1].speed +
              //     "，方向：" +
              //     pathData.data[pointIndex - 1].direction +
              //     "，行驶里程：" +
              //     pathData.data[pointIndex - 1].totalDistance +
              //     "，时间：" +
              //     pathData.data[pointIndex - 1].createDate +
              //     "<br/>";
              // }
              // }
              return html;
            },
            autoSetFitView: true,
            // 巡航器样式
            renderOptions: {
              pathNavigatorStyle: {
                initRotateDegree: 0,
                width: 50,
                height: 50,
                autoRotate: true,
                lineJoin: "round",
                content: PathSimplifier.Render.Canvas.getImageContent(
                  that.type == 1 ? carWork : workerWork,
                  onload,
                  onerror
                ),
                fillStyle: "#087EC4",
                strokeStyle: "#116394",
                lineWidth: 0,
                pathLinePassedStyle: {
                  lineWidth: 0,
                  strokeStyle: "#15c165",
                  borderWidth: 0,
                  borderStyle: "#eeeeee",
                  dirArrowStyle: false,
                },
              },
              pathLineSelectedStyle: {
                lineWidth: 6,
                strokeStyle: "#3fbbcc",
                borderWidth: 1,
                borderStyle: "#cccccc",
                dirArrowStyle: true,
              },
              startPointStyle: {
                radius: 5,
                fillStyle: "#ffa568",
                lineWidth: 2,
                strokeStyle: "#eeeeee",
              },
              endPointStyle: {
                radius: 5,
                fillStyle: "#ff6b6b",
                lineWidth: 2,
                strokeStyle: "#eeeeee",
              },
              keyPointHoverStyle: {
                radius: 4,
                fillStyle: "#ff8989",
                lineWidth: 2,
                strokeStyle: "#ffa500",
              },
              // keyPointTolerance: -1,
              renderAllPointsIfNumberBelow: that.pathList.length, //绘制路线节点，如不需要可设置为-1
            },
          });
          window.pathSimplifierIns = that.pathSimplifierIns;

          //历史轨迹巡航器设置数据
          that.pathSimplifierIns.setData([
            {
              name: "轨迹",
              path: that.pathList,
              data: trackList,
            },
          ]);
          that.pathSimplifierIns.setSelectedPathIndex(0);

          window.pathSimplifierIns = that.pathSimplifierIns;

          that.pathSimplifierIns.setFitView(-1);

          that.pathSimplifierIns.on("pointClick", function (e, info) {
            let infoData = info.pathData.data[info.pointIndex];
            let infoWindow = new AMap.InfoWindow({ closeWhenClickMap: true });
            this.infoData = infoData
            console.log(infoData, 'infoData');
            let html = "";
            if (that.type == 1) {
              console.log(infoData);
              html =
                '<div style="width:270px;" class="itemmsg">' +
                '<span class="particularsClass">所属部门：' +
                infoData.deptName +
                "</span><br/>" +
                '<span class="particularsClass">车辆编号：' +
                infoData.plateNumber +
                "</span><br/>" +
                '<span class="particularsClass">行驶速度：' +
                infoData.carspeed +
                "</span><br/>" +
                '<span class="particularsClass">方向：' +
                infoData.direction +
                "</span><br/>" +
                '<span class="particularsClass">行驶里程：' +
                infoData.totaldistance +
                "</span><br/>" +
                '<span class="particularsClass">作业里程：' +
                infoData.workmileage +
                "</span><br/>" +
                '<span class="particularsClass">当前时间：' +
                // formatDate.format(new Date(), "yyyy-MM-dd HH:mm:ss") +
                infoData.date +
                "</span><br/>" +
                "</div>";
            }
            if (that.type == 2) {
              console.log(infoData, 'aaaaaaasaaaa');
              let workMileage =
                infoData.workMileage != null ? infoData.workMileage : 0;
              html =
                '<div style="width: 270px;" onmouseout="mouseout1()" onmouseover="mouseout1()">' +
                '<span class="particularsClass">所属部门：' +
                infoData.orgName +
                "</span><br/>" +
                '<span class="particularsClass">人员姓名：' +
                infoData.workerName +
                "</span><br/>" +
                '<span class="particularsClass">当前速度：' +
                infoData.speed +
                "</span><br/>" +
                '<span class="particularsClass">方向：' +
                infoData.direction +
                "</span><br/>" +
                '<span class="particularsClass">作业里程：' +
                workMileage +
                "</span><br/>" +
                '<span class="particularsClass">总里程：' +
                infoData.totalDistance +
                "</span><br/>" +
                '<span class="particularsClass">当前时间：' +
                infoData.createDate +
                "</span><br/>" +
                "</div>";
            }
            infoWindow.setContent(html);
            // this.initEventTree()
            console.log(infoWindow);
            infoWindow.open(that.map, [infoData.xcd, infoData.ycd]);
            console.log(infoWindow.getPosition());
            console.log(infoWindow.getSize());
            console.log(infoWindow.getContent());
            console.log(infoData.xcd, infoData.ycd);
          });

          let startSpeed = that.speedFun(
            that.pathList[0],
            that.pathList[1],
            startPoint.intervalTime
          );
          startSpeed === 0 && (startSpeed = 0.1);

          //对第一条线路（即索引 0）创建一个巡航器
          // asd
          that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
            loop: false, //循环播放
            speed: startSpeed * that.times * 1000, //巡航速度，单位千米/小时
          });
          // that.navgtr.start();
          let idx = that.navgtr.getCursor().idx; //走到了第几个点
          let tail = that.navgtr.getCursor().tail; //至下一个节点的比例位置
          let totalIdx = idx + tail;
          console.log(idx, tail, 'JJJJJJJJ');

          // 计算下一个距离速度
          let point = trackList[idx];
          if (idx < len - 1) {
            point.nextSpeed <= 0.1 && (point.nextSpeed = 0.1);
            that.navgtr.setSpeed(point.nextSpeed * that.times);
          }

          // 剩余公里数，窗体随时移动展示
          // point &&
          // point.time &&
          // infoWindow.setContent(
          //     `<p class="info-window">时间：<span>${point.time}`
          // );
          // infoWindow.open(that.map, that.navgtr.getPosition());
          if (that.type == 1) {
            that.messageDept = point.deptName;
            that.messageCode = point.plateNumber;
            that.messageMileage = point.totaldistance;
            that.messageWorkMileage = point.workmileage;
            that.messageTime = point.date;
            that.messageSpeed = point.carspeed;
          }
          if (that.type == 2) {
            that.messageDept = point.orgName;
            that.messageCode = point.workerName;
            that.messageTotalDistance = point.totalDistance;
            that.messageWorkMileage = point.workMileage;
            that.messageTime = point.createDate;
            that.messageSpeed = point.speed;
          }
          // 进度条实时展示tail
          !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100);
          // 已经播放时间
          // let sTime = (pointObj.stampTime-startStampTime)/1000;
          let sTime = parseInt(
            (((endPoint.stampTime - startPoint.stampTime) / 1000) *
              that.sliderVal) /
            100
          );

          that.passedTime = that.getTime(sTime);
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.playIcon = "start";
            that.isPlay = false;
            that.sliderVal = 100;
            that.passedTime = that.totalTime;
          }
          // that.navgtr.resume()
          that.navgtr.pause()
          // 移动过程中
          that.navgtr.on("move", function () {
            that.playIcon = "resume";
            let idx = this.getCursor().idx; //走到了第几个点
            let tail = this.getCursor().tail; //至下一个节点的比例位置
            let totalIdx = idx + tail;
            // console.log(idx, tail, 'eeeee');
            // console.log('track', trackList);
            // 计算下一个距离速度
            let point = trackList[idx];
            if (idx < len - 1) {
              console.log(point.nextSpeed, 'wwwwwwwww')
              point.nextSpeed <= 0.1 && (point.nextSpeed = 0.1);
              that.navgtr.setSpeed(point.nextSpeed * that.times);
            }

            // 剩余公里数，窗体随时移动展示
            if (that.type == 1) {
              let geocoder = new AMap.Geocoder({});
              geocoder.getAddress(
                [point.xcd, point.ycd],
                function (status, result) {
                  if (status === "complete" && result.info === "OK") {
                    let address = result.regeocode.formattedAddress;
                    that.messageaddress = address;
                  } else {
                    console.log("error");
                  }
                }
              );
              that.messageDept = point.deptName;
              that.messageCode = point.plateNumber;
              that.messageMileage = point.totaldistance;
              that.messageWorkMileage = point.workmileage;
              that.messageTime = point.date;
              that.messageSpeed = point.carspeed;
              that.messagegostatus = point.gostatus;
            }
            if (that.type == 2) {
              that.messageDept = point.orgName;
              that.messageCode = point.workerName;
              that.messageTotalDistance = point.totalDistance;
              that.messageWorkMileage = point.workMileage;
              that.messageTime = point.createDate;
              that.messageSpeed = point.speed;
            }
            // 进度条实时展示tail
            !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100);
            // 已经播放时间
            // let sTime = (pointObj.stampTime-startStampTime)/1000;
            let sTime = parseInt(
              (((endPoint.stampTime - startPoint.stampTime) / 1000) *
                that.sliderVal) /
              100
            );

            that.passedTime = that.getTime(sTime);
            // 如果到头了，回到初始状态
            if (that.navgtr.isCursorAtPathEnd()) {
              that.playIcon = "start";
              that.isPlay = false;
              that.sliderVal = 100;
              that.passedTime = that.totalTime;
            }
          });

          that.navgtr.on("start resume", function () {
            console.log("开始", Date.now());
            console.log(that.navgtr)
            that.navgtr._startTime = Date.now();
            that.navgtr._startDist = this.getMovedDistance();
            // this.polygon.setPath(e.passedPath);
            // this.map.setCenter(e.target.getPosition(),true)
          });
          that.navgtr.on("stop pause", function () {
            that.navgtr._movedTime = Date.now() - that.navgtr._startTime;
            that.navgtr._movedDist =
              this.getMovedDistance() - that.navgtr._startDist;
          });
        }
      );
      console.log(123123);
    },
    displayno() {
      console.log('adadsf');
    },
    // 开始、暂停、继续等操作
    navgControl(action) {
      console.log(action)
      let that = this;
      if (action === "start") {
        this.sliderVal = 0;
        this.passedTime = "00:00:00";
        setTimeout(() => {
          that.navgtr[action]();
        }, 300);
      } else {
        setTimeout(() => {
          that.navgtr[action]();
        }, 300);
      }
    },
    // 格式化时间
    getTime(sTime) {
      let ss;
      let mm = "00";
      let hh = "00";
      if (sTime > 60) {
        let s = sTime % 60;
        ss = s > 9 ? s : "0" + s;
        let mTime = parseInt(sTime / 60);
        if (mTime > 60) {
          let m = mTime % 60;
          mm = m > 9 ? m : "0" + m;
          hh = parseInt(mTime / 60);
        } else {
          mm = mTime > 9 ? mTime : "0" + mTime;
        }
      } else {
        ss = sTime > 9 ? sTime : "0" + sTime;
      }
      return hh + ":" + mm + ":" + ss;
    },
    hideFormat() {
      return null;
    },
    // 计算两个坐标点之间的距离
    distanceFun(point1, point2) {
      // point1:[longitude,latitude]
      let p1 = new AMap.LngLat(point1[0], point1[1]);
      let p2 = new AMap.LngLat(point2[0], point2[1]);
      let distance = Math.round(p1.distance(p2));
      return distance;
    },
    speedFun(point1, point2, time) {
      // point1,point2:经纬度数组，time:时间，s
      let distance = this.distanceFun(point1, point2);
      if (distance === 0) {
        return 0;
      } else {
        let speed = distance / 1000 / (time / 60 / 60);
        // speed:km/h
        return speed;
      }
    },
    drag(isRemove) {
      let that = this;
      let el = document.getElementsByClassName("ivu-slider-button-wrap")[0];
      let el2 = document.getElementsByClassName("ivu-slider-wrap")[0];

      if (isRemove) {
        el && el.removeEventListener("mousedown", that.openSlider, false);
        document.removeEventListener("mouseup", that.closeSlider, false);
        el2 && el2.removeEventListener("click", that.sliderChange, false);
        return false;
      }
      el2.addEventListener("click", that.sliderChange, false);
      el.addEventListener("mousedown", that.openSlider, false);
      // 此处用document是因为，滑动较为随意时，mouseup可能不是作用在el上
      document.addEventListener("mouseup", that.closeSlider, false);
    },
    openSlider() {
      this.isOnSlider = true;
    },
    closeSlider() {
      this.isOnSlider = false;
    },
    // 修改倍速
    changeSpeed(times) {
      this.isTimesChoose = false;
      this.times = times * 20;
    },
    sliderChange(val) {
      let newVal = typeof newVal === "number" ? val : this.sliderVal;
      let num = parseInt((newVal / 100) * this.pathList.length);
      let decimal =
        String((newVal / 100) * this.pathList.length).split(".")[1] || 0;
      this.navgtr.moveToPoint(num, Number("0." + decimal));
      this.pathSimplifierIns.renderLater();
    },
    addMarker(item) { },
    closeDialog() {
      this.addOrUpdateVisible = false;
    },
  },
  beforeDestroy() {
    this.navgtr = null;
    this.drag(true);
  },
  watch: {
    sliderVal(newVal) {
      if (!this.isOnSlider) {
        return false;
      }
      this.sliderChange(newVal);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.aui-content>.el-tabs>.el-tabs__content {
  padding: 0px !important;
}

.el-dialog__body {
  padding: 0 !important;
}

.map-outbox {
  width: 100%;
  border: 1px solid #ddd;
  margin-left: 0px !important;
  margin-top: 10px !important;
}

#containerTrack {
  width: 100%;
  height: 80vh;
  margin-left: 0px !important;
}

.amap-info-close {
  display: none;
}

.info-window span {
  color: #2e75f1;
}

.ivu-slider-bar {
  color: #fff;
  background: #fff;
  transition: all 0.2s linear;
}

.ivu-slider-button-wrap {
  transition: all 0.2s linear;
  top: -5px;
}

.ivu-slider-wrap {
  background-color: rgba(255, 255, 255, 0.5);
}

.ivu-slider-button {
  border: none;
  box-shadow: 0 0 0 3.5px rgba(230, 230, 230, 0.4);
}

.order-map,
.map-outbox {
  position: relative;
  min-height: 60vh;
  margin-left: -2.4vh;
  margin-top: -2vh;
}

.color-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 200;
  font-size: 14px;
}

.color-tag li {
  display: inline-block;
  border-radius: 4px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  margin-right: 2px;
}

.color-tag li.color-org {
  background-color: #ff8533;
  color: #fff;
}

.color-tag li.color-green {
  background-color: #46c51a;
  color: #fff;
}

.map-control {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 200;
  height: 80px;
  line-height: 80px;
  color: #fff;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 0;
}

.play-icon {
  font-size: 36px;
}

.map-slider {
  display: inline-block;
  width: 65%;
  margin-left: 15px;
  position: relative;
  top: 14px;
}

.passed-time {
  position: relative;
  top: 2px;
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
}

.map-times {
  display: inline-block;
  position: relative;
  margin-left: 15px;
}

.amap-container {
  position: none;
}

/* /deep/.amap-info{
  z-index: 1200;
} */
.map-times .times-show {
  padding: 0 10px;
  line-height: 24px;
  font-size: 13px;
  border: 1px solid #fff;
  border-radius: 4px;
  cursor: default;
}

.map-times .choose-box {
  position: absolute;
  top: -135px;
  left: -6px;
  height: 162px;
  transition: all 0.5s linear;
}

.map-times ul {
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  width: 70px;
  text-align: center;
  border-radius: 3px;
}

.map-times li {
  height: 26px;
  line-height: 26px;
  cursor: pointer;
}

.map-times li.active {
  color: #ff8533;
}

.map-times li:hover {
  font-size: 13px;
}

/* .marker {
  position: absolute;
  top: -20px;
  right: -118px;
  color: #fff;
  padding: 4px 10px;
  box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
  white-space: nowrap;
  font-size: 12px;
  font-family: "";
  background-color: #25a5f7;
  border-radius: 3px;
} */
.amap-icon img {
  width: 25px;
  height: 34px;
}

.carMessage {
  position: absolute;
  top: 0px;
  height: 250px;
  background-color: #fafafa;
  padding: 10px;
  font-size: 13px;
  opacity: 0.9;
}

.messageTitle {
  font-size: 15px;
  color: black;
  font-family: sans-serif;
}

.aui-wrapper .el-date-editor .el-range-separator {
  width: 7% !important;
}

.el-range-input {
  width: 45%;
}

.el-dialog {
  /* margin-top: -71px !important; */
  margin-top: 6vh !important;
}
</style>