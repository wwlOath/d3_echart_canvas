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
        const config = {
          margins: {top: 20, left: 60, bottom: 50, right: 20},
          title: '',
          groupColorFunc: null, //如果设置了该函数，从该函数中获取分组的颜色值，否者用颜色比例尺获取
          height: 540,
          bandWidth: 0.3, //box宽度占当前band百分比，实际大小限制在5~100px
          ...this.config
        }

        const chart = new Chart(config);
        chart.margins(config.margins);
        chart.id('#' + this.config.id)

        /* ----------------------------工具函数 --------------------- */
        /**
         *
         * @param sortedValues
         * @returns {{min: null, median: null, max: null, mean: null, lowerOuterFence: null, quartile3: null, upperOuterFence: null, quartile1: null, iqr: null, upperInnerFence: null, lowerInnerFence: null}}
         */
        chart.utilFunc_calcMetrics = function (sortedValues) {
          let metrics = {
            max: sortedValues[sortedValues.length - 1],
            upperOuterFence: null,
            upperInnerFence: null,
            quartile3: d3.quantileSorted(sortedValues, 0.75),
            median: d3.quantileSorted(sortedValues, 0.5),
            mean: d3.mean(sortedValues),
            iqr: null,
            quartile1: d3.quantileSorted(sortedValues, 0.25),
            lowerInnerFence: null,
            lowerOuterFence: null,
            min: sortedValues[0],
          };

          metrics.iqr = metrics.quartile3 - metrics.quartile1;
          //The inner fences are the closest value to the IQR without going past it (assumes sorted lists)
          let LIF = metrics.quartile1 - (1.5 * metrics.iqr);
          let UIF = metrics.quartile3 + (1.5 * metrics.iqr);
          for (let i = 0; i <= sortedValues.length; i++) {
            if (sortedValues[i] < LIF) {
              continue;
            }
            if (!metrics.lowerInnerFence && sortedValues[i] >= LIF) {
              metrics.lowerInnerFence = sortedValues[i];
              continue;
            }
            if (sortedValues[i] > UIF) {
              metrics.upperInnerFence = sortedValues[i - 1];
              break;
            }
          }

          metrics.lowerOuterFence = metrics.quartile1 - (3 * metrics.iqr);
          metrics.upperOuterFence = metrics.quartile3 + (3 * metrics.iqr);
          if (!metrics.lowerInnerFence) {
            metrics.lowerInnerFence = metrics.min;
          }
          if (!metrics.upperInnerFence) {
            metrics.upperInnerFence = metrics.max;
          }
          return metrics
        }

        /**
         * 获取组的颜色
         * @param d
         * @returns {*}
         */
        chart.utilFunc_getGroupColor = function (d) {
          if (config.groupColorFunc) {
            return config.groupColorFunc(d)
          } else {
            return chart.groupColorScale(d)
          }
        }

        /**
         *
         * @returns {{middle: null, left: null, right: null}}
         */
        chart.utilFunc_getBoxBound = function (bandWidthRatio) {
          let boxSize = {left: null, right: null, middle: null, width: null};
          let range = chart.xScale.bandwidth();
          let width = range * bandWidthRatio;
          if (width < 10 && range > 10) {
            width = 10
          } else if (width < 10 && range < 10) {
            width = range * 0.9
          }
          if (width > 100) {
            width = 100
          }
          let padding = (range - width) / 2;
          boxSize.middle = range / 2;
          boxSize.left = padding;
          boxSize.right = padding + width;
          boxSize.width = width
          return boxSize;
        }
        //**** 转换数据 ***************
        const groupObjs = {};
        let min = Infinity;
        let max = -Infinity;
        let groupNames = new Set()
        let groupStats = {} //统计每组的均值
        data.forEach(d => {
          let value = +d["value"]
          if (!isNaN(value)) {
            let group = d["group"] || "~"
            const gName = d["name"] + " " + group
            if (typeof groupObjs[gName] == "undefined") {
              groupObjs[gName] = {values: []}
            }
            groupObjs[gName]["values"].push(value);
            groupObjs[gName]["group"] = group;
            groupNames.add(group)
            if (typeof groupStats[group] == "undefined") {
              groupStats[group] = {}
              groupStats[group]["sum"] = value
              groupStats[group]["count"] =1
            } else {
              groupStats[group]["sum"] += value
              groupStats[group]["count"] += 1
            }

            if (value > max) {
              max = value
            }
            if (value < min) {
              min = value
            }
          }
        })


        /* ----------------------------定义比例尺------------------------  */
        chart.xScale = d3.scaleBand()
            .domain(Object.keys(groupObjs).sort()).range([0, chart.getBodyWidth()]).padding(0.3);
        chart.yScale = d3.scaleLinear().range([chart.getBodyHeight(), 0]).domain([min, max])
        //每组颜色比例尺
        chart.groupColorScale = chart.getScaleColor().domain(Array.from(groupNames))

        /**
         * 准备boxplot和violinplot的格式数据
         */
        let maxBinLength = -Infinity
        Object.values(groupObjs).forEach(v => {
          v["values"] = d3.sort(v["values"])
          v["metrics"] = chart.utilFunc_calcMetrics(v["values"]) //boxplot
          let bins = d3.histogram()
              .thresholds(chart.yScale.ticks(Math.max(Math.round(2 * (v["metrics"].iqr / Math.pow(v["values"].length, 1 / 3))), 50)))
          v["bins"] = bins(v["values"]) //violin plot 提琴图本质是个柱状图
          v["bins"].map(d => {
            if (d.length > maxBinLength) {
              maxBinLength = d.length
            }
          })
        })

        /* ----------------------------渲染box组 --------------------- */
        chart.renderGroup = function () {
          chart.group = chart.body()
              .selectAll("g.group")
              .data(Object.keys(groupObjs))
              .join("g")
              .attr("data-id", d => d)
              .style("cursor", "pointer")
              .attr("transform", d => `translate(${chart.xScale(d)} ,0)`)
              .classed('group', true)
              .style("opacity",0.9)
          ;
        }
        /* ----------------------------渲染坐标轴------------------------  */
        chart.renderAxis = function () {
          chart.axis = chart.body().selectAll("g.axis")
              .data([null])
              .join('g')
              .classed('axis', true)

          chart.axis.append("g")
              .classed('yAxis', true)
              .call(d3.axisLeft(chart.yScale).ticks(10))

          chart.axis.append("g")
              .classed('xAxis', true)
              .attr("transform", "translate(0," + chart.getBodyHeight() + ")")
              .call(d3.axisBottom(chart.xScale))
              .selectAll("text")
              .attr("transform", "rotate(15)")
              .style("text-anchor", "start")
              .style('font-size', '0.7rem')
              .style('color', d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
        }
        /**
         * 渲染盒形图
         */
        chart.renderBox = function () {
          const {left, right, middle, width} = chart.utilFunc_getBoxBound(config.bandWidth)
          chart.box = chart.group.append("g").attr("class", "box")

          chart.box.append("rect")
              .attr("class", "box")
              .style("fill", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style('opacity', 0.7)
              .attr("x", left)
              .attr("y", d => chart.yScale(groupObjs[d]["metrics"].quartile3))
              .attr('width', width)
              .attr("height", d => chart.yScale(groupObjs[d]["metrics"].quartile1) - chart.yScale(groupObjs[d]["metrics"].quartile3));
          chart.box.append("line")
              .attr("class", "median")
              .attr("x1", left)
              .attr("x2", right)
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr('y1', d => chart.yScale(groupObjs[d]["metrics"].median))
              .attr("y2", d => chart.yScale(groupObjs[d]["metrics"].median));
          chart.box.append("circle")
              .attr("class", "median")
              .attr('r', 3)
              .style("fill", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr("cx", middle)
              .attr("cy", d => chart.yScale(groupObjs[d]["metrics"].median))
          chart.box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr("x1", left)
              .attr("x2", right)
              .attr('y1', d => chart.yScale(groupObjs[d]["metrics"].upperInnerFence))
              .attr("y2", d => chart.yScale(groupObjs[d]["metrics"].upperInnerFence))
          chart.box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr("x1", middle)
              .attr("x2", middle)
              .attr('y1', d => chart.yScale(groupObjs[d]["metrics"].quartile3))
              .attr("y2", d => chart.yScale(groupObjs[d]["metrics"].upperInnerFence));

          chart.box.append("line")
              .attr("class", "lower whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr("x1", left)
              .attr("x2", right)
              .attr('y1', d => chart.yScale(groupObjs[d]["metrics"].lowerInnerFence))
              .attr("y2", d => chart.yScale(groupObjs[d]["metrics"].lowerInnerFence))
          chart.box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .attr("x1", middle)
              .attr("x2", middle)
              .attr('y1', d => chart.yScale(groupObjs[d]["metrics"].quartile1))
              .attr("y2", d => chart.yScale(groupObjs[d]["metrics"].lowerInnerFence));
        }

        chart.renderViolin = function () {
          let xNum = d3.scaleLinear()
              .domain([-maxBinLength, maxBinLength])
              .range([0, chart.xScale.bandwidth()])
          chart.violin = chart.group.append("g").attr("class", "violin")
          chart.violin.append("path")
              .style("stroke", "#112e51")
              .style("stroke-width", "1px")
              .style("shape-rendering", "geometricPrecision")
              .style("opacity", 0.7)
              .style("fill", "#112e51")
              .datum(d => groupObjs[d]["bins"])
              .attr("d", d3.area().x0(d => xNum(-d.length))
                  .x1(d => xNum(d.length))
                  .y(d => chart.yScale(d.x0))
                  .curve(d3.curveCatmullRom)
              )
        }
        chart.renderGroupMeanLines = function () {
          chart.meanLines = chart.body()
              .selectAll("g.meanLines")
              .data(Object.keys(groupStats))
              .join("line")
              .classed("meanLines",true)
              .attr("x1", 0)
              .attr("x2", chart.getBodyWidth())
              .attr("y1", d => chart.yScale(groupStats[d]["sum"]/groupStats[d]["count"]))
              .attr("y2", d => chart.yScale(groupStats[d]["sum"]/groupStats[d]["count"]))
              .style("stroke-dasharray","5,2")
              .style("stroke", d=> chart.utilFunc_getGroupColor(d))
              .style("stroke-width","2px")
              .style("stroke-opacity",0.3)
              .style("cursor","pointer")
        }
        /* ----------------------------绑定鼠标交互事件------------------------  */
        chart.addMouseOn = function () {
          chart.meanLines.on('mouseover touchstart', function (e, d) {
            let tip = `<b style="color:${chart.utilFunc_getGroupColor(d)}">Mean(${d}):${d3.format(".2f")(groupStats[d]["sum"]/groupStats[d]["count"])}</b><br>`
            d3.select(this).style("stroke-opacity",1)
            chart.toggleToolTip(e, tip)
          }).on('mousemove touchmove', function (e, d) {
            chart.moveToolTip(e)
          }).on('mouseleave touchend', function (e) {
            d3.select(this).style("stroke-opacity",0.6)
            chart.toggleToolTip(e, null)
          })


          chart.group.on('mouseover touchstart', function (e, d) {
            let tip = `<b>${d}</b><br>
                             Max: ${d3.format(".2f")(groupObjs[d]["metrics"].max)},
                             Min: ${d3.format(".2f")(groupObjs[d]["metrics"].min)}<br>
                             Q3:  ${d3.format(".2f")(groupObjs[d]["metrics"].quartile3)},
                             Q2: ${d3.format(".2f")(groupObjs[d]["metrics"].median)},
                             Q1: ${d3.format(".2f")(groupObjs[d]["metrics"].quartile1)}<br>
                             Mean: ${d3.format(".2f")(groupObjs[d]["metrics"].mean)}
                    `
            d3.select(this).style("opacity",1)

            chart.toggleToolTip(e, tip)
          }).on('mousemove touchmove', function (e, d) {
            chart.moveToolTip(e)
          }).on('mouseleave touchend', function (e) {
            d3.select(this).style("opacity",0.9)
            chart.toggleToolTip(e, null)
          })
        }

        chart.render = function () {
          chart.renderGroup();
          chart.renderViolin();
          chart.renderBox();
          chart.renderAxis();
          chart.renderGroupMeanLines()
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
