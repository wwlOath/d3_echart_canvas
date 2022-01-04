<template>
  <div>
    <div id="scatter_container"></div>
  </div>
</template>

<style lang="less">

</style>

<script>
  import axios from 'axios';
  import html2canvas from 'html2canvas';
  import { Chart } from "@antv/g2";

  export default {
    name: '',
    data() {
      return {

      }
    },
    methods: {
      downloadImage(id) {
        //let canvas = document.getElementById(id + '_plotRegion');
        if (id == "tsneExpression") {
          html2canvas(this.$refs.tsneExpressionRef,{
            backgroundColor: '#fff'
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            let link = document.createElement('a');
            link.href = dataURL;
            link.download = "expression_" + this.geneKeyWord + ".png";
            link.click();
          })
        } else {
          html2canvas(this.$refs.tsneSampleRef,{
            backgroundColor: '#fff'
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            let link = document.createElement('a');
            link.href = dataURL;
            link.download = this.name + ".png";
            link.click();
          })
        }
      },
      getTsneDataList() {
        axios.get('../../../../static/_web_total_stat_for_web/umap_2.json').then(res => {
          let data = res.data.points;
          let transformData = [];

          data.forEach((d) => {
            transformData.push({
              cellName: d[2],
              x: d[4],
              y: d[3]
            })
          });

          const chart = new Chart({
            container: 'scatter_container',
            autoFit: true,
            height: 400,
            limitInPlot: true
          });
          // 数据格式： [{"gender":"female","height":161.2,"weight":51.6}]
          chart.data(transformData);
          chart.animate(false);
          chart.scale({
            x: { nice: true },
            y: { nice: true },
          });

          chart.point()
              .position('x*y')
              .color('cellName')
              .shape('circle')
              .style({
                fillOpacity: 0.85
              });

          chart.legend({
            useHtml: true,
            flipPage: true,
            position: 'right',
            /*title: {
              text: '图例可滚动'
            },*/
            'g2-legend-marker': {
              borderRadius: 'none'
            },
            'g2-legend-title': {
              fontSize: '12px',
              fontWeight: 500,
              margin: 0,
              color: '#ff8800'
            }
          });

          chart.interaction('view-zoom');
          chart.interaction('drag-move');

          chart.render();
          // 阻止默认事件，否则会整个窗口滚动
          chart.getCanvas().on('mousewheel', ev=> {ev.preventDefault();})
        })
      },
    },
    mounted() {
      this.getTsneDataList();
    }
  }

</script>
