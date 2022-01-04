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
          margins: {top: 30, left: 120, bottom: 20, right: 20},
          title: '',
          groupColorFunc: null, //如果设置了该函数，从该函数中获取分组的颜色值，否者用颜色比例尺获取
          height: 540,
          bandWidth: 0.3, //box宽度占当前band百分比，实际大小限制在5~100px
          ...this.config
        }

        const chart = new Chart(config);
        chart.margins(config.margins);
        chart.id('#' + this.config.id)
        chart.boxData = [] //把盒形图的数据导出以便制表
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
            std: d3.deviation(sortedValues),
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
            if (sortedValues[i] >= UIF) {
              metrics.upperInnerFence = sortedValues[i];
              break;
            }
          }

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
          let range = chart._yScale_.bandwidth();
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
              groupObjs[gName] = {
                values: [],
                group: group,
                name: d["name"]
              }
            }
            groupObjs[gName]["values"].push(value);
            groupObjs[gName]["group"] = group;
            groupNames.add(group)
            if (typeof groupStats[group] == "undefined") {
              groupStats[group] = {}
              groupStats[group]["sum"] = value
              groupStats[group]["count"] = 1
            } else {
              groupStats[group]["sum"] += value
              groupStats[group]["count"] += 1
            }
          }
        })

        /* ----------------------------定义比例尺------------------------  */
        chart._yScale_ = d3.scaleBand().domain(Object.keys(groupObjs).sort()).range([chart.getBodyHeight(), 0]).padding(0.01);
        //每组颜色比例尺
        chart.groupColorScale = chart.getScaleColor().domain(Array.from(groupNames))

        /**
         * 准备boxplot和violinplot的格式数据
         */
        Object.keys(groupObjs).sort().forEach(k => {
          groupObjs[k]["values"] = d3.sort(groupObjs[k]["values"])
          groupObjs[k]["metrics"] = chart.utilFunc_calcMetrics(groupObjs[k]["values"]) //boxplot
          //导出数据制表
          groupObjs[k]["metrics"]["name"] = groupObjs[k]["name"]
          groupObjs[k]["metrics"]["group"] = groupObjs[k]["group"]
          groupObjs[k]["metrics"]["num"] = groupObjs[k]["values"].length
          groupObjs[k]["filterValues"] = groupObjs[k]["values"].filter(d => d >= groupObjs[k]["metrics"]["lowerInnerFence"] && d <= groupObjs[k]["metrics"]["upperInnerFence"])
          if (max < groupObjs[k]["metrics"]["upperInnerFence"]) {
            max = groupObjs[k]["metrics"]["upperInnerFence"]
          }
          if (min > groupObjs[k]["metrics"]["lowerInnerFence"]) {
            min = groupObjs[k]["metrics"]["lowerInnerFence"]
          }


          chart.boxData.unshift(groupObjs[k]["metrics"])
        })

        Object.keys(groupObjs).sort().forEach(k => {

          //导出数据制表完成
          let bins = d3.histogram()
              .thresholds(Math.max(Math.round((groupObjs[k]["metrics"]["upperInnerFence"] - groupObjs[k]["metrics"]["lowerInnerFence"])*100/(max-min)) , 5))
          groupObjs[k]["bins"] = bins(groupObjs[k]["filterValues"]) //violin plot 提琴图本质是个柱状图

          let maxBinHeight = -Infinity
          let binScaler = d3.scaleLinear()
              .range([0, chart._yScale_.bandwidth()/2])
          groupObjs[k]["bins"].map(d => {
            if (d.length > maxBinHeight) {
              maxBinHeight = d.length
            }
            d["binScaler"] = binScaler
          })
          binScaler.domain([maxBinHeight,0 ])
        })
        chart._xScale_ = d3.scaleLinear().range([0, chart.getBodyWidth()]).domain([min - Math.abs(min)*0.05, max + Math.abs(max)*0.05])


        /* ----------------------------渲染box组 --------------------- */
        chart.renderGroup = function () {
          chart.group = chart.body()
              .selectAll("g.group")
              .data(Object.keys(groupObjs))
              .join("g")
              .attr("data-id", d => d)
              .style("cursor", "pointer")
              .attr("transform", d => `translate(0,${chart._yScale_(d)})`)
              .classed('group', true)
              .style("opacity", 0.9)
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
              .call(d3.axisLeft(chart._yScale_).ticks(10))
              .selectAll("text")
              .style("text-anchor", "left")
              .style('font-size', '0.7rem')
              .style('color', d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("text-overflow", "ellipsis")
          chart.axis.append("g")
              .classed('xAxis', true)
              .attr("transform", "translate(0," + chart.getBodyHeight() + ")")
              .call(d3.axisBottom(chart._xScale_))
              .style('fontSize', '0.2rem')

        }
        /**
         * 渲染盒形图
         */
        chart.renderBox = function () {
          const {left, right, middle, width} = chart.utilFunc_getBoxBound(config.bandWidth)
          chart.box = chart.group.append("g").attr("class", "box")

          chart.box.append("rect")
              .attr("class", "box")
              .attr("fill", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style('opacity', 0.9)
              .attr("x", d => chart._xScale_(groupObjs[d]["metrics"].quartile1))
              .attr("y", left)
              .attr('width', d => chart._xScale_(groupObjs[d]["metrics"].quartile3) - chart._xScale_(groupObjs[d]["metrics"].quartile1))
              .attr("height", width);
          chart.box.append("line")
              .attr("class", "median")
              .attr("x1", d => chart._xScale_(groupObjs[d]["metrics"].median))
              .attr("x2", d => chart._xScale_(groupObjs[d]["metrics"].median))
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("stroke-width", "2px")
              .attr('y1', left)
              .attr("y2", right);
          chart.box.append("circle")
              .attr("class", "median")
              .attr('r', 2)
              .style("fill", "#eee")
              .attr("cx", d => chart._xScale_(groupObjs[d]["metrics"].median))
              .attr("cy", middle)
          chart.box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("stroke-width", "2px")
              .attr("x1", d => chart._xScale_(groupObjs[d]["metrics"].upperInnerFence))
              .attr("x2", d => chart._xScale_(groupObjs[d]["metrics"].upperInnerFence))
              .attr('y1', left)
              .attr("y2", right)
          chart.box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("stroke-width", "1px")
              .attr("stroke-dasharray","2,1")
              .attr("x1", d => chart._xScale_(groupObjs[d]["metrics"].quartile3))
              .attr("x2", d => chart._xScale_(groupObjs[d]["metrics"].upperInnerFence))
              .attr('y1', middle)
              .attr("y2", middle);

          chart.box.append("line")
              .attr("class", "lower whisker")
              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("stroke-width", "2px")
              .attr("x1", d => chart._xScale_(groupObjs[d]["metrics"].lowerInnerFence))
              .attr("x2", d => chart._xScale_(groupObjs[d]["metrics"].lowerInnerFence))
              .attr('y1', left)
              .attr("y2", right)
          chart.box.append("line")
              .attr("class", "upper whisker")

              .style("stroke", d => chart.utilFunc_getGroupColor(groupObjs[d]["group"]))
              .style("stroke-width", "1px")
              .attr("stroke-dasharray","2,1")
              .attr("x1", d => chart._xScale_(groupObjs[d]["metrics"].quartile1))
              .attr("x2", d => chart._xScale_(groupObjs[d]["metrics"].lowerInnerFence))
              .attr('y1', middle)
              .attr("y2", middle);
        }

        chart.renderViolin = function () {

          chart.violin = chart.group.append("g").attr("class", "violin")
          chart.violin.append("path")
              .style("stroke", "#666")
              .style("stroke-width", "1px")
              .style("shape-rendering", "geometricPrecision")
              .style("fill", "#666")
              .datum(d => groupObjs[d]["bins"])
              .attr("d", d3.area().y0(d => d["binScaler"](0))
                  .y1(d => d["binScaler"](d.length))
                  .x(d => (chart._xScale_(d.x1) +chart._xScale_(d.x0))/2 )
                  .curve(d3.curveCatmullRom)
              )
        }
        chart.renderGroupMeanLines = function () {
          chart.meanLines = chart.body()
              .selectAll("g.meanLines")
              .data(Object.keys(groupStats))
              .join("line")
              .classed("meanLines", true)
              .attr("x1", d => chart._xScale_(groupStats[d]["sum"] / groupStats[d]["count"]))
              .attr("x2", d => chart._xScale_(groupStats[d]["sum"] / groupStats[d]["count"]))
              .attr("y1", 0)
              .attr("y2", chart.getBodyHeight())
              .style("stroke-dasharray", "5,2")
              .style("stroke", d => chart.utilFunc_getGroupColor(d))
              .style("stroke-width", "2px")
              .style("stroke-opacity", 0.3)
              .style("cursor", "pointer")
        }
        /* ----------------------------绑定鼠标交互事件------------------------  */
        chart.addMouseOn = function () {
          chart.meanLines.on('mouseover touchstart', function (e, d) {
            let tip = `<b style="color:${chart.utilFunc_getGroupColor(d)}">Mean(${d}):${d3.format(".2f")(groupStats[d]["sum"] / groupStats[d]["count"])}</b><br>`
            d3.select(this).style("stroke-opacity", 1)
            chart.toggleToolTip(e, tip)
          }).on('mousemove touchmove', function (e, d) {
            chart.moveToolTip(e)
          }).on('mouseleave touchend', function (e) {
            d3.select(this).style("stroke-opacity", 0.6)
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
            d3.select(this).style("opacity", 1)

            chart.toggleToolTip(e, tip)
          }).on('mousemove touchmove', function (e, d) {
            chart.moveToolTip(e)
          }).on('mouseleave touchend', function (e) {
            d3.select(this).style("opacity", 0.9)
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
