<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__publictoilet">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门">
          <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="dataForm.address" placeholder="请输入位置"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:publictoilet:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:publictoilet:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="area" label="面积" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orgName" label="所属部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="buildUnit" label="建造单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="contacts" label="联系人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="contactTel" label="联系人电话" header-align="center" align="center"></el-table-column>
        <el-table-column prop="managername" label="管理者" header-align="center" align="center"></el-table-column>
        <el-table-column prop="managertel" label="管理者电话" header-align="center" align="center"></el-table-column>
        <el-table-column prop="type" label="公厕类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="style" label="公厕样式" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gentsquatcount" label="男蹲位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="erectcount" label="站位数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="ladysquatcount" label="女蹲位" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:publictoilet:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:publictoilet:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './publictoilet-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/publictoilet/getPublictoiletViewPageList',
        getDataListIsPage: true,
        exportURL: '/worktarget/publictoilet/export',
        deleteURL: '/worktarget/publictoilet',
        deleteIsBatch: true
      },
      dataForm: {
        deptId: '',
        address: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    formatDevice: function (row, column, cellValue, index) {
      return (cellValue != null && cellValue.length > 0) ? cellValue[0].deviceCode : ''
    }
  }
}
</script>
