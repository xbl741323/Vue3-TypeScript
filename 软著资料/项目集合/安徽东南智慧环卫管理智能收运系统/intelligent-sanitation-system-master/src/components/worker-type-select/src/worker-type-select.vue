<template>
  <div>
    <el-select v-model="workerTypeId" :clearable="true" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in workerTypeList"
        :key="item.id"
        :label="item.typename"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorkerTypeSelect',
  data () {
    return {
      workerTypeList: [],
      workerTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
      this.workerTypeId = val
    }
  },
  mounted () {
    this.getWorkerTypeList()
  },
  methods: {
    getWorkerTypeList () {
      return this.$http
        .get('/zhhw-worker/twkrworkertype/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.workerTypeList = res.data
        })
        .catch(() => {})
    },
    changeValue (workerTypeId) {
      for (var i = 0; i < this.workerTypeList.length; i++) {
        var workerType = this.workerTypeList[i]
        if (workerType.id == workerTypeId) {
          this.$emit('changeWorkerType', workerType)
          break
        }
      }
    }
  }
}
</script>
