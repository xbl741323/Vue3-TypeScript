<template>
  <div>
    <el-select :clearable="true" v-model="workTypeId" :placeholder="placeholder" @change="changeValue">
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
  name: 'FrameworkWorktypeSelect',
  data () {
    return {
      workTypeList: [],
      workTypeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
      this.workTypeId = val
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
    changeValue (workTypeId) {
    
      for (var i = 0; i < this.workTypeList.length; i++) {
        var workType = this.workTypeList[i]
        if (workType.code == workTypeId) {
          this.$emit('changeWorkType', workType)
          break
        }
      }
    }
  }
}
</script>
