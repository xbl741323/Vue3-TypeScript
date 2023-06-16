<template>
  <el-dialog title="视频监控" :visible="carVideoVisible" @close='closeDialog'>
    <div id="containerCarOneVideo"></div>
  </el-dialog>
</template>

<script>

let player = null;
let playList = [];
let real = {};

export default {
  name: "carVideo",
  data() {
    return {
      carVideoVisible:false,
      device:'',
      carName:''
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    // const s = document.createElement('script');
    // s.type = 'text/javascript';
    // s.src = 'https://v.car900.com/api/byskplayer.js';
    // document.body.appendChild(s);
    this.initReal();
  },
  methods: {
    initReal(){
      real = null;
      player = null;
      real = {
        open: function(channel,device,plate) {
          console.log("点击了!,信息为："+channel+"------"+device+"---------"+plate);
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
        close: function(device,channel) {
          const channelArr = channel.split(',').map(p => p * 1)
          for (let i = 0; i < 4; i++) {
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
        openSpeak: function() {
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
        closeSpeak: function() {
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
      setTimeout(() => {
        that.createPlayer();
      }, 2 * 100)
    },
    createPlayer() {
      if (player) destroy();
      let userkey = '38a3df6e-e74b-4979-b691-a238fbd6deb9';
      let baseURL = 'wss://videostream.car900.com';
      let userLevel = 1; //默认1

      player = new byskplayer({
        id: 'containerCarOneVideo',
        isReal: true,
        isRecord: false,
        userId: 'apidemo',
        userkey,
        userLevel, //用户级别 开发平台无效
        // platform: platform || '', // 无效，已移除
        baseURL,
        isSwitchCodetypeOnFullscreen: false, //全屏是否切换高清，默认false
        // click: that.onPlayClick(),
        // playstart: that.onPlayStart(),
        // playend: that.onPlayEnd(),
        // snapshot: that.onSnapshot(),
        // message: that.onMessage(),
      });
      console.log('byskplayer.js version: ' + player.version);
      // player.poster = '/poster.png'; //设置预览图片
      console.log(player)
      player.setPlayerNum(4); //设置视频画面
    },
    clickVideo() {
      real.open(1,this.device,this.carName + '通道1');
      real.open(2,this.device,this.carName + '通道2');
      real.open(3,this.device,this.carName + '通道3');
      real.open(4,this.device,this.carName + '通道4');
    },
    closeDialog(){
      this.carVideoVisible=false;
      real.close(this.device,'1,2,3,4');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/deep/.el-dialog__body{
  padding:0 !important;
}
/deep/.el-card__body{
  padding: 0px!important;
}
/deep/.aui-content > .el-tabs > .el-tabs__content {
  padding: 0px!important;
}

/deep/#containerCarOneVideo {
  display: block;
}
/deep/.byskplayer-layout-wrapper{
  height: 60vh!important;
  margin-top: -1vh!important;
}
/deep/.byskplayer-layout-wrapper .player {
  background-color: #a8aaad!important;

}
</style>