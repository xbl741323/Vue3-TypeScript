<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="" prop="id">
              <el-input v-model="dataForm.id" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="1 作业标准
            2 行为标准（考勤标准）" prop="indicator">
              <el-input v-model="dataForm.indicator" placeholder="1 作业标准
            2 行为标准（考勤标准）"></el-input>
            </el-form-item>
            <el-form-item label="指标名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="指标名称"></el-input>
            </el-form-item>
            <el-form-item label="指标code" prop="code">
              <el-input v-model="dataForm.code" placeholder="指标code"></el-input>
            </el-form-item>
            <el-form-item label="判定参数1名" prop="param1Name">
              <el-input v-model="dataForm.param1Name" placeholder="判定参数1名"></el-input>
            </el-form-item>
            <el-form-item label="判定参数1code" prop="param1Code">
              <el-input v-model="dataForm.param1Code" placeholder="判定参数1code"></el-input>
            </el-form-item>
            <el-form-item label="参数1单位" prop="param1Unit">
              <el-input v-model="dataForm.param1Unit" placeholder="参数1单位"></el-input>
            </el-form-item>
            <el-form-item label="判定参数2名" prop="param2Name">
              <el-input v-model="dataForm.param2Name" placeholder="判定参数2名"></el-input>
            </el-form-item>
            <el-form-item label="判定参数2code" prop="param2Code">
              <el-input v-model="dataForm.param2Code" placeholder="判定参数2code"></el-input>
            </el-form-item>
            <el-form-item label="参数2单位" prop="param2Unit">
              <el-input v-model="dataForm.param2Unit" placeholder="参数2单位"></el-input>
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
      indicator: '',
      name: '',
      code: '',
      param1Name: '',
      param1Code: '',
      param1Unit: '',
      param2Name: '',
      param2Code: '',
      param2Unit: '',
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
        this.$http.get('/framework/tframeworkindicator/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/framework/tframeworkindicator/', this.dataForm).then(({ data: res }) => {
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
