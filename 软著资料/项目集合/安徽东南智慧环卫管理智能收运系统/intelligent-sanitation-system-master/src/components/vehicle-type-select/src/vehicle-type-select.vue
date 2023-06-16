<template>
  <div>
    <el-select :clearable="true" v-model="vehicleTypeId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in vehicleTypeList"
        :key="item.id"
        :label="item.typeName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'VehicleTypeSelect',
  data () {
    return {
      vehicleTypeList: [],
      vehicleTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
      this.vehicleTypeId = val
    }
  },
  mounted () {
    this.getVehicleTypeList()
  },
  methods: {
    getVehicleTypeList () {
      return this.$http
        .get('/vehwork/tvehvehicletype/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.vehicleTypeList = res.data
        })
        .catch(() => {})
    },
    changeValue (vehicleTypeId) {
      if (!vehicleTypeId) {
        this.$emit('changeVehicleType', vehicleTypeId)
        return
      }
      for (var i = 0; i < this.vehicleTypeList.length; i++) {
        var vehicleType = this.vehicleTypeList[i]
        if (vehicleType.id == vehicleTypeId) {
          this.$emit('changeVehicleType', vehicleType)
          break
        }
      }
    }
  }
}
</script>
