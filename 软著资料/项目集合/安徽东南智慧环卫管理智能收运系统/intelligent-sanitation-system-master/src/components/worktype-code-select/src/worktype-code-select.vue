<template>
  <div>
    <el-select :clearable="true" :disabled="disabled" v-model="workTypeCode" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in workTypeList"
        :key="item.code"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorktypeCodeSelect',
  data () {
    return {
      workTypeList: [],
      workTypeCode: this.worktypeCode
    }
  },
  props: {
    worktypeCode: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    worktypeCode (val) {
      this.workTypeCode = val
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
    changeValue (workTypeCode) {
      this.$emit('update:worktypeCode', workTypeCode)
    }
  }
}
</script>
