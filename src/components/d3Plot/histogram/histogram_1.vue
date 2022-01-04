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
        type: Object,
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
        // 获取配置
        const config = {
          id: "body",
          x: "gene",
          y: "dataset",
          value: "value",//value:[[{"value":1,},{}]]或者value:[[1,3,]] 需要一个子函数确定如何取值
          getSubValue: (d) => d["value"], //如何从子结构中取出要提取的数据，如{"value":1}
          xLabel: "",
          yLabel: "",
          title: '',
          barPadding: 0.15,
          margins: {top: 60, left: 60, bottom: 50, right: 60},
          tickShowGrid: [60, 120, 180],
          sort: null, //desc asc null是否按照整体高度排序
          _colorScale: null,
          rotate:-65,
          toolTipFormat: (d,chart)=>`<b>${d.name}</b> <br><span>${chart._opt.getSubValue(d.data[d.name])} Samples Affected</span>`,
        }

        Object.assign(config, {}, this.config);

        /* ----------------------------配置参数------------------------  */

        // 寻找最大的Y值
        let yMax = 0;

        let data = []
        if (dataOrigin == null || dataOrigin.length == 0) {
          return
        } else {
          for (let i = 0; i < dataOrigin[config["x"]].length; i++) {
            let t = {}
            t[config["x"]] = dataOrigin[config["x"]][i]
            let count = 0;
            for (let j = 0; j < dataOrigin[config["y"]].length; j++) {
              t[dataOrigin[config["y"]][j]] = dataOrigin[config["value"]][i][j]
              count += config.getSubValue(dataOrigin[config["value"]][i][j])
            }
            if (yMax < count) {
              yMax = count
            }
            if (config.sort) {
              t['_total_sum_count'] = count;
            }
            data.push(t)
          }
        }
        let XKeys = dataOrigin[config["x"]]
        if (config.sort) {
          data.sort((a, b) => {
            if (config.sort == "desc") {
              return b['_total_sum_count'] - a['_total_sum_count'];
            } else {
              return a['_total_sum_count'] - b['_total_sum_count'];
            }
          })
          XKeys =[]
          data.forEach(d=>XKeys.push(d[config["x"]]))
        }
        const chart = new Chart(config);

        chart.id(config.id)
        chart.margins(config.margins);

        chart.stack = d3.stack()
            .keys(dataOrigin[config["y"]])
            .value((d,key)=> config.getSubValue(d[key]))
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        chart.stackData = chart.stack(data);
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
          let groups = chart.body().selectAll('.g')
              .data(chart.stackData);

          let colorScale = chart.getScaleColor().domain(dataOrigin[config["y"]].sort())
          if(config._colorScale){
            colorScale = config._colorScale
          }

          let bars = groups.join('g')
              .merge(groups)
              .attr('class', (d) => 'stacked ' + d.key)
              .attr('fill', (d, i) => colorScale(d.key))
              .selectAll('.bar')
              .data((d) => {
                return d.map((item) => {
                  item.index = d.index;
                  item.name = d.key;
                  return item;
                });
              });


          bars.join('rect')
              .attr('class', 'bar')
              .merge(bars)
              .attr('x', (d) => chart.scaleX(d.data[config["x"]]))
              .attr('y', (d) => chart.scaleY(d[0]))
              .attr('width', chart.scaleX.bandwidth())
              .attr('height', 0)
              .style('cursor', 'pointer')
              .attr('stroke', 'none')
              .attr('stroke-width', '2px')
              .transition(200)
              .attr('height', (d) => chart.scaleY(d[0]) - chart.scaleY(d[1]))
              .attr('y', (d) => chart.scaleY(d[1]))
        }

        /* ----------------------------渲染坐标轴------------------------  */
        chart.renderX = function () {
          chart.svg().insert('g', '.body')
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
                  chart.toggleToolTip(e, config["toolTipFormat"].formatUnicorn(d))
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
                    .attr('stroke', 'none');
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
