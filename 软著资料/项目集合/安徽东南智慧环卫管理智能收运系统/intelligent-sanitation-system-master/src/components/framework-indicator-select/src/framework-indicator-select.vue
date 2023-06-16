<template>
  <div>
    <el-select :clearable="true" v-model="frameworkIndicatorId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in frameworkIndicatorList"
        :key="item.code"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'FrameworkIndicatorSelect',
  data () {
    return {
      frameworkIndicatorList: [],
      frameworkIndicatorId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  watch: {
    value (val) {
		
      this.frameworkIndicatorId = val
    }
  },
  mounted () {
    this.getFrameworkIndicatorList()
  },
  methods: {
    getFrameworkIndicatorList() {
      return this.$http
        .get('/framework/tframeworkindicator/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            console.log('ccccccccccccccccccccc')
            return this.$message.error(res.msg)
          }
          this.frameworkIndicatorList = res.data
        })
        .catch(() => {})
    },
    changeValue (frameworkIndicatorId) {
      var currentframeworkIndicator
      for (var i = 0; i < this.frameworkIndicatorList.length; i++) {
        var frameworkIndicator = this.frameworkIndicatorList[i]
        if (frameworkIndicator.code == frameworkIndicatorId) {
          currentframeworkIndicator = frameworkIndicator
          break
        }
      }
      this.$emit('changeFrameworkIndicator', currentframeworkIndicator)
    }
  }
}
</script>
