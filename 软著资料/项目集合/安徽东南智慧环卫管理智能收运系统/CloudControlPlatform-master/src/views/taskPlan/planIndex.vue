<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.carNo"
        placeholder="请输入车牌号"
        class="filter-item conditions"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.vehicleType"
        class="filter-item conditions"
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
        class="filter-item conditions"
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
      <el-button
        v-waves
        class="filter-item operation"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("搜索") }}
      </el-button>
      <el-button
        class="filter-item operation"
        type="primary"
        icon="el-icon-edit"
        @click="goCreateWorkPlan"
      >
        {{ $t("添加") }}
      </el-button>
      <el-button
        class="filter-item operation"
        type="primary"
        icon="el-icon-delete"
        @click="deleteJobPlan"
      >
        {{ $t("删除") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="planTable"
      :data="list"
      :border="false"
      :stripe="true"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column :label="$t('作业编号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.jobNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('车牌号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('车辆类型')" align="center">
        <template slot-scope="{ row }">
          <span>{{ vehicleTypeFormat(row.vehicleType) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('作业区域编号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.areaNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('时间策略')" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="lookTimeStrategy(row.timeStrategy)"
            >时间策略详情</span
          >
        </template>
      </el-table-column>

      <el-table-column :label="$t('计划状态')" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.jobStatus==0" type="success">{{ jobStatusArr[row.jobStatus] }}</el-tag>
          <el-tag v-if="row.jobStatus==1">{{ jobStatusArr[row.jobStatus] }}</el-tag>
          <el-tag v-if="row.jobStatus==2" type="danger">{{ jobStatusArr[row.jobStatus] }}</el-tag>
          <el-tag v-if="row.jobStatus==3" type="info">{{ jobStatusArr[row.jobStatus] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建时间')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作')" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.jobStatus == 0 ? false : true"
            type="text"
            @click="startJobPlan(row)"
          >
            {{ $t("启动") }} </el-button
          ><el-divider direction="vertical"></el-divider>
          <el-button
            :disabled="row.jobStatus == 1 ? false : true"
            type="text"
            @click="stopJobPlan(row)"
          >
            {{ $t("停止") }} </el-button
          ><el-divider direction="vertical"></el-divider>
          <el-button
            :disabled="row.jobStatus == 0 ? false : true"
            type="text"
            @click="abolishJobPlan(row)"
          >
            {{ $t("作废") }}
          </el-button>
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
    <el-dialog
      v-if="reFreshDialogVisible"
      :title="$t('创建作业计划')"
      :visible.sync="dialogVisible"
    >
      <el-steps :active="active" process-status="process ">
        <el-step title="作业园区"></el-step>
        <el-step title="作业策略"></el-step>
        <el-step title="时间策略"></el-step>
      </el-steps>
      <keep-alive>
        <component :is="setp_info" @event_stepinfo="getStepInfo"></component>
      </keep-alive>
    </el-dialog>

    <el-dialog
      width="30%"
      :title="$t('作业计划确认')"
      :visible.sync="confirmDialogVisible"
      center
      append-to-body
    >
      <P class="span_style">作业车辆： {{ this.sendData.vin17 }}</P
      ><br />
      <P class="span_style"
        >作业园区： {{ this.sendData.parkName }}
        {{ this.sendData.areaNumber }}</P
      ><br />
      <P class="span_style"
        >作业策略： {{ this.jobModeArr[this.sendData.jobMode] }}
        {{ this.jobTypeStr }}</P
      ><br />
      <P class="span_style">时间策略： </P>
      <el-table :data="timeStrategyData">
        <el-table-column property="time" label="执行时间"></el-table-column>
        <el-table-column property="cycle" label="执行周期"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createWorkPlan">确 认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="30%"
      :title="$t('时间策略')"
      :visible.sync="timeDialogVisible"
      center
      append-to-body
    >
      <el-table :data="timeStrategyData">
        <el-table-column property="time" label="执行时间"></el-table-column>
        <el-table-column property="cycle" label="执行周期"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  addJobPlan,
  inquireJobPlan,
  deleteJobPlan,
  inquireJobArea,
  startJobPlan,
  stopJobPlan,
  abolishJobPlan
} from "@/api/operationalPlanning";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Step1 from "@/views/taskPlan/step1";
import Step2 from "@/views/taskPlan/step2";
import Step3 from "@/views/taskPlan/step3";
import { Message } from "element-ui";
export default {
  watch: {
    dialogVisible(val) {
      if (val) {
        this.reFreshDialogVisible = true;
        this.$nextTick(() => {
          this.reFreshDialogVisible = true;
        });
      } else {
        this.reFreshDialogVisible = false;
        this.$nextTick(() => {
          this.reFreshDialogVisible = true;
        });
      }
      this.$nextTick(() => {
        this.reFreshDialogVisible = true;
      });
    }
  },
  name: "taskPlan",
  directives: { waves },
  components: {
    Pagination,
    Step1,
    Step2,
    Step3
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
      vehiclesTypeArr: ["清扫车", "洒水车", "抑尘车"],
      jobModeArr: ["单独作业", "编队作业"],
      jobTypeStr: "",
      jobAreaOptions: [],
      jobStatusArr: ["有效", "执行中", "已完成", "已失效"],
      active: 0,
      setp_info: "Step1",
      setp1_info: "",
      setp2_info: "",
      setp3_info: "",
      dialogVisible: false,
      reFreshDialogVisible: true,
      confirmDialogVisible: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false, //改
      listQuery: {
        page: 1,
        pageSize: 10,
        carNo: undefined,
        vehicleType: undefined,
        vehicleType: undefined
      },
      sendData: "",
      showData: "",
      timeDialogVisible: false,
      timeStrategyData: []
    };
  },
  created() {
    this.getList();
    this.getJobArea();
  },
  methods: {
    //下一步
    next(step) {
      switch (step) {
        case 1: {
          this.active = 1;
          this.setp_info = "Step2";
          break;
        }
        case 2: {
          this.active = 2;
          this.setp_info = "Step3";
          break;
        }
        case 3: {
          this.active = 3;
          this.setp_info = "Step4";
          break;
        }
        case 4: {
          this.active = 3;
          break;
        }
      }
    },
    //上一步
    back(step) {
      switch (step) {
        case 2: {
          this.active = 0;
          this.setp_info = "Step1";
          break;
        }
        case 3: {
          this.active = 1;
          this.setp_info = "Step2";
          break;
        }
        case 4: {
          this.active = 2;
          this.setp_info = "Step3";
          break;
        }
      }
    },
    //获取列表数据
    getList() {
      this.listLoading = true;
      inquireJobPlan(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.jobPlans;
        this.total = response.data.count;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    vehicleTypeFormat(vehicleType) {
      let vehicleTypeStr = ''
      let vehicleTypeArr = vehicleType.split(',')
      for(let item of vehicleTypeArr){
        vehicleTypeStr+=this.vehiclesTypeArr[item]+' '
      }
      return vehicleTypeStr
    },

    //跳转新增
    goCreateWorkPlan() {
      this.active = 0;
      this.setp_info = "Step1";
      this.dialogVisible = true;
    },
 
    //调用接口新增计划
    createWorkPlan() {
      addJobPlan(this.sendData).then(response => {
        if (response.code == 200) {
          this.$notify({
            title: "成功",
            message: "作业计划创建成功",
            type: "success",
            duration: 2000
          });
          this.dialogVisible = false;
          this.confirmDialogVisible = false;
          (this.active = 0), this.getList();
        } else {
          this.$notify({
            title: "失败",
            message: "作业计划创建失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //删除计划
    deleteJobPlan(row, index) {
      const data = [];
      const selectedData = this.$refs.planTable.selection;
      if (selectedData.length < 1) {
        Message({
          message: "请选择要删除的计划",
          type: "error",
          duration: 2000
        });
        return;
      }
      for (let item of selectedData) {
        data.push(item.jobNumber);
      }
      const sendData = { jobNumber: data.join(",") };
      deleteJobPlan(sendData).then(response => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "计划删除成功",
            type: "success",
            duration: 2000
          });
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },

    //获取子组件数据
    getStepInfo(operation, step, info) {
      if (operation === "next") {
        if (step == 1) {
          this.setp1_info = info;
          this.next(step);
        } else if (step == 2) {
          this.setp2_info = info;
          this.next(step);
        } else if (step == 3) {
          this.setp3_info = info;
          this.confirmTip();
        }
      } else if (operation === "back") {
        this.back(step);
      }
    },
    //确认提醒事件
    confirmTip() {
      this.jobTypeStr = '';
      this.sendData = {
        areaNumber: this.setp1_info.areaNumber,
        parkName: this.setp1_info.parkName,
        jobMode: this.setp2_info.jobMode,
        jobType: this.setp2_info.jobType.join(","),
        vehicleType: this.setp2_info.vehicleType.join(","),
        vin17: this.setp2_info.vin17.join(","),
        timeStrategy: this.setp3_info
      };
      this.timeStrategyData = this.setp3_info;
      for (let item of this.setp2_info.vehicleType) {
        this.jobTypeStr += this.vehiclesTypeArr[item] + "+";
      }
      this.confirmDialogVisible = true;
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
    //启动作业计划
    startJobPlan(row) {
      startJobPlan({ jobNumber: row.jobNumber }).then(response => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "计划启动成功",
            type: "success",
            duration: 3000
          });
        } else {
          Message({
            message: "计划启动失败",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //停止作业计划
    stopJobPlan(row) {
      stopJobPlan({ jobNumber: row.jobNumber }).then(response => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "计划停止成功",
            type: "success",
            duration: 3000
          });
        } else {
          Message({
            message: "计划停止失败",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //作废作业计划
    abolishJobPlan(row) {
      abolishJobPlan({ jobNumber: row.jobNumber }).then(response => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "计划作废成功",
            type: "success",
            duration: 3000
          });
        } else {
          Message({
            message: "计划作废失败",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //查看时间策略详情
    lookTimeStrategy(row) {
      this.timeStrategyData = eval("(" + row + ")");
      this.timeDialogVisible = true;
    }
  }
};
</script>
<style scoped>
.span_style {
  margin-top: -20px;
}
.conditions {
  width: 200px;
}
.operation {
  margin-left: 10px;
}
</style>
