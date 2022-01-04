<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目介绍</span>
      </div>
      <div>
        <p>Antv G2网址链接： http://v.antfin.com/zh-cn/g2/3.x/demo/component/legend-pagenation.html</p>
        <p>Antv G2在线编辑代码网址： https://g2.antv.vision/zh/examples/interaction/others#zoom</p>
        <p>Echarts网址： https://echarts.apache.org/examples/zh/index.html</p>
        <p>D3.js网址： https://observablehq.com/@d3/gallery</p>
        <p>D3.js(v4/v6)网址：https://www.d3-graph-gallery.com/violin.html</p>
        <p>大转盘、九宫格、老虎机网址：https://100px.net/?from=thosefree.com</p>
        <p>该项目绘制了echarts常用组件、d3.js常用组件以及Antv G2框架绘制散点图形。</p>
      </div>
    </el-card>

    <baidu-map class="bm-view" ak="CZKDpAkyPcXj9FdiBpkHFNAzb39g3XWn" :center="{lng: 116.404, lat: 39.915}" :zoom="11">
      <bm-driving start="天安门" end="百度大厦" @searchcomplete="handleSearchComplete" :panel="false" :autoViewport="true"></bm-driving>
      <bml-lushu
        @stop="reset"
        :path="path"
        :icon="icon"
        :play="play"
        :rotation="true">
      </bml-lushu>
    </baidu-map>
  </div>
</template>

<style lang="less">
  .bm-view {
    width: 100%;
    height: 300px;
  }
</style>

<script>
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import {BmlLushu} from 'vue-baidu-map'
  import {BmDriving} from 'vue-baidu-map'
  export default {
    name: '',
    data() {
      return {
        play: true,
        path: [],
        icon: {
          url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
          size: {width: 52, height: 26},
          opts: {anchor: {width: 27, height:13}}
        }
      }
    },
    components: {
      BaiduMap,
      BmlLushu,
      BmDriving
    },
    methods: {
      reset () {
        this.play = false
      },
      handleSearchComplete (res) {
        this.path = res.getPlan(0).getRoute(0).getPath()
      }
    },
    mounted() {

    }
  }

</script>
