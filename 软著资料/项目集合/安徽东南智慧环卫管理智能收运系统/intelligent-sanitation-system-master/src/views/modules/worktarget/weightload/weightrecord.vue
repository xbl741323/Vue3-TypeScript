<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtweight">
      <el-form :inline="true"  v-if="showCondition"  :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="车辆类型" prop="vehicleTypeId">
          <vehicle-type-select v-model="dataForm.vehicleTypeId" :placeholder="'请选择'" @changeVehicleType="changeVehicleType"></vehicle-type-select>
        </el-form-item>
        <el-form-item label="车辆">
          <vehicle-select :vehicleTypeId="dataForm.vehicleTypeId" :vehicleId="dataForm.vehicleId" @changeVehicle="changeVehicle"></vehicle-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDatetime">
            <el-date-picker
              v-model="dataForm.startDatetime"
              type="date"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="startDatetime">
            <el-date-picker
              v-model="dataForm.endDatetime"
              type="date"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 23:59:59"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtweight:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtweight:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <WeightRecordLine v-if="showCondition" :dataList="dataList"></WeightRecordLine>
      <el-table :show-summary="showSummary"
      :summary-method="getSummaries"
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="goodsTypeName" label="物品类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehiclePlateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="tare" label="皮重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gross" label="毛重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="net" label="净重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="tradeTypeName" label="业务类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="netDatetime" width="160px" label="称重时间" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import DateUtil from '@/utils/dateUtil.js'
import WeightRecordLine from './components/WeightRecordLine'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtweight/getRecordPage',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtweight/exportRecord',
        deleteURL: '/worktarget/twgtweight',
        deleteIsBatch: true
      },
      dataForm: {
        worktargetTypeId: '',
        worktargetId: '',
        vehicleTypeId: '',
        vehicleId: '',
        tradeType: '',
        startDatetime: DateUtil.getTodayStart(),
        endDatetime: DateUtil.getTodayEnd(),
        summary: 'tare,gross,net'
      }
    }
  },
  props: {
    showCondition: {
      type: Boolean,
      default: true
    },
    condition: ''
  },
  watch: {
    condition (val) {
      this.dataForm.worktargetId = val.worktargetId
      this.dataForm.worktargetTypeId = val.worktargetTypeId
      this.dataForm.vehicleTypeId = val.vehicleTypeId
      this.dataForm.vehicleId = val.vehicleId
      this.dataForm.tradeType = val.tradeType
      this.dataForm.startDatetime = val.startDatetime
      this.dataForm.endDatetime = val.endDatetime
      this.getDataList()
    }
  },
  components: {
    WeightRecordLine
  },
  computed: {
    showSummary () {
      return !(this.summaryData == '')
    }
  },
  methods: {
    changeVehicleType (vehicleType) {
      if (!vehicleType) {
        this.dataForm.vehicleTypeId = ''
      } else {
        this.dataForm.vehicleTypeId = vehicleType.id
      }
      this.dataForm.vehicleId = ''
    },
    changeVehicle (vehicle) {
      if (!vehicle) {
        this.dataForm.vehicleId = ''
      } else {
        this.dataForm.vehicleId = vehicle.id
      }
    },
    getSummaries (param) {
      const { columns } = param
      const sums = []
      var that = this
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = '合计'
        } else {
          console.log(that.summaryData)
          var summaryItem = that.summaryData[column.property]
          sums[index] = summaryItem == 'undefined' ? '' : summaryItem
        }
      })
      return sums
    }
  }
}
</script>
