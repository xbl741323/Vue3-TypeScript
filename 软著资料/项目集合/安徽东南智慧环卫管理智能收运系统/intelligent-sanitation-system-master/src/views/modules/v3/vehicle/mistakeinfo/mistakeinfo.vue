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
		      v-model="dataForm.vehicleTypeId"
		      placeholder="请选择"
              :clearable="true">
		      <el-option
		        v-for="item in vehicleTypeList"
		        :key="item.id"
		        :label="item.typeName"
		        :value="item.id">
		      </el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="车牌号">
		    <el-input v-model="dataForm.plateNumber" ></el-input>
		  </el-form-item>
		  <el-form-item label="违规类型">
		    <el-select v-model="dataForm.mistaketype" >
		      <el-option v-for="item in mistakeTypeList"
		      :key="item.id"
		      :label="item.label"
		      :value="item.id">
		      </el-option>
		    </el-select>
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
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="plateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="carTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
		<el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
		<el-table-column prop="driverName" label="驾驶员" header-align="center" align="center"></el-table-column>
		<el-table-column prop="mistakeType" label="违规类型" header-align="center" align="center"></el-table-column>
		<el-table-column  v-if="dateInfoShow" label="违规时间段" :formatter="formatNetDatetime" header-align="center" align="center"></el-table-column>
		<el-table-column  v-if="dateInfoShow" label="违规时长" :formatter="formatNetDatetime1" header-align="center" align="center"></el-table-column>
		<el-table-column  v-if="dateInfoShow" prop="checkdescription" label="违规地点" header-align="center" align="center"></el-table-column>
		<el-table-column  v-if="dateInfoShow==false" prop="mistakeCount" label="违规次数" header-align="center" align="center"></el-table-column>
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
import { GETCARTYPELISTV3 } from '@/api/cartype/cartype.js'
import DateUtil from '@/utils/dateUtil.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork/tvehmistakeinfo/getMistakeinfoReportBetweenDate',
        getDataListIsPage: true,
        exportURL: '/vehwork/workload/export',
        deleteURL: '/vehwork/workload',
        deleteIsBatch: true
      },
      reportTypeList: [
        { id: '1', label: '日报表' },
        { id: '2', label: '周报表' },
        { id: '3', label: '月报表' },
        { id: '4', label: '自定义时间' }
      ],
	  mistakeTypeList: [
	    { id: '停车点', label: '停车点' },
	    { id: '漏报数据', label: '漏报数据' },
	    { id: '慢速作业', label: '慢速作业' },
	    { id: '油量异常减少', label: '油量异常减少' },
	    { id: '超速点', label: '超速点' },
	    { id: '违规停车', label: '违规停车' },
	    { id: '车辆越界', label: '车辆越界' },
	    { id: '超时作业', label: '超时作业' },
	    { id: '超时停车', label: '超时停车' }
	  ],
      dateInfoShow: true,
      dateInputType: 1,
      dateRange: [DateUtil.format(new Date(), 'yyyy-MM-dd'), DateUtil.format(new Date(), 'yyyy-MM-dd')],
      dateWeek: new Date(),
      dateMonth: new Date(),
      reportType: '1',
	  tableName: 'mistakeinfo',
      dataForm: {
		  vehicleTypeId: '',
		  deptId: '',
		  plateNumber: '',
		  reportType: '1',
		  tableName: 'mistakeinfo',
		  startDate: DateUtil.format(new Date(), 'yyyy-MM-dd'),
		  endDate: DateUtil.format(new Date(), 'yyyy-MM-dd'),
		  mistaketype: ''
      },
	  vehicleTypeList: []
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
    this.getVehicleTypeList()
  },
  methods: {
	  getVehicleTypeList () {
	    GETCARTYPELISTV3({}).then(({ data: res }) => {
	      if (res.code === 0) {
          this.vehicleTypeList = res.data
	      }
	    })
	  },
	 formatNetDatetime (row, column) {
	   if (row.parkingtime) {
	     return row.parkingtime.substr(0, 17)
	   }
	   return ''
	 },
	 formatNetDatetime1 (row, column) {
	   if (row.parkingtime) {
	     return row.parkingtime.substring(19)
	   }
	   return ''
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
