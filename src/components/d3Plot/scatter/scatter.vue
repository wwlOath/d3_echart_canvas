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

        if (dataOrigin == null || dataOrigin.length == 0) {
          return
        }

        // 获取配置
        const config = {
          id: "body",
          x: "x",
          y: "", //存储和柱状图无关的列名
          xLabel: "",
          yLabel: "",
          title: '',
          circleColor: null,
          legendBy:null, //因为是柱状图，所以只考虑离散的颜色，@todo后期可以根据需要扩展，字段如果是数值则legend自动为连续的，否则为离散的,
          legendColorRange:["#00f","#f00"],
          sizeBy:null, //圆点大小
          barPadding: 0.15,
          margins: {top: 50, left: 90, bottom: 50, right: 10},
          tickShowGrid: [60, 120, 180],
          sort: null, //desc asc null是否按照整体高度排序
          toolTipFormat: "{name}\n{value}",
          rotateX:false
        }
        Object.assign(config, {}, this.config);

        const chart = new Chart(config);
        config["circleColor"] = chart.getScaleColor()(0)


        /* ----------------------------配置参数------------------------  */

        chart.id(config.id)
        chart.margins(config.margins);


        // ------------------ 数据格式转换及排序 - --------------------------
        let data = [];
        let yKeys = [];
        let legendKeys = []
        let xMax = 0;
        let sizeMin = Infinity
        let sizeMax = - Infinity

        dataOrigin.forEach((d, i) => {
          if(config["legendBy"] && legendKeys.indexOf(d[config["legendBy"]]) == -1){
            legendKeys.push(d[config["legendBy"]])
          }
          if(config["sizeBy"]){
            d[config["sizeBy"]] =  +d[config["sizeBy"]]
            if(sizeMin > d[config["sizeBy"]]) {
              sizeMin = d[config["sizeBy"]]
            }
            if(sizeMax < d[config["sizeBy"]]){
              sizeMax =  d[config["sizeBy"]]
            }
          }
          d[config['x']] = +d[config['x']]
          data.push(d)
          yKeys.push(d[config['y']])
          if (xMax < d[config['x']]) {
            xMax = d[config['x']]
          }
        })
        if (config.sort) {
          data.sort((a, b) => {
            if (config.sort == "desc") {
              return b[config['x']] - a[config['x']];
            } else {
              return a[config['x']] - b[config['x']];
            }
          })
          yKeys = []
          data.forEach(d => yKeys.push(d[config["y"]]))
        }

        /* ----------------------------尺度转换------------------------  */
        chart.scaleX = d3.scaleLinear()
            .domain([0, xMax])
            .range([0, chart.getBodyWidth()])

        chart.scaleY = d3.scaleBand()
            .domain(yKeys) //决定了坐标位置
            .range([chart.getBodyHeight(), 0])
            .padding(config.barPadding);


        //在此判断使用离散的还是连续的legend color bar
        let legendType = "scatter";
        if(legendKeys.length > 0){
          if(typeof legendKeys[0] == "number"){
            legendType = "continuous";
            chart.scaleLegendColor = d3.scaleLinear()
                .domain(d3.extent(legendKeys))
                .range(config["legendColorRange"])
          }else{
            chart.scaleLegendColor = chart.getScaleColor().domain(legendKeys)
          }
        }
        if(config["sizeBy"]){
          chart.scaleCircleSize = d3.scaleLinear().domain([sizeMin, sizeMax]).range([5, 12])
        }

        /* ----------------------------渲染柱形------------------------  */
        chart.renderCircles = function () {
          chart.body().selectAll('circle')
              .data(data)
              .join("circle")
              .classed('circle_size', true)
              .attr("cx",  (d) => chart.scaleX(d[config["x"]]))
              .attr("cy",  (d) => chart.scaleY(d[config["y"]]))
              .attr("r", d=> config["sizeBy"]?chart.scaleCircleSize(d[config["sizeBy"]]):10)
              .style("fill", d=>{
                if(config['legendBy']){
                  return chart.scaleLegendColor(d[config['legendBy']])
                }else{
                  return config["circleColor"]
                }}
              )
              .style('opacity',0.8)
              .style('cursor', 'pointer');
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
              .call(d3.axisLeft(chart.scaleY))
              .selectAll("text")
              .text(d=> d.toString().ellipsis(Math.ceil(chart.bodyX())/6.7));
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
                .attr('x', chart.getBodyWidth() / 2)
                .attr('y', 10)
                .attr('fill', '#333')
                .style('font-size', '12px')
                .attr('dy', 30)
                .text(config["xLabel"])
                .style('text-anchor', 'middle')

          }
          if (config["yLabel"]) {
            chart.svg().select('.yAxis').append('text')
                .attr('class', 'axisText')
                .attr('x', -chart.getBodyHeight()/2)
                .attr('y', 0)
                .attr('fill', '#333')
                .style('font-size', '12px')
                .attr('transform', 'rotate(-90)')
                .attr('dy', -chart.bodyX() + 10)
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
                      .style('stroke', '#ddd')
                      .attr('x1', 0)
                      .attr('y1', 0)
                      .attr('x2', chart.getBodyWidth())
                      .attr('y2', 0)
                      .attr('fill', 'none')
                      .style('shape-rendering', 'crispEdges')
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
              .attr('dy', '1em')
              .text(config.title)
              .attr('fill', '#252f40')
              .style('text-anchor', 'middle')
        }

        /* ----------------------------绑定鼠标交互事件------------------------  */
        chart.addMouseOn = function () {
          chart.svg().selectAll('circle')
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
                    .style('stroke', 'none');
                chart.toggleToolTip(e, null)

              })
        }
        chart.renderLegend = function () {
          if(legendType == "scatter"){
            //离散的legend
            chart.svg().append("g")
                .selectAll("g")
                .data(legendKeys)
                .join("g")
                .attr("transform", (d, i) => {
                  const y = chart.margins().top + i*20
                  const x = chart.margins().left + chart.getBodyWidth() + 5
                  return `translate(${x},${y})`
                })
                .call(g => g.append("rect")
                    .attr("width", 14)
                    .attr("height", 14)
                    .attr("fill", d => chart.scaleLegendColor(d)))
                .call(g => g.append("text")
                    .attr("x", 20)
                    .attr("y", 4)
                    .attr("dy", "0.35em")
                    .attr("fill", d => chart.scaleLegendColor(d))
                    .text(d => d)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .style("font-size", "0.7rem")
                    .style("text-overflow","ellipsis"))
          }else{
            let legend = chart.svg().append("g").classed('legend_colorbar', true).attr("transform", (d, i) => {
              const y = chart.margins().top
              const x = chart.margins().left + chart.getBodyWidth() + 15
              return `translate(${x},${y})`
            })
            legend.append('defs').append('linearGradient')
                .attr('id', 'linear-gradient')
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "0%")
                .attr("y2", "0%") //垂直legend
                .selectAll("stop")
                .data(config["legendColorRange"])
                .join("stop")
                .attr("offset", (d,i)=> i*100/(config["legendColorRange"].length -1) +"%")
                .attr("stop-color", d=>d);

            legend.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .style("text-anchor", "left")
                .text(config["legendBy"])
                .style('font-size', '12px');
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 19)
                .attr("width", 15)
                .attr("height", 101)
                .style("fill", "url(#linear-gradient)");

            let xLeg = d3.scaleLinear().domain([0,chart.scaleLegendColor.domain()[1]]).range([100, 0]); //legend height
            let axisLeg = d3.axisRight(xLeg).ticks(4).tickFormat( d3.format('.5f'))
            legend.append("g").attr("transform", "translate(15, 19)")
                .call(axisLeg);
          }
        }

        chart.render = function () {
          if(config["legendBy"]){
            chart.renderLegend()
          }
          chart.renderAxis();
          chart.renderText();
          chart.renderGrid();
          chart.renderCircles();
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
