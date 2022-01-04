<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="8" class="item" key="1">
            <el-card class="box-card">
              <line_1 :lineData="line1Data"></line_1>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="2">
            <el-card class="box-card">
              <line_2></line_2>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="3">
            <el-card class="box-card">
              <line_3></line_3>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="4">
            <el-card class="box-card">
              <line_4></line_4>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="5">
            <el-card class="box-card">
              <line_5></line_5>
            </el-card>
          </el-col>
        </transition-group>
      </draggable>
    </el-row>
  </div>
</template>

<style lang="less">
  .content {
    .item {
      margin-bottom: 20px;
    }
  }
</style>

<script>
  import line_1 from "@/components/echartPlot/line/line_1";
  import line_2 from "@/components/echartPlot/line/line_2";
  import line_3 from "@/components/echartPlot/line/line_3";
  import line_4 from "@/components/echartPlot/line/line_4";
  import line_5 from "@/components/echartPlot/line/line_5";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
        line1Data: {
          axisX: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [
            {
              legend: 'Email',
              y: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              legend: 'Union Ads',
              y: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              legend: 'Video Ads',
              y: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              legend: 'Direct',
              y: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              legend: 'Search Engine',
              y: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        }
      }
    },
    components: {
      line_1,
      line_2,
      line_3,
      line_4,
      line_5,
      draggable
    },
    methods: {
      onStart(){
        this.drag = true;
      },
      onEnd() {
        this.drag = false;
      }
    },
    mounted() {

    }
  }

</script>
