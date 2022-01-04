<template>
  <div>
    <el-row style="min-height: 600px">
      <el-col :span="14" id="tsne-sample">
        <div v-show="isShowTsne">
          <div class="tsne-content">
            <el-row class="operate-btn">
              <span @click="downloadImage('tsneSample')" class="operate-icon">
               <i class="el-icon-download"></i>
              </span>
            </el-row>
            <div id="tsneSample" :style="containerStyle">
              <div id="tsneSample_plotRegion" ref="tsneSampleRef">
                <div id="tsneSample_tip" :style="tips.tsneSample_style" v-html="tips.content"></div>

                <!--右侧legend-->
                <div style="position: absolute;right: 0;">
                <ul style="list-style-type: none; margin: 0px; padding: 0px; text-align: left;">
                  <li style="cursor: pointer; margin-bottom: 5px; margin-right: 24px; display: block;" v-for="(item, index) in set_cluster"  :style="{display: index >= (currentPage - 1) * pageSize && index < currentPage * pageSize ? '' : 'none'}">
                    <i :style="{'background-color': set_color_cluster(item)}" style="width: 9px; height: 9px; display: inline-block; margin-right: 4px; vertical-align: middle;border-radius: 50%"></i>
                    <span style="font-size:12px">{{item}}</span>
                  </li>
                </ul>
                <div style="width: auto; height: auto;" v-if="set_cluster.length > 0 && set_cluster.length > pageSize">
                  <i class="el-icon-arrow-left" :style="{color: currentPage == 1 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.65)'}" @click="leftPage"></i>
                  <p style="display: inline-block; font-size: 12px; cursor: default; padding-left: 10px;">
                    {{currentPage}}
                  </p>
                  <p style="display: inline-block; font-size: 12px; cursor: default; opacity: 0.3; padding-right: 10px;">
                    /{{Math.ceil(set_cluster.length/pageSize)}}
                  </p>
                  <i class="el-icon-arrow-right" :style="{color: currentPage == Math.ceil(set_cluster.length/pageSize) ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.65)'}" @click="rightPage"></i>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="!isShowTsne" class="file-no-exist">
          <p>Loading failed, please refresh the page.</p>
        </div>
      </el-col>
      <el-col :span="10">
        <div v-show="isShowTsne">
          <div class="tsne-content">
            <el-row class="operate-btn">
              <span @click="downloadImage('tsneExpression')" class="operate-icon">
               <i class="el-icon-download"></i>
            </span>
            </el-row>
            <div id="tsneExpression" :style="containerStyle">
              <div id="tsneExpression_plotRegion" ref="tsneExpressionRef"></div>
              <div id="tsneExpression_tip" :style="tips.tsneExpression_style" v-html="tips.content"></div>
            </div>
          </div>
        </div>
        <div v-show="!isShowTsne" class="file-no-exist">
          <p>Loading failed, please refresh the page.</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
  @import '../common.css';
  .svg-plot, .canvas-plot {
    position: absolute;
  }
  .el-col {
    position: relative;
  }
</style>

