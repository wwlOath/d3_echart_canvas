<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="10" class="item" key="1">
            <el-card class="box-card">
              <kLine_1></kLine_1>
            </el-card>
          </el-col>
          <el-col :span="14" class="item" key="2">
            <el-card class="box-card">
              <kLine_2></kLine_2>
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
  import kLine_1 from "@/components/echartPlot/kLine/kLine_1";
  import kLine_2 from "@/components/echartPlot/kLine/kLine_2";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      kLine_1,
      kLine_2,
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
