<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtworktargetvehicle">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="设施类型" prop="worktargetTypeId">
          <worktarget-type-select v-model="dataForm.worktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
        </el-form-item>
        <el-form-item label="设施名称" prop="worktargetId">
          <worktarget-select :worktargetTypeId="dataForm.worktargetTypeId" :worktargetId="dataForm.worktargetId" @changeWorktarget="changeWorktarget"></worktarget-select>
        </el-form-item>
        <el-form-item label="关系类型" prop="relationType">
            <dict-select v-model="dataForm.relationType" :dictType="'worktargetVehicleRelation'" @change="changeWorktargetVehicleRelation"></dict-select>
          </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtworktargetvehicle:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtworktargetvehicle:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="worktargetTypeName" label="环卫设施类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetName" label="环卫设施" header-align="center" align="center"></el-table-column>
        <el-table-column prop="relationName" label="关联类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleCount" label="车辆数量" header-align="center" align="center">
          <template slot-scope="scope">
            <el-link type="info" @click="showWorktargetVehicleInfo(scope.row)">{{scope.row.vehicleCount}}</el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:twgtworktargetvehicle:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:twgtworktargetvehicle:delete')" type="text" size="small" @click="deleteHandle(scope.row)">{{ $t('delete') }}</el-button>
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
      <worktargetvehicleinfo ref="worktargetvehicleinfo"></worktargetvehicleinfo>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './twgtworktargetvehicle-add-or-update'
import worktargetvehicleinfo from './worktargetvehicleinfo'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      worktargetVehicleInfoVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtworktargetvehicle/getWorktargetVehicleStatisticListPage',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtworktargetvehicle/export',
        deleteURL: '/worktarget/twgtworktargetvehicle',
        deleteIsBatch: true
      },
      dataForm: {
        worktargetTypeId: '',
        worktargetId: '',
        relationType: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate,
    worktargetvehicleinfo
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        if (row) {
          this.$refs.addOrUpdate.dataForm.worktargetTypeId = row.worktargetTypeId
          this.$refs.addOrUpdate.dataForm.worktargetId = row.worktargetId
          this.$refs.addOrUpdate.dataForm.relationType = row.relationType
          this.$refs.addOrUpdate.disabled = true
          this.$refs.addOrUpdate.edit = true
        } else {
          this.$refs.addOrUpdate.dataForm.worktargetTypeId = ''
          this.$refs.addOrUpdate.dataForm.worktargetId = ''
          this.$refs.addOrUpdate.dataForm.relationType = ''
          this.$refs.addOrUpdate.disabled = false
          this.$refs.addOrUpdate.edit = false
        }
        this.$refs.addOrUpdate.init()
      })
    },
    changeWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.worktargetTypeId = worktargetType.id
      } else {
        this.dataForm.worktargetTypeId = ''
      }
      this.dataForm.worktargetId = ''
    },
    changeWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.worktargetId = worktarget.id
      } else {
        this.dataForm.worktargetId = ''
      }
    },
    changeWorktargetVehicleRelation (worktargetVehicleRelation) {
      this.dataForm.relationType = worktargetVehicleRelation.dictValue
    },
    showWorktargetVehicleInfo (row) {
      this.worktargetVehicleInfoVisible = true
      this.$refs.worktargetvehicleinfo.dataForm.worktargetTypeId = row.worktargetTypeId
      this.$refs.worktargetvehicleinfo.dataForm.worktargetId = row.worktargetId
      this.$refs.worktargetvehicleinfo.dataForm.relationType = row.relationType
      this.$refs.worktargetvehicleinfo.init()
    }
  }
}
</script>
