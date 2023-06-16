<template>
  <div>
    <el-select :clearable="true" v-model="workTimeId" :placeholder="placeholder" @change="changeValue">
      <el-option
        v-for="item in workTimeList"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'workTimeSelect',
  data () {
    return {
      workTimeList: [],
      workTimeId: this.value
    }
  },
  props: {
    value: [Number, String],
    placeholder: String,
    display: Boolean
  },
  watch: {
    value (val) {
      this.workTimeId = val
    }
  },
  mounted () {
    this.getworkTimeList()
  },
  methods: {
    getworkTimeList () {
      return this.$http
        .get('/framework/tframeworkworktime/getList', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          for (var i = 0; i < res.data.length; i++) {
            var workTime = res.data[i]
            workTime.label = workTime.beginTime + '-' + workTime.endTime
          }
          this.workTimeList = res.data
        })
        .catch(() => {})
    },
    changeValue (workTimeId) {
      if (!workTimeId) {
        this.$emit('changeWorkTime', workTimeId)
        return
      }
      for (var i = 0; i < this.workTimeList.length; i++) {
        var workTime = this.workTimeList[i]
        if (workTime.id == workTimeId) {
          this.$emit('changeWorkTime', workTime)
          break
        }
      }
    }
  }
}
</script>
