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
            title: {
              text: 'World Population'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
            },
            /*
              xAxis与yAxis互换生成对应的横bar或者纵bar
              xAxis为value，yAxis为category -- 横bar
              xAsis为category，yAxis为value -- 纵bar
            */
            series: [
              {
                name: '2011',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
              },
              {
                name: '2012',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
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
