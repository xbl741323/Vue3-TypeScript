<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-vehicle__tvehvehicleinfo">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门">
          <dept-tree v-model="dataForm.deptId" placeholder="请选择"></dept-tree>
        </el-form-item>
        <el-form-item label="车辆类型">
          <vehicle-type-select v-model="dataForm.vehicleTypeId" @changeVehicleType="changeVehicleType"></vehicle-type-select>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="dataForm.plateNumber" ></el-input>
        </el-form-item>
        <el-form-item label="车辆编号">
          <el-input v-model="dataForm.vehicleNum" ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dataForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('veh:tvehvehicleinfo:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('veh:tvehvehicleinfo:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleModel" label="车辆型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleNum" label="车辆编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="plateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="ratedCarload" label="额定载重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="selfCarload" label="额定自重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="ratedCubage" label="额定容积" header-align="center" align="center"></el-table-column>
        <el-table-column prop="carParkName" label="停车场" header-align="center" align="center"></el-table-column>
        <el-table-column prop="oilStyle" label="油箱型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="driverName" label="司机" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" :formatter="statusFormatter" label="状态" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('veh:tvehvehicleinfo:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('veh:tvehvehicleinfo:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './tvehvehicleinfo-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork/tvehvehicleinfo/listPage',
        getDataListIsPage: true,
        exportURL: '/vehwork/tvehvehicleinfo/export',
        deleteURL: '/vehwork/tvehvehicleinfo',
        deleteIsBatch: true
      },
      dataForm: {
        deptId: '',
        vehicleTypeId: '',
        plateNumber: '',
        vehicleNum: '',
        status: '1'
      },
      vehicleTypeList: [],
      statusList: [
        { label: '不限', value: '' },
        { label: '正常', value: '1' },
        { label: '禁用', value: '0' }
      ]
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    // this.getVehicleType()
  },
  methods: {
    statusFormatter (row, column, cellValue, index) {
      if (cellValue === '0') {
        return '正常'
      } else {
        return '禁用'
      }
    },
    changeVehicleType (vehicleType) {
      this.dataForm.vehicleTypeId = vehicleType.id
    }
  }
}
</script>
