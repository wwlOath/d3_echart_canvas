<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="8" class="item" key="1">
            <el-card class="box-card">
              <his_1></his_1>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="2">
            <el-card class="box-card">
              <his_2></his_2>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="3">
            <el-card class="box-card">
              <his_3></his_3>
            </el-card>
          </el-col>
          <el-col :span="24" class="item" key="4">
            <el-card class="box-card">
              <his_4></his_4>
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
  import his_1 from "@/components/echartPlot/histogram/histogram_1";
  import his_2 from "@/components/echartPlot/histogram/histogram_2";
  import his_3 from "@/components/echartPlot/histogram/histogram_3";
  import his_4 from "@/components/echartPlot/histogram/histogram_4";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      his_1,
      his_2,
      his_3,
      his_4,
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
