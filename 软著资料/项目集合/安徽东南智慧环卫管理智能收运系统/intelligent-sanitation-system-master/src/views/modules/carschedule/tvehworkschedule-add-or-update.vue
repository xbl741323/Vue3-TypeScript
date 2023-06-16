<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="" prop="id">
              <el-input v-model="dataForm.id" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="作业车辆id" prop="workVehicleId">
              <el-input v-model="dataForm.workVehicleId" placeholder="作业车辆id"></el-input>
            </el-form-item>
            <el-form-item label="作业类型" prop="workTypeCode">
              <el-input v-model="dataForm.workTypeCode" placeholder="作业类型"></el-input>
            </el-form-item>
            <el-form-item label="作业频率" prop="workFrequency">
              <el-input v-model="dataForm.workFrequency" placeholder="作业频率"></el-input>
            </el-form-item>
            <el-form-item label="作业遍数(次数)" prop="workNum">
              <el-input v-model="dataForm.workNum" placeholder="作业遍数(次数)"></el-input>
            </el-form-item>
            <el-form-item label="" prop="workTimeIds">
              <el-input v-model="dataForm.workTimeIds" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="0 不生效。1生效" prop="status">
              <el-input v-model="dataForm.status" placeholder="0 不生效。1生效"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
              <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
              <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
            <el-form-item label="更新人" prop="updater">
              <el-input v-model="dataForm.updater" placeholder="更新人"></el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="updateDate">
              <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
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
      workVehicleId: '',
      workTypeCode: '',
      workFrequency: '',
      workNum: '',
      workTimeIds: '',
      status: '',
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
        this.$http.get('/vehicle/tvehworkschedule/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/vehicle/tvehworkschedule/', this.dataForm).then(({ data: res }) => {
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
