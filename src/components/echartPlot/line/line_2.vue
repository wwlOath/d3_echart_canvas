<template>
  <div>
    <div id="lineChart" style="width: 100%;height: 400px" ref="chart"></div>
  </div>
</template>

<style lang="less">

</style>

<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    methods: {
      getData() {
        let dom = this.$refs.chart;
        if(dom) {
          let myChart = this.$echarts.init(dom);

          let option = {
            title: {
              text: 'Temperature Change in the Coming Week'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              top: '10%',
              left: 'center'
            },
            grid: {
              top: '23%',
              left: '3%',
              right: '10%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              show: true,
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value} °C'
              }
            },
            series: [
              {
                name: 'Highest',
                type: 'line',
                data: [10, 11, 13, 11, 12, 12, 9],
                markPoint: {
                  data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: 'Avg' }]
                }
              },
              {
                name: 'Lowest',
                type: 'line',
                data: [1, -2, 2, 5, 3, 2, 0],
                markPoint: {
                  data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'Avg' },
                    [
                      {
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                      },
                      {
                        symbol: 'circle',
                        label: {
                          position: 'start',
                          formatter: 'Max'
                        },
                        type: 'max',
                        name: '最高点'
                      }
                    ]
                  ]
                }
              }
            ]
          };
          myChart.setOption(option);
          window.addEventListener('resize',() => {myChart.resize()});
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
