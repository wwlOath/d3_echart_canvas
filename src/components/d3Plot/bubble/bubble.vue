<template>
  <div>

  </div>
</template>

<style lang="less">
  @import '../common.css';
</style>

<script>
  import * as d3 from "d3";
  import Chart from "../chart";

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
        console.log(dataOrigin)
        // 获取配置
        const config = {
          id: "body",
          xLabel: "",
          yLabel: "",
          title: '',
          barPadding: 0.15,
          margins: {top: 40, left: 40, bottom: 50, right: 50},
          tickShowGrid: [60, 120, 180],
          sort: null, //desc asc null是否按照整体高度排序
          _colorScale: null,
          rotate: -65,
          toolTipFormat: "{name}\n{value}",
        }

        Object.assign(config, {}, this.config);

        /* ----------------------------配置参数------------------------  */
        const chart = new Chart(config);

        chart.id(config.id)
        chart.margins(config.margins);

        /* ----------------------------尺度转换------------------------  */

        chart.scaleX = d3.scaleLinear()
            .domain([0, 12000])
            .range([ 0, chart.getBodyWidth()]);

        chart.scaleY = d3.scaleLinear()
            .domain([35, 90])
            .range([ chart.getBodyHeight(), 0]);

        chart.scaleZ = d3.scaleLinear()
            .domain([200000, 1310000000])
            .range([ 4, 40]);

        /* ----------------------------渲染柱形------------------------  */
        chart.renderBars = function () {
          let groups = chart.body().selectAll('.g')
              .data(dataOrigin);

          const myColor = d3.scaleOrdinal()
              .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
              .range(d3.schemeSet2);

          groups.join("circle")
              .attr("class", "bubbles")
              .attr("cx", d => chart.scaleX(d.gdpPercap))
              .attr("cy", d => chart.scaleY(d.lifeExp))
              .attr("r", d => chart.scaleZ(d.pop))
              .style("fill", d => myColor(d.continent))
              .classed('bubble',true);
        }

        /* ----------------------------渲染坐标轴------------------------  */
        chart.renderX = function () {
          chart.svg().append('g', '.body')
              .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
              .attr('class', 'xAxis')
              .call(d3.axisBottom(chart.scaleX))
              .selectAll("text")
              .attr("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", "rotate("+config.rotate+")");

        }

        chart.renderY = function () {
          chart.svg().append('g', '.body')
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
                .attr('x', chart.getBodyWidth())
                .attr('y', 10)
                .attr('fill', 'gray')
                .attr('fontSize', '10px')
                .attr('dy', 30)
                .text(config["xLabel"]);
          }
          if (config["yLabel"]) {
            chart.svg().select('.yAxis').append('text')
                .attr('class', 'axisText')
                .attr('x', 0)
                .attr('y', 10)
                .attr('fill', 'gray')
                .attr('fontSize', '10px')
                .attr('transform', 'rotate(-90)')
                .attr('dy', - config.margins.left )
                .attr('text-anchor', 'end')
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
                      .attr('stroke-width', '1px')
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
          chart.svg().selectAll('.bubble')
              .on('mouseover touchstart', function (e, d) {
                chart.svg()
                    .selectAll('.bubble')
                    .transition(300)
                    .style('opacity', 0.65)

                d3.select(e.target)
                    .attr('stroke', '#283e5d')
                    .transition(300)
                    .style('opacity', 1)

                if(typeof( config["toolTipFormat"]) == "function"){
                  chart.toggleToolTip(e, config["toolTipFormat"](d,chart))
                }else{
                  chart.toggleToolTip(e, config["toolTipFormat"].formatUnicorn(d))
                }

              })
              .on('mousemove touchmove', function (e, d) {
                chart.moveToolTip(e)
              })
              .on('mouseleave touchend', function (e) {
                chart.svg().selectAll('.bubble')
                    .transition(300)
                    .style('opacity', 1)

                d3.select(e.target)
                    .attr('stroke', 'none');
                chart.toggleToolTip(e,null)

              })
        }

        chart.render = function () {
          chart.renderAxis();
          chart.renderText();
          //chart.renderGrid();
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
