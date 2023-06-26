<!-- 视频监控管理 -->
<template>
  <div class="foot">
    <div id="video" class="foot one">
      <div id="containers"></div>
    </div>
    <div class="foot two">
      <div class="card" style="height: 10%;">
        <div class="title">
          <span>视频控制</span>
        </div>
        <div class="button">
          <div class="frame" @click="playerNum(1)">
            <icon class="el-icon-menu"></icon>
            <span class="frameFont">单画面</span>
          </div>
          <div class="frame" @click="playerNum(4)">
            <icon class="el-icon-menu"></icon>
            <span class="frameFont">四画面</span>
          </div>
          <div class="frame" @click="playerNum(6)">
            <icon class="el-icon-menu"></icon>
            <span class="frameFont">六画面</span>
          </div><br /><br />
          <div class="frame" @click="playerNum(9)">
            <icon class="el-icon-menu"></icon>
            <span class="frameFont">九画面</span>
          </div>
          <div class="frame" @click="playerNum(16)">
            <icon class="el-icon-menu"></icon>
            <span class="frameFont">十六画面</span>
          </div>
        </div>
      </div>

      <div style="height: 80%;">
        <div class="title" style="height: 100%;">
          <span>设备信息</span><br />
          <el-input style="margin-top: 10px;" placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>

          <el-tree class="filter-tree" :data="data" :props="defaultProps" style="height: 68vh;overflow: auto;"
            :filter-node-method="filterNode" ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-if="data.nodeType == 'detailtype'">
                <i class="el-icon-notebook-2" style="color: gray;"></i>
                <span style="color: gray;">{{ node.label }}</span>
              </span>
              <span v-else-if="data.nodeType == 'device'" style="color: gray;" @click="clickVideo(data.obj, data.status)">
                <i class="el-icon-video-camera"></i>
                <span style="color: gray;">{{ node.label }}</span>
              </span>
              <span v-else-if="data.nodeType == 'lastobject' && data.status == '1'" style="color: green;">
                <i class="el-icon-truck" style="color: green;"></i>
                <span style="color: green;">{{ node.label }}</span>&nbsp;
                <el-tooltip v-if="openOnClose == data.obj.videodeviceids" class="item" effect="dark" content="一键关闭"
                  placement="right-start">
                  <i class="el-icon-video-pause" @click="clickCloseVideo(data.obj)"></i>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="播放所有视频" placement="right-start">
                  <i class="el-icon-video-play" @click="clickAllVideo(data.obj)"></i>
                </el-tooltip>
              </span>
              <span v-else-if="data.nodeType == 'lastobject' && data.status == '2'" style="color: #eab31e;">
                <i class="el-icon-truck" style="color: #eab31e;"></i>
                <span style="color: #eab31e;">{{ node.label }}</span>&nbsp;
                <el-tooltip v-if="openOnClose == data.obj.videodeviceids" class="item" effect="dark" content="一键关闭"
                  placement="right-start">
                  <i class="el-icon-video-pause" @click="clickCloseVideo(data.obj)"></i>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="播放所有视频" placement="right-start">
                  <i class="el-icon-video-play" @click="clickAllVideo(data.obj)"></i>
                </el-tooltip>
              </span>
              <span v-else style="color: gray;">
                <i class="el-icon-truck" style="color: gray;"></i>
                <span style="color: gray;">{{ node.label }}</span>&nbsp;
                <el-tooltip v-if="openOnClose == data.obj.videodeviceids" class="item" effect="dark" content="一键关闭"
                  placement="right-start">
                  <i class="el-icon-video-pause" @click="clickCloseVideo(data.obj)"></i>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="播放所有视频" placement="right-start">
                  <i class="el-icon-video-play" @click="clickAllVideo(data.obj)"></i>
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCommonTreeListByTypeVideo } from "@/api/carmonitoring";

let player = null;
let playList = [];

let real = null;

