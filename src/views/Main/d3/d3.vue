<template>
  <div class="d3-content">
    <el-row :gutter="20">
      <!--<draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>-->
          <el-col :span="8" class="item" key="1">
            <el-card class="dashboard-card">
              <div v-if="Object.keys(histogram1Data).length != 0">
                <histogram_1 :dataFormatter="histogram1Data" id="stacked" :config="histogram1Config"></histogram_1>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="2">
            <el-card class="dashboard-card">
              <div v-if="histogram2Data.length > 0">
                <histogram_2 :dataFormatter="histogram2Data" id="stat" :config="histogram2Config"></histogram_2>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="3">
            <el-card class="dashboard-card">
              <div v-if="histogram3Data.length > 0">
                <histogram_3 :dataFormatter="histogram3Data" id="verticalStat" :config="histogram3Config"></histogram_3>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="4">
            <el-card class="dashboard-card">
              <div v-if="pieData.length > 0">
                <pie :dataFormatter="pieData" id="pie" :config="pieConfig"></pie>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="5">
            <el-card class="dashboard-card">
              <div v-if="scatterData.length > 0">
                <scatter :dataFormatter="scatterData" id="scatter" :config="scatterConfig"></scatter>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="6">
            <el-card class="dashboard-card">
              <div v-if="Object.keys(kLineData).length != 0">
                <kLine :dataFormatter="kLineData" id="kLine" :config="kLineConfig"></kLine>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="7">
            <el-card class="dashboard-card">
              <div v-if="violinBoxData.length > 0">
                <violinBox :dataFormatter="violinBoxData" id="violinBox" :config="violinBoxConfig"></violinBox>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="8">
            <el-card class="dashboard-card">
              <div v-if="violinBoxPlotData.length > 0">
                <violinPlot :dataFormatter="violinBoxPlotData" :id="'violinBoxPlot'" :selectValue="'Sample'"></violinPlot>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="9">
            <el-card class="dashboard-card">
              <div v-if="violinBoxData.length > 0">
                <violinBoxVertical :dataFormatter="violinBoxVerticalData" id="violinBox_vertical" :config="violinBoxVerticalConfig"></violinBoxVertical>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="10">
            <el-card class="dashboard-card">
              <div v-if="networkData.length > 0">
                <network :dataFormatter="networkData" id="network" :config="networkConfig"></network>
              </div>
            </el-card>
          </el-col>
          <el-col :span="20" class="item" key="11">
            <el-card class="dashboard-card">
              <scatter_1 :geneKeyWord="'CD34'"></scatter_1>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="12">
            <el-card class="dashboard-card">
              <div v-if="heatmapData.length > 0">
                <heatmap :dataFormatter="heatmapData" id="heatmap" :config="heatmapConfig"></heatmap>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="13">
            <el-card class="dashboard-card">
              <div v-if="bubbleData.length > 0">
                <bubble :dataFormatter="bubbleData" id="bubble" :config="bubbleConfig"></bubble>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="14">
            <el-card class="dashboard-card">
              <div v-if="lineData.length > 0">
                <linePlot :dataFormatter="lineData" id="line" :config="lineConfig"></linePlot>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="15">
            <el-card class="dashboard-card">
              <scatter_2 id="scatter_vant"></scatter_2>
            </el-card>
          </el-col>
        <!--</transition-group>
      </draggable>-->
    </el-row>
  </div>
</template>

<style lang="less">
  .d3-content {
    .item {
      margin-bottom: 20px;
    }
  }
</style>

