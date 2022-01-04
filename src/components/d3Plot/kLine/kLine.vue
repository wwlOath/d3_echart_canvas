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
        let data = this.dataFormatter;
        if (data == null || data.length == 0) {
          return
        }
        // 获取配置
        const config = {
          id: "body",
          toolTipFormat: "Survival estimate: {y} <br> Interval of last follow-up: {x} {timeUnit} <br> 95% upper confidence interval: {upperCi} <br> 95% lower confidence interval: {lowerCi}",
          title:"",
          xLabel: 'Duration ',
          yLabel: 'Survival Rate',
          margins: {
            top: 10,
            right: 20,
            bottom: 40,
            left: 60,
          },
          shouldShowConfidenceIntervals: true,
          confidenceAreaOpacity: 0.2,
        }
        Object.assign(config, {}, this.config);
        const chart = new Chart(config);
        /* ----------------------------配置参数------------------------  */

        chart.id(config.id)
        chart.margins(config.margins);


        // ------------------ 数据格式转换及排序 - --------------------------
        let xMax =  -Infinity
        data["data"].forEach(d => {
          if(xMax < d["time"][d["time"].length -1]){
            xMax =  d["time"][d["time"].length -1]
          }
          if(isNaN(Number(d["ciLower"][d["ciLower"].length -1]))){
            d["ciLower"][d["ciLower"].length -1] = d["survivalEstimate"][d["ciLower"].length -1]
            d["ciUpper"][d["ciUpper"].length -1] = d["survivalEstimate"][d["ciUpper"].length -1]
          }
        })
        /* ----------------------------尺度转换------------------------  */

        chart.scaleX = d3.scaleLinear()
            .domain([0,xMax]) //决定了坐标位置
            .range([0, chart.getBodyWidth()])

        chart.scaleY = d3.scaleLinear()
            .domain([0, 1])
            .range([chart.getBodyHeight(), 0])


        /* ----------------------------渲染柱形------------------------  */
        chart.renderSurvival = function () {
          let legend = d3.select(config["id"])
              .append("ul")
              .style("display","flex")
              .style("justify-content","center")
              .style("list-style","none")
              .style("flex-direction","column")
              .style("left",0)
              .style("right",0)
              .style("text-align","center")

          let title = d3.select(config["id"]).insert("div","svg").style("text-align","center")

          let tStr = `${data["meta"]["survivalType"]} on ${data["meta"]["marker"]} ${data["meta"]["event"]} - ${data["meta"]["dataName"]}`
          title.append("a")
              .attr("title", data["meta"]["dataName"])
              .style("font-size","0.9rem")
              .text(tStr.toString().ellipsis(Math.ceil(chart.getBodyWidth())/6.7))
          title.append("div").append("span")
              .style("font-size","0.8rem")
              .text("Log-Rank Test P-Value = " + data["meta"]["pvalue"])

          data["data"].forEach( (d,i) => {
            let color = chart.getScaleColor()(i+1)
            chart.body().append('path')
                .attr('class', 'line')
                .attr('stroke', color)
                .attr('d', d3.area()
                    .x(m=>chart.scaleX(m))
                    .y((m,mi) => chart.scaleY(d["survivalEstimate"][mi]))
                    .curve(d3.curveStepBefore)(d["time"]))
            // Draw the confidence interval
            if(config["shouldShowConfidenceIntervals"]){
              chart.body().append('path')
                  .attr('class', 'area confidence')
                  .attr('fill', color)
                  .attr('fill-opacity', config["confidenceAreaOpacity"])
                  .attr('pointer-events', 'none')
                  .attr('d',  d3.area()
                      .x(m => chart.scaleX(m))
                      .y0((m,mi) => chart.scaleY(d["ciLower"][mi]))
                      .y1((m,mi) => chart.scaleY(d["ciUpper"][mi]))
                      .curve(d3.curveStepAfter)(d["time"]))
            }
            // Draw the data points as cross
            let status = []
            d["status"].forEach((s,ind) =>{
              if(!s){
                status.push({cate:i,index:ind})
              }
            })

            chart.body().append('g')
                .selectAll("line")
                .data(status)
                .join("line")
                .attr('class', 'line-cross')
                .attr('x1', c => chart.scaleX(d["time"][c.index]))
                .attr('y1', c => chart.scaleY(d["survivalEstimate"][c.index]) + 5)
                .attr('x2', c => chart.scaleX(d["time"][c.index]))
                .attr('y2', c => chart.scaleY(d["survivalEstimate"][c.index]) - 5 )
                .attr('stroke',  color)
                .style('cursor','pointer')

            // add legend
            legend.append("li")
                .html(`<span><em>S</em><sub>${i}</sub></span> (N = <span style="font-weight: 400; color: inherit;">${data["group"][i]["n"]}</span>) - ${data["meta"]["marker"]} ${data["meta"]["event"]} - ${data["group"][i]["type"]} `)
                .style("color",color)
                .style("font-size","0.75rem")
                .style("line-height",1.6)
                .style("user-select","none")
          })

        }

        /* ----------------------------渲染坐标轴------------------------  */

        chart.renderAxis = function () {
          // x axis
          let x = chart.svg().insert('g', '.body')
              .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
              .attr('class', 'xAxis')
              .call(d3.axisBottom(chart.scaleX));
          x.selectAll("text")
              .attr("text-anchor", "middle")
              .attr("dx", 0)
              .attr("dy", 10);

          // y axis
          chart.svg().insert('g', '.body')
              .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
              .attr('class', 'yAxis')
              .call(d3.axisLeft(chart.scaleY));
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
                .attr('dy', 30)
                .text(config["xLabel"]+ "("+data["meta"]["timeUnit"]+")")
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
          chart.svg().selectAll('.line-cross')
              .on('mouseover touchstart', function (e, d) {
                chart.toggleToolTip(e, config["toolTipFormat"].formatUnicorn({
                  x: data["data"][d["cate"]]["time"][d["index"]],
                  y: data["data"][d["cate"]]["survivalEstimate"][d["index"]],
                  timeUnit: data["meta"]["timeUnit"],
                  upperCi:data["data"][d["cate"]]["ciUpper"][d["index"]],
                  lowerCi:data["data"][d["cate"]]["ciLower"][d["index"]]
                }))
              })
              .on('mousemove touchmove', function (e, d) {
                chart.moveToolTip(e)
              })
              .on('mouseleave touchend', function (e) {
                chart.toggleToolTip(e,null)
              })
        }

        chart.render = function () {
          chart.renderAxis();
          chart.renderText();
          chart.renderSurvival();
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
