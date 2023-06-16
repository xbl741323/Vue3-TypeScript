<template>
  <div>
    <el-select v-model="worktargetTypeId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in worktargetTypeList"
        :key="item.id"
        :label="item.worktargetTypeName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorktargetTypeSelect',
  data () {
    return {
      worktargetTypeList: [],
      worktargetTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
      this.worktargetTypeId = val
    }
  },
  mounted () {
    this.getWorktargetTypeList()
  },
  methods: {
    getWorktargetTypeList () {
      return this.$http
        .get('/worktarget/worktargettype/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.worktargetTypeList = res.data
        })
        .catch(() => {})
    },
    changeValue (worktargetTypeId) {
      for (var i = 0; i < this.worktargetTypeList.length; i++) {
        var worktargetType = this.worktargetTypeList[i]
        if (worktargetType.id == worktargetTypeId) {
          this.$emit('changeWorktargetType', worktargetType)
          break
        }
      }
    }
  }
}
</script>
