<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worker__twkrworkereventinfo">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
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
        <el-form-item label="部门">
          <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="dataForm.workerName" ></el-input>
        </el-form-item>
        <el-form-item label="违规类型">
          <el-select
            v-model="dataForm.eventType"
            placeholder="请选择">
            <el-option
              v-for="item in eventTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报表类型">
          <el-select v-model="reportType" >
            <el-option v-for="item in reportTypeList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-if="dateInputType == 1"
            v-model="datetimeRange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
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
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worker:twkrworkereventinfo:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worker:twkrworkereventinfo:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="workerName" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="eventType" label="事件类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="runSpeed" label="速度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="事件日期" :formatter="dateFormatter" header-align="center" align="center"></el-table-column>
        <el-table-column prop="eventStartDate" label="事件开始时间" :formatter="timeFormatter" header-align="center" align="center"></el-table-column>
        <el-table-column prop="eventEndDate" label="事件结束时间" :formatter="timeFormatter" header-align="center" align="center"></el-table-column>
        <el-table-column prop="eventLong" label="事件时长" header-align="center" align="center"></el-table-column>
        <el-table-column prop="eventPlace" label="事件地址" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column prop="status" label="状态" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worker:twkrworkereventinfo:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worker:twkrworkereventinfo:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column> -->
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
import { GETWORKERTYPELIST } from '@/api/worker/worker.js'
import DateUtil from '@/utils/dateUtil.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/wkr-old/personeventadapter/getPersoneventPage4Datetime',
        getDataListIsPage: true,
        exportURL: '/wkr-old/personeventadapter/exportPersonevent4Datetime',
        deleteURL: '/worker/twkrworkereventinfo',
        deleteIsBatch: true
      },
      dateInputType: 1,
      datetimeRange: [DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 00:00:00', DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 23:59:59'],
      dateWeek: new Date(),
      dateMonth: new Date(),
      reportType: '1',
      dataForm: {
        workerTypeId: '',
        deptId: '',
        workerName: '',
        eventType: '',
        reportType: '1',
        startDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
        endDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 23:59:59'
      },
      workerTypeList: [],
      eventTypeList: [
        { label: '滞留', value: '滞留点' },
        { label: '脱岗', value: '脱岗点' },
        { label: '迟到', value: '迟到点' },
        { label: '早退', value: '早退点' },
        { label: '越界', value: '越界点' },
        { label: '未开机', value: '未开机' },
        { label: '驻地滞留', value: '驻地滞留点' }],
      reportTypeList: [
        { id: '1', label: '日报表' },
        { id: '2', label: '周报表' },
        { id: '3', label: '月报表' },
        { id: '4', label: '自定义时间' }
      ]
    }
  },
  watch: {
    datetimeRange (newValue, oldValue) {
      if (this.datetimeRange.length > 1) {
        this.dataForm.startDatetime = this.datetimeRange[0]
        this.dataForm.endDatetime = this.datetimeRange[1]
      }
    },
    dateWeek (newValue, oldValue) {
      this.dataForm.startDatetime = DateUtil.getWeekStart(this.dateWeek) + ' 00:00:00'
      this.dataForm.endDatetime = DateUtil.getWeekEnd(this.dateWeek) + ' 23:59:59'
    },
    dateMonth (newValue, oldValue) {
      this.dataForm.startDatetime = DateUtil.getMonthStart(this.dateMonth) + ' 00:00:00'
      this.dataForm.endDatetime = DateUtil.getMonthEnd(this.dateMonth) + ' 23:59:59'
    },
    reportType (newValue, oldValue) {
      this.dataForm.reportType = this.reportType
      if (this.reportType === '1' || this.reportType === '4') {
        this.dateInputType = 1
        this.dataForm.startDatetime = this.datetimeRange[0]
        this.dataForm.endDatetime = this.datetimeRange[1]
      } else if (this.reportType === '2') {
        this.dateInputType = 2
        this.dataForm.startDatetime = DateUtil.getWeekStart(this.dateWeek) + ' 00:00:00'
        this.dataForm.endDatetime = DateUtil.getWeekEnd(this.dateWeek) + ' 23:59:59'
      } else if (this.reportType === '3') {
        this.dateInputType = 3
        this.dataForm.startDatetime = DateUtil.getMonthStart(this.dateMonth) + ' 00:00:00'
        this.dataForm.endDatetime = DateUtil.getMonthEnd(this.dateMonth) + ' 23:59:59'
      }
    }
  },
  components: {
  },
  mounted () {
    // this.dataForm.startDatetime = this.datetimeRange[0]
    // this.dataForm.endDatetime = this.datetimeRange[1]
    this.getWorkerTypeList()
  },
  methods: {
    getWorkerTypeList () {
      GETWORKERTYPELIST({}).then(({ data: res }) => {
        if (res.code === 0) {
          this.workerTypeList = res.data
        }
      })
    },
    dateFormatter (row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.substring(0, 10)
      }
      return ''
    },
    timeFormatter (row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.substring(11)
      }
      return ''
    }
  }
}
</script>
