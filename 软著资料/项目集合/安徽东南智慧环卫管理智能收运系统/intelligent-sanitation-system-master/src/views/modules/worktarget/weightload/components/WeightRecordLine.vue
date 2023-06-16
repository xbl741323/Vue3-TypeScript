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
          this.xAxisDataList.push(item.recDatetime)
          this.reportSerials.push(item.net)
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

      msg += '车辆类型：' + item.vehicleTypeName + '</br>'
      msg += '车牌号：' + item.vehiclePlateNumber + '</br>'
      msg += '毛重：' + item.gross + '公斤</br>'
      msg += '皮重：' + item.tare + '公斤</br>'
      msg += '净重：' + item.net + '公斤</br>'
      msg += '称重时间:' + item.netDatetime + '</br>'
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
            name: '净重',
            type: 'line',
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
