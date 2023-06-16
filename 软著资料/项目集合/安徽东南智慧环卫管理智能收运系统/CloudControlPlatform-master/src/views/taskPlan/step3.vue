<template>
  <div>
    <el-form
      :model="timeStrategy"
      ref="timeStrategy"
      :rules="timeStrategyRules"
      status-icon
      label-position="left"
      label-width="100px"
      class="step3-style"
    >
      <el-form-item
        :label="$t('执行时间')"
        class="select-style"
        prop="time"
      >
        <el-time-picker
          v-model="timeStrategy.time"
          class="select-width"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          placeholder="请选择执行时间"
          value-format="HH:mm:ss"
        >
        </el-time-picker>
      </el-form-item>

      <el-form-item
        :label="$t('执行周期')"
        class="select-style"
        prop="cycle"
      >
        <el-select
          v-model="timeStrategy.cycle"
          clearable
          class="select-width"
          placeholder="请选择执行周期"
          @change="cycleChange"
        >
          <el-option
            v-for="item in cycleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <i class="el-icon-remove" @click="deleteTimeStrategy"></i>
      <i class="el-icon-circle-plus" @click="createTimeStrategy"></i>
      <br />
    </el-form>
    <div class="table-style">
      <el-table
        :data="list"
        :border="false"
        :stripe="true"
        ref="timeStrategyTable"
        :row-class-name="tableRowClassName"
        @row-click="onRowClick"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="selection" width="50px" align="center">
        </el-table-column>
        <el-table-column :label="$t('执行时间')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.time }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('执行周期')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.cycle }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="button-div">
      <el-button type="primary" class="next-style" @click="next"
        >下一步</el-button
      >
      <el-button type="primary" class="back-style" @click="back"
        >上一步</el-button
      >
    </div>
    <el-dialog
      width="30%"
      :title="$t('自定义周期')"
      :visible.sync="customDialogVisible"
      center
      append-to-body
    >
      <el-select
        v-model="weeksSelected"
        multiple
        placeholder="请选择执行周期"
        class="select-width"
      >
        <el-option
          v-for="item in weeks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-button type="primary" class="confirm-style" @click="confirmCustom"
        >确认</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/vehicles";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { Message } from "element-ui";

export default {
  name: "taskPlan1",
  components: {},
  data() {
    return {
      list: [],
      cycleOptions: [
        {
          value: "once",
          label: "仅此一次"
        },
        {
          value: "everyDay",
          label: "每天"
        },
        {
          value: "workDay",
          label: "周一至周五"
        },
        {
          value: "自定义",
          label: "自定义"
        }
      ],
      weeks: [
        {
          value: "Mon",
          lable: "周一"
        },
        {
          value: "Tues",
          lable: "周二"
        },
        {
          value: "Wed",
          lable: "周三"
        },
        {
          value: "Thur",
          lable: "周四"
        },
        {
          value: "Fri",
          lable: "周五"
        },
        {
          value: "Sat",
          lable: "周六"
        },
        {
          value: "Sun",
          lable: "周日"
        }
      ],
      timeStrategy: {
        time: "",
        cycle: ""
      },
      customDialogVisible: false,
      timeStrategyData: [],

      timeStrategyRules: {
        time: [
          { required: true, message: "请选择执行时间", trigger: "blur" }
        ],
        cycle: [
          { required: true, message: "请选择执行周期", trigger: "blur" }
        ]
      },
      //自定义周期时选中的值
      weeksSelected: [],
      //选中的时间策略表格的值
      selectedTableData: []
    };
  },
  created() {},
  methods: {
    //创建时间策略
    createTimeStrategy() {
      const data = [];

      this.$refs["timeStrategy"].validate(valid => {
        if (valid) {
          if (this.timeStrategy.cycle === "自定义") {
            this.list.push({
              cycle: this.weeksSelected.join(","),
              time: this.timeStrategy.time
            });
          }else{
            this.list.push({
              cycle: this.timeStrategy.cycle,
              time: this.timeStrategy.time
            });
          }
        }
      });
    },
    //删除时间策略
    deleteTimeStrategy() {
      const _selectData = this.$refs.timeStrategyTable.selection;
      this.list.splice(_selectData[0].row_index, 1);
    },

    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index;
    },

    //下一步事件：
    next() {
      this.selectedTableData = this.$refs.timeStrategyTable.selection;
      if (this.selectedTableData.length>0) {
        const data = []
        for(let item of this.selectedTableData) {
          data.push({
            time: item.time,
            cycle: item.cycle
          })
        }
        this.$emit("event_stepinfo", "next", 3, data);
      } else {
        Message({
          message: '请至少选择一种时间策略',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    back() {
      this.$emit("event_stepinfo", "back", 3, this.dbForm);
    },
    //自定义周期确认事件
    confirmCustom() {
      this.customDialogVisible = false;
    },
    //周期选择事件
    cycleChange(e) {
      if (e === "自定义") {
        this.customDialogVisible = true;
        this.$parent.dialogVisible = false;
      }
    }
  }
};
</script>
<style lang="scss">
/* reset element-ui css */

.step3-style {
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
.confirm-style {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
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
  width: 100%;
}
.table-style {
  height: auto;
}
.button-div {
  margin-top: 30px;
}
.el-icon-circle-plus {
  float: right;
  color: #46a6ff;
  font-size: 30px;
}
.el-icon-remove {
  float: right;
  margin-left: 10px;
  color: #ff4949;
  font-size: 30px;
}
</style>
