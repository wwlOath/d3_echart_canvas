<template>
  <div style="position: relative;" class="violin-content">
    <div v-loading="spinShow">
    </div>

    <el-row class="operate-btn-download">
      <span @click="downloadImage" class="operate-icon">
          <i class="el-icon-download"></i>
      </span>
    </el-row>
    <div style="width: 100%;height: 320px;overflow-y: hidden;" :style="{'overflow-x': violinLength > 30 ? 'scroll' : 'hidden'}" :id="id+'_violin'" ref="violinImage"></div>

    <div class="chart_tooltip" :style="tooltipStyle">
      <div class="wrapper">
        <div class="tooltip-content">
          <div v-html="tooltip"></div>
        </div>
        <div class="tooltip-arrow"></div>
        <div class="tooltip-content-c"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  .violin-content {
    .chart_tooltip {
      height: 0;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      display: none;
      .wrapper {
        position: relative;
        bottom: 12px;
        left: -50%;
        padding: 6px;
        color: #3d3d3d;
        background: #fff;
        font-size: 10px;
        border: 2px solid #dedede;
        border-radius: 4px;
        transform: translateY(-100%);
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -12px;
          width: 0;
          height: 0;
          border-top: 12px solid #dedede;
          border-right: 12px solid transparent;
          border-left: 12px solid transparent;
        }
        .tooltip-content-c {
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -8px;
          width: 0;
          height: 0;
          border-top: 8px solid #fff;
          border-right: 8px solid transparent;
          border-left: 8px solid transparent;
        }
      }
    }

    .operate-btn-download {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>

<script>
  import * as d3 from "d3";
  import html2canvas from 'html2canvas'
  export default {
    name: '',
    data() {
      return {
        xScale: '',
        spinShow: true,
        tooltip: '',
        tooltipStyle: {},
        violinLength: 0,
      }
    },
    props: {
      dataFormatter: {
        type: Array,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      selectValue: {
        type: String
      }
    },
    methods: {
      downloadImage() {
        html2canvas(this.$refs.violinImage,{
          backgroundColor: '#fff'
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          let link = document.createElement('a');
          link.href = dataURL;
          link.download = this.selectValue+"_violin.png";
          link.click();
        })
      },
      getViolinPlot() {
        let _this = this;
        let dom = this.$refs.violinImage;
        if(dom) {
          let margin = {top: 20, right: 120, bottom: 50, left: 50};

          let width = 0;
          let height = d3.select("#"+_this.id+'_violin').node().getBoundingClientRect().height - margin.left - margin.top;

          const groupObjs = {};
          let min = Infinity;
          let max = -Infinity;
          let groupNames = new Set();
          let groupStats = {} //统计每组的均值\

          _this.dataFormatter.forEach(d => {
            let value = +d["value"]
            if (!isNaN(value)) {
              let group = d["group"]
              const gName =  group
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
          });

          _this.spinShow = false;

          //更新violin的宽度
          let violinGroupsLength = Object.values(groupObjs).length;
          this.violinLength = violinGroupsLength;
          let scaleXWidth = 0;
          if(violinGroupsLength > 30){
            width = 30 * violinGroupsLength;
            scaleXWidth = width - margin.right;
          }else {
            width =  d3.select("#"+_this.id+'_violin').node().getBoundingClientRect().width - margin.left - margin.right/2;
            scaleXWidth = width;
          }

          let svg = d3.select("#"+_this.id+'_violin')
              .append("svg")
              .attr('id','violin_svg')
              .attr("height", "100%")
              //.attr("width", "100%");
              .attr("width", violinGroupsLength > 30 ? width : '100%');

          let group = svg.append("g")
              .classed('violin', true)
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

          let maxString = 0;
          Object.keys(groupObjs).forEach((d) => {
            if(d.length > maxString) {
              maxString = d.length;
            }
          });

          height = height - maxString * 4.3;

          /* ----------------------------定义比例尺------------------------  */
          let xScale = d3.scaleBand()
                         .domain(Object.keys(groupObjs).sort((a,b) => {return a.toLowerCase().localeCompare(b.toLowerCase())})).range([0, scaleXWidth]).padding(0.3);

          this.xScale = xScale;

          let yScale = d3.scaleLinear().range([height, 0]).domain([min, max])
          //每组颜色比例尺
          let groupColorScale = d3.scaleOrdinal().domain(Array.from(groupNames)).range(d3.schemeCategory10)

          let maxBinLength = -Infinity
          Object.values(groupObjs).forEach(v => {
            v["values"] = v["values"].sort();
            v["metrics"] = _this.utilFunc_calcMetrics(v["values"]) //boxplot
            let bins = d3.histogram()
                         .thresholds(yScale.ticks(Math.max(Math.round(2 * (v["metrics"].iqr / Math.pow(v["values"].length, 1 / 3))), 50)))
            v["bins"] = bins(v["values"]) //violin plot 提琴图本质是个柱状图
            v["bins"].map(d => {
              if (d.length > maxBinLength) {
                maxBinLength = d.length
              }
            })
          });

          let groupAll = svg.select('.violin').selectAll('.group')
              .data(Object.keys(groupObjs))
              .join("g")
              .attr("id", d => d)
              .style("cursor", "pointer")
              .attr("transform", d => `translate(${xScale(d)} ,0)`)
              .classed('group', true);

          let xNum = d3.scaleLinear()
              .domain([-maxBinLength, maxBinLength])
              .range([0, xScale.bandwidth()]);

          //violin plot
          let violin = groupAll.append("g").attr("class", "violinG")
          violin.append("path")
              .style("stroke", "#112e51")
              .style("stroke-width", "1px")
              .style("shape-rendering", "geometricPrecision")
              .style("opacity", 0.5)
              .style("fill", "#112e51")
              .datum(d => groupObjs[d]["bins"])
              .attr("d", d3.area().x0(d => xNum(-d.length))
                  .x1(d => xNum(d.length))
                  .y(d => yScale(d.x0))
                  .curve(d3.curveCatmullRom)
              );

          //box plot
          const {left, right, middle, widths} = _this.utilFunc_getBoxBound(0.3)
          let box = groupAll.append("g").attr("class", "box")

          box.append("rect")
              .attr("class", "box")
              .style("fill", d => groupColorScale(groupObjs[d]["group"]))
              .style('opacity', 0.5)
              .attr("x", left)
              .attr("y", d => yScale(groupObjs[d]["metrics"].quartile3))
              .attr('width', widths)
              .attr("height", d => yScale(groupObjs[d]["metrics"].quartile1) - yScale(groupObjs[d]["metrics"].quartile3));
          box.append("line")
              .attr("class", "median")
              .attr("x1", left)
              .attr("x2", right)
              .style("stroke", d => groupColorScale(groupObjs[d]["group"]))
              .attr('y1', d => yScale(groupObjs[d]["metrics"].median))
              .attr("y2", d => yScale(groupObjs[d]["metrics"].median));
          box.append("circle")
              .attr("class", "median")
              .attr('r', 3)
              .style("fill", d => groupColorScale(groupObjs[d]["group"]))
              .attr("cx", middle)
              .attr("cy", d => yScale(groupObjs[d]["metrics"].median))
          box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => groupColorScale(groupObjs[d]["group"]))
              .attr("x1", left)
              .attr("x2", right)
              .attr('y1', d => yScale(groupObjs[d]["metrics"].upperInnerFence))
              .attr("y2", d => yScale(groupObjs[d]["metrics"].upperInnerFence))
          box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => groupColorScale(groupObjs[d]["group"]))
              .attr("x1", middle)
              .attr("x2", middle)
              .attr('y1', d => yScale(groupObjs[d]["metrics"].quartile3))
              .attr("y2", d => yScale(groupObjs[d]["metrics"].upperInnerFence));

          box.append("line")
              .attr("class", "lower whisker")
              .style("stroke", d => groupColorScale(groupObjs[d]["group"]))
              .attr("x1", left)
              .attr("x2", right)
              .attr('y1', d => yScale(groupObjs[d]["metrics"].lowerInnerFence))
              .attr("y2", d => yScale(groupObjs[d]["metrics"].lowerInnerFence))
          box.append("line")
              .attr("class", "upper whisker")
              .style("stroke", d => groupColorScale(groupObjs[d]["group"]))
              .attr("x1", middle)
              .attr("x2", middle)
              .attr('y1', d => yScale(groupObjs[d]["metrics"].quartile1))
              .attr("y2", d => yScale(groupObjs[d]["metrics"].lowerInnerFence));

          let axis = group.selectAll("g.axis")
              .data([null])
              .join('g')
              .classed('axis', true)

          axis.append("g")
              .classed('yAxis', true)
              .call(d3.axisLeft(yScale).ticks(10))
              .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(0)")
              .attr("y", -15)
              .attr("x", -5)
              .attr("dy", ".71em")
              .attr('fill', '#000')
              .style("text-anchor", "middle")
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .text('Expression');

          let axisX = axis.append("g")
              .classed('xAxis', true)
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(xScale));


          axisX.selectAll("text")
              .attr("transform", "rotate(-45)")
              .style("text-anchor", "end")
              .style('font-size', '0.7rem')
              .style('color', d => groupColorScale(groupObjs[d]["group"]));

          axisX.append("text")
              .attr("class", "label")
              .attr("transform", "rotate(0)")
              .attr("y", 10)
              .attr("x", this.violinLength > 30 ? width - margin.right : width)
              .attr("dy", ".71em")
              .attr('fill', '#000')
              .style("text-anchor", "initial")
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .text(_this.selectValue == 'ALL' ? 'CellType' : 'Sample');

          groupAll.on('mouseover touchstart', function (e,d) {
            let tip = `<b>${d}</b><br>
                         Max: ${d3.format(".2f")(groupObjs[d]["metrics"].max)},
                         Min: ${d3.format(".2f")(groupObjs[d]["metrics"].min)}<br>
                         Q3:  ${d3.format(".2f")(groupObjs[d]["metrics"].quartile3)},
                         Q2: ${d3.format(".2f")(groupObjs[d]["metrics"].median)},
                         Q1: ${d3.format(".2f")(groupObjs[d]["metrics"].quartile1)}<br>
                         Mean: ${d3.format(".2f")(groupObjs[d]["metrics"].mean)}
                    `;
            _this.tooltip = tip;

            _this.tooltipStyle = {
              'transform' : `translate(${e.layerX}px,${e.layerY}px)`,
              'display': 'block',
            }

          }).on('mousemove touchmove', function (e, d) {
            _this.tooltipStyle = {
              'transform' : `translate(${e.layerX}px,${e.layerY}px)`,
              'display': 'block',
            }
          }).on('mouseleave touchend', function (e) {
            _this.tooltipStyle = {
              'visibility': 'hidden',
            }
          })
        }
      },
      utilFunc_calcMetrics (sortedValues) {
        let metrics = {
          max: sortedValues[sortedValues.length - 1],
          upperOuterFence: null,
          upperInnerFence: null,
          quartile3: d3.quantile(sortedValues, 0.75),
          median: d3.quantile(sortedValues, 0.5),
          mean: d3.mean(sortedValues),
          iqr: null,
          quartile1: d3.quantile(sortedValues, 0.25),
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
      },
      utilFunc_getBoxBound (bandWidthRatio) {
        let boxSize = {left: null, right: null, middle: null, width: null};
        let range = this.xScale.bandwidth();
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
        boxSize.widths = width
        return boxSize;
      },
    },
    mounted() {
      this.getViolinPlot();
    }
  }

</script>
