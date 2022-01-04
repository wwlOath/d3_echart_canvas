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

          myChart.showLoading();
          axios.get('../../../../static/file/les-miserables.json').then(res => {
            myChart.hideLoading();
            let graph = res.data;
            let option = {
              tooltip: {},
              legend: [
                {
                  data: graph.categories.map(function (a) {
                    return a.name;
                  })
                }
              ],
              series: [
                {
                  name: 'Les Miserables',
                  type: 'graph',
                  layout: 'none',
                  data: graph.nodes,
                  links: graph.links,
                  categories: graph.categories,
                  roam: true,
                 /* draggable: true,
                  force: {
                    edgeLength: 5,
                    repulsion: 2000,
                    gravity: 0.2
                  },*/
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  },
                  labelLayout: {
                    hideOverlap: true
                  },
                  scaleLimit: {
                    min: 0.4,
                    max: 2
                  },
                  lineStyle: {
                    color: 'source',
                    curveness: 0.3
                  }
                }
              ]
            };
            myChart.setOption(option);
          });

          window.addEventListener('resize', () => {myChart.resize()});
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
