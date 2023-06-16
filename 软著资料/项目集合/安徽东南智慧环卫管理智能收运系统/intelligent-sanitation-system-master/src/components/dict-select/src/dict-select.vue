<template>
  <div>
    <el-select v-model="dictDataId" :style="comStyle" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in dictDataList"
        :key="item.dictValue"
        :label="item.dictLabel"
        :value="item.dictValue">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'DictSelect',
  data () {
    return {
      dictDataList: [],
      dictDataId: this.value
    }
  },
  props: {
    value: [Number, String],
    dictType: String,
    placeholder: String,
    comStyle: String
  },
  watch: {
    value (val) {
      this.dictDataId = val
    },
    dictType (val) {
      console.log(val)
    }
  },
  mounted () {
    this.getDictDataList()
  },
  methods: {
    getDictDataList () {
      return this.$http
        .get('/sys/dict/data/getDictData4DictType', { params: { dictType: this.dictType } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.dictDataList = res.data
        })
        .catch(() => {})
    },
    changeValue (dictDataId) {
      for (var i = 0; i < this.dictDataList.length; i++) {
        var dictData = this.dictDataList[i]
        if (dictData.dictValue == dictDataId) {
          this.$emit('change', dictData)
          break
        }
      }
    }
  }
}
</script>
