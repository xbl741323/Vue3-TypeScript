<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtmachineroadnode">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtmachineroadnode:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtmachineroadnode:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="roadId" label="路线id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nodeLat" label="节点纬度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nodeLng" label="节点经度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nodePlace" label="节点位置" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nodeIndex" label="节点序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nodeType" label="节点类型(0:起点，1:中间节点，2:终点)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="prefixNodeId" label="前节点id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="prefixNodeLat" label="前节点纬度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="prefixNodeLng" label="前节点经度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="prefixNodePlace" label="前节点位置" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subfixNodeId" label="后节点id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subfixNodeLat" label="后节点纬度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subfixNodeLng" label="后节点经度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subfixNodePlace" label="后节点位置" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updater" label="修改人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('worktarget:twgtmachineroadnode:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('worktarget:twgtmachineroadnode:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './twgtmachineroadnode-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtmachineroadnode/page',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtmachineroadnode/export',
        deleteURL: '/worktarget/twgtmachineroadnode',
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
