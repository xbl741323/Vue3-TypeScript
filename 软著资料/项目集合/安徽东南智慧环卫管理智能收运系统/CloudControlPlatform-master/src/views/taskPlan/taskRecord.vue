<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.carNo"
        placeholder="请输入车牌号"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.vehicleType"
        class="filter-item"
        clearable
        placeholder="请选择车辆类型"
      >
        <el-option
          v-for="item in vehicleTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.areaNumber"
        class="filter-item"
        clearable
        placeholder="请选择区域编号"
      >
        <el-option
          v-for="item in jobAreaOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="listQuery.taskStatus"
        class="filter-item"
        clearable
        placeholder="请选择任务状态"
      >
        <el-option
          v-for="item in taskStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-date-picker
        class="time-stlye"
        v-model="timeValue"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>

      <el-button
        v-waves
        class="button-stlye"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("搜索") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :border="false"
      :stripe="true"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('任务编号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.taskNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('车牌号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('车辆类型')" align="center">
        <template slot-scope="{ row }">
          <span>{{ vehicleTypeArr[row.vehicleType] }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('作业计划编号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.jobNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('作业区域编号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.areaNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('起止时间')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.startTime }}~{{ row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('任务状态')" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.taskStatus == 0">{{
            taskStatusArr[row.taskStatus]
          }}</el-tag>
          <el-tag v-if="row.taskStatus == 1" type="warning">{{
            taskStatusArr[row.taskStatus]
          }}</el-tag>
          <el-tag v-if="row.taskStatus == 2" type="info">{{
            taskStatusArr[row.taskStatus]
          }}</el-tag>
          <el-tag v-if="row.taskStatus == 3" type="success">{{
            taskStatusArr[row.taskStatus]
          }}</el-tag>
          <el-tag v-if="row.taskStatus == 4" type="danger">{{
            taskStatusArr[row.taskStatus]
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('完成率')" align="center">
        <template slot-scope="{ row }">
          <div
            v-if="
              row.taskStatus == 0 || row.taskStatus == 1 || row.taskStatus == 2
            "
          >
            <el-progress :percentage="row.taskSchedule"></el-progress>
          </div>
          <div v-if="row.taskStatus == 3">
            <el-progress
              :percentage="row.taskSchedule"
              status="success"
            ></el-progress>
          </div>
          <div v-if="row.taskStatus == 4">
            <el-progress
              :percentage="row.taskSchedule"
              status="exception"
            ></el-progress>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="pauseTask(row.taskNumber)"
            :disabled="row.taskStatus == 0 ? false : true"
            >暂停</el-button
          ><el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="continueTask(row.taskNumber)"
            :disabled="row.taskStatus == 1 ? false : true"
            >继续</el-button
          ><el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="cancelTask(row.taskNumber)"
            :disabled="
              row.taskStatus == 0 || row.taskStatus == 1 ? false : true
            "
            >取消</el-button
          ><el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="taskDetails(row)"
            :disabled="
              row.taskSchedule == 100 || row.taskStatus == 4 ? false : true
            "
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :pageSize.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {
  inquireTask,
  pauseTask,
  continueTask,
  cancelTask,
  inquireJobArea
} from "@/api/operationalPlanning";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Bus from "@/utils/bus";
import { Message } from "element-ui";
import { getConnectInfo } from "@/api/socket";
export default {
    watch: {
    timeValue(newVal, oldVal) {
      if(newVal==null){
        this.timeValue=[]
      }
    },
    immediate: true,
    deep: true
  },
  name: "taskPlan",
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      vehicleTypeOptions: [
        {
          value: 0,
          label: "清扫车"
        },
        {
          value: 1,
          label: "洒水车"
        },
        {
          value: 2,
          label: "抑尘车"
        }
      ],
      vehicleTypeArr: ["清扫车", "洒水车", "抑尘车"],
      jobAreaOptions: [],
      taskStatusOptions: [
        {
          value: 0,
          label: "执行中"
        },
        {
          value: 1,
          label: "已暂停"
        },
        {
          value: 2,
          label: "已取消"
        },
        {
          value: 3,
          label: "已完成"
        },
        {
          value: 4,
          label: "异常"
        }
      ],
      taskStatusArr: ["执行中", "已暂停", "已取消", "已完成", "异常"],
      timeValue: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      instructLoading: null,
      listQuery: {
        page: 1,
        pageSize: 10,
        areaNumber: undefined,
        carNo: undefined,
        vehicleType: undefined,
        taskStatus: undefined,
        startTime: undefined,
        endTime: undefined
      },
      //socket相关
      socketPath: "",
      socket: "",
      clientID: "",
      taskId: ""
    };
  },
  created() {
    this.getList();
    this.getJobArea();
  },
  destroyed() {
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    //获取列表数据
    getList() {
      if (this.timeValue.length > 0) {
        this.listQuery.startTime = this.timeValue[0].replace(/\-| |:/g, "");
        this.listQuery.endTime = this.timeValue[1].replace(/\-| |:/g, "");
      }

      inquireTask(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.tasks;
        this.total = response.data.count;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    //获取作业区域数据
    getJobArea() {
      inquireJobArea({}).then(response => {
        for (let item of response.data.jobAreas) {
          this.jobAreaOptions.push({
            value: item.areaNumber,
            label: item.areaNumber
          });
        }
      });
    },
    //查看任务详情
    taskDetails(row) {
      this.$router.push({
        path: `historyDetails/${row.vin17}/${row.startTime}/${row.endTime}/${row.taskSchedule}`
      });
    },
    //暂停任务
    pauseTask(row) {
      pauseTask({ taskNumber: row }).then(response => {
        if (response.code == 200) {
          this.getList();
          this.taskId = response.data.taskId;
          this.instructLoading = this.$loading({
            lock: true,
            text: "指令执行中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (this.socketPath) {
            this.init();
          } else {
            this.getConnectInfo();
          }
        } else {
          Message({
            message: "作业任务停止失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //继续任务
    continueTask(row) {
      continueTask({ taskNumber: row }).then(response => {
        if (response.code == 200) {
          this.getList();
          this.taskId = response.data.taskId;
          this.instructLoading = this.$loading({
            lock: true,
            text: "指令执行中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (this.socketPath) {
            this.init();
          } else {
            this.getConnectInfo();
          }
        } else {
          Message({
            message: "作业任务继续失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //取消任务
    cancelTask(row) {
      cancelTask({ taskNumber: row }).then(response => {
        if (response.code == 200) {
          this.getList();
          this.taskId = response.data.taskId;
          this.instructLoading = this.$loading({
            lock: true,
            text: "指令执行中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (this.socketPath) {
            this.init();
          } else {
            this.getConnectInfo();
          }
        } else {
          Message({
            message: "作业任务取消失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //获取socket连接信息
    getConnectInfo() {
      getConnectInfo({}).then(response => {
        if (response.code == "200") {
          this.socketPath =
            "ws://" + response.data.host + ":" + response.data.port;
          this.init();
        } else {
          Message({
            message: "获取socket连接信息失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //socket 初始化
    init: function() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.socketPath);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function() {
      //鉴权
      var sendData = JSON.stringify({
        actionName: "authorityReq",
        clientId: "",
        data: {}
      });
      this.socket.send(sendData);
    },
    error: function() {
      console.log("连接错误");
    },
    //解析socket返回值
    getMessage: function(msg) {
      const resultData = eval("(" + msg.data + ")");
      if (resultData.data.actionName == "authorityRsp") {
        var dataInfo = resultData;
        //鉴权成功
        if (dataInfo.code == "200") {
          this.clientID = dataInfo.data.clientId;
          console.log("鉴权成功");
          //发送订阅数据
          var sendData = JSON.stringify({
            actionName: "subscribeReq",
            clientId: this.clientID,
            data: { taskIDs: this.taskId }
          });
          console.log(sendData);
          this.socket.send(sendData);
        } else {
          //鉴权返回值有误
          console.log("鉴权失败");
          this.socket.onclose = this.close();
        }
      } else if (resultData.data.actionName == "subscribeRemoteRsp") {
        console.log("指令日志:");
        console.log(resultData.data.data);
        if (resultData.data.data.data.VehicleControl.Result == 0) {
          this.instructLoading.close();
          Message({
            message: "指令执行成功",
            type: "success",
            duration: 2000
          });
        } else if (resultData.data.data.data.VehicleControl.Result == 1) {
          this.instructLoading.close();
          Message({
            message: "指令执行失败",
            type: "error",
            duration: 2000
          });
        }
      }
    },
    //发送订阅数据
    send: function() {
      this.socket.send(params);
    },
    close: function() {
      console.log("socket已经关闭");
    }
  }
};
</script>
<style scoped>
.filter-item {
  width: 150px;
}
.time-stlye {
  margin-bottom: 10px;
  display: inline-block;
  vertical-align: middle;
}
.button-stlye {
  margin-bottom: 10px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
.link-style {
  display: inline-block;
  margin-right: 4px;
}
</style>
