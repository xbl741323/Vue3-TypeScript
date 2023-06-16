<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="id" prop="id">
              <el-input v-model="dataForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="" prop="tenantId">
              <el-input v-model="dataForm.tenantId" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="" prop="pageNumber">
              <el-input v-model="dataForm.pageNumber" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="大类配置id" prop="bigTypeCode">
              <el-input v-model="dataForm.bigTypeCode" placeholder="大类配置id"></el-input>
            </el-form-item>
            <el-form-item label="具体类型id" prop="detailTypeId">
              <el-input v-model="dataForm.detailTypeId" placeholder="具体类型id"></el-input>
            </el-form-item>
            <el-form-item label="图标url" prop="iconUrl">
              <el-input v-model="dataForm.iconUrl" placeholder="图标url"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
              <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
              <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
            <el-form-item label="更新者" prop="updateBy">
              <el-input v-model="dataForm.updateBy" placeholder="更新者"></el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="updateTime">
              <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
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
      pageNumber: '',
      bigTypeCode: '',
      detailTypeId: '',
      iconUrl: '',
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
        this.$http.get('/monitorconfig/monitorobjectdetailtypeconfig/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/monitorconfig/monitorobjectdetailtypeconfig/', this.dataForm).then(({ data: res }) => {
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