<script>
  import histogram_1 from "@/components/d3Plot/histogram/histogram_1";
  import histogram_2 from "@/components/d3Plot/histogram/histogram_2";
  import histogram_3 from "@/components/d3Plot/histogram/histogram_3";
  import pie from "@/components/d3Plot/pie/pie";
  import scatter from "@/components/d3Plot/scatter/scatter";
  import scatter_1 from "@/components/d3Plot/scatter/scatter_1"; //散点图右侧legend可翻页
  //import scatter_1_1 from "@/components/d3Plot/scatter/scatter_1_1"; //散点图legend可翻译并且可以勾选切换
  import scatter_2 from "@/components/d3Plot/scatter/scatter_2";
  import kLine from "@/components/d3Plot/kLine/kLine";
  import violinBox from "@/components/d3Plot/violinBox/violinBox";
  import violinBoxVertical from "@/components/d3Plot/violinBox/violinBoxVertical";
  import violinPlot from "@/components/d3Plot/violinBox/violinPlot";
  import network from "@/components/d3Plot/network/network";
  import heatmap from "@/components/d3Plot/heatmap/heatmap";
  import bubble from "@/components/d3Plot/bubble/bubble";
  import linePlot from "@/components/d3Plot/line/line";
  import draggable from 'vuedraggable';
  import axios from 'axios';
  import * as d3 from "d3";

  export default {
    name: '',
    data() {
      return {
        drag: false,
        //柱状图
        //堆叠柱状图
        histogram1Data: {},
        histogram1Config: {},
        //纵向柱状图
        histogram2Data: [],
        histogram2Config: {},
        //横向柱状图
        histogram3Data: [],
        histogram3Config: {},

        //饼图
        pieData: [],
        pieConfig: {},

        //散点图
        scatterData: [],
        scatterConfig: {},

        //k线图
        kLineData: {},
        kLineConfig: {},

        //小提琴图
        //竖向
        violinBoxData: [],
        violinBoxConfig: {},
        //横向
        violinBoxVerticalData: [],
        violinBoxVerticalConfig: {},

        violinBoxPlotData: [],

        //网络图
        networkData: [],
        networkConfig: {},

        //热图
        heatmapData: [],
        heatmapConfig: {},

        //气泡图
        bubbleData: [],
        bubbleConfig: {},

        //折线图
        lineData: [],
        lineConfig: {}
      }
    },
    components: {
      histogram_1,
      histogram_2,
      histogram_3,
      pie,
      scatter,
      scatter_1,
      scatter_2,
      kLine,
      violinBox,
      violinBoxVertical,
      violinPlot,
      network,
      heatmap,
      bubble,
      linePlot,
      draggable
    },
    methods: {
      onStart() {
        this.drag = true;
      },
      onEnd() {
        this.drag = false;
      },
      getHistogram1() {
        axios.get('../../../static/_web_total_stat_for_web/home_page_stat.json').then(res => {
          this.histogram1Data = res.data['top_mutation'];
          this.histogram1Config = {
            "id": "#stacked",
            "x": "gene",
            "y": "dataset",
            "value": "value",
            "getSubValue": d => d["value"]/d["total"],
            "xLabel": "",
            "title": "Top Mutated Cancer Genes",
            "yLabel": "Samples Affected %",
            "toolTipFormat": (d,chart)=>`<b>${d.name}</b> <br><span>${d.data[d.name]["value"]}/${d.data[d.name]["total"]} (${(d.data[d.name]["value"]*100/d.data[d.name]["total"]).toFixed(2) + "%"}) Samples Affected</span>`,
            "margins": {top: 60, left: 40, bottom: 50, right: 30},
          }
        });
      },
      getHistogram2() {
        axios.get('../../../static/_web_total_stat_for_web/stat.json').then(res => {
          // 获取配置
          let dataS = res.data["clinical_stat"][0];
          this.histogram2Data = dataS['data'];

          this.histogram2Config = {
           "id": '#stat',
           "x": dataS['x'],
           "y": dataS['y'], //存储和柱状图无关的列名
           "xLabel": dataS["x_label"],
           "yLabel": dataS["y_label"],
           "title": dataS["title"],
           "rotateX": true,
           "toolTipFormat": dataS["tool_tip"]
          };
        })
      },
      getHistogram3() {
        axios.get('../../../static/_web_total_stat_for_web/stat.json').then(res => {
          // 获取配置
          let dataS = res.data["deg_stat"]["go_enrichment"];
          this.histogram3Data = res.data["deg_stat"]["go_enrichment"]["data"];

          this.histogram3Config = {
            "id": '#verticalStat',
            "x": dataS["x"],
            "y": dataS["y"], //存储和柱状图无关的列名
            "xLabel": dataS["x_label"],
            "yLabel": dataS["y_label"],
            "title": dataS["title"],
            "toolTipFormat": dataS["tool_tip"],
            "legendBy": dataS["legend_by"],
            "margins": {top: 50, left: 200, bottom: 50, right: 90},
          };
        })
      },
      getPie() {
        axios.get('../../../static/_web_total_stat_for_web/stat.json').then(res => {
          // 获取配置
          let dataS = res.data["clinical_stat"][0];
          this.pieData = res.data["clinical_stat"][0]["data"];

          this.pieConfig = {
            "id": '#pie',
            "name": dataS["x"],
            "value": dataS["y"],
            "title": dataS["title"],
            "showLegend": true,
            "toolTipFormat": dataS["tool_tip"],
            "margins": {top: 60, left: 10, bottom: 30, right: 30},
          };
        })
      },
      getScatter() {
        axios.get('../../../static/_web_total_stat_for_web/stat.json').then(res => {
          // 获取配置
          let dataS = res.data["deg_stat"]["kegg_enrichment"];
          this.scatterData = res.data["deg_stat"]["kegg_enrichment"]["data"];
          this.scatterConfig = {
            "id": '#scatter',
            "x": dataS["x"],
            "y": dataS["y"], //存储和柱状图无关的列名
            "xLabel": dataS["x_label"],
            "yLabel": dataS["y_label"],
            "title": dataS["title"],
            "toolTipFormat": dataS["tool_tip"],
            "legendBy": dataS["legend_by"],
            "sizeBy": dataS["size_by"],
            "margins": {top: 50, left: 190, bottom: 50, right: 80},
          };
        })
      },
      getKLine() {
        axios.get('../../../static/_web_total_stat_for_web/survival.json').then(res => {
          // 获取配置
          this.kLineData = res.data.data;
          this.kLineConfig = {
            "id": '#kLine',
            "height": 210
          };
        })
      },
      getViolinBox() {
        const groupObjs = {};
        let _this = this;
        d3.csv('../../../static/_web_total_stat_for_web/exp.csv', d => {
          d["value"] = +d["value"]
          if (!isNaN(d["value"])) {
            let group = d["group"] || "~"
            const gName = d["name"] + " " + group
            if (typeof groupObjs[gName] == "undefined") {
              groupObjs[gName] = 1
            }
          }
          return d
        }).then(function (data) {
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].value = +data[i].value;
            }

            _this.violinBoxData = data;
            _this.violinBoxConfig = {
              id: 'violinBox',
              fields: {
                dataset_key: 'name',
                value_key: 'value',
                sample_key: 'group',
                market_sample: '1995',
              },
              height: 160 + Object.keys(groupObjs).length * 32
            };

            _this.violinBoxVerticalData = data;
            _this.violinBoxVerticalConfig = {
              id: 'violinBox_vertical',
              fields: {
                dataset_key: 'name',
                value_key: 'value',
                sample_key: 'group',
                market_sample: '1995',
              },
              height: 160 + Object.keys(groupObjs).length * 32
            };
          }
        })
      },
      getNetwork() {
        axios.get('../../../static/_web_total_stat_for_web/network.json').then(res => {
          // 获取配置
          this.networkData = res.data.combined;
          this.networkConfig = {
            id: "#network",
            centerNode: ['TP53']
          };
        })
      },
      getViolinPlot() {
        axios.get('../../../static/_web_total_stat_for_web/violinPlot.json').then(res => {
          // 获取配置
          this.violinBoxPlotData = res.data;
        })
      },
      getHeatmap() {
        d3.csv('../../../static/_web_total_stat_for_web/heatmap_data.csv', data => {
          return data;
        }).then(res => {
          this.heatmapData = res;
          this.heatmapConfig = {
            id: "#heatmap",
            rotate: 0,
            toolTipFormat: 'The exact value of<br>this cell is:  {value}'
          };
        });
      },
      getBubble() {
        d3.csv('../../../static/_web_total_stat_for_web/threeNum.csv', data => {
          return data;
        }).then(res => {
          this.bubbleData = res;
          this.bubbleConfig = {
            id: "#bubble",
            rotate: -45,
            toolTipFormat: 'Country:  {country}'
          };
        });
      },
      getLine() {
        d3.csv('../../../static/_web_total_stat_for_web/line.csv', data => {
          return data;
        }).then(res => {
          this.lineData = res;
          this.lineConfig = {
            id: "#line",
            rotate: -45,
            toolTipFormat: 'Number:  {value}'
          };
        });
      }
    },
    mounted() {
      this.getHistogram1();
      this.getHistogram2();
      this.getHistogram3();
      this.getPie();
      this.getScatter();
      this.getKLine();
      this.getViolinBox();
      this.getNetwork();
      this.getViolinPlot();
      this.getHeatmap();
      this.getBubble();
      this.getLine();
    }
  }
</script>
