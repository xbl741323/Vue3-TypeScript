<template>
  <div class="card-class">
    <el-transfer  v-model="vehicleArray"
          :props="props"
          :data="vehicleList"
          :titles="titles"
          target-order="push"
          @change="changeValue"
        ></el-transfer>
  </div>
</template>
<script>
export default {
  name: 'VehicleTransfer',
  data () {
    return {
      vehicleList: [],
      vehicleArray: this.vehicleIds,
      vehicleMap: new Map(),
      titles: ['未配置', '已配置'],
      props: {
        key: 'id',
        label: 'plateNumber'
      }
    }
  },
  props: {
    vehicleIds: Array
  },
  watch: {
    vehicleIds (val) {
      this.vehicleArray = val
      this.changeValue(val)
    }
  },
  mounted () {
    this.getVehicleList()
  },
  methods: {
    changeValue (vehicleIds) {
      // console.log(vehicleIds)
      this.$emit('update:vehicleIds', vehicleIds)
      // var vehicleArray = []
      // for (var i = 0; i < vehicleIds.length; i++) {
      //   var vehicleId = vehicleIds[i]
      //   var vehicle = this.vehicleMap.get(vehicleId)
      //   vehicleArray.push(vehicle)
      // }
      this.$emit('change', vehicleIds)
    },
    getVehicleList () {
      return this.$http
        .get('/vehwork/tvehvehicleinfo/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.vehicleList = res.data
          // console.log(this.vehicleList)
          // if (this.vehicleList.length > 0) {
          //   for (var i = 0; i < this.vehicleList.length; i++) {
          //     var vehicle = this.vehicleList[i]
          //     this.vehicleMap.set(vehicle.id + '', vehicle)
          //   }
          // }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
  .card-class {
    padding-top: 10px;
  }
  .card-class .el-transfer .el-transfer__buttons .el-button{
    margin-left: 0px !important;
    display: block;
  }

  .card-class .el-transfer .el-transfer__buttons .el-button [class*=el-icon-]+span{margin-left: 0px !important;}
  .card-class .el-transfer .el-transfer__buttons .el-transfer__buttons {
      display: block !important;
  }
</style>
