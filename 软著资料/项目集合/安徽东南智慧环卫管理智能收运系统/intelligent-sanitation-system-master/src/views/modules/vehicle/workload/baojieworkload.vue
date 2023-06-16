<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-vehwork__workload">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="queryData()">
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
		  <el-form-item label="车辆类型">
		    <el-select
		      v-model="dataForm.cartypeId"
		      placeholder="请选择">
		      <el-option
		        v-for="item in carTypeList"
		        :key="item.id"
		        :label="item.typename"
		        :value="item.id">
		      </el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="车牌号">
		    <el-input v-model="dataForm.carName" ></el-input>
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
        <el-table-column prop="plateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="carTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
		<el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column  v-if="dateInfoShow"  prop="workttime" label="出车时间" header-align="center" align="center"></el-table-column>
		<el-table-column prop="travelmileage" label="行驶里程" header-align="center" align="center"></el-table-column>
		<el-table-column prop="workMileage" label="作业里程" header-align="center" align="center"></el-table-column>
		<el-table-column  v-if="dateInfoShow"  prop="longwork" label="作业时长" header-align="center" align="center"></el-table-column>
        <el-table-column prop="overspeed" label="超速违规次数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="parkviolations" label="停车违规次数" header-align="center" align="center"></el-table-column>

        <el-table-column prop="oilabnormal" label="油量异常次数" header-align="center" align="center"></el-table-column>
    
 
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
import { GETCARTYPELIST } from '@/api/cartype/cartype.js'
import DateUtil from '@/utils/dateUtil.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork-old/adapterworkworkload/getWorkloadReportBetweenDate',
        getDataListIsPage: true,
        exportURL: '/vehwork-old/adapterworkworkload/getWorkloadReportBetweenDateExcel',
        deleteURL: '/vehwork/workload',
        deleteIsBatch: true
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
		  cartypeId: '',
		  deptId: '',
		  carName: '',
		  reportType: '1',
		  startDate: '',
		  endDate: ''
      },
	  carTypeList: []
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
      this.dataForm.startDate = DateUtil.getMonthStart(this.dateWeek)
      this.dataForm.endDate = DateUtil.getMonthEnd(this.dateWeek)
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
    this.getCarTypeList()
  },
  methods: {
	  getCarTypeList () {
	    GETCARTYPELIST({}).then(({ data: res }) => {
	      if (res.code === 0) {
			this.carTypeList = res.data
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
