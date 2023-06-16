<template>
  <div>
    <el-select :clearable="true" v-model="deviceTypeId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in deviceTypeList"
        :key="item.id"
        :label="item.devicetypename"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'DeviceTypeSelect',
  data () {
    return {
      deviceTypeList: [],
      deviceTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
      this.deviceTypeId = val
    }
  },
  mounted () {
    this.getDeviceTypeList()
  },
  methods: {
    getDeviceTypeList () {
      return this.$http
        .get('/device/devicetype/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            console.log('ccccccccccccccccccccc')
            return this.$message.error(res.msg)
          }
          this.deviceTypeList = res.data
        })
        .catch(() => {})
    },
    changeValue (deviceTypeId) {
      var currentDeviceType
      for (var i = 0; i < this.deviceTypeList.length; i++) {
        var deviceType = this.deviceTypeList[i]
        if (deviceType.id == deviceTypeId) {
          currentDeviceType = deviceType
          break
        }
      }
      this.$emit('changeDeviceType', deviceType)
    }
  }
}
</script>
