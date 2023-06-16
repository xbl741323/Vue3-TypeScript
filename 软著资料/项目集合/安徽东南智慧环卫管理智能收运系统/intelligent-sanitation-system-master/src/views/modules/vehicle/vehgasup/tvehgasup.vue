<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-vehicle__tvehgasup">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
		  <el-form-item label="部门">
		    <ren-dept-tree v-model="dataForm.orgId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
		  </el-form-item>
		  <el-form-item label="车辆类型">
		    <el-select
		      v-model="dataForm.vehicleTypeId"
		      placeholder="请选择">
		      <el-option
		        v-for="item in cartypeList"
		        :key="item.id"
		        :label="item.typeName"
		        :value="item.id">
		      </el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="车牌号">
		    <el-select
		      v-model="dataForm.vehicleId"
		      placeholder="请选择">
		      <el-option
		        v-for="item in carinfoList"
		        :key="item.id"
		        :label="item.vehicleNum"
		        :value="item.id">
		      </el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="加油时间">
		    <el-date-picker
			  v-model="dateRange"
			  type="daterange"
			  value-format="yyyy-MM-dd"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期">
		    </el-date-picker>
		  </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
       <!-- <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="$hasPermission('vehicle:tvehgasup:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('vehicle:tvehgasup:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
		<el-table-column prop="plateNumber" label="车辆名称" header-align="center" align="center"></el-table-column>
		<el-table-column prop="gasupNumber" label="加油量" header-align="center" align="center"></el-table-column>
		<el-table-column prop="gasupTime" label="加油时间" header-align="center" align="center"></el-table-column>
		<el-table-column prop="typeName" label="车辆类型" header-align="center" align="center"></el-table-column>
		<el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('vehicle:tvehgasup:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('vehicle:tvehgasup:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './tvehgasup-add-or-update'
import DateUtil from '@/utils/dateUtil.js'
import { GETCARTYPELISTV3 } from '@/api/cartype/cartype.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork/tvehgasup/getListPage',
        getDataListIsPage: true,
        exportURL: '/vehwork/tvehgasup/export',
        deleteURL: '/vehwork/tvehgasup',
        deleteIsBatch: true
      },
	  dateRange: [DateUtil.format(new Date(), 'yyyy-MM-dd'), DateUtil.format(new Date(), 'yyyy-MM-dd')],
      dataForm: {
		  status: '1',
		  orgId: '',
		  vehicleTypeId: '',
		  vehicleId: '',
		  startDate: '',
		  endDate: ''
      },
	  cartypeList: [],
	  carinfoList: []
    }
  },
  computed: {
    vehicleTypeId () {
      return this.dataForm.vehicleTypeId
    },
    orgId () {
      return this.dataForm.orgId
    } 
  },
  watch: {
    vehicleTypeId (val) {

		this.dataForm.vehicleTypeId = val;
      this.getCarinfo()
    },
    orgId (val) {
		this.dataForm.orgId = val;
      this.getCarinfo()
    },
	dateRange (newValue, oldValue) {
	  if (this.dateRange.length > 1) {
	    this.dataForm.startDate = this.dateRange[0]
	    this.dataForm.endDate = this.dateRange[1]
	  }
  }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    this.getCartype()
    this.getCarinfo()
  },
  methods: {
    getCartype () { 
	 GETCARTYPELISTV3({}).then(({ data: res }) => {
	   if (res.code === 0) {
	 	this.cartypeList = res.data
	   }
	 })
    },
    getCarinfo () {
	  this.$http
	    .get('/vehwork/tvehvehicleinfo/getList', {params: { ...this.dataForm } })
	    .then(({ data: res }) => {
	      if (res.code != 0) {
	        return this.$message.error(res.msg)
	      }
	      this.carinfoList = res.data
	     
	    })
	    .catch(() => {})
    }
  }
}
</script>
