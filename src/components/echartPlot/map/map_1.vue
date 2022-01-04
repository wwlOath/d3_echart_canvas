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

          axios.get('../../../../static/file/Veins_Medical_Diagram_clip_art.svg').then(res => {
            let svg = res.data;
            this.$echarts.registerMap('organ_diagram', { svg: svg });
            let option = {
              tooltip: {},
              geo: {
                left: 10,
                right: '50%',
                map: 'organ_diagram',
                selectedMode: 'multiple',
                emphasis: {
                  focus: 'self',
                  itemStyle: {
                    color: null
                  },
                  label: {
                    position: 'bottom',
                    distance: 0,
                    textBorderColor: '#fff',
                    textBorderWidth: 2
                  }
                },
                blur: {},
                select: {
                  itemStyle: {
                    color: '#b50205'
                  },
                  label: {
                    show: false,
                    textBorderColor: '#fff',
                    textBorderWidth: 2
                  }
                }
              },
              grid: {
                left: '60%',
                top: '20%',
                bottom: '20%'
              },
              xAxis: {},
              yAxis: {
                data: [
                  'heart',
                  'large-intestine',
                  'small-intestine',
                  'spleen',
                  'kidney',
                  'lung',
                  'liver'
                ]
              },
              series: [
                {
                  type: 'bar',
                  emphasis: {
                    focus: 'self'
                  },
                  data: [121, 321, 141, 52, 198, 289, 139]
                }
              ]
            };
            myChart.setOption(option);

            /*
            *通过地图区域的鼠标悬停事件，用dispatchAction触发器官对应的tooltip
             dispatchAction的seriesIndex必须加上
            *  */
            myChart.on('mouseover', { seriesIndex: 0 }, function (event) {
              myChart.dispatchAction({
                type: 'highlight',
                geoIndex: 0,
                name: event.name
              });
            });
            myChart.on('mouseout', { seriesIndex: 0 }, function (event) {
              myChart.dispatchAction({
                type: 'downplay',
                geoIndex: 0,
                name: event.name
              });
            });

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
