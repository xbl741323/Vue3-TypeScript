<template>
  <div>
     <el-checkbox-group v-model="wgtTypeIds" size="small" @change="changeValue">
      <el-checkbox-button style="margin-top:5px;margin-bottom:5px;" v-for="worktargettype in worktargetTypeList" :key="worktargettype.id" :label="worktargettype.id">{{worktargettype.worktargetTypeName}}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: 'WorktargetTypeCheckboxGroup',
  data () {
    return {
      worktargetTypeList: [],
      wgtTypeIds: this.worktargetTypeIds
    }
  },
  props: {
    businessType: String,
    worktargetTypeIds: {
      type: Array,
      default () {
        return []
      }
    },
    worktypeCode: String,
    defaultSelect: {
      type: String,
      default: 'all'
    }
  },
  watch: {
    businessType (val) {
      this.getWorktargetTypeList()
    },
    worktargetTypeIds (val) {
      this.wgtTypeIds = this.worktargetTypeIds
    },
    worktypeCode (val) {
      this.getWorktargetTypeList()
    }
  },
  mounted () {
    this.getWorktargetTypeList()
  },
  methods: {
    getWorktargetTypeList () {
      this.$http
        .get('/worktarget/worktargettype/getWorktargettypeList4Worktype', { params: { businessType: this.businessType, worktypeCode: this.worktypeCode } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.worktargetTypeList = res.data

          if (this.defaultSelect == 'all') {
            var worktargetTypeIds = []
            if (this.worktargetTypeList != null && this.worktargetTypeList.length > 0) {
              for (var i = 0; i < this.worktargetTypeList.length; i++) {
                var worktargetType = this.worktargetTypeList[i]
                worktargetTypeIds.push(worktargetType.id)
              }
              this.wgtTypeIds = worktargetTypeIds
              console.log(this.wgtTypeIds)
              this.$emit('change', worktargetTypeIds)
            }
          }
        })
        .catch(() => {})
    },
    changeValue (worktargetTypeIds) {
      this.$emit('change', worktargetTypeIds)
    }
  }
}
</script>
