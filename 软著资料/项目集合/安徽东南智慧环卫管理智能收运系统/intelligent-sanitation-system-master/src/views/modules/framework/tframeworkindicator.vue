<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-framework__tframeworkindicator">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkindicator:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkindicator:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="indicator" label="1 作业标准
            2 行为标准（考勤标准）" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="指标名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="code" label="指标code" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Name" label="判定参数1名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Code" label="判定参数1code" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Unit" label="参数1单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Name" label="判定参数2名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Code" label="判定参数2code" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Unit" label="参数2单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('framework:tframeworkindicator:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('framework:tframeworkindicator:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './tframeworkindicator-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/framework/tframeworkindicator/page',
        getDataListIsPage: true,
        exportURL: '/framework/tframeworkindicator/export',
        deleteURL: '/framework/tframeworkindicator',
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
