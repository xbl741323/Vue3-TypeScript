<template>
  <div>
    <el-select :clearable="true" v-model="workTypeId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in workTypeList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorktypeSelect',
  data () {
    return {
      workTypeList: [],
      workTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String,
    display: Boolean
  },
  watch: {
    value (val) {
      this.workTypeId = val
    }
  },
  mounted () {
    this.getWorkTypeList()
  },
  methods: {
    getWorkTypeList () {
      return this.$http
        .get('/framework/tframeworkworktype/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.workTypeList = res.data
        })
        .catch(() => {})
    },
    changeValue (workTypeId) {
      if (!workTypeId) {
        this.$emit('changeVehicleType', workTypeId)
        return
      }
      for (var i = 0; i < this.workTypeList.length; i++) {
        var workType = this.workTypeList[i]
        if (workType.id == workTypeId) {
          this.$emit('changeWorkType', workType)
          break
        }
      }
    }
  }
}
</script>
