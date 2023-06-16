<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-framework__tframeworkworkstandard">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
		  <el-form-item>
		    <el-input v-model="dataForm.workStandardName" placeholder="作业标准名称"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-input v-model="dataForm.workTypeName" placeholder="作业类型名称"></el-input>
		  </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkworkstandard:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('framework:tframeworkworkstandard:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="workStandardName" label="作业标准名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workTypeName" label="作业类型" header-align="center" align="center"></el-table-column>
		<el-table-column prop="standardType" label="标准类型" header-align="center" align="center" :formatter="zhuhuan"></el-table-column>

        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('framework:tframeworkworkstandard:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('framework:tframeworkworkstandard:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './tframeworkworkstandard-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/framework/tframeworkworkstandard/page',
        getDataListIsPage: true,
        exportURL: '/framework/tframeworkworkstandard/export',
        deleteURL: '/framework/tframeworkworkstandard',
        deleteIsBatch: true
      },
      dataForm: {
		  standardTypeName:''
      }
    }
  },
  watch: {
	 
  },
  components: {
    AddOrUpdate
  },
  methods:{
	  zhuhuan(row, column)
	  {
		  if(row.standardType == 1)
		  {
			 return "质量标准";
		  }
		  else{
			  return "考勤行为标准";
		  }
	  }
  }
}
</script>
