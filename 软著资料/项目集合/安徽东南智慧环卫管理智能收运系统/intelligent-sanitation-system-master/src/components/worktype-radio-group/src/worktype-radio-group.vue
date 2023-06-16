<template>
  <div>
     <el-radio-group v-model="typeCode" size="small" @change="changeValue">
      <el-radio-button style="margin-top:5px;margin-bottom:5px;" v-for="worktype in workTypeList" :key="worktype.id" :label="worktype.code">{{worktype.name}}</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  name: 'WorktypeRadioGroup',
  data () {
    return {
      workTypeList: [],
	  workMainBodyCode:this.workMainBody,
      bsScope: this.businessType,
      vehTypeId: this.vehicleTypeId,
      wgtTypeId: this.worktargetTypeId,
      typeCode: this.worktypeCode
    }
  },
  props: {
	workMainBody: String,
    businessType: [Number, String],
    vehicleTypeId: [Number, String],
    worktargetTypeId: [Number, String],
    worktypeCode: String
  },
  watch: {
	workMainBody (val) {
	  this.workMainBodyCode = this.workMainBody
	  this.getWorkTypeList()
	},
    businessType (val) {
      this.bsScope = this.businessType
      this.getWorkTypeList()
    },
    vehicleTypeId (val) {
      this.vehTypeId = this.vehicleTypeId
      this.getWorkTypeList()
    },
    worktargetTypeId (val) {
      this.wgtTypeId = this.worktargetTypeId
      this.getWorkTypeList()
    },
    worktypeCode (val) {
      this.typeCode = this.worktypeCode
    }
  },
  mounted () {
    this.getWorkTypeList()
  },
  methods: {
    getWorkTypeList () {
      this.$http
        .get('/framework/tframeworkworktype/getList', { params: { workMainBody: this.workMainBodyCode,businessType: this.bsScope, vehicleTypeId: this.vehTypeId, worktargetTypeId: this.wgtTypeId } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.workTypeList = res.data
          if (this.workTypeList != null && this.workTypeList.length > 0 && !this.typeCode) {
            var workType = this.workTypeList[0]
            this.typeCode = workType.code
            this.$emit('changeWorktype', workType)
          }
        })
        .catch(() => {})
    },
    changeValue (workTypeId) {
      if (!workTypeId) {
        this.$emit('changeWorktype', '')
        return
      }
      var worktype = ''
      var index = ''
      console.log(this.workTypeList)
      for (var i = 0; i < this.workTypeList.length; i++) {
        var workType = this.workTypeList[i]
        if (workType.code == this.typeCode) {
          worktype = workType
          index = i
          this.$emit('changeWorktype', workType)
          break
        }
      }
      if (worktype != '') {
        var workTypeList = []
        for (var j = 0; j < this.workTypeList.length; j++) {
          workTypeList.push(this.workTypeList[j])
        }
        workTypeList[0] = ''
        workTypeList[index] = this.workTypeList[0]
        workTypeList[0] = this.workTypeList[index]
        this.workTypeList = workTypeList
      }
    }
  }
}
</script>
