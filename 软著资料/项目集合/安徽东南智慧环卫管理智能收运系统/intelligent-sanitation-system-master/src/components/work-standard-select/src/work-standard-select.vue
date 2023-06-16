<template>
  <div>
    <el-select :clearable="true" v-model="workStandardId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in workStandardList"
        :key="item.id"
        :label="item.workStandardName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorkStandardSelect',
  data () {
    return {
      workStandardList: [],
      workStandardId: this.value
    }
  },
  props: {
    value: [Number, String],
    worktypeCode: String,
    placeholder: String,
    display: Boolean
  },
  watch: {
    value (val) {
      this.workStandardId = val
    }
  },
  mounted () {
    this.getworkStandardList()
  },
  methods: {
    getworkStandardList () {
      return this.$http
        .get('/framework/tframeworkworkstandard/getWorkStandardList', { params: { worktypeCode: this.worktypeCode } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.workStandardList = res.data
        })
        .catch(() => {})
    },
    changeValue (workStandardId) {
      if (!workStandardId) {
        this.$emit('changeWorkStandard', workStandardId)
        return
      }
      for (var i = 0; i < this.workStandardList.length; i++) {
        var workStandard = this.workStandardList[i]
        if (workStandard.id == workStandardId) {
          this.$emit('changeWorkStandard', workStandard)
          break
        }
      }
    }
  }
}
</script>
