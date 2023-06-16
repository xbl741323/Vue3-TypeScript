<template>
  <div class="card-class">
    <el-transfer  v-model="viewCleanWorktargetArray"
          :props="props"
          :data="viewCleanWorktargetList"
          :titles="titles"
          target-order="push"
          @change="changeValue"
        ></el-transfer>
  </div>
</template>
<script>
export default {
  name: 'CleanWorktargetTransfer',
  data () {
    return {
      viewCleanWorktargetList: [],
      viewCleanWorktargetArray: this.worktargetInfos,
      viewCleanWorktargetMap: new Map(),
      titles: ['未配置', '已配置'],
      props: {
        key: 'typeAndId',
        label: 'name'
      }
    }
  },
  props: {
    worktargetInfos: Array
  },
  watch: {
    worktargetInfos (val) {
      this.viewCleanWorktargetArray = val
      this.changeValue(val)
    }
  },
  mounted () {
    this.getViewCleanWorktargetInfoList()
  },
  methods: {
    changeValue (worktargetInfos) {
      this.$emit('update:worktargetInfos', worktargetInfos)
      var viewWorktargetInfoArray = []
      for (var i = 0; i < worktargetInfos.length; i++) {
        var typeAndId = worktargetInfos[i]
        var viewWorktargetInfo = this.viewCleanWorktargetMap.get(typeAndId)
        viewWorktargetInfoArray.push(viewWorktargetInfo)
      }
      this.$emit('change', viewWorktargetInfoArray)
    },
    getViewCleanWorktargetInfoList () {
      return this.$http
        .get('/worktarget/cleanworktarget/getViewCleanWorktargetInfoList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.viewCleanWorktargetList = res.data
          console.log(this.viewCleanWorktargetList)
          if (this.viewCleanWorktargetList.length > 0) {
            for (var i = 0; i < this.viewCleanWorktargetList.length; i++) {
              var viewWorktargetInfo = this.viewCleanWorktargetList[i]
              this.viewCleanWorktargetMap.set(viewWorktargetInfo.typeAndId, viewWorktargetInfo)
            }
          }
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
