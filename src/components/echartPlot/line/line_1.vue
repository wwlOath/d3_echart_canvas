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
    props: {
      lineData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

      }
    },
    methods: {
      getData() {
        let dom = this.$refs.chart;
        if(dom) {
          let myChart = this.$echarts.init(dom);
          let series = [];
          let legends = [];

          this.lineData.data.forEach((d) => {
            series.push({
              name: d.legend,
              type: 'line',
              stack: 'Total',
              data: d.y,
              //step: 'start', middle end //梯形折线图
            });
            legends.push(d.legend);
          })

          let option = {
            title: {
              text: 'Stacked Line',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: legends,
              top: '10%',
              left: 'center'
            },
            grid: {
              top: '23%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.lineData.axisX
            },
            yAxis: {
              type: 'value'
            },
            series: series
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
