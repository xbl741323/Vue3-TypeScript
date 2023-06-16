<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worker__twkrworkload">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="报表类型">
          <el-select v-model="reportType" >
            <el-option v-for="item in reportTypeList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item label="人员类型">
          <el-select
            v-model="dataForm.workerTypeId"
            placeholder="请选择">
            <el-option
              v-for="item in workerTypeList"
              :key="item.id"
              :label="item.typename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="dataForm.workerName" ></el-input>
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-if="dateInputType == 1"
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-date-picker
            v-if="dateInputType == 2"
            v-model="dateWeek"
            type="week"
            format="yyyy 第 WW 周"
            >
          </el-date-picker>
          <el-date-picker
            v-if="dateInputType == 3"
            v-model="dateMonth"
            type="month"
            format="yyyy年MM月"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryData()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="workerName" label="工作人姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workerTypeName" label="工作人员类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column v-if="dateInfoShow" prop="startWorkTime" label="开始作业时间" header-align="center" align="center"></el-table-column>
        <el-table-column v-if="dateInfoShow" prop="endWorkTime1" label="结束作业时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="earlyLeaveNum" label="早退次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="yuejieNum" label="越界次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="yuejieLong" label="越界时长" header-align="center" align="center"></el-table-column>
        <el-table-column prop="tuogangNum" label="脱管次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="zhiliuNum" label="滞留次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="zhiliuLong" label="滞留时长" header-align="center" align="center"></el-table-column>
        <el-table-column prop="homeZhiliuNum" label="住址滞留次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="homeZhiliuLong" label="住址滞留时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="xunchaNum" label="巡查次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="xunchaMileage" label="巡查里程" header-align="center" align="center"></el-table-column>
        <el-table-column prop="xunchaLong" label="巡查时长" header-align="center" align="center"></el-table-column>
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
import { GETWORKERTYPELISTV3 } from '@/api/worker/worker.js'
import DateUtil from '@/utils/dateUtil.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/zhhw-worker/twkrworkload/getWorkerWorkloadReportBetweenDate',
        getDataListIsPage: true,
        exportURL: '/worker/twkrworkload/export',
        deleteURL: '/worker/twkrworkload',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      reportTypeList: [
        { id: '1', label: '日报表' },
        { id: '2', label: '周报表' },
        { id: '3', label: '月报表' },
        { id: '4', label: '自定义时间' }
      ],
      dateInfoShow: true,
      dateInputType: 1,
      dateRange: [DateUtil.format(new Date(), 'yyyy-MM-dd'), DateUtil.format(new Date(), 'yyyy-MM-dd')],
      dateWeek: new Date(),
      dateMonth: new Date(),
      reportType: '1',
      dataForm: {
        workerTypeId: '',
        deptId: '',
        workerName: '',
        reportType: '1',
        startDate: '',
        endDate: ''
      },
      workerTypeList: []
    }
  },
  watch: {
    dateRange (newValue, oldValue) {
      if (this.dateRange.length > 1) {
        this.dataForm.startDate = this.dateRange[0]
        this.dataForm.endDate = this.dateRange[1]
      }
    },
    dateWeek (newValue, oldValue) {
      this.dataForm.startDate = DateUtil.getWeekStart(this.dateWeek)
      this.dataForm.endDate = DateUtil.getWeekEnd(this.dateWeek)
    },
    dateMonth (newValue, oldValue) {
      this.dataForm.startDate = DateUtil.getMonthStart(this.dateMonth)
      this.dataForm.endDate = DateUtil.getMonthEnd(this.dateMonth)
    },
    reportType (newValue, oldValue) {
      if (this.reportType === '1' || this.reportType === '4') {
        this.dateInputType = 1
        this.dataForm.startDate = this.dateRange[0]
        this.dataForm.endDate = this.dateRange[1]
      } else if (this.reportType === '2') {
        this.dateInputType = 2
        this.dataForm.startDate = DateUtil.getWeekStart(this.dateWeek)
        this.dataForm.endDate = DateUtil.getWeekEnd(this.dateWeek)
      } else if (this.reportType === '3') {
        this.dateInputType = 3
        this.dataForm.startDate = DateUtil.getMonthStart(this.dateMonth)
        this.dataForm.endDate = DateUtil.getMonthEnd(this.dateMonth)
      }
    }
  },
  mounted () {
    // this.dateRange = [DateUtil.format(new Date(), 'yyyy-MM-dd'), DateUtil.format(new Date(), 'yyyy-MM-dd')]
    this.dataForm.startDate = this.dateRange[0]
    this.dataForm.endDate = this.dateRange[1]
    // this.dateWeek = DateUtil.format(new Date(), 'yyyy-MM-dd')
    // this.dateMonth = DateUtil.format(new Date(), 'yyyy-MM-dd')
    this.getWorkerTypeList()
  },
  methods: {
    getWorkerTypeList () {
        GETWORKERTYPELISTV3({}).then(({ data: res }) => {

        if (res.code === 0) {
          this.workerTypeList = res.data
        }
      })
    },
    queryData () {
      if (this.reportType === '1') {
        this.dateInfoShow = true
      } else {
        if (this.dataForm.startDate === this.dataForm.endDate) {
          this.dateInfoShow = true
        } else {
          this.dateInfoShow = false
        }
      }
      if (this.dateInfoShow) {
        this.dataForm.reportType = '1'
      } else {
        this.dataForm.reportType = this.reportType
      }
      this.getDataList()
    }
  }
}
</script>
