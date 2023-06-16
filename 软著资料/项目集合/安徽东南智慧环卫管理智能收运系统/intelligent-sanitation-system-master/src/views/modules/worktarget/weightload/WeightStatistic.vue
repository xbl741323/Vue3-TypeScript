<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtworktargetcleanload">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="报表类型">
          <el-select v-model="reportType" placeholder="报表类型" @change="changeReportType">
            <el-option v-for="item in reportTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型">
          <vehicle-type-select v-model="dataForm.vehicleTypeId" @changeVehicleType="changeVehicleType"></vehicle-type-select>
        </el-form-item>
        <el-form-item label="车辆">
          <vehicle-select :vehicleTypeId="dataForm.vehicleTypeId" :vehicleId="dataForm.vehicleId" @changeVehicle="changeVehicle"></vehicle-select>
        </el-form-item>
        <div v-if="showDate" class="time-div">
          <el-form-item label="统计日期" prop="startDatetime">
            <el-date-picker
              v-model="date"
              type="date"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="showCustom" class="time-div">
          <el-form-item label="开始时间" prop="startDatetime">
            <el-date-picker
              v-model="startDatetime"
              type="date"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="startDatetime">
            <el-date-picker
              v-model="endDatetime"
              type="date"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 23:59:59"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
        </div>
        <div v-if="showMonth" class="time-div">
          <el-form-item label="统计月份" prop="startDatetime">
            <el-date-picker
              v-model="month"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="showYear" class="time-div">
          <el-form-item label="统计年份" prop="startDatetime">
            <el-date-picker
              v-model="year"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <WeightStatisticLine :dataList="dataList"></WeightStatisticLine>
      <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="statisticTime" :width="timeWidth" :label="dateHeader" header-align="center" align="center"></el-table-column>
        <el-table-column prop="enterCount"  label="入厂次数" header-align="center" align="center">
          <template slot-scope="scope">
              <span @click="showEnterDialog(scope.row)" :class="scope.row.enterCount > 0 ?'enter-class': ''">{{ scope.row.enterCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterWeightAmount" label="入厂重量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="leaveCount" label="离厂次数" header-align="center" align="center">
          <template slot-scope="scope">
              <span @click="showLeaveDialog(scope.row)" :class="scope.row.leaveCount > 0 ?'enter-class': ''">{{ scope.row.leaveCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaveWeightAmount" label="离厂重量" header-align="center" align="center"></el-table-column>
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
      <!-- 弹窗, 新增 / 修改 -->
    </div>
    <el-dialog :visible="visible" custom-class="dialogClass" title="称重明细" :close-on-click-modal="false" :close-on-press-escape="false" @close="onDialogClose">
      <weightrecord :showCondition="false" :condition="detailCondition"></weightrecord>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import DateUtil from '@/utils/dateUtil.js'
import weightrecord from './weightrecord'
import WeightStatisticLine from './components/WeightStatisticLine'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtweight/weightStatistic',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtweight/exportStatistic',
        deleteURL: '/worktarget/twgtweight',
        deleteIsBatch: true
      },
      order: 'desc', // 排序，asc／desc
      orderField: 'statisticTime', // 排序，字段
      reportTypeList: [
        { value: 'dateReport', label: '日报表' },
        { value: 'monthReport', label: '月报表' },
        { value: 'yearReport', label: '年报表' }
      ],
      visible: false,
      date: DateUtil.format(new Date(), 'yyyy-MM-dd'),
      month: DateUtil.format(new Date(), 'yyyy-MM'),
      year: DateUtil.format(new Date(), 'yyyy'),
      startDatetime: DateUtil.getTodayStart(),
      endDatetime: DateUtil.getTodayEnd(),
      dateHead: '统计日期',
      dateHeader: '统计日期',
      detailCondition: {},
      reportType: 'dateReport',
      dataForm: {
        reportType: 'dateReport',
        worktargetTypeId: '',
        worktargetId: '',
        vehicleTypeId: '',
        vehicleId: '',
        startDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
        endDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
        summary: 'enterCount,enterWeightAmount,leaveCount,leaveWeightAmount'
      },
      doneDataForm: {},
      summaryData: {}
    }
  },
  watch: {
    month (val) {
      this.dataForm.startDatetime = DateUtil.getMonthStartFullTime(val)
      this.dataForm.endDatetime = DateUtil.getMonthEndFullTime(val)
    },
    year (val) {
      this.dataForm.startDatetime = DateUtil.getYearStartFullTime(val)
      this.dataForm.endDatetime = DateUtil.getYearEndFullTime(val)
    },
    date (val) {
      this.dataForm.startDatetime = val + ' 00:00:00'
      this.dataForm.endDatetime = val + ' 23:59:59'
    },
    startDatetime (val) {
      this.dataForm.startDatetime = val
    },
    endDatetime (val) {
      this.dataForm.endDatetime = val
    }
  },
  components: {
    weightrecord,
    WeightStatisticLine
  },
  computed: {
    showCustom () {
      return this.reportType == 'customReport'
    },
    showDate () {
      return this.reportType == 'dateReport'
    },
    showWeek () {
      return this.reportType == 'weekReport'
    },
    showMonth () {
      return this.reportType == 'monthReport'
    },
    showYear () {
      return this.reportType == 'yearReport'
    },
    timeWidth () {
      if (this.dataForm.reportType == 'customReport') {
        return '160px'
      } else {
        return '120px'
      }
    }
  },
  methods: {
    changeReportType () {
      if (this.reportType == 'dateReport') {
        this.dateHead = '统计日期'
        this.dataForm.reportType = this.reportType
        this.dataForm.startDatetime = this.date + ' 00:00:00'
        this.dataForm.endDatetime = this.date + ' 23:59:59'
      } else if (this.reportType == 'monthReport') {
        this.dateHead = '统计日期'
        this.dataForm.reportType = 'dateReport'
        var date = DateUtil.parse(this.month, 'yyyy-MM')
        this.dataForm.startDatetime = DateUtil.getMonthStartFullTime(date)
        this.dataForm.endDatetime = DateUtil.getMonthEndFullTime(date)
      } else if (this.reportType == 'yearReport') {
        this.dateHead = '统计月份'
        this.dataForm.reportType = 'monthReport'
        var yearDate = DateUtil.parse(this.year, 'yyyy')
        this.dataForm.startDatetime = DateUtil.getYearStartFullTime(yearDate)
        this.dataForm.endDatetime = DateUtil.getYearEndFullTime(yearDate)
      }
    },
    showEnterDialog (row) {
      if (row.enterCount > 0) {
        this.visible = true
        this.$nextTick(() => {
          this.detailCondition = {
            worktargetTypeId: this.doneDataForm.worktargetTypeId,
            worktargetId: this.doneDataForm.worktargetId,
            vehicleTypeId: this.doneDataForm.vehicleTypeId,
            vehicleId: this.doneDataForm.vehicleId,
            tradeType: '1',
            startDatetime: row.startDatetime,
            endDatetime: row.endDatetime
          }
        })
      }
    },
    showLeaveDialog (row) {
      if (row.leaveCount > 0) {
        this.visible = true
        this.$nextTick(() => {
          this.detailCondition = {
            worktargetTypeId: this.doneDataForm.worktargetTypeId,
            worktargetId: this.doneDataForm.worktargetId,
            vehicleTypeId: this.doneDataForm.vehicleTypeId,
            vehicleId: this.doneDataForm.vehicleId,
            tradeType: '2',
            startDatetime: row.startDatetime,
            endDatetime: row.endDatetime
          }
        })
      }
    },
    onDialogClose () {
      this.visible = false
    },
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
    },
    query () {
      this.dateHeader = this.dateHead
      this.dataListLoading = true
      this.doneDataForm = {
        ...this.dataForm
      }
      this.$http.get(
        this.mixinViewModuleOptions.getDataListURL,
        {
          params: {
            order: this.order,
            orderField: this.orderField,
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
            ...this.dataForm
          }
        }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.list : res.data
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.data.total : 0
        this.summaryData = res.data.summary
      }).catch(() => {
        this.dataListLoading = false
      })
    }
  }
}
</script>
<style>
  .enter-class {
    color:blue;
  }
  .enter-class:hover {
    text-decoration:underline;
    cursor:pointer;
  }
  .dialogClass{
    width: 80%;
  }
  .time-div {
    display: inline-block;
  }

</style>
