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

          axios.get('../../../../static/file/webkit-dep.json').then(res => {
            myChart.hideLoading();
            let webkitDep = res.data;
            let option = {
              legend: {
                data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
              },
              series: [
                {
                  type: 'graph',
                  layout: 'force',
                  animation: false,
                  label: {
                    position: 'right',
                    formatter: '{b}'
                  },
                  draggable: true,
                  data: webkitDep.nodes.map(function (node, idx) {
                    node.id = idx;
                    return node;
                  }),
                  categories: webkitDep.categories,
                  force: {
                    edgeLength: 2,
                    repulsion: 8,
                    gravity: 0.2
                  },
                  edges: webkitDep.links
                }
              ]
            };
            myChart.setOption(option);
          })

          window.addEventListener('resize', () => {myChart.resize()});
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
