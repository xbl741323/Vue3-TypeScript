<template>
  <div style="background-color: white;height: 85vh;">
    <div class="block" style="width: 100%;margin-left: 10px;padding-top: 15px;">
      <span class="demonstration">协议类型</span>
      <el-select
          v-model="value"
          filterable
          allow-create
          default-first-option
          placeholder="请选择协议类型">
        <el-option value="GF-1078">GF-1078</el-option>
        <el-option value="GB-1078">GB-1078</el-option>
        <el-option value="GA系列">GA系列</el-option>
      </el-select>
      <span class="demonstration">默认</span>
      <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
<!--      <el-button type="primary" style="margin-left: 10px;">查询历史视频</el-button>-->
    </div>
    <div style="width: 100%;margin-top:20px;">
      <div style="width: 20%; margin-left: 10px;float: left;">
        <el-input
            style="margin-top: 10px;margin-bottom: 10px;"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            style="height: 68vh;overflow: auto;"
            :filter-node-method="filterNode"
            ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
               <span v-if="data.nodeType=='detailtype'">
                <i class="el-icon-notebook-2" style="color: gray;"></i>
                <span style="color: gray;">{{ node.label }}</span>
              </span>
              <span v-else-if="data.nodeType=='device'" style="color: gray;">
                <i class="el-icon-video-camera"></i>
                <span style="color: gray;" @click="queryCarVideoPlay(data.obj,node.label)">{{ node.label }}</span>
              </span>
              <span v-else-if="data.nodeType=='lastobject' && data.status=='1'" style="color: green;" >
                <i class="el-icon-truck" style="color: green;"></i>
                <span style="color: green;">{{ node.label }}</span>
              </span>
              <span v-else-if="data.nodeType=='lastobject' && data.status=='2'" style="color: #eab31e;" >
                <i class="el-icon-truck" style="color: #eab31e;"></i>
                <span style="color: #eab31e;">{{ node.label }}</span>
              </span>
              <span v-else style="color: gray;" >
                <i class="el-icon-truck" style="color: gray;"></i>
                <span style="color: gray;">{{ node.label }}</span>&nbsp;
              </span>
            </span>
        </el-tree>
      </div>
      <div style="width: 80%;margin-left: 22%;text-align: center;">
        <el-table
            :data="tableData" height="600">
          <el-table-column
              prop="fileName"
              label="文件名">
          </el-table-column>
          <el-table-column
              prop="begintime"
              label="开始时间">
          </el-table-column>
          <el-table-column
              prop="endtime"
              label="结束时间">
          </el-table-column>
          <el-table-column
              prop="filesize"
              label="大小">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="videoPlay">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-popover
        placement="bottom"
        trigger="click"
        width="400"
        style="margin: -10px;"
        v-model="showPopover">
      <div id="containerPlay" style="margin: -10px;"></div>
      <el-button slot="reference" style="margin-left: 35%!important;">视频展示</el-button>
    </el-popover>
  </div>
</template>

<script>
import { getCommonTreeListByTypeVideo } from "@/api/carmonitoring";

let record = null;
let player = null;

export default {
  name: "videoPlayback",
  data() {
    return {
      filterText:'',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      openOnClose:'',
      value:'',
      value1:[],
      tableData:[],
      videoDev:'',
      videoChn:'',
      type:'',
      protocolType:'',
      carVideoVisible:false,
      showPopover:false
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    let that = this;
    that.createPlayer();
    getCommonTreeListByTypeVideo().then(response => {
      that.data = response.data;
    });
  },
  methods: {
    createPlayer(){
      let userkey = '38a3df6e-e74b-4979-b691-a238fbd6deb9';
      let baseURL = 'wss://videostream.car900.com/';
      let userLevel = 1; //默认1
      player = new byskplayer({
        id: 'containerPlay',
        isReal: false,
        isRecord: true,
        userId: 'apidemo',
        userkey: userkey,
        userLevel: userLevel,
        baseURL: baseURL,
        isSwitchCodetypeOnFullscreen: false
      });
      record = player.record;
    },
    dateNums(date) {
      let timestamp = new Date(date).getTime() / 1000;
      return timestamp;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    queryCarVideoPlay(obj,node){
      let that = this;
      that.videoDev = obj;
      that.videoChn = node.charAt(node.length - 1);
      if (that.videoDev == "") {
        this.$message({
          message: '请选择要回放的设备！',
          type: 'warning'
        });
        return false;
      }
      if(that.value.length < 1){
        this.$message({
          message: '请选择协议类型！',
          type: 'warning'
        });
        return false;
      }
      if (that.value1.length < 1) {
        this.$message({
          message: '请选择回放时间！',
          type: 'warning'
        });
        return false;
      }
      if (that.value == "GA系列") {
        that.protocolType = 2;
      } else {
        that.protocolType = 1;
      }
      let param = {
        device: that.videoDev,//设备号
        channel: that.videoChn,//通道数
        protocolType: that.protocolType,//类型
        begintime: that.dateNums(that.value1[0]),
        endtime: that.dateNums(that.value1[1]),
        alarmSign: 0
      };
      record.query(param, function (res) {
        if (res.status == 1) {
          for (let i=0;i<res.recordfiles.length;i++){
            res.recordfiles[i].fileName = node;
          }
          that.tableData = res.recordfiles;
        } else {
          let msg = res.info + '！';
          this.$message({
            message: msg,
            type: 'warning'
          });
        }
      });
    },
    videoPlay(){
      let that = this;
      that.showPopover = true;
      player.real.close(this.device,'1,2,3,4');
      // 初始化视频回放
      player.setPlayerNum(1);
      let tidObj = player.allocate(1);
      if (tidObj.flag == 1) {
        let tid = tidObj.ids[0];
        let params = {
          device: that.videoDev,
          channel: that.videoChn,
          protocolType: that.protocolType,//类型
          begintime: that.dateNums(that.value1[0]),
          endtime: that.dateNums(that.value1[1]),
        };
        console.log(params)
        if (that.value == "GA系列") {
          params.fileName = "GA系列";
          record.open(tid, params, function (res) {
            console.log(res);
          });
        } else if (that.value == "GB") {
          params.datatype = 0;
          record.open(tid, params, function (res) {
            console.log(res);
          }, {
            hasAudio: false
          });
        } else {
          record.open(tid, params, function (res) {
            console.log(res);
          });
        }
      }
    },
    closeDialog(){
      this.carVideoVisible=false;

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-card__body{
    padding: 0px!important;
  }
  .aui-content > .el-tabs > .el-tabs__content {
    padding: 0px!important;
  }
  .el-main{
    padding: 0px!important;
  }
  .demonstration{
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .el-popover{
    height: 400px!important;
    overflow: auto;
    margin-top: 10%;
    z-index: 200000;
  }
</style>