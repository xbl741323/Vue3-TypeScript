<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-framework__tframeworkworktime">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item prop="beginTime">
          <el-time-picker
            placeholder="起始时间"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            v-model="dataForm.beginTime">
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-time-picker
            placeholder="结束时间"
            value-format="HH:mm:ss"
             format="HH:mm:ss"
            v-model="dataForm.endTime">
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkworktime:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkworktime:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('framework:tframeworkworktime:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('framework:tframeworkworktime:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './tframeworkworktime-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/framework/tframeworkworktime/page',
        getDataListIsPage: true,
        exportURL: '/framework/tframeworkworktime/export',
        deleteURL: '/framework/tframeworkworktime',
        deleteIsBatch: true
      },
      dataForm: {
        beginTime: '',
        endTime: ''
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
