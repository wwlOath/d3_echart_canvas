<template>
  <div>
    <div id="chart" ref="chart" style="width: 100%;height: 400px"></div>
  </div>
</template>

<style lang="less">

</style>

<script>
  import axios from 'axios';

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

          // http://gallery.echartsjs.com/explore.html?u=bd-16906679
          // http://gallery.echartsjs.com/editor.html?c=xHJw-hVqjW
          axios.get('../../../../static/file/house-price-area2.json').then(res => {
            var option = {
              title: {
                text: 'Dispersion of house price based on the area',
                left: 'center',
                top: 0
              },
              visualMap: {
                min: 15202,
                max: 159980,
                dimension: 1,
                orient: 'vertical',
                right: 0,
                top: 'center',
                text: ['HIGH', 'LOW'],
                calculable: true,
                inRange: {
                  color: ['#f2c31a', '#24b7f2']
                }
              },
              tooltip: {
                trigger: 'item',
                axisPointer: {
                  type: 'cross'
                }
              },
              xAxis: [
                {
                  type: 'value'
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              dataZoom: [
                {
                  type: 'inside'
                },
                {
                  type: 'inside',
                  orient: 'vertical'
                },
              ],
              series: [
                {
                  name: 'price-area',
                  type: 'scatter',
                  symbolSize: 5,
                  data: res.data
                }
              ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', () => {myChart.resize()});
          })
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
