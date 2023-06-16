<template>
  <div>
    <el-form
      :model="jobStrategy"
      :rules="strategyRules"
      ref="jobStrategy"
      status-icon
      label-position="left"
      label-width="100px"
      class="step2-style"
    >
      <el-form-item :label="$t('作业模式')" class="select-style" prop="jobMode">
        <el-select
          v-model="jobStrategy.jobMode"
          clearable
          class="select-width"
          placeholder="请选择作业模式"
          @change="jobModeChange"
        >
          <el-option
            v-for="item in jobModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('作业类型')" class="select-style" prop="jobType">
        <el-select
          v-model="jobStrategy.jobType"
          clearable
          class="select-width"
          multiple
          :multiple-limit="multipleLimit"
          placeholder="请选择作业类型"
          @change="jobTypeChange"
        >
          <el-option
            v-for="item in jobTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        ><br />
      </el-form-item>
    </el-form>
    <div class="table-style">
      <el-table
        :data="list"
        :border="false"
        :stripe="true"
        ref="vehiclesTable"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('车牌号')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.carNo }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('VIN')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.vin17 }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('车辆类型')" align="center">
          <template slot-scope="{ row }">
            <span>{{ vehiclesTypeArr[row.vehicleType] }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('车身尺寸')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.vehicleSize }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('转弯半径')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.turningRadius }}{{ "m" }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('接近角')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.approachAngle }}{{ "°" }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('离去角')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.departureAngle }}{{ "°" }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('车重')" align="center">
          <template slot-scope="{ row }">
            <span> {{ row.vehicleWeight }}{{ "T" }}</span>
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

    <div class="button-div">
      <el-button type="primary" class="next-style" @click="next"
        >下一步</el-button
      >
      <el-button type="primary" class="back-style" @click="back"
        >上一步</el-button
      >
    </div>
  </div>
</template>

<script>
import { inquireVehicle } from "@/api/vehicles";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { Message } from "element-ui";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "taskPlan1",
  components: {
    Pagination
  },
  data() {
    return {
      vehiclesTypeArr: ["清扫车", "洒水车", "抑尘车"],
      multipleLimit: 0,
      list: null,
      total: 0,
      //   listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        vehicleType: undefined
      },
      jobModeOptions: [
        {
          value: 0,
          label: "单独作业"
        },
        {
          value: 1,
          label: "编队作业"
        }
      ],
      jobTypeOptions: [
        {
          value: 0,
          label: "清扫"
        },
        {
          value: 1,
          label: "洒水"
        },
        {
          value: 2,
          label: "抑尘"
        }
      ],
      jobStrategy: {
        jobMode: "",
        jobType: [],
        vin17: [],
        vehicleType: []
      },
      strategyRules: {
        jobMode: [
          { required: true, message: "请选择作业模式", trigger: "blur" }
        ],
        jobType: [
          { required: true, message: "请选择作业类型", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = true;
      inquireVehicle(this.listQuery).then(response => {
        this.list = response.data.vehicles;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },

    //下一步事件：
    next() {
      this.jobStrategy.vin17 = [];
      this.jobStrategy.vehicleType = [];
      this.$refs["jobStrategy"].validate(valid => {
        if (valid) {
          const selectedTableData = this.$refs.vehiclesTable.selection;
          if (selectedTableData.length > 0) {
            for (let item of selectedTableData) {
              this.jobStrategy.vin17.push(item.vin17);
              this.jobStrategy.vehicleType.push(item.vehicleType);
            }
            if (
              this.jobStrategy.jobType.length !== this.jobStrategy.vin17.length
            ) {
              Message({
                message: "作业类型对应的作业车辆数不一致",
                type: "error",
                duration: 3 * 1000
              });
            } else {
              var typeFlag = true;
              for (let item of this.jobStrategy.jobType) {
                if (this.jobStrategy.vehicleType.indexOf(item)===-1) {
                  typeFlag = false;
                }
              }
              if (typeFlag) {
                this.$emit("event_stepinfo", "next", 2, this.jobStrategy);
              } else {
                Message({
                  message: "作业类型与车辆类型不一致",
                  type: "error",
                  duration: 3 * 1000
                });
              }
            }
          } else {
            Message({
              message: "请至少选择一辆作业车辆",
              type: "error",
              duration: 3 * 1000
            });
          }
        }
      });
    },
    back() {
      this.$emit("event_stepinfo", "back", 2, this.jobStrategy);
    },

    //根据作业模式设置作业类型单选或多项
    jobModeChange(e) {
      if (e === 0) {
        this.multipleLimit = 1;
      } else {
        this.multipleLimit = 0;
      }
    },
    //根据选中的作业类型获取对应的作业车辆
    jobTypeChange(e) {
      if (e.length > 0) {
        this.listQuery.vehicleType = e.join(",");
      } else {
        this.listQuery.vehicleType = undefined;
      }
      inquireVehicle(this.listQuery).then(response => {
        this.list = response.data.vehicles;
        this.total = response.data.count;
        this.listLoading = false;
      });
    }
  }
};
</script>
<style lang="scss">
/* reset element-ui css */

.step2-style {
  display: block;
  margin: 0 auto;
  width: 60%;
  margin-top: 30px;
  margin-bottom: 30px;
}
.next-style {
  float: right;
  margin-top: -20px;
  margin-left: 10px;
}
.back-style {
  float: left;
  margin-top: -20px;
  margin-left: 10px;
}
.select-style {
  margin-top: 30px;
}
.select-width {
  width: 80%;
}
.table-style {
  height: auto;
}
.button-div {
  margin-top: 30px;
}
</style>
