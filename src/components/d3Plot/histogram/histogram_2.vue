<template>
  <div>
    <div></div>
  </div>
</template>

<style lang="less">
  @import '../common.css';
</style>

<script>
  import * as d3 from "d3";
  import Chart from "../chart";
  let formatUnicorn = require('format-unicorn/safe');

  export default {
    name: '',
    data() {
      return {

      }
    },
    props: {
      dataFormatter: {
        type: Array,
        required: true
      },
      config: {
        type: Object,
        required: true
      }
    },
    methods: {
      getData() {
        let dataOrigin = this.dataFormatter;
        const config = {
          id: "body",
          x: "x",
          y: "", //存储和柱状图无关的列名
          xLabel: "",
          yLabel: "",
          title: '',
          barColor: null,
          barPadding: 0.15,
          margins: {top: 40, left: 50, bottom: 70, right: 40},
          tickShowGrid: [60, 120, 180],
          sort: null, //desc asc null是否按照整体高度排序
          toolTipFormat: "{name}\n{value}",
          rotateX:false
        }
        const chart = new Chart(config);
        Object.assign(config, {}, this.config);

        config["barColor"] = chart.getScaleColor()(0)
        /* ----------------------------配置参数------------------------  */

        chart.id(config.id)
        chart.margins(config.margins);

        // ------------------ 数据格式转换及排序 - --------------------------
        let data = [];
        let XKeys = [];
        let yMax = 0;
        dataOrigin.forEach((d, i) => {
          d[config['y']] = +d[config['y']];
          data.push(d)
          XKeys.push(d[config['x']])
          if (yMax < d[config['y']]) {
            yMax = d[config['y']]
          }
        })
        if (config.sort){
          data.sort((a, b) => {
            if (config.sort == "desc") {
              return b[config['y']] - a[config['y']];
            } else {
              return a[config['y']] - b[config['y']];
            }
          })
          XKeys = []
          data.forEach(d => XKeys.push(d[config["x"]]))
        }
        /* ----------------------------尺度转换------------------------  */

        chart.scaleX = d3.scaleBand()
            .domain(XKeys) //决定了坐标位置
            .range([0, chart.getBodyWidth()])
            .padding(config.barPadding);

        chart.scaleY = d3.scaleLinear()
            .domain([0, yMax])
            .range([chart.getBodyHeight(), 0])

        /* ----------------------------渲染柱形------------------------  */
        chart.renderBars = function () {
          chart.body().selectAll('rect')
              .data(data)
              .join('rect')
              .classed('bar', true)
              .attr('x', (d) => chart.scaleX(d[config["x"]]))
              .attr('y', chart.scaleY(0))
              .attr('width', chart.scaleX.bandwidth())
              .attr('height', 0)
              .attr('fill', config.barColor)
              .style('cursor','pointer')
              .transition(350)
              .attr('height', (d) => chart.getBodyHeight() - chart.scaleY(d[config["y"]]))
              .attr('y', (d) => chart.scaleY(d[config["y"]]))
        }

        /* ----------------------------渲染坐标轴------------------------  */
        chart.renderX = function () {
          let X = chart.svg().insert('g', '.body')
              .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
              .attr('class', 'xAxis')
              .call(d3.axisBottom(chart.scaleX))
              .selectAll("text");
          if(config["rotateX"]){
            X.attr("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
          }else{
            X.attr("text-anchor", "middle")
                .attr("dx", 0)
                .attr("dy", 10)
          }

        }

        chart.renderY = function () {
          chart.svg().insert('g', '.body')
              .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
              .attr('class', 'yAxis')
              .call(d3.axisLeft(chart.scaleY));
        }

        chart.renderAxis = function () {
          chart.renderX();
          chart.renderY();
        }

        /* ----------------------------渲染文本标签------------------------  */
        chart.renderText = function () {
          if (config["xLabel"]) {
            chart.svg().select('.xAxis').append('text')
                .attr('class', 'axisText')
                .attr('x', chart.getBodyWidth()/2)
                .attr('y', 10)
                .attr('fill', '#333')
                .style('font-size', '12px')
                .attr('dy', 60)
                .text(config["xLabel"])
                .attr('text-anchor', 'middle')

          }
          if (config["yLabel"]) {
            chart.svg().select('.yAxis').append('text')
                .attr('class', 'axisText')
                .attr('x', - chart.getBodyHeight()/2)
                .attr('y', 10)
                .attr('fill', '#333')
                .style('font-size', '12px')
                .attr('transform', 'rotate(-90)')
                .attr('dy', -40)
                .attr('text-anchor', 'middle')
                .text(config["yLabel"])

          }
        }

        /* ----------------------------渲染网格线------------------------  */
        chart.renderGrid = function () {
          chart.svg().selectAll('.yAxis .tick')
              .each(function (d) {
                if (config.tickShowGrid.indexOf(d) > -1) {
                  d3.select(this).append('line')
                      .attr('class', 'grid')
                      .attr('stroke', '#ddd')
                      .attr('x1', 0)
                      .attr('y1', 0)
                      .attr('x2', chart.getBodyWidth())
                      .attr('y2', 0)
                      .attr('fill', 'none')
                      .attr('shape-rendering', 'crispEdges')
                      .style('stroke-width', '1px')
                }
              });
        }

        /* ----------------------------渲染图标题------------------------  */
        chart.renderTitle = function () {
          chart.svg().append('text')
              .classed('title', true)
              .attr('x', chart.width() / 2)
              .attr('y', 0)
              .attr('dy', '2em')
              .text(config.title)
              .attr('fill', '#252f40')
              .attr('text-anchor', 'middle')
        }

        /* ----------------------------绑定鼠标交互事件------------------------  */
        chart.addMouseOn = function () {
          chart.svg().selectAll('.bar')
              .on('mouseover touchstart', function (e, d) {
                chart.svg()
                    .selectAll('.bar')
                    .transition(300)
                    .style('opacity', 0.65)

                d3.select(e.target)
                    .attr('stroke', '#283e5d')
                    .transition(300)
                    .style('opacity', 1)
                if(typeof( config["toolTipFormat"]) == "function"){
                  chart.toggleToolTip(e, config["toolTipFormat"](d,chart))
                }else{
                  let tooltip = formatUnicorn(config["toolTipFormat"], { x: d.x, y: d.y,v: d.v })
                  chart.toggleToolTip(e, tooltip)
                }

              })
              .on('mousemove touchmove', function (e, d) {
                chart.moveToolTip(e)
              })
              .on('mouseleave touchend', function (e) {
                chart.svg().selectAll('.bar')
                    .transition(300)
                    .style('opacity', 1)

                d3.select(e.target)
                    .style('stroke', 'none');
                chart.toggleToolTip(e,null)

              })
        }

        chart.render = function () {
          chart.renderAxis();
          chart.renderText();
          chart.renderGrid();
          chart.renderBars();
          chart.addMouseOn();
          chart.renderTitle();
        }

        chart.renderChart();
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
