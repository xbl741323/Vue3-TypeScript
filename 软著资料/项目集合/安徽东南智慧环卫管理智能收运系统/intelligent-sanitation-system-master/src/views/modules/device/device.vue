<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-device__device">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="设备类型" prop="deviceTypeId">
          <device-type-select v-model="dataForm.deviceTypeId" @changeDeviceType="changeDeviceType"></device-type-select>
        </el-form-item>
        <el-form-item label="设备厂家" prop="deviceFactory">
          <el-input v-model="dataForm.deviceFactory" placeholder="设备厂家"></el-input>
        </el-form-item>
        <el-form-item label="设备号">
          <el-input v-model="dataForm.deviceCode" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('device:device:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('device:device:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deviceTypeName" label="设备类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceMold" label="设备型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceCode" label="设备编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="purchaseDate" label="购买日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="installDate" label="安装日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceFactory" label="设备厂家" header-align="center" align="center"></el-table-column>
        <el-table-column prop="assignType" label="安装对象类型" :formatter="assignTypeFormatter" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('device:device:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('device:device:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './device-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/device/device/listPage',
        getDataListIsPage: true,
        exportURL: '/device/device/export',
        deleteURL: '/device/device',
        deleteIsBatch: true
      },
      dataForm: {
        deviceTypeId: '',
        deviceFactory: '',
        deviceCode: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    assignTypeFormatter (row, column) {
      if (row.assignType == 'vehicle') {
        return '车俩-' + row.vehiclePlateNumber
      } else if (row.assignType == 'person') {
        return '人员-' + row.workerName
      } else if (row.assignType == 'worktarget') {
        return row.worktargetTypeName + '-' + row.worktargetName
      }
      return '--'
    },
    changeDeviceType (deviceType) {
      this.dataForm.deviceTypeId = deviceType.id
    }
  }
}
</script>
