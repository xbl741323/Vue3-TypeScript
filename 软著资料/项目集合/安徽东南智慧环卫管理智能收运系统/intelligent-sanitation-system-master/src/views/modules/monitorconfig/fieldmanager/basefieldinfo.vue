<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-monitorconfig__basefieldinfo">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.fieldName" placeholder="字段名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.fieldCode" placeholder="字段code" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <select style="width:200px" v-model="dataForm.objectTypeCode" placeholder="所属对象类型">
            <option   value="vehicle"  key="vehicle"  >车辆</option>
            <option   value="worker"  key="worker"  >工作人员</option>
            <option   value="publictoilet"  key="publictoilet"  >公厕</option>
            <option   value="worktarget"  key="worktarget"  >设施</option>
            <option   value="carpark"  key="carpark"  >停车场</option>
            <option   value="waterpoint"  key="waterpoint"  >加水点</option>
            <option   value="transferstation"  key="transferstation"  >中转站</option>
            <option   value="road"  key="road"  >道路</option>
            <option   value="publictoilet"  key="publictoilet"  >公厕</option>
          </select>
        </el-form-item>

        <el-form-item>
          <select style="width:200px" v-model="dataForm.quotaTypeCode" placeholder="指标类型">
            <option   value="basedata"  key="basedata"  >基本数据</option>
            <option   value="workdata"  key="workdata"  >作业数据</option>
            <option   value="devicedata"  key="devicedata"  >设备数据</option>
            <option   value="operatedata"  key="operatedata"  >操作数据</option>
          </select>
        </el-form-item>

        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="fieldName" label="字段名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="fieldCode" label="字段code" header-align="center" align="center"></el-table-column>
        <el-table-column prop="objectTypeCode" label="所属对象类型code" header-align="center" align="center" :formatter="formatterObjectTypeCode"></el-table-column>
        <el-table-column prop="quotaTypeCode" label="指标类型code" header-align="center" align="center" :formatter="formatterQuotaTypeCode"></el-table-column>

        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button   type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './basefieldinfo-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/monitorconfig/basefieldinfo/page',
        getDataListIsPage: true,
        exportURL: '/monitorconfig/basefieldinfo/export',
        deleteURL: '/monitorconfig/basefieldinfo',
        deleteIsBatch: true
      },
      dataForm: {
        fieldName: '',
        fieldCode: '',
          objectTypeCode: '',
      }
    }
  },
    methods:{

        formatterQuotaTypeCode(row, column){
            if(row.quotaTypeCode == 'basedata'){
                return "基本数据"
            }else if(row.quotaTypeCode == 'workdata'){
                return "作业数据"
            }else if(row.quotaTypeCode == 'devicedata'){
            return "设备数据"
       }else if(row.quotaTypeCode == 'operatedata'){
                return "操作数据"
            }
    }
    ,
        formatterObjectTypeCode(row, column){
            if(row.objectTypeCode == 'vehicle'){
                return "车辆"
            }else if(row.objectTypeCode == 'worker'){
                return "人员"
            }else if(row.objectTypeCode == 'worktarget'){
                return "设施"
            }
            else if(row.objectTypeCode == 'publictoilet'){
                return "公厕"
            }
            else if(row.objectTypeCode == 'road'){
                return "道路"
            }
        }
    }
   ,
  watch: {
  },
  components: {
    AddOrUpdate
  }
}
</script>
