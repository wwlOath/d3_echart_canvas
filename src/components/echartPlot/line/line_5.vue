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
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            tooltip: {
              trigger: 'axis'
            },
            series: [
              {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
                //smooth: true //折线是否平滑
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
