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
        let data = this.dataFormatter;
        if (data == null || data.length === 0) {
          return
        }

        // 获取配置
        const config = {
          id: "body",
          name: "name",
          value: "value",
          title: '',
          innerRadius: 0,
          outerRadius: 100,
          textOffsetH: 10,
          animateDuration: 200,
          margins: {top: 60, left: 20, bottom: 30, right: 40},
          showLegend: false,
          toolTipFormat: "{name}\n{value} ({percent})"
        }

        Object.assign(config, this.config)
        /* ----------------------------配置参数------------------------  */


        const chart = new Chart(config);
        chart.id(config.id)
        chart.margins(config.margins);

        let tmpR = (chart.getBodyWidth() / 2.8) - 20
        config["outerRadius"] = tmpR>85? 85: tmpR

        /* ----------------------------尺度转换------------------------  */
        let XKeys = []
        let sumCount = 0
        let dataMap = {}
        data.forEach(d=>{
          d[config["value"]] = +d[config["value"]]
          sumCount += d[config["value"]]
          dataMap[d[config["name"]]] = d
          XKeys.push(d[config["name"]])
        })

        chart.arcAngle = d3.pie()
            .value(d => dataMap[d][config["value"]]);

        let colorScale = chart.getScaleColor().domain(XKeys.sort())

        /* ----------------------------渲染扇形------------------------  */
        const arc = d3.arc()
            .outerRadius(config.outerRadius)
            .innerRadius(config.innerRadius);

        chart.renderSlices = function () {
          chart.body().append('g')
              .classed('pie', true)
              .attr('transform', 'translate(' + (config.showLegend?(chart.getBodyWidth() - config["outerRadius"] -15):chart.getBodyWidth()/2) + ',' + (config["outerRadius"]) + ')')
              .selectAll('.arc')
              .data(chart.arcAngle(XKeys.sort()))
              .join('path')
              .attr('class', (d, i) => 'arc arc-' + i)
              .attr('fill', d => colorScale(d.data))
              .attr('cursor', 'pointer')
              .attr("d", arc)
          //.transition()
          //.attrTween("d",arcTween) //过渡动画

          function arcTween(d) {
            let currentArc = this._current;

            if (!currentArc) {
              currentArc = {startAngle: 0, endAngle: 0};
            }

            const interpolate = d3.interpolate(currentArc, d);
            this._current = interpolate(1);   //当饼图更新时，从当前角度过渡到新角度

            return function (t) {
              return arc(interpolate(t));
            }
          }
        }

        /* ----------------------------渲染图标题------------------------  */
        chart.renderTitle = function () {
          chart.svg().append('text')
              .classed('title', true)
              .attr('x', chart.width() / 2)
              .attr('y', 0)
              .attr('dy', '2em')
              .text(config.title)
              .attr('fill', 'gary')
              .attr('text-anchor', 'middle')
        }

        chart.renderLegend = function () {
          chart.svg().append("g")
              .selectAll("g")
              .data(XKeys.sort())
              .join("g")
              .attr("transform", (d, i) => {
                const y = chart.margins().top + i*20
                const x = chart.margins().left
                return `translate(${x},${y})`
              })
              .call(g => g.append("rect")
                  .attr("width", 14)
                  .attr("height", 14)
                  .attr("fill", d => colorScale(d)))
              .call(g => g.append("text")
                  .attr("x", 20)
                  .attr("y", 4)
                  .attr("dy", "0.35em")
                  .attr("fill", d => colorScale(d))
                  .text(d => d)
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle")
                  .style("font-size", "0.7rem")
                  .style("text-overflow","ellipsis"))

        }

        /* ----------------------------绑定鼠标交互事件------------------------  */
        chart.addMouseOn = function () {

          const arcLarger = d3.arc()
              .outerRadius(config.outerRadius + 10)
              .innerRadius(config.innerRadius);

          const arcNormal = d3.arc()
              .outerRadius(config.outerRadius)
              .innerRadius(config.innerRadius);


          chart.svg().selectAll('.arc')
              .on('mouseover touchstart', function (e, d) {
                d3.select(e.target)
                    .transition().duration(300)
                    .attr('d', arcLarger(d));
                if(typeof( config["toolTipFormat"]) == "function"){
                  chart.toggleToolTip(e, config["toolTipFormat"]({
                    percent: (d.value * 100 / sumCount).toFixed(2) + "%",
                    ...dataMap[d.data]
                  },chart))
                }else{
                  chart.toggleToolTip(e,
                      config.toolTipFormat.formatUnicorn({
                        percent: (d.value * 100 / sumCount).toFixed(2) + "%",
                        ...dataMap[d.data]
                      }))
                }

              })
              .on('mousemove touchmove', function (e) {
                chart.moveToolTip(e)
              })
              .on('mouseleave touchend', function (e, d) {
                d3.select(e.target)
                    .transition().duration(300)
                    .attr('d', arcNormal(d));
                chart.toggleToolTip(e,null)
              })
        }

        chart.render = function () {
          chart.renderTitle();
          if (config.showLegend) {
            chart.renderLegend()
          }
          chart.renderSlices();
          chart.addMouseOn();

        }
        chart.renderChart();
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
