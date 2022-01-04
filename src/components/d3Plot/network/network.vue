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

        const config = {
          id: "body",
          margins: {top: 20, left: 20, bottom: 20, right: 20},
          centerNode: null, //["TP53"]
          title: '',
        }

        Object.assign(config, {}, this.config);
        const chart = new Chart(config);

        chart.margins(config.margins);
        chart.id(config.id);
        let xCenter = chart.getBodyWidth() / 2, yCenter = chart.getBodyHeight() / 2;



        //-------预处理数据-----------
        let links = [];
        let nodes = [];
        chart.degree = {};
        dataOrigin.forEach((d) => {
          if (!chart.degree[d[0]]) {
            nodes.push({id: d[0]})
            chart.degree[d[0]] = 1
          } else {
            chart.degree[d[0]] = chart.degree[d[0]] + 1
          }
          if (!chart.degree[d[1]]) {
            nodes.push({id: d[1]})
            chart.degree[d[1]] = 1
          } else {
            chart.degree[d[1]] = chart.degree[d[1]] + 1
          }
          links.push({source: d[0], target: d[1], value:0})
        })
        nodes.forEach(d=>d["_degree"] = chart.degree[d["id"]])

        let circleSizeScaleByDegree = d3.scaleSqrt()
            .domain(d3.extent(nodes, d => d._degree))
            .range([5, 20])
        chart.renderNetwork = function () {
          const simulation = d3.forceSimulation()
              .nodes(nodes)
              .force("link", d3.forceLink(links).id(d => d.id).distance(50)) //连接线
              .force("collide", d3.forceCollide().radius(20))
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(xCenter, yCenter))
              .on("tick", ticked)


          let link = chart.body().insert('g')
              .selectAll("path")
              .data(links)
              .join("path")
              .attr("stroke", "#333")
              .attr("stroke-opacity", 0.25)
              .style("cursor", "pointer")
              .on("mouseover", (e, d) => mouseOn(e,d,d.source.id, d.target.id))
              .on("mouseout", (e, d) => mouseLeave(e))

          let colorScale = chart.getScaleColor()

          let node = chart.body().insert('g')
              .selectAll("circle")
              .data(nodes)
              .join("circle")
              .attr("r", d => circleSizeScaleByDegree(d._degree))
              .attr("fill",  d=>config.centerNode.indexOf(d.id) > -1 ? colorScale(2) : colorScale(0))
              .attr("opacity", 0.85)
              .attr("stroke", d => config.centerNode.indexOf(d.id) > -1 ? "#eee" : "#aaa")
              .attr("stroke-width", 3)
              .attr("stroke-opacity", 0.85)
              .style("cursor", "pointer")
              .on("mouseover", (e, d) => mouseOn(e,d,d.id))
              .on("mouseout", (e, d) => mouseLeave(e))
              .call(chart.drag(simulation))

          let nodeText = chart.body().insert('g')
              .selectAll("text")
              .data(nodes)
              .join("text")
              .attr("fill", '#000')
              .attr("y", ".31em")
              .attr("text-anchor", "middle")
              .text((d) => d.id)
              .style('font-size', '0.5rem')
              .style('font-weight', '900')
              .style("cursor", "pointer")
              .attr("opacity", 0.95)
              .on("mouseover", (e, d) => mouseOn(e,d,d.id))
              .on("mouseout", (e, d) => mouseLeave(e))
              .call(chart.drag(simulation))

          const zoom = d3.zoom()
              .scaleExtent([0.2, 8])
              .on("zoom", ({transform}) => chart.body().attr("transform", transform))
          chart.svg().call(zoom)
              .transition().duration(750).call(zoom.transform, d3.zoomIdentity);

          function ticked() {
            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
            nodeText.attr("transform", (d) => `translate(${d.x},${d.y})`);
            link.attr( "d", d => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}` )
          }


          function mouseOn(e,d,s, t) {
            const set = new Set([s, t]);
            const set2 = new Set([s, t])
            link.transition(100).attr("stroke-opacity", d => {
              if (t && set.has(d.source.id) && set.has(d.target.id)) {
                return 1
              } else if (!t && (s == d.source.id || s == d.target.id)) {
                set2.add(d.source.id)
                set2.add(d.target.id)
                return 1
              } else {
                return 0.05
              }
            })
            node.transition(100).attr("opacity", d => set2.has(d.id) ? 1 : 0.2)
            nodeText.transition(100).attr("opacity", d => set2.has(d.id) ? 1 : 0.2)
            if(d.id){
              chart.toggleToolTip(e, `<b>${d.id}</b><br/><small>Degree:${d._degree}</small>`)
            }

          }

          function mouseLeave(e) {
            node.transition(100).attr("opacity", 0.85)
            link.transition(100).attr("stroke-opacity", 0.25)
            nodeText.transition(100).attr("opacity", 0.95)
            chart.toggleToolTip(e, null)
          }

        }


        chart.render = function () {
          chart.renderNetwork();
          //chart.addMouseOn();
        }

        chart.drag = function (simulation) {
          return d3.drag()
              .on("start", (e) => {
                if (!e.active) simulation.alphaTarget(0.3).restart();
                e.subject.fx = e.subject.x;
                e.subject.fy = e.subject.y;
              })
              .on("drag", (e) => {
                e.subject.fx = e.x;
                e.subject.fy = e.y;
              })
              .on("end", (e) => {
                if (!e.active) simulation.alphaTarget(0);
                e.subject.fx = null;
                e.subject.fy = null;
              });
        }

        chart.renderChart();
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>
