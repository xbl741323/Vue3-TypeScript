<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-oil__gasup">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门">
          <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select
            v-model="dataForm.cartypeId"
            placeholder="请选择">
            <el-option
              v-for="item in cartypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-select
            v-model="dataForm.carId"
            placeholder="请选择">
            <el-option
              v-for="item in carinfoList"
              :key="item.id"
              :label="item.vehicleNum"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加油时间">
          <el-date-picker
            v-model="dataForm.gasupTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('vehwork:gasup:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('vehwork:gasup:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gasupnumber" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleid" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gasuptime" label="" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('vehwork:gasup:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('vehwork:gasup:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './gasup-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork/gasup/page',
        getDataListIsPage: true,
        exportURL: '/vehwork/gasup/export',
        deleteURL: '/vehwork/gasup/',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      dataForm: {
        deptId: '',
        cartypeId: '',
        carId: '',
        gasupTime: []
      },
      cartypeList: [],
      carinfoList: []
    }
  },
  computed: {
    cartypeId () {
      return this.dataForm.cartypeId
    },
    deptId () {
      return this.dataForm.deptId
    }
  },
  watch: {
    cartypeId (val, oldVal) {
      this.getCarinfo()
    },
    deptId (val, oldVal) {
      this.getCarinfo()
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    this.getCartype()
    this.getCarinfo()
  },
  methods: {
    getCartype () {
      this.$http.post(
        '/veh-old/adptCartype/list', {
          status: '1'
        }
      ).then(({ data: res }) => {
        if (res.code === 0) {
          this.cartypeList = res.data
        }
      })
    },
    getCarinfo () {
      var carinfoParam = {}
      carinfoParam.status = '1'
      if (this.dataForm.cartypeId) {
        carinfoParam.vehicleTypeIdList = [this.dataForm.cartypeId]
      }
      if (this.dataForm.deptId) {
        carinfoParam.deptIdList = [this.dataForm.deptId]
      }
      this.$http.post('/veh-old/adptCarinfo/getListbyType',
        carinfoParam).then(({ data: res }) => {
        if (res.code === 0) {
          this.carinfoList = res.data
        }
      })
    }
  }
}
</script>