<script>
  import * as d3 from "d3";
  import axios from 'axios';
  import  * as d3Quadtree from 'd3-quadtree';
  import html2canvas from 'html2canvas'

  export default {
    name: '',
    data() {
      return {
        currentPage: 1,
        pageSize: 20,
        isShowTsne: true,
        set_cluster: [],
        set_cluster_transfrom: {},
        tsneUmapDataList: {},
        expression: {},
        tsneSample_spinLoadingShow: true,
        tsneExpression_spinLoadingShow: true,
        cleanPlotData: [],
        containerStyle: {
          "width": "100%",
          "height": "100%",
          "padding": "10px"
        },
        tips: {
          content: "",
          tsneSample_style: {
            "position": "absolute",
            "will-change": "top, left",
            'visibility': 'hidden',
            "top": 0,
            "left": 0,
            "padding": "5px",
            "position": "absolute",
            "border-style": "solid",
            "white-space": "nowrap",
            "z-index": "9999999",
            "transition": "left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            "background-color": "rgba(50, 50, 50, 0.7)",
            "border-width": "0px",
            "border-color": "rgb(51, 51, 51)",
            "border-radius": "4px",
            "color": "rgb(255, 255, 255)",
            "font-style": "normal",
            "font-variant": "normal",
            "font-weight": "normal",
            "font-stretch": "normal",
            "font-size": "14px",
          },
          tsneExpression_style: {
            "position": "absolute",
            "will-change": "top, left",
            'visibility': 'hidden',
            "top": 0,
            "left": 0,
            "padding": "5px",
            "position": "absolute",
            "border-style": "solid",
            "white-space": "nowrap",
            "z-index": "9999999",
            "transition": "left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            "background-color": "rgba(50, 50, 50, 0.7)",
            "border-width": "0px",
            "border-color": "rgb(51, 51, 51)",
            "border-radius": "4px",
            "color": "rgb(255, 255, 255)",
            "font-style": "normal",
            "font-variant": "normal",
            "font-weight": "normal",
            "font-stretch": "normal",
            "font-size": "14px",
          }
        },
        color_list: [],
      }
    },
    props: {
      geneKeyWord: {
        type: String,
        required: true
      }
    },
    methods: {
      rightPage() {
        if(this.currentPage >= Math.ceil(this.set_cluster.length / this.pageSize)){
          return false;
        }
        this.currentPage = this.currentPage + 1;
      },
      leftPage() {
        if(this.currentPage <= 1){
          return false;
        }
        this.currentPage = this.currentPage - 1;
      },
      set_color_cluster(val) {
        let colorFunc = d3.scaleOrdinal().domain(this.set_cluster).range(this.color_list);
        return colorFunc(val);
      },
      downloadImage(id) {
        //let canvas = document.getElementById(id + '_plotRegion');
        if (id == "tsneExpression") {
          html2canvas(this.$refs.tsneExpressionRef,{
            backgroundColor: '#fff'
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            let link = document.createElement('a');
            link.href = dataURL;
            link.download = "expression_" + this.geneKeyWord + ".png";
            link.click();
          })
        } else {
          html2canvas(this.$refs.tsneSampleRef,{
            backgroundColor: '#fff'
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            let link = document.createElement('a');
            link.href = dataURL;
            link.download = this.name + ".png";
            link.click();
          })
        }
      },
      orderCelltype(cell_type,flag){
        let order = this.clusterLabelDefaultList;
        let orderCelltype = cell_type;
        if (this.useCelltype){
          orderCelltype = []
          order.forEach(function (item) {
            if (cell_type.indexOf(item) != -1) {
              orderCelltype.push(item);
            }
          });

          //差集
          let diff = cell_type.filter((v) => {return orderCelltype.indexOf(v) === -1});

          //并集
          let union = orderCelltype.concat(diff.filter((v) => {return orderCelltype.indexOf(v) === -1}));

          orderCelltype = union;
        }else {
          if (flag) {
            orderCelltype = this.orderUnknown(cell_type);
          }
        }
        return orderCelltype
      },
      getTsneDataList() {
        this.tsneSample_spinLoadingShow = true;

        return axios.get('../../../../static/_web_total_stat_for_web/umap_1.json').then(res => {
          /*if (res.data.code == 0) {*/
            let data = res.data;
            this.tsneUmapDataList = data;

            data.points.forEach(d => {
              d[8] = true;
            });

            this.cleanPlotData = data.points;
            this.isShowTsne = true;

            this.set_cluster = data['sample_labels'].length == 1 && data['sample_labels'][0] == null ? [] : data['sample_labels'];
            this.set_cluster_label = data['sample_labels'].length == 1 && data['sample_labels'][0] == null ? [] : data['sample_labels'];
            if (this.set_cluster.length == 0) {
              this.isShowTsne = false;
            } else {
              this.isShowTsne = true;
            }
          /*} else {
            this.isShowTsne = false;
          }*/

          let index = this.set_cluster_label.indexOf("null");
          if (index > -1) {
            this.set_cluster_label.splice(index, 1);
          }
          this.set_cluster_label = this.orderCelltype(this.set_cluster_label,true)
          this.umapLabels = this.set_cluster_label;

        })
      },
      getExpressionPlotData() {
        let _this = this
        _this.tsneExpression_spinLoadingShow = true;

        return axios.get('../../../../static/_web_total_stat_for_web/CD34.json').then(res => {
          if (res.data.code == 0) {
            _this.expression = JSON.parse(res.data.data);
            _this.initExpression();
            _this.$emit("getcellexpression",this.expression, this.tsneUmapDataList['sample_labels'], this.tsneUmapDataList['celltype_labels']);
          }else{
            _this.tsneExpression_spinLoadingShow = false;
            _this.expression = {};
            _this.$emit("getcellexpression",this.expression);
          }
        })
      },
      test(plot_cc_id) {
        let _this = this;
        let flag_pic1 = true;
        if (plot_cc_id != "tsneSample") {
          flag_pic1 = false
        }

        //调整参数适应原图的比例
        let maxOriginLabelLength = 0; //ptShape名称的长度，以便控制页面显示比例，防止超长
        if(_this.set_cluster.length > 0){
          _this.set_cluster.forEach(d => {
            if (d && d.length > maxOriginLabelLength) {
              maxOriginLabelLength = d.length
            }
          })
        }

        //计算值的类别及最大最小值
        let expMin = Infinity, expMax = -Infinity
        if (!flag_pic1) {
          Object.values(_this.expression).forEach(d => {
            expMin = d < expMin ? d : expMin
            expMax = d > expMax ? d : expMax
          })
        }

        if (expMin > 0 & expMax < 0) {
          expMin = 0.0000001
          expMax = 1
        }

        let tmp_wordLength = (maxOriginLabelLength - 23) > 0 ? (maxOriginLabelLength - 23) : 0;
        let rightWidth = 50 + tmp_wordLength * 7.6;

        if(_this.set_cluster.length > 90){
          rightWidth = 150 + tmp_wordLength * 7.6;
        }

        let tmp_fontSize = Math.ceil(4 - Math.log(maxOriginLabelLength / rightWidth) * 3);
        let lengendFontSize = tmp_fontSize > 15 ? 15 : (tmp_fontSize < 8 ? 8 : tmp_fontSize);


        //基因表达

        if (expMin == expMax) {
          expMax += 0.1
        }
        _this._negtInterpolate = d3.interpolate(d3.rgb("blue"), d3.rgb("#d3d3d3"))
        _this._posiInterpolate = d3.interpolate(d3.rgb("#d3d3d3"), d3.rgb("red"))
        _this._positiveLinear = d3.scaleLinear().domain([0, expMax]).range([0, 1])
        _this._nagtiveLinear = d3.scaleLinear().domain([expMin, 0]).range([0, 1])


        let container = d3.select("#" + plot_cc_id + '_plotRegion');
        d3.select("#" + plot_cc_id + '_plotRegion').select("svg").remove();
        d3.select("#" + plot_cc_id + '_plotRegion').select("canvas").remove();

        let margin = {top: 20, right: 200, bottom: 100, left: 70};
        let attr = {
          width: d3.select("#" + plot_cc_id + '_plotRegion').node().getBoundingClientRect().width,
          height: 600,
          left: 70,
          right: 150,
          top: 50,
          bottom: 60
        }
        let width = 0;
        if (plot_cc_id != "tsneSample") {
          width = attr.width - margin.left;
        }else{
          width = attr.width - margin.left - margin.right;
        }

        const height = attr.height - margin.top - margin.bottom;
        // Init SVG
        const svgChart = container.append('svg:svg').attr('id',plot_cc_id+'_svg')
            .attr('width', attr.width)
            .attr('height', attr.height)
            .attr('class', 'svg-plot')
            .style('margin-top','15px')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Init Canvas
        const canvasNode = container.append('canvas')
            .attr('width', width)
            .attr('height', height)
            .style('margin-left', margin.left + 'px')
            .style('margin-top', margin.top + 'px')
            .attr('class', 'canvas-plot');


        //坐标轴的范围取整，否则初始化图片的时候小数部分的点会看不到
        let x = _this.tsneUmapDataList['x'];
        let y = _this.tsneUmapDataList['y'];
        let xmin  = Math.floor(x[0]);
        let xmax = Math.ceil(x[1]);
        let ymin  = Math.floor(y[0]);
        let ymax = Math.ceil(y[1]);
        // Init Scales
        let xScale = d3.scaleLinear().domain([xmin,xmax]).range([0, width - 30])
        let yScale = d3.scaleLinear().domain([ymin,ymax]).range([height - 39, 0])


        // Init Axis
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Add Axis
        const gxAxis = svgChart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        const gyAxis = svgChart.append('g')
            .call(yAxis);

        // Add labels
        svgChart.append('text')
            .attr('x', `-${height/2}`)
            .attr('dy', '-3.5em')
            .attr('transform', 'rotate(-90)')
            .style('font-size','12px')
            .text('UMAP_2');
        svgChart.append('text')
            .attr('x', `${width/2}`)
            .attr('y', `${height + 40}`)
            .style('font-size','12px')
            .text('UMAP_1');
        let canvas = canvasNode.node(),
            context = canvas.getContext("2d");

        // context.fillStyle="#fff";
        // canvasNode.height=context.height;
        //   context.clearRect(0,0,width,height);
        //处理标签及颜色值
        let colors20 = [
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#1f77b4",
          "#ff9896",
          "#8c564b",
          "#e377c2",
          "#FFD700",
          "#FF1493",
          "#bcbd22",
          "#0000FF",
          "#ADFF2F",
          "#8B668B",
          "#00FFFF",
          "#20B2AA",
          "#ffbb78",
          "#98df8a",
          "#FFBBFF",
          "#BFEFFF",
          "#7f7f7f",
          "#625B57",
          "#F08080",
          "#CD5C5C",
          "#B22222",
          "#8B0000",
          "#FF0000",
          "#FF4D40",
          "#FFE4E1",
          "#FFA07A",
          "#A0522D",
          "#FF8033",
          "#E69966",
          "#4D1F00",
          "#8B4513",
          "#FFDAB9",
          "#F4A460",
          "#B87333",
          "#CD853F",
          "#704214",
          "#FF9900",
          "#B8860B",
          "#4D3900",
          "#E6C35C",
          "#EEE8AA",
          "#CCFF00",
          "#6B8E23",
          "#9ACD32",
          "#66FF59",
          "#228B22",
          "#00FF00",
          "#4DE680",
          "#A6FFCC",
          "#00FF80",
          "#00A15C",
          "#7FFFD4",
          "#AFEEEE",
          "#2F4F4F",
          "#AFDFE4",
          "#5F9EA0",
          "#4798B3",
          "#87CEEB",
          "#003153",
          "#4682B4",
          "#1E90FF",
          "#004D99",
          "#B0C4DE",
          "#0047AB",
          "#6495ED",
          "#4D80E6",
          "#003399",
          "#2A52BE",
          "#4169E1",
          "#24367D",
          "#0033FF",
          "#191970",
          "#00008B",
          "#5C50E6",
          "#483D8B",
          "#6A5ACD",
          "#B399FF",
          "#9370DB",
          "#FF00FF",
          "#C71585",
          "#FF73B3",
          "#990036",
          "#FF8099",
          "#DC143C"
        ];
        let colorUse = [];
        /*if (this.useCelltype && this.groupsType != 'sample') {
          let clusterValue = ["HSC/MPP","LMPP","CLP","GMP","MEP","MKP","pre-T","Naive T","CD4 Mem","CD8 Mem","CD8 Effector","NK","preB","Immature B","Mature B/pre-plasma","B-unknow","pre-PC","pDC","cDC1","cDC2","CD14 Mono","CD16 Mono","Ery","Plasma","Platelet","Stroma"];
          _this.set_cluster.sort((a, b) => {
            if (clusterValue.indexOf(a) == -1 || clusterValue.indexOf(b) == -1) {
              return clusterValue.indexOf(b) - clusterValue.indexOf(a);
            } else {
              return clusterValue.indexOf(a) - clusterValue.indexOf(b);
            }
          });
        }*/

        //按照legend的顺序生成对应的颜色数组
        let i = 0;
        let colorValues = {};
        let obj = {};
        _this.set_cluster.forEach(d => {
          obj[d] = colors20[i++];
        });

        colorValues = obj;

        _this.set_cluster.forEach(d => {
          if (d == 'null') {
            colorUse.push('#333333');
          } else if(this.umapLabels.indexOf(d)== -1){
            colorUse.push('rgba(200, 200, 200, 0.8)');
          }else {
            if (JSON.stringify(colorValues) != '{}' && colorValues[d]){
              colorUse.push(colorValues[d]);
            } else if (i<colors20.length) {
              colorUse.push(colors20[i++])
            } else {
              colorUse.push('#'+Math.floor(Math.random()*256).toString(10))
            }
          }
        });

        if (colorUse.indexOf('undefined') != -1) {
          _this.color_cluster = d3.scaleOrdinal().domain(_this.set_cluster).range(colors20);
          this.color_list = colors20;
        } else {
          _this.color_cluster = d3.scaleOrdinal().domain(_this.set_cluster).range(colorUse);
          this.color_list = colorUse;
        }

        //绘制点
        let cleanPlotData = _this.tsneUmapDataList.points;

        // Initial draw made with no zoom
        this.draw(plot_cc_id,canvasNode,d3.zoomIdentity,xScale,yScale,context,gxAxis,gyAxis,xAxis,yAxis,cleanPlotData,width,height,flag_pic1);

        //zoom
        //定义缩放及选择
        const zoom = d3.zoom().on("zoom", e => {
          const transform = e.transform;
          context.save();
          _this.draw(plot_cc_id,canvasNode,transform,xScale,yScale,context,gxAxis,gyAxis,xAxis,yAxis,cleanPlotData,width,height,flag_pic1);
          context.restore();
        });

        canvasNode.call(zoom)

        if (flag_pic1) {
          _this.tsneSample_spinLoadingShow = false;
        } else {
          _this.tsneExpression_spinLoadingShow = false;
        }

      },
      initExpression() {
        let _this = this
        _this.tsneExpression_spinLoadingShow = true;
        //计算值的类别及最大最小值
        let expMin = Infinity, expMax = -Infinity
        Object.values(_this.expression).forEach(d => {
          expMin = d < expMin ? d : expMin
          expMax = d > expMax ? d : expMax
        })
        if (expMin > 0 & expMax < 0) {
          expMin = 0.00000001
          expMax = 1
        }
        _this._negtInterpolate = d3.interpolate(d3.rgb("blue"), d3.rgb("#d3d3d3"))
        _this._posiInterpolate = d3.interpolate(d3.rgb("#d3d3d3"), d3.rgb("red"))
        _this._positiveLinear = d3.scaleLinear().domain([0, expMax]).range([0, 1])
        _this._nagtiveLinear = d3.scaleLinear().domain([expMin, 0]).range([0, 1])


        let svg = d3.select("#tsneExpression_plotRegion").select("svg")
        svg.selectAll("circle")
            .attr("fill", function (d) {
              if (typeof(_this.expression[d[0]]) == "undefined") {
                return "none";
              } else if (typeof(_this.expression[d[0]]) == "undefined") {
                return "rgba(200,200,200,0.8)"
              } else if (_this.expression[d[0]] >= 0) {
                return _this._posiInterpolate(_this._positiveLinear(_this.expression[d[0]]))
              } else {
                return _this._negtInterpolate(_this._nagtiveLinear(_this.expression[d[0]]))
              }
            })


        let barValueArray = new Array();
        let dataExpL = []

        //如果有正负则各五个方块
        if (expMin < 0 & expMax > 0) {
          dataExpL = d3.merge([d3.range(expMin, 0, (0 - expMin) / 5), d3.range(0, expMax, (expMax - 0) / 5)])
        } else {
          dataExpL = d3.range(expMin, expMax, (expMax - expMin) / 10)
        }

        dataExpL.forEach(function (d) {
          if (d >= 0) {
            barValueArray.push(_this._posiInterpolate(_this._positiveLinear(d)));
          } else {
            barValueArray.push(_this._negtInterpolate(_this._nagtiveLinear(d)));
          }
        })


        /*颜色bar*/
        let expRect = svg.select(".geneExpColorBar")
            .selectAll("rect")
            .data(barValueArray)
        let expText = svg.select(".geneExpColorBar")
            .selectAll("text")
            .data([d3.format(".4f")(expMin), d3.format(".4f")(expMax), ""])

        expRect.style("fill", function (d) {
          return d
        })

        expText.text(function (d) {
          return d
        })


        _this.tsneExpression_spinLoadingShow = false;
      },
      xAxis(x, y, context, height, width) {
        var tickCount = 10,
            tickSize = 6,
            ticks = x.ticks(tickCount);
        // tickFormat = x.tickFormat(tickCount,'%Y-%m-%d');

        //横向刻度
        context.beginPath();
        ticks.forEach(function (d) {
          context.moveTo(x(d), height);
          context.lineTo(x(d), height + tickSize);
        });
        context.strokeStyle = "black";
        context.stroke();

        //横线
        context.beginPath();
        context.moveTo(1, height + tickSize);
        context.lineTo(1, height);
        context.lineTo(width, height);
        context.lineTo(width, height + tickSize);
        context.strokeStyle = "black";
        context.stroke();

        //刻度值
        context.textAlign = "center";
        context.textBaseline = "top";
        ticks.forEach(function (d) {
          context.fillText(d, x(d), height + tickSize);
        });

        //刻度单位
        context.save();
        context.textBaseline = "bottom";
        context.font = "bold 10px sans-serif";
        context.fillText(this.option["axisLabel"]["x"], width / 2, height + 40);
        context.restore();
      },
      yAxis(x, y, context, height, width) {
        var tickCount = 10,
            tickSize = 6,
            tickPadding = 3,
            ticks = y.ticks(tickCount);

        //纵向刻度
        context.beginPath();
        ticks.forEach(function (d) {
          context.moveTo(0, y(d));
          context.lineTo(-6, y(d));
        });
        context.strokeStyle = "black";
        context.stroke();

        //竖线
        context.beginPath();
        context.moveTo(-tickSize, 0);
        context.lineTo(0.5, 0);
        context.lineTo(0.5, height);
        context.lineTo(-tickSize, height);
        context.strokeStyle = "black";
        context.stroke();

        //刻度值
        context.textAlign = "right";
        context.textBaseline = "middle";
        ticks.forEach(function (d) {
          context.fillText(d, -tickSize - tickPadding, y(d));
        });

        //刻度单位
        context.save();
        context.rotate(-Math.PI / 2);
        context.textAlign = "right";
        context.textBaseline = "top";
        context.font = "bold 10px sans-serif";
        context.fillText(this.option["axisLabel"]["y"], '-' + height / 2, -30);
        context.restore();
      },
      draw(id,cavasNode,transform,x,y,context,gxAxis,gyAxis,xAxis,yAxis,cleanPlotData,width,height,flag_pic1){
        let _this = this;
        let points = [];
        const scaleX = transform.rescaleX(x);
        const scaleY = transform.rescaleY(y);

        gxAxis.call(xAxis.scale(scaleX));
        gyAxis.call(yAxis.scale(scaleY));
        context.clearRect(0, 0, width, height);
        for (let i = 0; i < cleanPlotData.length; i++) {
          //画点
          points.push([cleanPlotData[i][3], cleanPlotData[i][4], cleanPlotData[i][0], cleanPlotData[i][1], cleanPlotData[i][2], cleanPlotData[i][5], cleanPlotData[i][6]]);
          this.drawPoint(context, scaleX, scaleY, [cleanPlotData[i][3], cleanPlotData[i][4]], transform.k, _this.getcolor(flag_pic1, cleanPlotData[i]));
        }

        _this.setMouseListener(id,cavasNode,points,scaleX,scaleY,flag_pic1,transform.k)
      },
      drawPoint(context,scaleX, scaleY, point, k,color) {
        context.beginPath();
        context.fillStyle = color;
        const px = scaleX(point[0]);
        const py = scaleY(point[1]);
        context.arc(px, py, 1.2 * k, 0, 2 * Math.PI, true);
        context.fill();
      },
      setMouseListener(id,canvasNode,points,scaleX,scaleY,flag_pic1,k) {
        let d3quadtree = d3Quadtree.quadtree();
        d3quadtree.addAll(points);
        d3quadtree.extent([[this.tsneUmapDataList.x[0],this.tsneUmapDataList.y[0]],[this.tsneUmapDataList.x[1],this.tsneUmapDataList.y[1]]]);
        let _this = this;
        canvasNode.on("mousemove",function(e){

          let mouse = d3.pointer(e,this),
              closest = d3quadtree.find(scaleX.invert(mouse[0]), scaleY.invert(mouse[1]));

          let content ="";
          //如果鼠标距离点的位置差距很大的时候不再显示悬浮框
          if (Math.abs(closest[0]-scaleX.invert(mouse[0]))<0.3/k && Math.abs(closest[1]-scaleY.invert(mouse[1]))<0.3/k) {
            if (!flag_pic1) {

              content = '<div>'
                  + '<p style="margin: 5px auto">Cell: ' + closest[2] + '</p>';

              content += '<p style="margin: 5px auto"><span style="color:' + _this.color_cluster(closest[4]) + '">' + closest[4] + '</span></p>';

              content += '<p style="margin: 5px auto">Expression: ' + (_this.expression[closest[2]] || 0) + '</p>'
                  + '</div>'
            } else {
              content = '<div>'
                  + '<p style="margin: 5px auto">Cell: ' + closest[2] + '</p>';
              content += '<p style="margin: 5px auto"><span style="color:' + (closest[7] == 'false' ? 'rgba(200,200,200,0.8)' : _this.color_cluster(closest[4])) + '">' + closest[4] + '</span></p>';
              content += '</div>'
            }
            _this.$set(_this.tips, "content", content);
            _this.$set(_this.tips[id + "_style"], "visibility", "visible");
            _this.$set(_this.tips[id + "_style"], "top", `${e.layerY + 45}px`);
            _this.$set(_this.tips[id + "_style"], "left", `${e.layerX + 30}px`);
          }else{
            _this.$set(_this.tips[id + "_style"], "visibility", "hidden");
          }
        });

        canvasNode.on('mouseout', function () {
          _this.$set(_this.tips[id + "_style"], "visibility", "hidden")
        })

        canvasNode.on('mouseover', function () {
          // _this.$set(_this.tips[id + "_style"], "visibility", "hidden")
        })
        // canvasNode.on('mouseover', function () {
        //   _this.$set(_this.tips[id + "_style"], "visibility", "hidden")
        // })
      },
      orderUnknown(array) {
        if (array.indexOf("unknown") != -1){
          array.splice(array.indexOf("unknown"),1);
          array.push("unknown")
        }
        if (array.indexOf("undefined") != -1){
          array.splice(array.indexOf("undefined"),1);
          array.push("undefined")
        }
        return array;
      },
      getcolor(flag_pic1,d){
        if (!flag_pic1) {
          if (typeof(this.expression[d[0]]) == "undefined") {
            return "rgba(200,200,200,0)";
          } else if(d[5] == 'false'){
            return 'rgba(200,200,200,0.8)';
          } else if( typeof(this.expression[d[0]]) == "undefined"){
            return "rgba(200,200,200,0.8)"
          }else if (this.expression[d[0]] >= 0) {
            return this._posiInterpolate(this._positiveLinear(this.expression[d[0]]))
          } else {
            return this._negtInterpolate(this._nagtiveLinear(this.expression[d[0]]))
          }
        }else{
            if(d[8]) {
              return this.color_cluster(d[2]);
            }else{
              return "rgba(200,200,200,0.8)";
            }
        }
      },
    },
    mounted() {
      this.getTsneDataList().then(res => {
        this.test("tsneSample");
        if(this.isShowTsne){
          if (this.geneKeyWord.trim() != '') {
            this.getExpressionPlotData().then(res=>{
              this.test("tsneExpression");
            });
          }
        }
      });
    }
  }

</script>
