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
          let base = +new Date(1988, 9, 3);
          let oneDay = 24 * 3600 * 1000;
          let data = [[base, Math.random() * 300]];
          for (let i = 1; i < 20000; i++) {
            let now = new Date((base += oneDay));
            data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
          }
          let option = {
            tooltip: {
              trigger: 'axis',
              position: function (pt) {
                return [pt[0], '10%'];
              }
            },
            title: {
              left: 'center',
              text: 'Large Ara Chart'
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
              type: 'time',
              boundaryGap: false
            },
            yAxis: {
              type: 'value',
              boundaryGap: [0, '100%']
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 20
              },
              {
                start: 0,
                end: 20
              }
            ],
            series: [
              {
                name: 'Fake Data',
                type: 'line',
                smooth: true,
                symbol: 'none',
                areaStyle: {},
                data: data
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
