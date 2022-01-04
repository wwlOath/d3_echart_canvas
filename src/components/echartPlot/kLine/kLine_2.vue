<template>
  <div>
    <div id="chart" ref="chart" style="width: 100%;height: 400px"></div>
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
            xAxis: {
              data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
            },
            yAxis: {},
            series: [
              {
                type: 'candlestick',
                data: [
                  [20, 34, 10, 38],
                  [40, 35, 30, 50],
                  [31, 38, 33, 44],
                  [38, 15, 5, 42]
                ]
              }
            ]
          };

          myChart.setOption(option);
          window.addEventListener('resize', () => {myChart.resize()});
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
