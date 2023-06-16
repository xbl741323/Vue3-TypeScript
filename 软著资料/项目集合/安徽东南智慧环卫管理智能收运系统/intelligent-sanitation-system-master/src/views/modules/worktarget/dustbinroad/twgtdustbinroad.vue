<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtdustbinroad">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门" prop="orgId">
          <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtdustbinroad:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtdustbinroad:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orgName" label="所属部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="length" label="里程" header-align="center" align="center"></el-table-column>
        <el-table-column prop="times" label="运行时长" :formatter="timesFormat" header-align="center" align="center"></el-table-column>
        <el-table-column prop="description" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:twgtdustbinroad:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:twgtdustbinroad:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './twgtdustbinroad-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtdustbinroad/listPage',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtdustbinroad/export',
        deleteURL: '/worktarget/twgtdustbinroad',
        deleteIsBatch: true
      },
      dataForm: {
        name: '',
        orgId: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    timesFormat (row, column, cellValue, index) {
      var hour = Math.floor(row.times / 3600)
      var minute = Math.round((row.times % 3600) / 60)
      return hour + '小时' + minute + '分钟'
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    }
  }
}
</script>
