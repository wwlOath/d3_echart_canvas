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
              text: 'Funnel'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            toolbox: {
              feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
              }
            },
            legend: {
              data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
            },
            series: [
              {
                name: 'Expected',
                type: 'funnel',
                left: '10%',
                width: '80%',
                label: {
                  formatter: '{b}Expected'
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  opacity: 0.7
                },
                emphasis: {
                  label: {
                    position: 'inside',
                    formatter: '{b}Expected: {c}%'
                  }
                },
                data: [
                  { value: 60, name: 'Visit' },
                  { value: 40, name: 'Inquiry' },
                  { value: 20, name: 'Order' },
                  { value: 80, name: 'Click' },
                  { value: 100, name: 'Show' }
                ]
              },
              {
                name: 'Actual',
                type: 'funnel',
                left: '10%',
                width: '80%',
                maxSize: '80%',
                label: {
                  position: 'inside',
                  formatter: '{c}%',
                  color: '#fff'
                },
                itemStyle: {
                  opacity: 0.5,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                emphasis: {
                  label: {
                    position: 'inside',
                    formatter: '{b}Actual: {c}%'
                  }
                },
                data: [
                  { value: 30, name: 'Visit' },
                  { value: 10, name: 'Inquiry' },
                  { value: 5, name: 'Order' },
                  { value: 50, name: 'Click' },
                  { value: 80, name: 'Show' }
                ],
                // Ensure outer shape will not be over inner shape when hover.
                z: 100
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
