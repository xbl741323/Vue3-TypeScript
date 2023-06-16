<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.carNo"
        placeholder="请输入车牌号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.vehicleType"
        style="width: 200px"
        class="filter-item"
        clearable
        placeholder="请选择车辆类型"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("搜索") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("添加") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-delete"
        @click="handleDelete"
      >
        {{ $t("删除") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      ref="vehiclesTable"
      v-loading="listLoading"
      :data="list"
      :border="false"
      :stripe="true"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column :label="$t('车牌号')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('VIN')" align="center" min-width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.vin17 }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('车辆类型')" align="center">
        <template slot-scope="{ row }">
          <span>{{ vehicleTypeArr[row.vehicleType] }}</span>
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
          <span> {{ row.vehicleWeight }}</span>
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

    <el-dialog :title="$t('新增车辆')" :visible.sync="dialogFormVisible">
      <el-form
        ref="vehicleForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="margin-left: 20px"
      >
        <el-row :gutter="30">
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('车牌号')" prop="carNo">
                <el-input v-model="temp.carNo" />
              </el-form-item></div
          ></el-col>
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('VIN')" prop="vin17">
                <el-input v-model="temp.vin17" />
              </el-form-item></div
          ></el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('车辆类型')" prop="vehicleType">
                <el-select
                  v-model="temp.vehicleType"
                  clearable
                  placeholder="请选择车辆类型"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item></div
          ></el-col>
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('车身尺寸')" prop="vehicleSize">
                <el-row :gutter="0">
                  <el-col :span="8"
                    ><div>
                      <el-input
                        v-model="vehicleSize.length"
                        placeholder="长(m)"
                      /></div
                  ></el-col>
                  <el-col :span="8"
                    ><div>
                      <el-input
                        v-model="vehicleSize.width"
                        placeholder="宽(m)"
                      /></div
                  ></el-col>
                  <el-col :span="8"
                    ><div>
                      <el-input
                        v-model="vehicleSize.height"
                        placeholder="高(m)"
                      /></div
                  ></el-col>
                </el-row>
              </el-form-item></div
          ></el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('转弯半径')" prop="turningRadius">
                <el-input v-model="temp.turningRadius" placeholder="单位(m)" />
              </el-form-item></div
          ></el-col>
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('接近角')" prop="approachAngle">
                <el-input v-model="temp.approachAngle" placeholder="单位(度)" />
              </el-form-item></div
          ></el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('离去角')" prop="departureAngle">
                <el-input
                  v-model="temp.departureAngle"
                  placeholder="单位(度)"
                />
              </el-form-item></div
          ></el-col>
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('车重')" prop="vehicleWeight">
                <el-input v-model="temp.vehicleWeight" placeholder="单位(T)" />
              </el-form-item></div
          ></el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12"
            ><div>
              <el-form-item :label="$t('作业尺寸')" prop="jobSize">
                <el-row :gutter="0">
                  <el-col :span="12"
                    ><div>
                      <el-input
                        v-model="jobSize.length"
                        placeholder="长(m)"
                      /></div
                  ></el-col>
                  <el-col :span="12"
                    ><div>
                      <el-input
                        v-model="jobSize.width"
                        placeholder="宽(m)"
                      /></div
                  ></el-col>
                </el-row>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("userTable.cancel") }}
        </el-button>
        <el-button type="primary" @click="createData()">
          {{ $t("userTable.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{
          $t("确认")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  inquireVehicle,
  createVehicles,
  deletedVehicles,
} from "@/api/vehicles";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { Message } from "element-ui";

export default {
  name: "Vehicles",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    const validateVehicleSize = (rule, value, callback) => {
      if (this.vehicleSize.length &&
        this.vehicleSize.width &&
        this.vehicleSize.height) {
        callback();
      } else {
        callback(new Error("请输入车身尺寸"));
      }
    };
    const validateJobSize = (rule, value, callback) => {
      if (this.jobSize.length && this.jobSize.width) {
        callback();
      } else {
        callback(new Error("请输入作业尺寸"));
      }
    };
    const validateVin17 = (rule, value, callback) => {
      var reg = /^(?!(?:\d+|[A-Z]+)$)[\dA-Z]{17}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("VIN由17位大写字母和数字组成"));
      }
    };
    return {
      options: [
        {
          value: 0,
          label: "清扫车",
        },
        {
          value: 1,
          label: "洒水车",
        },
        {
          value: 2,
          label: "抑尘车",
        },
      ],
      vehicleTypeArr: ["清扫车", "洒水车", "抑尘车"],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        carNo: undefined,
        vehicleType: undefined,
      },
      //新增车辆相关字段
      temp: {
        vin17: "",
        carNo: "",
        vehicleType: "",
        vehicleSize: "",
        turningRadius: "",
        approachAngle: "",
        departureAngle: "",
        vehicleWeight: "",
        jobSize: "",
      },
      //车身尺寸
      vehicleSize: {
        length: "",
        width: "",
        height: "",
      },
      //作业尺寸
      jobSize: {
        length: "",
        width: "",
      },
      dialogFormVisible: false,
      dialogPvVisible: false,

      pvData: [],
      rules: {
        vin17: [{ validator: validateVin17, trigger: "blur" }],
        carNo: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        vehicleType: [
          { required: true, message: "请选择车辆类型", trigger: "blur" },
        ],
        vehicleSize: [{ trigger: "blur", validator: validateVehicleSize }],
        turningRadius: [
          { required: true, message: "请输入转弯半径", trigger: "blur" },
        ],
        approachAngle: [
          { required: true, message: "请输入接近角", trigger: "blur" },
        ],
        departureAngle: [
          { required: true, message: "请输入离去角", trigger: "blur" },
        ],
        vehicleWeight: [
          { required: true, message: "请输入车重", trigger: "blur" },
        ],
        jobSize: [
          { trigger: "blur", validator: validateJobSize },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = true;
      inquireVehicle(this.listQuery).then((response) => {
        this.list = response.data.vehicles;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["vehicleForm"].clearValidate();
        this.$refs["vehicleForm"].resetFields();
        this.vehicleSize.length = "";
        this.vehicleSize.width = "";
        this.vehicleSize.height = "";
        this.jobSize.length = "";
        this.jobSize.width = "";
      });
    },
    //新增
    createData() {
      if (
        this.vehicleSize.length &&
        this.vehicleSize.width &&
        this.vehicleSize.height
      ) {
        this.temp.vehicleSize =
          this.vehicleSize.length +
          "m" +
          "*" +
          this.vehicleSize.width +
          "m" +
          "*" +
          this.vehicleSize.height +
          "m";
      }
      if (this.jobSize.length && this.jobSize.width) {
        this.temp.jobSize =
          this.jobSize.length + "m" + "*" + this.jobSize.width + "m";
      }
      this.$refs["vehicleForm"].validate((valid) => {
        if (valid) {
          createVehicles(this.temp).then((response) => {
            this.dialogFormVisible = false;
            if (response.code == 200) {
              Message({
                message: "车辆新增成功",
                type: "success",
                duration: 3000,
              });
              this.getList();
            } else {
              Message({
                message: response.message,
                type: "error",
                duration: 3000,
              });
            }
          });
        }
      });
    },

    //删除车辆
    handleDelete(row, index) {
      const selectedData = this.$refs.vehiclesTable.selection;
      if (selectedData.length < 1) {
        Message({
          message: "请选择要删除的车辆",
          type: "error",
          duration: 3000,
        });
        return;
      }
      const data = [];
      for (let item of selectedData) {
        data.push(item.vin17);
      }
      const sendData = { vin17: data.join(",") };
      deletedVehicles(sendData).then((response) => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "车辆删除成功",
            type: "success",
            duration: 3000,
          });
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000,
          });
        }
      });
    },
  },
};
</script>
