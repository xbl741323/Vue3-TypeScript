<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtworktargetrelation">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtworktargetrelation:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtworktargetrelation:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetTypeId" label="环卫设施类型id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetId" label="环卫设施id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mainTable" label="客表" header-align="center" align="center"></el-table-column>
        <el-table-column prop="parentWorktargetTypeId" label="关联环卫设施类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="parentWorktargetId" label="关联环卫设施id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="parentTable" label="父表" header-align="center" align="center"></el-table-column>
        <el-table-column prop="relationType" label="关系类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updater" label="修改人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:twgtworktargetrelation:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:twgtworktargetrelation:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './twgtworktargetrelation-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtworktargetrelation/page',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtworktargetrelation/export',
        deleteURL: '/worktarget/twgtworktargetrelation',
        deleteIsBatch: true
      },
      dataForm: {
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  }
}
</script>
