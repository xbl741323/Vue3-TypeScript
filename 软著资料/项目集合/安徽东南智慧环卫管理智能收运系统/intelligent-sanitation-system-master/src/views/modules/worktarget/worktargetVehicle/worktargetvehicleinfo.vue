<template>
  <el-dialog width="70%" :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="worktargetTypeName" label="环卫设施类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="worktargetName" label="环卫设施" header-align="center" align="center"></el-table-column>
        <el-table-column prop="relationName" label="关联类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="vehicleTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="plateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
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
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        createdIsNeed: false, // 此页面是否在创建时，调用查询数据列表接口？
        activatedIsNeed: false, // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '/worktarget/twgtworktargetvehicle/getListPage',
        getDataListIsPage: true
      },
      dataForm: {
        worktargetTypeId: '',
        worktargetId: '',
        relationType: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.worktargetTypeId && this.dataForm.worktargetId) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      console.log(this.dataForm)
      this.query()
    //   this.$http.get('/worktarget/twgtworktargetvehicle/getDataListPage', { params: { ...this.dataForm } }).then(({ data: res }) => {
    //     if (res.code !== 0) {
    //       return this.$message.error(res.msg)
    //     }
    //     this.dataList = res.data
    //   }).catch(() => {})
    }
  }
}
</script>
