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
              text: 'Basic Radar Chart'
            },
            legend: {
              data: ['Allocated Budget', 'Actual Spending'],
              orient: 'vertical',
              right: 10,
            },
            radar: {
              // shape: 'circle',
              indicator: [
                { name: 'Sales', max: 6500 },
                { name: 'Administration', max: 16000 },
                { name: 'Information Technology', max: 30000 },
                { name: 'Customer Support', max: 38000 },
                { name: 'Development', max: 52000 },
                { name: 'Marketing', max: 25000 }
              ]
            },
            series: [
              {
                name: 'Budget vs spending',
                type: 'radar',
                emphasis: {
                  lineStyle: {
                    width: 4
                  }
                },
                data: [
                  {
                    value: [4200, 3000, 20000, 35000, 50000, 18000],
                    name: 'Allocated Budget',
                    /*lineStyle: { //线条类型
                      type: 'dashed'
                    },
                    areaStyle: { //面积背景色
                      color: '#0ff'
                    }*/
                  },
                  {
                    value: [5000, 14000, 28000, 26000, 42000, 21000],
                    name: 'Actual Spending'
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
