<template>
  <div>
    <div id="chart" ref="chart" style="width: 100%;height: 600px"></div>
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
          axios.get('../../../../static/file/energy.json').then(res => {
            myChart.hideLoading();
            let data = res.data;
            let option = {
              title: {
                text: 'Node Align Left'
              },
              tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
              },
              animation: false,
              series: [
                {
                  type: 'sankey',
                  emphasis: {
                    focus: 'adjacency'
                  },
                  nodeAlign: 'right',
                  data: data.nodes,
                  links: data.links,
                  lineStyle: {
                    color: 'source',
                    curveness: 0.5
                  }
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
