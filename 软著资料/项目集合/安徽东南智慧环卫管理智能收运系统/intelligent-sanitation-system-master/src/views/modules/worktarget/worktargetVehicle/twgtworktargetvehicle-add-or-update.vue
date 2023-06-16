<template>
  <el-dialog width="50%" :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设施类型" prop="worktargetTypeId">
            <worktarget-type-select :disabled="disabled" v-model="dataForm.worktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设施名称" prop="worktargetId">
            <worktarget-select :disabled="disabled" :worktargetTypeId="dataForm.worktargetTypeId" :worktargetId="dataForm.worktargetId" @changeWorktarget="changeWorktarget"></worktarget-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="关系类型" prop="relationType">
            <dict-select :disabled="disabled" v-model="dataForm.relationType" :dictType="'worktargetVehicleRelation'" @change="changeWorktargetVehicleRelation"></dict-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <vehicle-transfer :vehicleIds.sync="vehicleIds" @change="changeVehicleIds"></vehicle-transfer>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import vehicleSelect from '../../../../components/vehicle-select/src/vehicle-select.vue'
export default {
  components: { vehicleSelect },
  data () {
    return {
      visible: false,
      disabled: false,
      edit: false,
      vehicleIds: [],
      dataForm: {
        worktargetTypeId: '',
        worktargetId: '',
        relationType: '',
        vehicleIds: ''
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
      this.vehicleIds = []
      this.dataForm.vehicleIds = ''
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        if (this.dataForm.worktargetTypeId && this.dataForm.worktargetId) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/twgtworktargetvehicle/getWorktargetVehicleInfo', { params: { ...this.dataForm } }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.vehicleIds = res.data.vehicleIds.split(',')
      }).catch(() => {})
    },
    changeWorktargetVehicleRelation (worktargetVehicleRelation) {
      this.dataForm.relationType = worktargetVehicleRelation.dictValue
    },
    changeWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.worktargetId = worktarget.id
      } else {
        this.dataForm.worktargetId = ''
      }
    },
    changeWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.worktargetTypeId = worktargetType.id
      } else {
        this.dataForm.worktargetTypeId = ''
      }
      this.dataForm.worktargetId = ''
    },
    changeVehicleIds (vehicleIds) {
      console.log(vehicleIds)
      // this.vehicleArray = vehicleArray
      // var vehicleIds = ''
      // if (vehicleArray.length > 0) {
      //   for (var i = 0; i < vehicleArray.length; i++) {
      //     var vehicle = vehicleArray[i]
      //     vehicleIds += vehicle.id + ','
      //   }
      //   vehicleIds = vehicleIds.substring(0, vehicleIds.length - 1)
      // }
      // this.dataForm.vehicleIds = vehicleIds
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[(!this.edit) ? 'post' : 'put']('/worktarget/twgtworktargetvehicle/', this.dataForm).then(({ data: res }) => {
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
