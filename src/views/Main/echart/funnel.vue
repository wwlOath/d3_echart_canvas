<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="10" class="item" key="1">
            <el-card class="funnel-card">
              <funnel_1></funnel_1>
            </el-card>
          </el-col>
          <el-col :span="14" class="item" key="2">
            <el-card class="funnel-card">
              <funnel_2></funnel_2>
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
  import funnel_1 from "@/components/echartPlot/funnel/funnel_1";
  import funnel_2 from "@/components/echartPlot/funnel/funnel_2";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      funnel_1,
      funnel_2,
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
