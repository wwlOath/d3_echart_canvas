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
            tooltip: {
              formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
              {
                name: 'Pressure',
                type: 'gauge',
                progress: {
                  show: true
                },
                detail: {
                  valueAnimation: true,
                  formatter: '{value}'
                },
                data: [
                  {
                    value: 50,
                    name: 'SCORE'
                  }
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
