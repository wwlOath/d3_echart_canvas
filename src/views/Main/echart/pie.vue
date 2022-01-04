<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="10" class="item" key="1">
            <el-card class="box-card">
              <pie_1></pie_1>
            </el-card>
          </el-col>
          <el-col :span="14" class="item" key="2">
            <el-card class="box-card">
              <pie_2></pie_2>
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
  import pie_1 from "@/components/echartPlot/pie/pie_1";
  import pie_2 from "@/components/echartPlot/pie/pie_2";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      pie_1,
      pie_2,
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
