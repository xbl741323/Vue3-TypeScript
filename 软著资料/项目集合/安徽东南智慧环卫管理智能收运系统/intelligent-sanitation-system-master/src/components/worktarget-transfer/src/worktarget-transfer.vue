<template>
  <div class="card-class">
    <el-transfer  v-model="viewWorktargetArray"
          :props="props"
          :data="viewWorktargetList"
          :titles="titles"
          target-order="push"
          @change="changeValue"
        ></el-transfer>
  </div>
</template>
<script>
export default {
  name: 'WorktargetTransfer',
  data () {
    return {
      viewWorktargetList: [],
      viewWorktargetArray: this.worktargetInfos,
      viewWorktargetMap: new Map(),
      titles: ['未勾选', '已勾选'],
      props: {
        key: 'typeAndId',
        label: 'name'
      }
    }
  },
  props: {
    worktargetInfos: Array,
	codetype: String,
	worktargetType: Array
  },
  watch: {
    worktargetInfos (val) {
      this.viewWorktargetArray = val
      this.changeValue(val)
    },
	codetype (val) {
		this.getViewWorktargetInfoList()
	},
	worktargetType(val) {
		this.getViewWorktargetInfoList()
	}
  },
  mounted () {
    this.getViewWorktargetInfoList()
  },
  methods: {
    changeValue (worktargetInfos) {
      this.$emit('update:worktargetInfos', worktargetInfos)
      var viewWorktargetInfoArray = []
      for (var i = 0; i < worktargetInfos.length; i++) {
        var typeAndId = worktargetInfos[i]
        var viewWorktargetInfo = this.viewWorktargetMap.get(typeAndId)
        viewWorktargetInfoArray.push(viewWorktargetInfo)
      }
      this.$emit('change', viewWorktargetInfoArray)
    },
    getViewWorktargetInfoList () {
      return this.$http
        .get('/worktarget/cleanworktarget/getWorktargetInfoViewList', { params: {worktypeCode:this.codetype ,worktargetTypeIds:this.worktargetType.toString()} })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.viewWorktargetList = res.data
          console.log(this.viewWorktargetList)
          if (this.viewWorktargetList.length > 0) {
            for (var i = 0; i < this.viewWorktargetList.length; i++) {
              var viewWorktargetInfo = this.viewWorktargetList[i]
              this.viewWorktargetMap.set(viewWorktargetInfo.typeAndId, viewWorktargetInfo)
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
