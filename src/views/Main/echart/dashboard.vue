<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="8" class="item" key="1">
            <el-card class="dashboard-card">
              <dashboard_1></dashboard_1>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="2">
            <el-card class="dashboard-card">
              <dashboard_2></dashboard_2>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="3">
            <el-card class="dashboard-card">
              <dashboard_3></dashboard_3>
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
  import dashboard_1 from "@/components/echartPlot/dashboard/dashboard_1";
  import dashboard_2 from "@/components/echartPlot/dashboard/dashboard_2";
  import dashboard_3 from "@/components/echartPlot/dashboard/dashboard_3";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      dashboard_1,
      dashboard_2,
      dashboard_3,
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
