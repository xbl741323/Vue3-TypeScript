<template>
  <div id="mapTrack">
    <el-card class="box-card" shadow="never" :body-style="{ padding: '0' }">
      <div id="map-test" :style="{ height: 'calc(100vh - ' + 1 + 'px)' }"></div>

      <div class="guijiset form-table-search">
        <div class="btn-set-true">
          <div class="playBox clearBoth">
            <div class="playIcon fl" v-if="isPlay">
              <el-button
                type="text"
                v-if="palyStayus === 0"
                icon="el-icon-video-play"
                value="开始动画"
                @click="navgControl('start')"
                :disabled="beforeInit"
              ></el-button>
              <el-button
                type="text"
                v-if="palyStayus === 1"
                icon="el-icon-video-play"
                value="继续动画"
                @click="navgControl('resume')"
                :disabled="beforeInit"
              ></el-button>
            </div>
            <div class="playIcon fl" v-if="!isPlay">
              <el-button
                type="text"
                icon="el-icon-video-pause"
                value="暂停动画"
                @click="navgControl('pause')"
                :disabled="beforeInit"
              ></el-button>
            </div>
            <div class="progress fl" style="margin-right: 0;">
              <el-button
                type="text"
                icon="el-icon-d-arrow-left"
                value="减速"
                :disabled="isMinSpeed"
                @click="changeSpeed('less')"
              ></el-button>
            </div>
            <div class="progress fl">
              <el-button type="text" class="speed fl">{{ times }}X</el-button>
            </div>
            <div class="progress fl">
              <el-button
                type="text"
                icon="el-icon-d-arrow-right"
                value="加速"
                :disabled="isMaxSpeed"
                @click="changeSpeed('add')"
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="videoPlays" layout="inline" v-if="playerStatus">
      <el-card class="box-cards">
        <div>
          <videoPlayer
            class="vjs-custom-skin videoPlayer"
            :options="playerOptions1"
            ref="videoPlayer1"
            @ended="onPlayer1Ended($event)"
          ></videoPlayer>
        </div>
        <el-divider></el-divider>
        <div>
          <videoPlayer
            class="vjs-custom-skin videoPlayer"
            :options="playerOptions2"
            ref="videoPlayer2"
            @ended="onPlayer2Ended($event)"
          ></videoPlayer>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
import MapTrackData from "./data/MapTrackData.js";
// import MapTrackTableData from "./data/MapTrackTableData.js";
import { historyTrack, historyMonitor } from "@/api/operationalPlanning";
import { Message } from "element-ui";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import "video.js/dist/video-js.css"; // 引入样式
import "vue-video-player/src/custom-theme.css"; // 引入样式

