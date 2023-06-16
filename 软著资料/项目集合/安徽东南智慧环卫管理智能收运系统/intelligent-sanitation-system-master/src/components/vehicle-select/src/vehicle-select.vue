<template>
  <div>
    <el-select v-model="vehId" :clearable="true" :placeholder="placeholder" @change="changeVehicle">
      <el-option
        v-for="item in vehicleList"
        :key="item.id"
        :label="item.plateNumber"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'VehicleSelect',
  data () {
    return {
      vehicleList: [],
      vehId: this.vehicleId
    }
  },
  props: {
    vehicleTypeId: [Number, String],
    vehicleId: [Number, String],
    placeholder: String
  },
  watch: {
    vehicleTypeId (val) {
      this.getVehicleList()
    },
    vehicleId (val) {
      this.vehId = val
    }
  },
  methods: {
    getVehicleList () {
      this.vehicleList = []
      if (this.vehicleTypeId) {
        this.$http
          .get('/vehwork/tvehvehicleinfo/getList', { params: { vehicleTypeId: this.vehicleTypeId } })
          .then(({ data: res }) => {
            if (res.code != 0) {
              return this.$message.error(res.msg)
            }
            this.vehicleList = res.data
          })
          .catch(() => {})
      }
    },
    changeVehicle (vehicleId) {
      var currentVehicle
      for (var i = 0; i < this.vehicleList.length; i++) {
        var vehicle = this.vehicleList[i]
        if (vehicle.id == vehicleId) {
          currentVehicle = vehicle
          break
        }
      }
      this.$emit('changeVehicle', currentVehicle)
    }
  }
}
</script>
