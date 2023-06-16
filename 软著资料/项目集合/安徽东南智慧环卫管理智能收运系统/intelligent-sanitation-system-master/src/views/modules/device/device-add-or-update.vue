<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="设备类型" prop="deviceTypeId">
              <device-type-select v-model="dataForm.deviceTypeId" @changeDeviceType="changeDeviceType"></device-type-select>
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceMold">
              <el-input v-model="dataForm.deviceMold" placeholder="设备型号"></el-input>
            </el-form-item>
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="dataForm.deviceCode" placeholder="设备编号"></el-input>
            </el-form-item>
            <el-form-item label="购买日期" prop="purchaseDate">
              <el-date-picker
                v-model="dataForm.purchaseDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="安装日期" prop="installDate">
              <el-date-picker
                v-model="dataForm.installDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="设备厂家" prop="deviceFactory">
              <el-input v-model="dataForm.deviceFactory" placeholder="设备厂家"></el-input>
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
import deviceTypeSelect from '../../../components/device-type-select/src/device-type-select.vue'
export default {
  components: { deviceTypeSelect },
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        deviceTypeId: '',
        deviceMold: '',
        deviceCode: '',
        purchaseDate: '',
        installDate: '',
        worktargetTypeId: '',
        worktargetId: '',
        description: '',
        status: '',
        deviceFactory: '',
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
      this.$http.get('/device/device/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    changeDeviceType (deviceType) {
      this.dataForm.deviceTypeId = deviceType.id
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/device/device/', this.dataForm).then(({ data: res }) => {
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
