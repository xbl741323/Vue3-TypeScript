<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">

        <el-form-item label="页面名称" prop="pageName">
            <el-input v-model="dataForm.pageName" placeholder="页面名称"></el-input>
        </el-form-item>
        <el-form-item label="页面编号" prop="pageNumber">
            <el-input v-model="dataForm.pageNumber" placeholder="页面编号"></el-input>
        </el-form-item>
        <el-form-item label="功能大类" prop="bigType">

            <el-select v-model="dataForm.bigType" placeholder="监控大类">
                <el-option label="车辆监控" value="vehicle_monitor"></el-option>
                <el-option label="人员监控" value="person_monitor"></el-option>
                <el-option label="垃圾箱监控" value="garbage_monitor"></el-option>
                <el-option label="道路监控" value="road_monitor"></el-option>
                <el-option label="公厕监控" value="toilet_monitor"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
      id: '',
      tenantId: '',
      pageName: '',
      pageNumber: '',
      bigType: '',
      creator: '',
      createDate: '',
      updateBy: '',
      updateTime: '',
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
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      // 获取信息
      getInfo () {
        this.$http.get('/monitorconfig/monitorpageinfo/' + this.dataForm.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
        }).catch(() => {})
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http[!this.dataForm.id ? 'post' : 'put']('/monitorconfig/monitorpageinfo/', this.dataForm).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {})
        })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
</script>
