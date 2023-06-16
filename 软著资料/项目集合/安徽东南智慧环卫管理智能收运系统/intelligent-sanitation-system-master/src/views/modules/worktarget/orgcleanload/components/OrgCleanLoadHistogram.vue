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
      reportSerials: [],
      labelOption: {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        // formatter: '{c}  {name|{a}}',
        formatter: '{c}',
        fontSize: 16,
        rich: {
          name: {
            color: '#000',
            fontSize: 16,
            fontWeight: 200,
            fontStyle: 'normal'
          }
        }
      }
    }
  },
  watch: {
    dataList (n, o) {
      this.xAxisDataList = []
      this.reportSerials = []
      if (this.dataList != null && this.dataList.length > 0) {
        this.dataList.forEach(item => {
          this.xAxisDataList.push(item.orgName)
          this.reportSerials.push(item.cleanAmount)
        })
      }
      this.chartsOptions.xAxis[0].data = this.xAxisDataList
      this.chartsOptions.series[0].data = this.reportSerials
      this.chartsOptions = this.chartsOptions
    }
  },
  methods: {
    formatter (param) {
      var dataIndex = param[0].dataIndex
      var item = this.dataList[dataIndex]

      var msg = ''
      msg += '' + item.statisticTime + '</br>'

      msg += '部门：' + item.orgName + '</br>'
      msg += '清运次数：' + item.cleanCount + '次</br>'
      msg += '清运量：' + item.cleanAmount + '公斤</br>'
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
          axisPointer: {
            type: 'shadow'
          },
          formatter: this.formatter
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: this.xAxisDataList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '清运量',
            type: 'bar',
            barGap: 0,
            label: this.labelOption,
            emphasis: {
              focus: 'series'
            },
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
    margin-top: 10px;
  }

</style>
