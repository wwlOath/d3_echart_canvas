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
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: { interval: 0, rotate: 30 }//设置旋转角度
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                //showBackground: true, //是否显示背景色
                backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
                }
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
