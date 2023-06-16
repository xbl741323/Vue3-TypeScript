<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__worktargettype">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="名称">
          <el-input v-model="dataForm.worktargetTypeName" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:worktargettype:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:worktargettype:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="worktargetTypeName" label="类型名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="plftype" :formatter="plftypeFormatter" label="地理信息类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="description" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:worktargettype:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:worktargettype:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './worktargettype-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/worktargettype/page',
        getDataListIsPage: true,
        exportURL: '/worktarget/worktargettype/export',
        deleteURL: '/worktarget/worktargettype',
        deleteIsBatch: true
      },
      dataForm: {
        worktargetTypeName: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    plftypeFormatter (row, column, cellValue, index) {
      if (cellValue == '1') {
        return '点'
      } else if (cellValue == '2') {
        return '线'
      } else if (cellValue == '3') {
        return '面'
      }
    }
  }
}
</script>
