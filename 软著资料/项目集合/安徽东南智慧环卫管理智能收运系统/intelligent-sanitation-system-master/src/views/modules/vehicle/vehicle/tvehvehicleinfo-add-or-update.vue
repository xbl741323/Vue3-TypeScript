<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="vehicleTypeId">
              <vehicle-type-select v-model="dataForm.vehicleTypeId" :placeholder="'请选择'" @changeVehicleType="changeVehicleType"></vehicle-type-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆型号" prop="vehicleModel">
              <el-input v-model="dataForm.vehicleModel" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆编号" prop="vehicleNum">
              <el-input v-model="dataForm.vehicleNum" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="plateNumber">
              <el-input v-model="dataForm.plateNumber" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <dept-tree v-model="dataForm.deptId"></dept-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="额定载重" prop="ratedCarload">
              <el-input v-model="dataForm.ratedCarload" placeholder=""></el-input>
            </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="额定自重" prop="selfCarload">
              <el-input v-model="dataForm.selfCarload" placeholder=""></el-input>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="额定容积" prop="ratedCubage">
              <el-input v-model="dataForm.ratedCubage" placeholder=""></el-input>
            </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场" prop="carParkId">
              <el-select v-model="dataForm.carParkId" placeholder="请选择">
                <el-option
                  v-for="item in vehicleParkList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机" prop="driverId">
              <el-input v-model="dataForm.driverId" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <el-card>
      <el-table :data="deviceInfo" :stripe="true" :border="true">
        <el-table-column label="设备类型" align="center">
          <template slot-scope="scope">
            <device-type-select v-model="scope.row.deviceTypeId" @changeDeviceType="changeDeviceType($event,scope.row)"></device-type-select>
          </template>
        </el-table-column>
        <el-table-column label="设备号" align="center">
          <template slot-scope="scope">
            <device-select :deviceTypeId="scope.row.deviceTypeId" :deviceId="scope.row.deviceId" @changeDevice="changeDevice($event,scope.row)"></device-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" :render-header="renderHeader" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <template slot="footer" style="text-align:center">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import Device from '../../device/device.vue'
import deviceSelect from '../../../../components/device-select/src/device-select.vue'
export default {
  components: { deviceSelect },
  data () {
    return {
      visible: false,
      vehicleTypeList: [],
      vehicleParkList: [],
      deviceInfo: [
      ],
      dataForm: {
        id: '',
        vehicleTypeId: '',
        vehicleModel: '',
        vehicleNum: '',
        plateNumber: '',
        deptId: '',
        ratedCarload: '',
        selfCarload: '',
        ratedCubage: '',
        oilCapacity: '',
        carParkId: '',
        oilStyle: '',
        isacc: '',
        driverId: '',
        status: '0',
        deviceIdList: []
      }
    }
  },
  computed: {
    dataRule () {
      return {
        vehicleTypeId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        deptId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        vehicleNum: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        plateNumber: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getVehicleParkList()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.deviceInfo = []
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/vehwork/tvehvehicleinfo/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        console.log(this.dataForm.deviceList)
        if (this.dataForm.deviceList.length > 0) {
          for (var i = 0; i < this.dataForm.deviceList.length; i++) {
            var device = this.dataForm.deviceList[i]
            var deviceObj = {
              deviceTypeId: device.deviceTypeId, deviceId: device.id
            }
            this.deviceInfo.push(deviceObj)
          }
        }
      }).catch(() => {})
    },
    getVehicleParkList () {
      this.$http.get('/worktarget/worktarget/getList', { params: {
        worktargetTypeId: '13'
      } }
      ).then(({ data: res }) => {
        if (res.code === 0) {
          this.vehicleParkList = res.data
        }
      })
    },
    handleAdd () {
      this.deviceInfo.push({ deviceTypeId: '', deviceId: '' })
    },
    handleDelete (index, row) {
      console.log(index)
      this.deviceInfo.splice(index, 1)
    },
    changeDeviceType (deviceType, row) {
      row.deviceTypeId = deviceType.id
      console.log(row)
    },
    changeDevice (device, row) {
      console.log(device)
      console.log(row)
      row.deviceId = device.id
    },
    changeVehicleType (vehicleType) {
      this.dataForm.vehicleTypeId = vehicleType.id
    },
    renderHeader (h, { column }) {
      return h('div', [
        h('span', column.label),
        h('span', ' '),
        h('el-button', {
          props: {
            type: 'success',
            // icon: 'el-icon-circle-plus-outline',
            plain: true
          },
          on: {
            click: this.handleAdd
          }
        }, '新增设备')
      ])
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.deviceIdList = []
        if (this.deviceInfo.length > 0) {
          for (var i = 0; i < this.deviceInfo.length; i++) {
            var device = this.deviceInfo[i]
            this.dataForm.deviceIdList.push(device.deviceId)
          }
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/vehwork/tvehvehicleinfo/', this.dataForm).then(({ data: res }) => {
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
