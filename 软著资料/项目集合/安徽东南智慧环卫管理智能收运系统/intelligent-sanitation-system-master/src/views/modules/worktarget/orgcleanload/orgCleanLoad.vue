<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtworktargetcleanload">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="报表类型">
          <el-select v-model="dataForm.reportType" placeholder="报表类型" @change="changeReportType">
            <el-option v-for="item in reportTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <dept-tree v-model="dataForm.worktargetOrgId"></dept-tree>
        </el-form-item>
        <el-form-item label="设施类型" prop="worktargetTypeId">
            <worktarget-type-select v-model="dataForm.worktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
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
      <OrgCleanLoadHistogram ref="histogram" :dataList="dataList"></OrgCleanLoadHistogram>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetCount" label="应清运数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetCleanedCount"  label="已清运数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="cleanCount" label="清运次数" header-align="center" align="center">
            <template slot-scope="scope">
              <span @click="showDialog(scope.row)" :class="scope.row.cleanCount > 0 ?'worktargetName-class': ''">{{ scope.row.cleanCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cleanAmount" label="清运量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="statisticTime" :width="timeWidth" :label="dateHeader" header-align="center" align="center"></el-table-column>
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
    <el-dialog :visible="visible" custom-class="dialogClass" title="清运记录明细" :close-on-click-modal="false" :close-on-press-escape="false" @close="onDialogClose">
      <twgtworktargetcleanrecord :showCondition="false" :condition="detailCondition"></twgtworktargetcleanrecord>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import DateUtil from '@/utils/dateUtil.js'
import OrgCleanLoadHistogram from './components/OrgCleanLoadHistogram'
import twgtworktargetcleanrecord from '../worktargetcleanrecord/twgtworktargetcleanrecord'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtworktargetcleanload/getOrgCleanStatisticPage4ReportType',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtworktargetcleanload/exportOrgCleanStatistic4ReportType',
        deleteURL: '/worktarget/twgtworktargetcleanload',
        deleteIsBatch: true
      },
      order: 'desc', // 排序，asc／desc
      orderField: 'cleanCount', // 排序，字段
      reportTypeList: [
        { value: 'dateReport', label: '日报表' },
        { value: 'monthReport', label: '月报表' },
        { value: 'yearReport', label: '年报表' },
        { value: 'customReport', label: '自定义报表' }
      ],
      visible: false,
      date: DateUtil.format(new Date(), 'yyyy-MM-dd'),
      month: DateUtil.format(new Date(), 'yyyy-MM'),
      year: DateUtil.format(new Date(), 'yyyy'),
      startDatetime: DateUtil.getTodayStart(),
      endDatetime: DateUtil.getTodayEnd(),
      timeWidth: '120px',
      dateHead: '统计日期',
      dateHeader: '统计日期',
      detailCondition: {},
      dataForm: {
        worktargetOrgId: '',
        worktargetTypeId: '',
        orgId: '',
        reportType: 'dateReport',
        startDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
        endDatetime: DateUtil.format(new Date(), 'yyyy-MM-dd') + ' 23:59:59'
      }
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
    twgtworktargetcleanrecord,
    OrgCleanLoadHistogram
  },
  computed: {
    showCustom () {
      return this.dataForm.reportType == 'customReport'
    },
    showDate () {
      return this.dataForm.reportType == 'dateReport'
    },
    showWeek () {
      return this.dataForm.reportType == 'weekReport'
    },
    showMonth () {
      return this.dataForm.reportType == 'monthReport'
    },
    showYear () {
      return this.dataForm.reportType == 'yearReport'
    }
  },
  methods: {
    changeWorktargetType (worktargetType) {
      if (!worktargetType) {
        this.dataForm.worktargetTypeId = ''
      } else {
        this.dataForm.worktargetTypeId = worktargetType.id
      }
    },
    changeOrg (org) {
      this.dataForm.worktargetOrgId = org.id
    },
    changeReportType () {
      if (this.dataForm.reportType == 'dateReport') {
        this.dateHead = '统计日期'
      } else if (this.dataForm.reportType == 'monthReport') {
        this.dateHead = '统计月份'
      } else if (this.dataForm.reportType == 'yearReport') {
        this.dateHead = '统计年份'
      }
    },
    showDialog (row) {
      if (row.cleanCount > 0) {
        this.visible = true
        this.$nextTick(() => {
          this.detailCondition = {
            worktargetOrgId: row.orgId,
            worktargetTypeId: row.worktargetTypeId,
            startDatetime: row.startDatetime,
            endDatetime: row.endDatetime
          }
        })
      }
    },
    onDialogClose () {
      this.visible = false
    },
    query () {
      this.dateHeader = this.dateHead
      this.dataListLoading = true
      if (this.dataForm.reportType == 'customReport') {
        this.timeWidth = '160px'
      } else {
        this.timeWidth = '120px'
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
      }).catch(() => {
        this.dataListLoading = false
      })
    }
  }
}
</script>
<style>
  .worktargetName-class {
    color:blue;
  }
  .worktargetName-class:hover {
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
