<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="" prop="id">
              <el-input v-model="dataForm.id" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="所属标准id" prop="workStandardId">
              <el-input v-model="dataForm.workStandardId" placeholder="所属标准id"></el-input>
            </el-form-item>
            <el-form-item label="指标项code" prop="indicatorCode">
              <el-input v-model="dataForm.indicatorCode" placeholder="指标项code"></el-input>
            </el-form-item>
            <el-form-item label="判定参数1值" prop="param1Value">
              <el-input v-model="dataForm.param1Value" placeholder="判定参数1值"></el-input>
            </el-form-item>
            <el-form-item label="判定参数1比较关系" prop="param1Comparison">
              <el-input v-model="dataForm.param1Comparison" placeholder="判定参数1比较关系"></el-input>
            </el-form-item>
            <el-form-item label="判定参数2值" prop="param2Value">
              <el-input v-model="dataForm.param2Value" placeholder="判定参数2值"></el-input>
            </el-form-item>
            <el-form-item label="判定参数2比较关系" prop="param2Comparison">
              <el-input v-model="dataForm.param2Comparison" placeholder="判定参数2比较关系"></el-input>
            </el-form-item>
            <el-form-item label="" prop="remark">
              <el-input v-model="dataForm.remark" placeholder=""></el-input>
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
      workStandardId: '',
      indicatorCode: '',
      param1Value: '',
      param1Comparison: '',
      param2Value: '',
      param2Comparison: '',
      remark: '',
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
        this.$http.get('/framework/tframeworkworkstandarditem/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/framework/tframeworkworkstandarditem/', this.dataForm).then(({ data: res }) => {
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
