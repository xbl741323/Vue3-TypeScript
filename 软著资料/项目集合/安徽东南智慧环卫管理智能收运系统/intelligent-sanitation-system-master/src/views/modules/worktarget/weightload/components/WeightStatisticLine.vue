<template>
    <div style="width:100%">
        <echats ref="echats" class="echart_c" :options="chartsOptions" :auto-resize="true"></echats>
    </div>
</template>
<script>
import echats from 'vue-echarts'
export default {
  components: {
    echats
  },
  props: {
    dataList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      xAxisDataList: [],
      seriesDataList: [],
      title: '',
      chartsOptions: this.getOption(),
      reportSerials: []
    }
  },
  watch: {
    dataList (n, o) {
      this.xAxisDataList = []
      this.reportSerials = []
      if (this.dataList != null && this.dataList.length > 0) {
        this.dataList.forEach(item => {
          this.xAxisDataList.push(item.statisticTime)
          this.reportSerials.push(item.enterWeightAmount)
        })
      }
      this.chartsOptions.xAxis.data = this.xAxisDataList
      this.chartsOptions.series[0].data = this.reportSerials
      this.chartsOptions = this.chartsOptions
    }
  },
  methods: {
    formatter (param) {
      var dataIndex = param[0].dataIndex
      var item = this.dataList[dataIndex]

      var msg = ''

      msg += '车辆类型：' + item.statisticTime + '</br>'
      msg += '进厂次数：' + item.enterCount + '次</br>'
      msg += '进场量：' + item.enterWeightAmount + '公斤</br>'
      msg += '出厂次数：' + item.leaveCount + '次</br>'
      msg += '出厂量:' + item.leaveWeightAmount + '公斤</br>'
      return msg
    },
    getOption () {
      return {
        title: {
          text: this.title,
          x: 'center',
          y: 'top',
          textAlign: 'center',
          padding: 5
        },
        tooltip: {
          trigger: 'axis',
          formatter: this.formatter
        },
        xAxis: {
          type: 'category',
          data: this.xAxisDataList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '进厂量',
            type: 'bar',
            data: this.reportSerials
          }
        ]
      }
    }
  }
}
</script>
<style >
  .echart_c {
    width: 100%;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }
</style>
