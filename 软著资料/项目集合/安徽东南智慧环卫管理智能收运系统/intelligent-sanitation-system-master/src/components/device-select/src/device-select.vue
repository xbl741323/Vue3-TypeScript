<template>
  <div>
    <el-select v-model="devId" :placeholder="placeholder" @change="changeDevice">
      <el-option
        v-for="item in deviceList"
        :key="item.id"
        :label="item.deviceCode"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'DeviceSelect',
  data () {
    return {
      deviceList: [],
      devId: this.deviceId
    }
  },
  props: {
    deviceTypeId: [Number, String],
    deviceId: [Number, String],
    placeholder: String
  },
  watch: {
    deviceTypeId: {
      handler (val) {
        this.getDeviceList()
      },
      immediate: true
    },
    deviceId: {
      handler (val) {
        this.devId = val
        this.getDevice(this.devId)
      },
      immediate: true
    }
  },
  methods: {
    getDeviceList () {
      this.deviceList = []
      if (this.deviceTypeId) {
        this.$http
          .get('/device/device/getList', { params: { deviceTypeId: this.deviceTypeId, status: 0 } })
          .then(({ data: res }) => {
            if (res.code != 0) {
              console.log('aaaaaaaaaaaaaaaaaaaa')
              return this.$message.error(res.msg)
            }
            this.deviceList = res.data
          })
          .catch(() => {})
        this.$nextTick(() => {
        })
      }
    },
    getDevice (devId) {
      var isExit = false
      if (this.deviceList && this.deviceList.length > 0) {
        for (var i = 0; i < this.deviceList.length; i++) {
          var device = this.deviceList[i]
          if (device.id == devId) {
            isExit = true
          }
        }
      }
      if (!isExit && devId) {
        this.$http.get('/device/device/' + devId).then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
          this.deviceList.unshift(res.data)
        }).catch(() => {})
      }
    },
    changeDevice (deviceId) {
      var currentDevice
      for (var i = 0; i < this.deviceList.length; i++) {
        var device = this.deviceList[i]
        if (device.id == deviceId) {
          currentDevice = device
          break
        }
      }
      this.$emit('changeDevice', currentDevice)
    }
  }
}
</script>