export default {
  components: {
    videoPlayer
  },
  watch: {
    sliderVal(newVal) {
      if (!this.isOnSlider) {
        return false;
      }
      this.sliderChange(newVal);
    }
  },
  data() {
    return {
      initSimplifier: false,
      // 信息窗体
      infoWindow: null,
      // 巡航轨迹
      AMap: null,
      map: null,
      PathSimplifier: null,
      beforeInit: true,
      isPlay: true,
      sliderVal: 0, // 进度条
      times: 1, // 倍速
      maxSpeed: 32, // 最高倍速
      navgtrSpeed: 80, // 速度（）
      isMinSpeed: true,
      isMaxSpeed: false,
      navgtr: null,
      pathSimplifierIns: null,
      //经纬度
      longAndLat: "",
      address: "",
      //轨迹点列表
      actualList: [],
      defaultRenderOptions: {
        renderAllPointsIfNumberBelow: -1, // 描绘路径点，如不需要设为-1
        pathTolerance: 2,
        keyPointTolerance: 0,
        pathLineStyle: {
          lineWidth: 6,
          strokeStyle: "#409eff",
          borderWidth: 1,
          borderStyle: "#eeeeee",
          dirArrowStyle: false
        },
        pathLineHoverStyle: {
          lineWidth: 6,
          strokeStyle: "#ff0000",
          borderWidth: 1,
          borderStyle: "#cccccc",
          dirArrowStyle: false
        },
        dirArrowStyle: {
          stepSpace: 30,
          strokeStyle: "#ffffff",
          lineWidth: 2
        },
        pathLineSelectedStyle: {
          lineWidth: 6,
          strokeStyle: "#409eff",
          borderWidth: 1,
          borderStyle: "#cccccc",
          dirArrowStyle: true
        },
        keyPointStyle: {
          radius: 0,
          fillStyle: "rgba(8, 126, 196, 1)",
          lineWidth: 1,
          strokeStyle: "#eeeeee"
        },
        keyPointHoverStyle: {
          radius: 0,
          fillStyle: "rgba(0, 0, 0, 0)",
          lineWidth: 2,
          strokeStyle: "#ffa500"
        },
        keyPointOnSelectedPathLineStyle: {
          radius: 0,
          fillStyle: "rgba(8, 126, 196, 1)",
          lineWidth: 2,
          strokeStyle: "#eeeeee"
        }
      },
      isCursorAtPathEnd: false,
      palyStayus: 0, //0->未开始  1->行驶中  2->暂停
      value: 0, // 进度条初始化

      signMarker: null,
      firstArr: [116.397428, 39.90923],
      currentPoint: null,
      trackData: [],
      //播放器相关
      playerStatus: false,
      playerOptions1: {
        height: "200",
        fluid: true,
        sources: [
          {
            type: "video/mp4",
            src: ""
          }
        ],
        techOrder: ["flash"],
        autoplay: true,
        controls: true,
        preload: "auto", //视频预加载
        aspectRatio: "16:9"
      },
      playerOptions2: {
        height: "200",
        fluid: true,
        sources: [
          {
            type: "video/mp4",
            src: ""
          }
        ],
        techOrder: ["flash"],
        autoplay: true,
        controls: true,
        preload: "auto", //视频预加载
        aspectRatio: "16:9"
      },
      playerList1: [],
      playerCount1: 0,
      playerCount2: 0,
      playerList2: []
    };
  },
  created() {},

  mounted() {
    // 初始化地图
    this.initMap();
    this.historyTrack();
    this.historyMonitor();
  },
  methods: {
    // 视频播完回调
    onPlayer2Ended($event) {
      this.playerCount2++;
      if (this.playerCount2 <= this.playerList2.length) {
        this.playerOptions2.sources[0].src = this.playerList2[
          this.playerCount2
        ];
        this.$refs.videoPlayer2.player.play(); // 播放
      }
    },
    onPlayer1Ended($event) {
      this.playerCount1++;
      if (this.playerCount1 <= this.playerList2.length)
        this.playerOptions1.sources[0].src = this.playerList1[
          this.playerCount1
        ];
      this.$refs.videoPlayer1.player.play(); // 播放
    },
    //获取历史轨迹
    historyTrack() {
      const sendData = {
        vin17: this.$route.params.vin17,
        startTime: this.$route.params.startTime.replace(/\-| |:/g, ""),
        endTime: this.$route.params.endTime.replace(/\-| |:/g, "")
      };
      historyTrack(sendData).then(response => {
        if (response.code == 200) {
          this.trackData = response.data;
          lazyAMapApiLoaderInstance.load().then(() => {
            // 初始化点位
            this.initMarker();
            // 初始化信息窗体
            this.initInfoWindow();
          });
          this.queryTimes();
        } else {
          Message({
            message: "获取历史轨迹失败",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //获取历史视频播放列表
    historyMonitor() {
      const sendData = {
        vin17: this.$route.params.vin17,
        startTime: this.$route.params.startTime.replace(/\-| |:/g, ""),
        endTime: this.$route.params.endTime.replace(/\-| |:/g, "")
      };
      historyMonitor(sendData).then(response => {
        if (response.code == 200) {
          this.createVideoPath(response.data);
        } else {
          Message({
            message: "历史视频获取失败",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    // 初始化巡航组件实例
    initPathSimplifier() {
      let that = this;
      AMapUI.load(["ui/misc/PathSimplifier"], PathSimplifier => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }

        that.initSimplifier = true;
        that.signMarker.setLabel({});
        // 如果已存在巡航轨迹，则删除
        if (window.pathSimplifierIns && that.pathSimplifierIns) {
          //通过该方法清空上次传入的轨迹
          that.pathSimplifierIns.setData([]);
        }
        // TODO
        // let data = MapTrackData.mapTrackData();
        let data = this.trackData;
        let linArray = [];
        for (let item of data) {
          linArray.push([item.longitude, item.latitude]);
        }
        // let pointDataList = data.result.pointDataList;
        let pointDataList = data;
        // 初始化坐标点
        if (linArray.length > 0) {
          that.signMarker.show();
          that.signMarker.setPosition(linArray[0]);

          that.actualList = linArray;

          //创建一个巡航轨迹路线
          that.pathSimplifierIns = new PathSimplifier({
            zIndex: 100, //地图层级，
            map: this.map, //所属的地图实例
            //巡航路线轨迹列表
            getPath: (pathData, pathIndex) => {
              return pathData.path;
            },
            //hover每一个轨迹点，展示内容
            getHoverTitle: function(pathData, pathIndex, pointIndex) {
              /*if (pointIndex >= 0) {
                    return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                  }
                  return pathData.name + '，点数量' + pathData.path.length;*/
              return "";
            },
            //自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
            //绘制路线节点
            renderOptions: that.defaultRenderOptions
          });
          window.pathSimplifierIns = that.pathSimplifierIns;
          //设置数据
          that.pathSimplifierIns.setData([
            {
              name: "轨迹路线",
              path: that.actualList
            }
          ]);
          that.pathSimplifierIns.setSelectedPathIndex(0);

          function onload() {
            that.pathSimplifierIns.renderLater();
          }

          function onerror(e) {
            console.log("图片加载失败！");
          }

          //对第一条线路（即索引 0）创建一个巡航器
          let image = PathSimplifier.Render.Canvas.getImageContent(
            "/t_car.png",
            onload,
            onerror
          );
          that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
            loop: false, //循环播放
            speed: that.navgtrSpeed, //巡航速度，单位千米/小时
            pathNavigatorStyle: {
              width: 26,
              height: 52,
              //使用图片
              content: image, // 自定义巡航样式
              strokeStyle: null,
              fillStyle: null,
              //经过路径的样式
              pathLinePassedStyle: {
                lineWidth: 6,
                strokeStyle: "#69f81e",
                dirArrowStyle: {
                  stepSpace: 15,
                  strokeStyle: "#FFF"
                }
              }
            }
          });

          that.navgtr.on("start resume", function() {
            that.navgtr._startTime = Date.now();
            that.navgtr._startDist = this.getMovedDistance();
          });
          that.navgtr.on("stop pause", function() {
            that.navgtr._movedTime = Date.now() - that.navgtr._startTime;
            that.navgtr._movedDist =
              this.getMovedDistance() - that.navgtr._startDist;
          });
          that.navgtr.on("move", function(data, position) {
            that.isCursorAtPathEnd = false;
            let idx = position.dataItem.pointIndex; //走到了第几个点
            let tail = position.tail; //至下一个节点的比例位置
            let totalIdx = idx + tail;
            let len = position.dataItem.pathData.path.length;
            // 设置当前点位
            that.currentPoint = that.actualList[idx];
            that.longAndLat =
              pointDataList[idx].longitude + "," + pointDataList[idx].latitude;
            that.regeocoder();

            // 打开信息窗体
            let content = [
              '<div style="padding: 5px;">',
              "<div>VIN : " + that.$route.params.vin17 + "</div>",
              "<div>接收时间 : " + pointDataList[idx].sample_time + "</div>",
              "<div>速度 : " + pointDataList[idx].speed + "(km/h)</div>",
              "<div>本次任务完成率 : " +
                that.$route.params.taskSchedule +
                "(%)</div>",
              "<div>经纬度 : " + that.longAndLat + "</div>",
              "<div>位置 : " + that.address + "</div>",
              "</div>"
            ];
            that.infoWindow.setContent(content.join(""));
            that.infoWindow.open(that.map, that.actualList[idx]);

            if (idx < len - 1) {
              that.navgtr.setSpeed(that.navgtrSpeed * that.times);
            }
            // 进度条实时展示tail
            !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100);
            // 如果到头了，回到初始状态
            if (that.navgtr.isCursorAtPathEnd()) {
              that.isCursorAtPathEnd = true;
              that.initPlayBox();
            }
          });

          // 加载完成
          that.beforeInit = false;
        } else {
          that.signMarker.hide();
          that.signMarker.setLabel({});
        }
        // }
        // })
        // .finally(() => {
        // 隐藏加载
        that.initSimplifier = false;
        // })
      });
    },
    // 控制播放按钮
    navgControl(type) {
      if (!this.navgtr || !type) {
        return;
      }
      if (type === "start" || type === "resume") {
        this.isPlay = false;
        this.palyStayus = 2;
        // 如果已经到了终点，重新定位坐标
        if (this.isCursorAtPathEnd && this.actualList.length > 0) {
          this.map.setCenter(this.actualList[0]);
        }
      } else if (type === "pause") {
        this.isPlay = true;
        this.palyStayus = 1;
      }
      this.navgtr[type]();
    },

    // 改变倍速
    changeSpeed(operate) {
      let base = 2;
      this.isMinSpeed = false;
      this.isMaxSpeed = false;
      if (operate === "add") {
        if (this.times * base === this.maxSpeed) {
          this.times *= base;
          this.isMaxSpeed = true;
          this.isMinSpeed = false;
        } else if (this.times + base > this.maxSpeed) {
          this.times = this.maxSpeed;
          this.isMaxSpeed = true;
          this.isMinSpeed = false;
        } else {
          this.times *= base;
        }
      } else if (operate === "less") {
        if (this.times / base === 1) {
          this.times /= base;
          this.isMinSpeed = true;
          this.isMaxSpeed = false;
        } else if (this.times - base < 1) {
          this.times /= 1;
          this.isMinSpeed = true;
          this.isMaxSpeed = false;
        } else {
          this.times /= base;
        }
      }
    },

    // 查询轨迹信息
    queryTimes() {
      if (this.infoWindow) this.infoWindow.close();
      this.initPlayBox();
      this.beforeInit = true;
      // 初始化巡航组件
      this.initPathSimplifier();
    },
    // 初始化地图
    initMap() {
      // map-test为div的id
      // zooms: [3, 18], // 地图缩放范围
      // eslint-disable-next-line no-undef
      this.map = new AMap.Map("map-test", {
        resizeEnable: true, // 窗口大小调整
        // eslint-disable-next-line no-undef
        center: this.firstArr, // 地图中心点
        zoom: 5
      });
      this.map.addControl(
        new AMap.MapType({
          defaultType: 0 //0代表默认，1代表卫星
        })
      );
    },
    //初始化marker
    initMarker() {
      // 引入Marker,绘制点标记
      this.signMarker = new AMap.Marker({
        map: this.map,
        offset: new AMap.Pixel(-4, -4),
        visible: false,
        content:
          '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.9); height: 10px; width: 10px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>'
      });
    },
    // 创建 infoWindow 实例
    initInfoWindow() {
      this.infoWindow = new AMap.InfoWindow({
        anchor: "bottom-center",
        autoMove: false,
        offset: new AMap.Pixel(0, -20),
        content: "" //传入 dom 对象，或者 html 字符串
      });
    },
    // 初始化播放器状态
    initPlayBox() {
      // 暂停
      this.navgControl("pause");
      this.playIcon = "start";
      this.isPlay = true; // 播放图标
      this.palyStayus = 0; // 继续状态
      this.sliderVal = 0; // 进度条清0
    },
    //逆地理编码
    regeocoder() {
      let that = this;
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "base"
      });
      geocoder.getAddress(this.longAndLat, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          that.address = result.regeocode.formattedAddress;
        } else {
          that.address = "位置解析失败";
        }
      });
    },
    //拼接视频列表地址
    createVideoPath(data) {
      let pathArr = data.path.split("html");
      for (let item of data.video[2]) {
        let pathstr =
          "http://" +
          data.ip +
          ":" +
          data.port +
          pathArr[1] +
          "/" +
          Object.keys(item)[0];
        this.playerList1.push(pathstr)
      }
     
      for (let item of data.video[4]) {
        let pathstr =
          "http://" +
          data.ip +
          ":" +
          data.port +
          pathArr[1] +
          "/" +
          Object.keys(item)[0];
        this.playerList2.push(pathstr);
      }
      this.playerOptions2.sources[0].src = this.playerList2[0]
      this.playerOptions1.sources[0].src = this.playerList1[0]
      this.playerStatus = true;
    }
  }
};
</script>

<style scoped lang="less">
@deep: ~">>>";
#map-test {
  width: 100%;

  @{deep}.amap-marker-label {
    border: 1px solid #ffe099 !important;
    background-color: rgba(255, 255, 255, 0.9) !important;
  }

  @{deep}.amap-info-close {
    display: none;
  }
}

.button {
  float: bottom;
}

.tabSty {
  overflow-y: auto;
  height: calc(100vh - 355px);
  min-height: 510px;
}

.playBox {
  height: 25px;
  width: 275px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;

  .el-button {
    padding: 0px;
    font-size: 25px;
  }

  .playIcon {
    height: 30px;
    display: inline-block;
    width: 30px;
    margin: 0 20px 0 25px;
  }

  .progress {
    display: inline-block;
    /*height: 35px;*/
    width: 300px;
    margin: 0px 15px;
  }

  .speed {
    font-size: 15px;
    font-weight: bolder;
    color: #1890ff;
    width: 40px;
    padding-left: 10px;
    text-align: center;
    cursor: pointer;
  }

  .fl {
    float: left;
  }
}

#marker-info {
  .input-item {
    margin-bottom: 5px;
  }
}

.box-card {
  position: relative;
}

.guijiset {
  position: absolute;
  top: 10px;
  left: 10px;
  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  background: #fff;
  padding: 15px;
  border-radius: 5px;
  z-index: 1000;
}

.form-table-search {
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
}

.rowset {
  overflow: hidden;
  margin-bottom: 10px;
  text-align: left;
}

.rowset label {
  font-size: 12px;
  display: inline-block;
}

.track-detail {
  z-index: 100;
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 0;
}

.videoPlays {
  position: absolute;
  right: 6px;
  top: 18%;
}
.box-cards {
  width: 350px;
}

.track-table {
  z-index: 99;
  /*position: absolute;*/
  width: 100vw;
  bottom: 0;

  @{deep}.el-tabs__header {
    margin: 0;
  }
  @{deep}.el-tabs__nav {
    margin-left: 15px;
  }
}
</style>
