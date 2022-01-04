<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="10" class="item" key="1">
            <el-card class="box-card">
              <radar_1></radar_1>
            </el-card>
          </el-col>
          <el-col :span="14" class="item" key="2">
            <el-card class="box-card">
              <radar_2></radar_2>
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
  import radar_1 from "@/components/echartPlot/radar/radar_1";
  import radar_2 from "@/components/echartPlot/radar/radar_2";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      radar_1,
      radar_2,
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
