<template>
  <el-dialog width="54vw" title="油耗曲线" :visible="carGasCurveVisible" @close='closeDialog'>
    <div id="carGasCurve"></div>
  </el-dialog>
</template>

<script>
import { getOilMonitoringList } from "@/api/carmonitoring";
import formatDate from '@/utils/dateUtil.js';

let myEchart;

export default {
  name: "carGasCurve",
  data() {
    return {
      carGasCurveVisible:false,
      id:'20',
    };
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      myEchart = this.$echarts.init(document.getElementById("carGasCurve"));
      that.initGas();
    }, 3 * 100)

  },
  methods: {
    initGas(){
      let queryParams = {
        startDate : formatDate.format(new Date(),'yyyy-MM-dd') + ' 00:00:00',
        endDate : formatDate.format(new Date(),'yyyy-MM-dd') + ' 23:59:59',
        vehicleId:this.id
      };
      console.log(this.id)
      getOilMonitoringList(queryParams).then(response => {
        let list = response.data.data;
        let xData = [];
        let yData = [];
        let pData = [];
        for (let i=0;i<list.length;i++){
          xData.push(list[i].date);
          yData.push(list[i].oilavg);
          pData.push(list[i].speed);
        }
        console.log(list)
        let carName = list[0].carnum;
        let option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: carName
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData
          },
          yAxis: [{
            type: 'value',
            boundaryGap: [0, '100%']
          },
          {
            type: 'value',
            boundaryGap: [0, '100%']
          }],
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10
            },
            {
              start: 0,
              end: 10
            }
          ],
          series: [
            {
              name: '油耗',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              data: yData
            },
            {
              name: '速度',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              yAxisIndex: 1,
              itemStyle: {
                color: 'rgba(65,140,222,0.82)'
              },
              data: pData
            }
          ]
        };
        console.log(option)
        myEchart.setOption(option);
      });
    },
    closeDialog(){
      this.carGasCurveVisible=false;
    }
  }
}
</script>

<style scoped>

#carGasCurve {
  width: 800px;
  height:400px;
}
.gasClass{
  width: 65%!important;margin-top: 20vh!important;margin-left: 30%!important;padding: 0!important;
}
</style>