<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="id" prop="id">
              <el-input v-model="dataForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="事件类型code" prop="eventType">
              <el-input v-model="dataForm.eventType" placeholder="事件类型code"></el-input>
            </el-form-item>
            <el-form-item label="人员id" prop="workerId">
              <el-input v-model="dataForm.workerId" placeholder="人员id"></el-input>
            </el-form-item>
            <el-form-item label="位置点id" prop="positionId">
              <el-input v-model="dataForm.positionId" placeholder="位置点id"></el-input>
            </el-form-item>
            <el-form-item label="速度" prop="runSpeed">
              <el-input v-model="dataForm.runSpeed" placeholder="速度"></el-input>
            </el-form-item>
            <el-form-item label="经度" prop="xCd">
              <el-input v-model="dataForm.xCd" placeholder="经度"></el-input>
            </el-form-item>
            <el-form-item label="维度" prop="yCd">
              <el-input v-model="dataForm.yCd" placeholder="维度"></el-input>
            </el-form-item>
            <el-form-item label="停止时间段" prop="parkingTime">
              <el-input v-model="dataForm.parkingTime" placeholder="停止时间段"></el-input>
            </el-form-item>
            <el-form-item label="事件开始时间" prop="eventStartDate">
              <el-input v-model="dataForm.eventStartDate" placeholder="事件开始时间"></el-input>
            </el-form-item>
            <el-form-item label="事件结束时间" prop="eventEndDate">
              <el-input v-model="dataForm.eventEndDate" placeholder="事件结束时间"></el-input>
            </el-form-item>
            <el-form-item label="事件地址" prop="eventPlace">
              <el-input v-model="dataForm.eventPlace" placeholder="事件地址"></el-input>
            </el-form-item>
            <el-form-item label="作业规划id" prop="workScheduleId">
              <el-input v-model="dataForm.workScheduleId" placeholder="作业规划id"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-input v-model="dataForm.status" placeholder="状态"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        eventType: '',
        workerId: '',
        positionId: '',
        runSpeed: '',
        xCd: '',
        yCd: '',
        parkingTime: '',
        eventStartDate: '',
        eventEndDate: '',
        eventPlace: '',
        workScheduleId: '',
        status: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: ''
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
      this.$http.get('/zhhw-worker/twkrworkereventinfo/' + this.dataForm.id).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/zhhw-worker/twkrworkereventinfo/', this.dataForm).then(({ data: res }) => {
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
