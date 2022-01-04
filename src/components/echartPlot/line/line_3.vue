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
          const data = [
            ["2000-06-05", 116],
            ["2000-06-06", 129],
            ["2000-06-07", 135],
            ["2000-06-08", 86],
            ["2000-06-09", 73],
            ["2000-06-10", 85],
            ["2000-06-11", 73],
            ["2000-06-12", 68],
            ["2000-06-13", 92],
            ["2000-06-14", 130],
            ["2000-06-15", 245],
            ["2000-06-16", 139],
            ["2000-06-17", 115],
            ["2000-06-18", 111],
            ["2000-06-19", 309],
            ["2000-06-20", 206],
            ["2000-06-21", 137],
            ["2000-06-22", 128],
            ["2000-06-23", 85],
            ["2000-06-24", 94],
            ["2000-06-25", 71],
            ["2000-06-26", 106],
            ["2000-06-27", 84],
            ["2000-06-28", 93],
            ["2000-06-29", 85],
            ["2000-06-30", 73]];

          const dateList = data.map(function (item) {
            return item[0];
          });
          const valueList = data.map(function (item) {
            return item[1];
          });
          let option = {
            // Make gradient line here
            visualMap: [
              {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: 400
              },
              {
                show: false,
                type: 'continuous',
                seriesIndex: 1,
                dimension: 0,
                min: 0,
                max: dateList.length - 1
              }
            ],
            title: [
              {
                left: 'center',
                text: 'Gradient along the y axis'
              },
              {
                top: '50%',
                left: 'center',
                text: 'Gradient along the x axis'
              }
            ],
            tooltip: {
              trigger: 'axis'
            },
            xAxis: [
              {
                data: dateList
              },
              {
                data: dateList,
                gridIndex: 1
              }
            ],
            yAxis: [
              {},
              {
                gridIndex: 1
              }
            ],
            grid: [
              {
                bottom: '60%'
              },
              {
                top: '60%'
              }
            ],
            series: [
              {
                type: 'line',
                showSymbol: false,
                data: valueList
              },
              {
                type: 'line',
                showSymbol: false,
                data: valueList,
                xAxisIndex: 1,
                yAxisIndex: 1
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