export default {
  name: "videomonitoring",
  data() {
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      openOnClose: ''
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    real = null;
    player = null;
    real = {
      open: function (channel, device, plate) {
        console.log("点击了!,信息为：" + channel + "------" + device + "---------" + plate);
        let protocolType = 1;
        let obj = playList.find(p => p.device == device && p.channel == channel);
        if (obj) return; //已经在播放的则不能再播放

        const channelArr = [channel];
        const tidObj = player.allocate(channelArr.length); //根据通道数申请
        // let tidObj = player.allocate(1); //申请一个视频播放器

        if (tidObj.flag == 1) {
          //申请成功
          let params = {
            device: device, //终端号
            channel: channel, //通道号 （1~8）
            protocolType: protocolType, //协议类型，1：GF-1078，GB-1078; 2：GA系列
            codeTypeCtrlBtnEnabled: protocolType === 1, //是否显示高标清切换按钮(GF才有高清)
            plate: plate, //车牌号（可选）
            vehicleId: '4321', //车辆Id（可选）
            groupId: '1', //车辆所属车组ID（可选）
          };

          if (protocolType === 1) { //1078
            for (let i = 0; i < channelArr.length; i++) {
              const tid = tidObj.ids[i]
              const param = {
                ...params,
                channel: channelArr[i]
              }
              player.real.open(tid, param, res => {
                console.log(res);
              });
              playList.push({
                ...param
              })
            }
          } else if (protocolType === 2) { //GA
            player.real.open(tidObj.ids, params, res => {
              console.log(res);
            });
            playList.push(...tidObj.ids.map((p, i) => {
              return {
                ...params,
                channel: channelArr[i]
              }
            }));
          }
        } else {
          //申请失败
          alert(tidObj.msg);
        }
      },
      close: function (device, channel) {
        const channelArr = channel.split(',').map(p => p * 1)
        for (let i = 0; i < channelArr.length; i++) {
          let index = playList.findIndex(p => p.device == device && p.channel == channelArr[i]);
          let obj = playList[index];
          if (obj) player.real.close(obj.tid, {
            device: obj.device,
            channel: obj.channel,
            protocolType: obj.protocolType
          }, res => {
            console.log(res);
          });
          playList.splice(index, 1);
        }
      },
      openSpeak: function () {
        const device = document.getElementById('real_device').value.trim()
        const protocolType = Number(document.getElementById('real_protocol').value);
        const params = {
          device: device, //终端号
          protocolType: protocolType //协议类型，1：GF-1078，2：GA系列，目前支持GF-1078
        }
        player.real.openSpeak(params, res => {
          console.log(res)
        })
      },
      closeSpeak: function () {
        const device = document.getElementById('real_device').value.trim()
        const protocolType = Number(document.getElementById('real_protocol').value);
        const params = {
          device: device,
          protocolType: protocolType
        }
        player.real.closeSpeak(params, res => {
          console.log(res)
        })
      }
    }
    let that = this;
    getCommonTreeListByTypeVideo().then(response => {
      that.data = response.data;
    });
    this.createPlayer();
  },
  methods: {
    createPlayer() {
      if (player) destroy();
      let userkey = '38a3df6e-e74b-4979-b691-a238fbd6deb9';
      let baseURL = 'wss://videostream.car900.com';
      let userLevel = 1; //默认1

      player = new byskplayer({
        id: 'containers',
        isReal: true,
        isRecord: false,
        userId: 'apidemo',
        userkey,
        userLevel, //用户级别 开发平台无效
        // platform: platform || '', // 无效，已移除
        baseURL,
        isSwitchCodetypeOnFullscreen: false, //全屏是否切换高清，默认false
      });
      console.log('byskplayer.js version: ' + player.version);
      console.log(player);
      // player.poster = '/poster.png'; //设置预览图片
      player.setPlayerNum(4); //设置视频画面
    },
    clickVideo(device, channel) {
      real.open(parseInt(channel), device, '通道1');
    },
    clickAllVideo(device) {
      let videoDeviceIds = device.videodeviceids
      if (videoDeviceIds.length > 0) {
        real.open(1, videoDeviceIds, '通道1');
        real.open(2, videoDeviceIds, '通道2');
        real.open(3, videoDeviceIds, '通道3');
        real.open(4, videoDeviceIds, '通道4');
      }
      this.openOnClose = videoDeviceIds;
    },
    clickCloseVideo(device) {
      let videoDeviceIds = device.videodeviceids
      if (videoDeviceIds.length > 0) {
        real.close(videoDeviceIds, '1,2,3,4');
      }
      this.openOnClose = '';
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    playerNum(i) {
      player.setPlayerNum(i);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/deep/.el-card__body {
  padding: 0px !important;
}

/deep/.aui-content>.el-tabs>.el-tabs__content {
  padding: 0px !important;
}

/deep/.foot {
  position: fixed;
  background-color: #fff;
}

/deep/.one {
  float: left;
  width: 63vw;
  height: 90%;
}

/deep/.two {
  float: left;
  height: 100%;
  width: 22%;
  left: 78%;
}

/deep/.prism-player {
  width: 100%;
  height: 100%;
  background-color: #FFF;
  border: 1px solid #FFF;
  position: relative;
}

/deep/.information {
  height: 25px;
  border-top: 1px solid #e4d4d4;
  color: white;
  font-size: 13px;
  line-height: 25px;
  position: absolute;
  bottom: 0px;
  width: 100%;
}

/deep/.title {
  color: black;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  padding-left: 12px;
}

/deep/.iconfont {
  color: #49bbcf;
  font-size: 20px;
  border: 2px solid #393b47;
  padding: 4px;
  border-radius: 6px;
  margin: 5px;
  display: block;
}

/deep/.frameFont {
  color: #516f8a;
}

/deep/.frame {
  text-align: center;
  width: 20%;
  float: left;
  flex: 1;
}

/deep/.frame img {
  margin: 0 auto;
  margin-bottom: 8px;
}

/deep/.button {
  display: flex;
  padding: 10px 4px;
  flex-direction: row;
  flex-wrap: wrap;
}

/deep/.font {
  font-size: 16px;
  padding-top: 4%;
}

/deep/#containers {
  width: 100%;
  height: 90%;
  display: block;
}

/deep/.byskplayer-layout-wrapper .player {
  background-color: #a8aaad !important;
}

/deep/.el-tree-node.is-current>.el-tree-node__content {
  background-color: rgb(190, 208, 190) !important;
}</style>