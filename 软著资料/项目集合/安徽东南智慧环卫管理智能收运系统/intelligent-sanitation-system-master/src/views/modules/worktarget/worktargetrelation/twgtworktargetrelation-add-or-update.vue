<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="id" prop="id">
              <el-input v-model="dataForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="环卫设施类型id" prop="worktargetTypeId">
              <el-input v-model="dataForm.worktargetTypeId" placeholder="环卫设施类型id"></el-input>
            </el-form-item>
            <el-form-item label="环卫设施id" prop="worktargetId">
              <el-input v-model="dataForm.worktargetId" placeholder="环卫设施id"></el-input>
            </el-form-item>
            <el-form-item label="客表" prop="mainTable">
              <el-input v-model="dataForm.mainTable" placeholder="客表"></el-input>
            </el-form-item>
            <el-form-item label="关联环卫设施类型" prop="parentWorktargetTypeId">
              <el-input v-model="dataForm.parentWorktargetTypeId" placeholder="关联环卫设施类型"></el-input>
            </el-form-item>
            <el-form-item label="关联环卫设施id" prop="parentWorktargetId">
              <el-input v-model="dataForm.parentWorktargetId" placeholder="关联环卫设施id"></el-input>
            </el-form-item>
            <el-form-item label="父表" prop="parentTable">
              <el-input v-model="dataForm.parentTable" placeholder="父表"></el-input>
            </el-form-item>
            <el-form-item label="关系类型" prop="relationType">
              <el-input v-model="dataForm.relationType" placeholder="关系类型"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
              <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
              <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
            <el-form-item label="修改人" prop="updater">
              <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="updateDate">
              <el-input v-model="dataForm.updateDate" placeholder="修改时间"></el-input>
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
      worktargetTypeId: '',
      worktargetId: '',
      mainTable: '',
      parentWorktargetTypeId: '',
      parentWorktargetId: '',
      parentTable: '',
      relationType: '',
      creator: '',
      createDate: '',
      updater: '',
      updateDate: '',
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
        this.$http.get('/worktarget/twgtworktargetrelation/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtworktargetrelation/', this.dataForm).then(({ data: res }) => {
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
