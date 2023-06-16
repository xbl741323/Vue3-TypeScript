<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-model="selectIdArray" @change="changeValue">
      <el-checkbox v-for="worktargetType in worktargetTypeList" :label="worktargetType.id" :key="worktargetType.id">{{worktargetType.worktargetTypeName}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: 'WorktargetTypePanel',
  data () {
    return {
      worktargetTypeList: [],
      selectIdArray: this.worktargetTypeIdArray,
      checkAll: true,
      isIndeterminate: true
    }
  },
  props: {
    worktargetTypeIdArray: Array,
    placeholder: String
  },
  watch: {
    worktargetTypeArray (val) {
      this.worktargetTypeIdArray = val
    }
  },
  mounted () {
    this.getWorktargetTypeList()
  },
  methods: {
    getWorktargetTypeList () {
      return this.$http
        .get('/worktarget/worktargettype/list', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.worktargetTypeList = res.data
        })
        .catch(() => {})
    },
    handleCheckAllChange (val) {
      var selectIdArray = []
      if (val) {
        for (var i = 0; i < this.worktargetTypeList.length; i++) {
          var worktargetType = this.worktargetTypeList[i]
          selectIdArray.push(worktargetType.id + '')
        }
      }
      this.selectIdArray = val ? selectIdArray : []
      this.isIndeterminate = false
      this.$emit('update:worktargetTypeIdArray', this.selectIdArray)
    },
    changeValue (value) {
      let checkedCount = this.selectIdArray.length
      this.checkAll = checkedCount === this.worktargetTypeList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.worktargetTypeList.length
      this.$emit('update:worktargetTypeIdArray', this.selectIdArray)
    }
  }
}
</script>
