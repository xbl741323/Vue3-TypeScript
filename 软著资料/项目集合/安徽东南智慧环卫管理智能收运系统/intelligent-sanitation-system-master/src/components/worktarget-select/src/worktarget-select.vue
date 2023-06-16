<template>
  <div>
    <el-select v-model="wktId" :placeholder="placeholder" @change="changeWorktarget">
      <el-option
        v-for="item in worktargetList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'WorktargetSelect',
  data () {
    return {
      worktargetList: [],
      wktId: this.worktargetId
    }
  },
  props: {
    worktargetTypeId: [Number, String],
    worktargetId: [Number, String],
    placeholder: String
  },
  watch: {
    worktargetTypeId (val) {
      this.getWorktargetList()
    },
    worktargetId (val) {
      this.wktId = val
    }
  },
  methods: {
    getWorktargetList () {
      this.worktargetList = []
      if (this.worktargetTypeId) {
        this.$http
          .get('/worktarget/worktarget/getListByTypeId', { params: { worktargetTypeId: this.worktargetTypeId } })
          .then(({ data: res }) => {
            if (res.code != 0) {
              return this.$message.error(res.msg)
            }
            this.worktargetList = res.data
          })
          .catch(() => {})
      }
    },
    changeWorktarget (worktargetId) {
      var currentWorktarget
      for (var i = 0; i < this.worktargetList.length; i++) {
        var worktarget = this.worktargetList[i]
        if (worktarget.id == worktargetId) {
          currentWorktarget = worktarget
          break
        }
      }
      this.$emit('changeWorktarget', currentWorktarget)
    }
  }
}
</script>
