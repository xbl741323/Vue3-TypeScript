<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtworktargetcleanrecord">
      <el-form :inline="true" v-if="showCondition" :rules="dataRule" :model="dataForm" @keyup.enter.native="getDataList()">
         <el-form-item label="部门">
          <dept-tree v-model="dataForm.worktargetOrgId"></dept-tree>
        </el-form-item>
        <el-form-item label="设施类型" prop="worktargetTypeId">
            <worktarget-type-select v-model="dataForm.worktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDatetime">
          <el-date-picker
            v-model="dataForm.startDatetime"
            type="datetime"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="startDatetime">
          <el-date-picker
            v-model="dataForm.endDatetime"
            type="datetime"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="worktargetTypeName" label="环卫设施类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetName" label="环卫设施" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetOrgName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehiclePlateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleOrgName" label="车辆部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workerName" label="清运人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="cleanAmount" label="清运量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="cleanTime" label="清运时间" width="140px" header-align="center" align="center"></el-table-column>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import DateUtil from '@/utils/dateUtil.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtworktargetcleanrecord/getListPageBetweenDatetime',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtworktargetcleanrecord/export',
        deleteURL: '/worktarget/twgtworktargetcleanrecord',
        deleteIsBatch: true
      },
      dataForm: {
        worktargetOrgId: '',
        worktargetTypeId: '',
        worktargetId: '',
        startDatetime: DateUtil.getTodayStart(),
        endDatetime: DateUtil.getTodayEnd()
      }
    }
  },
  props: {
    showCondition: {
      type: Boolean,
      default: true
    },
    condition: ''
  },
  watch: {
    condition (val) {
      this.dataForm.worktargetOrgId = val.worktargetOrgId
      this.dataForm.worktargetTypeId = val.worktargetTypeId
      this.dataForm.worktargetId = val.worktargetId
      this.dataForm.startDatetime = val.startDatetime
      this.dataForm.endDatetime = val.endDatetime
      this.getDataList()
    }
  },
  components: {
  },
  computed: {
    dataRule () {
      return {
        startDatetime: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        endDatetime: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeWorktargetType (worktargetType) {
      if (!worktargetType) {
        this.dataForm.worktargetTypeId = ''
      } else {
        this.dataForm.worktargetTypeId = worktargetType.id
      }
    },
    changeOrg (org) {
      this.dataForm.worktargetOrgId = org.id
    }
  }
}
</script>
