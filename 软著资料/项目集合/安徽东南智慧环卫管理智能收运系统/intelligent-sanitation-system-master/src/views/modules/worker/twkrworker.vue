<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worker__twkrworker">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门" prop="departId">
          <dept-tree v-model="dataForm.departId"></dept-tree>
        </el-form-item>
        <el-form-item label="人员类型" prop="type">
          <worker-type-select v-model="dataForm.type" @changeWorkerType="changeWorkerType"></worker-type-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worker:twkrworker:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worker:twkrworker:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="departName" label="部门名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="telephone" label="电话" header-align="center" align="center"></el-table-column>
        <el-table-column prop="typeName" label="人员类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="sexFormatter" header-align="center" align="center"></el-table-column>
        <el-table-column prop="identification" label="身份证号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" header-align="center" align="center"></el-table-column>
        <el-table-column prop="urgenttel" label="紧急联系电话" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nation" label="民族" header-align="center" align="center"></el-table-column>
        <el-table-column prop="entrydate" label="入职日期" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worker:twkrworker:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worker:twkrworker:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './twkrworker-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/zhhw-worker/twkrworker/listPage',
        getDataListIsPage: true,
        exportURL: '/zhhw-worker/twkrworker/export',
        deleteURL: '/zhhw-worker/twkrworker',
        deleteIsBatch: true
      },
      dataForm: {
        name: '',
        departId: '',
        type: ''
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    sexFormatter (row, column) {
      return row.sex == 0 ? '女' : '男'
    },
    changeWorkerType (workerType) {
      if (workerType) {
        this.dataForm.type = workerType.id
      } else {
        this.dataForm.type = ''
      }
    }
  }
}
</script>
